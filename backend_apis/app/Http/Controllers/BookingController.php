<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\AdSlot;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Exception;

class BookingController extends Controller
{
  

    public function index()
{
    try {
        $bookings = Booking::with(['user', 'adSlot'])
            ->orderBy('booking_id', 'desc')
            ->get();
        return BookingResource::collection($bookings);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch bookings',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

public function loggedUserBookings()
{
    try {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'message' => 'User not authenticated',
                'auth_check' => false
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unable to retrieve authenticated user',
                'user_id' => Auth::id()
            ], Response::HTTP_UNAUTHORIZED);
        }
        
        $bookings = Booking::with(['user', 'adSlot'])
            ->where('user_id', $user->user_id)
            ->orderBy('booking_id', 'desc')
            ->get();
            
        if ($bookings->isEmpty()) {
            return response()->json([
                'message' => 'No bookings found for user',
                'user_id' => $user->id
            ]);
        }
            
        return BookingResource::collection($bookings);
        
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch bookings',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

    
    public function store(Request $request)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $validator = Validator::make($request->all(), [
            'bookings' => 'required|array',
            'bookings.*.ad_slot_id' => 'required|exists:ad_slots,ad_slot_id',
            'bookings.*.quantity' => 'required|integer|min:1',
            'bookings.*.duration_type' => 'required|string|in:hours,days,permanent,impressions',
            'bookings.*.duration_value' => 'required_if:duration_type,hours,days,impressions|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $bookingsData = $request->input('bookings');
        $createdBookings = [];
        $invoiceItems = [];
        $totalCost = 0;

        DB::beginTransaction();

        foreach ($bookingsData as $bookingData) {
            $adSlot = AdSlot::where('ad_slot_id', $bookingData['ad_slot_id'])
                ->lockForUpdate()
                ->first();

            if (!$adSlot || !$adSlot->available) {
                DB::rollBack();
                return response()->json([
                    'message' => "Ad slot ID {$bookingData['ad_slot_id']} is not available"
                ], Response::HTTP_BAD_REQUEST);
            }

            $slotCost = $this->calculateSlotCost($adSlot, $bookingData['quantity'], $bookingData['duration_type'], $bookingData['duration_value']);
            $totalCost += $slotCost;

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'ad_slot_id' => $adSlot->ad_slot_id,
                'quantity' => $bookingData['quantity'],
                'total_cost' => $slotCost,
                'duration_type' => $bookingData['duration_type'],
                'duration_value' => $bookingData['duration_value'] ?? null,
                'status' => 'pending',
            ]);

            $createdBookings[] = $booking;
            $invoiceItems[] = [
                'ad_slot_id' => $adSlot->ad_slot_id,
                'ad_unit' => $adSlot->ad_unit,
                'quantity' => $bookingData['quantity'],
                'duration' => $bookingData['duration_type'] . ($bookingData['duration_value'] ? " ({$bookingData['duration_value']})" : ''),
                'total_amount' => number_format($slotCost, 2),
                'date' => $booking->created_at->toDateTimeString(),
            ];
        }

        $invoice = Invoice::create([
            'user_id' => Auth::id(),
            'booking_id' => $createdBookings[0]->booking_id,
            'total_amount' => $totalCost,
            'status' => 'unpaid',
            'invoice_number' => 'INV-' . time(),
        ]);

        $admins = User::where('role_id', 1)->get();
        if ($admins->isNotEmpty()) {
            foreach ($admins as $admin) {
                $this->sendBookingNotification($admin, $createdBookings[0], $user->name);
            }
        } else {
            \Log::warning('No admins found to notify for bookings');
        }

        DB::commit();

        return response()->json([
            'message' => 'Bookings created successfully',
            'bookings' => BookingResource::collection($createdBookings),
            'invoice' => [
                'invoice_id' => $invoice->invoice_id,
                'invoice_number' => $invoice->invoice_number,
                'items' => $invoiceItems,
                'total_amount' => number_format($totalCost, 2),
                'date' => $createdBookings[0]->created_at->toDateTimeString(),
                'status' => $invoice->status,
            ],
            'total_cost' => number_format($totalCost, 2),
        ], Response::HTTP_CREATED);

    } catch (Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Failed to create bookings',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

private function calculateSlotCost(AdSlot $adSlot, $quantity, $durationType, $durationValue)
{
    $rate = $adSlot->rate;
    switch ($adSlot->rate_unit) {
        case 'CPM USD':
            return $rate * $quantity; // Changed to rate * quantity instead of rate * (quantity / 1000)
        case 'TZS per hour':
            return $rate * ($durationType === 'hours' ? $durationValue : 1) * $quantity;
        case 'TZS per day':
            return $rate * ($durationType === 'days' ? $durationValue : 1) * $quantity;
        case 'TZS':
            return $rate * $quantity; // Flat rate
        default:
            return $rate * $quantity; // Default to flat rate
    }
}




    private function sendBookingNotification(User $admin, Booking $booking, $userName)
    {
        $createdAt = $booking->created_at->format('Y-m-d H:i:s');
        $adSlot = $booking->adSlot;

        $emailBody = "Dear {$admin->name},\n\n"
            . "A new booking has been made by {$userName}:\n"
            . "Ad Slot: {$adSlot->ad_unit} ({$adSlot->dimensions}, {$adSlot->platform})\n"
            . "Quantity: {$booking->quantity}\n"
            . "Duration: {$booking->duration_type}" . ($booking->duration_value ? " ({$booking->duration_value})" : '') . "\n"
            . "Total Cost: {$booking->total_cost}\n"
            . "Booking Created At: {$createdAt}\n\n"
            . "Please review and confirm.\n\n"
            . "Thank you.";

        try {
            Mail::raw($emailBody, function ($message) use ($admin) {
                $message->to($admin->email)->subject('New Booking Notification');
            });
            \Log::info('Booking notification sent to admin', [
                'admin_id' => $admin->id,
                'booking_id' => $booking->booking_id
            ]);
            return true;
        } catch (Exception $e) {
            \Log::error('Booking email failed: ' . $e->getMessage(), [
                'admin_id' => $admin->id,
                'booking_id' => $booking->booking_id
            ]);
            return false;
        }
    }


    public function show($booking_id)
{
    try {
        $booking = Booking::with(['user', 'adSlot'])
            ->where('booking_id', $booking_id)
            ->firstOrFail();
        
        return new BookingResource($booking);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch booking',
            'error' => $e->getMessage()
        ], Response::HTTP_NOT_FOUND);
    }
}


public function update(Request $request, $booking_id)
{
    try {
        $booking = Booking::findOrFail($booking_id);

        // Check if user is authenticated and authorized (admin only)
        if (!Auth::check() || Auth::user()->role_id !== 1) {
            return response()->json([
                'message' => 'Unauthorized to update booking status'
            ], Response::HTTP_FORBIDDEN);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $newStatus = $request->status;
        $booking->status = $newStatus;
        $booking->save();

        // Send email to user if status changed to confirmed
        if ($newStatus === 'confirmed') {
            $user = User::find($booking->user_id);
            $adSlot = AdSlot::find($booking->ad_slot_id);
            
            if ($user && $adSlot) {
                $emailBody = "Dear {$user->name},\n\n"
                    . "Your booking has been confirmed!\n"
                    . "Details:\n"
                    . "Ad Slot: {$adSlot->ad_unit} ({$adSlot->dimensions}, {$adSlot->platform})\n"
                    . "Quantity: {$booking->quantity}\n"
                    . "Duration: {$booking->duration_type}" . ($booking->duration_value ? " ({$booking->duration_value})" : '') . "\n"
                    . "Total Cost: {$booking->total_cost}\n"
                    . "Confirmed At: " . now()->toDateTimeString() . "\n\n"
                    . "Thank you for your booking!";

                Mail::raw($emailBody, function ($message) use ($user) {
                    $message->to($user->email)
                           ->subject('Booking Confirmation');
                });
                
                Log::info('Confirmation email sent to user', [
                    'user_id' => $user->id,
                    'booking_id' => $booking->booking_id
                ]);
            }
        }

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => new BookingResource($booking)
        ], Response::HTTP_OK);

    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to update booking status',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}



    public function destroy($booking_id)
{
    try {
        $booking = Booking::findOrFail($booking_id);

        if (!Auth::check() || (Auth::id() !== $booking->user_id && Auth::user()->role_id !== 1)) {
            return response()->json([
                'message' => 'Unauthorized to delete this booking'
            ], Response::HTTP_FORBIDDEN);
        }

        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully',
            'booking_id' => $booking_id
        ], Response::HTTP_OK);

    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to delete booking',
            'error' => $e->getMessage()
        ], Response::HTTP_NOT_FOUND);
    }
}



public function totalBookings()
{
    try {
        $totalCount = Booking::count(); 
        return response()->json([
            'message' => 'Total bookings retrieved successfully',
            'total_bookings' => $totalCount
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to retrieve total bookings',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}