<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Exception;

class InvoiceController extends Controller
{
    
    public function index()
    {
        try {
            $invoices = Invoice::with([
                'user',  
                'booking' => function ($query) {
                    $query->with(['adSlot' => function ($query) {
                        $query->select('ad_slot_id', 'ad_type');
                    }]);
                }
            ])
            ->orderBy('invoice_id', 'desc')  // Added ordering by invoice_id descending
            ->get();  // Get ALL invoices without any user filtering
    
            return InvoiceResource::collection($invoices);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch invoices',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function loggedUserInvoices()
{
    try {
        $user = auth()->user();
        $invoices = Invoice::where('user_id', $user->user_id)
            ->with(['booking' => function ($query) {
                $query->select('booking_id', 'ad_slot_id', 'quantity', 'total_cost', 'duration_type', 'duration_value')
                      ->with(['adSlot' => function ($query) {
                          $query->select('ad_slot_id', 'ad_unit', 'image', 'dimensions', 'platform');
                      }]);
            }])
            ->select('invoice_id', 'user_id', 'booking_id', 'invoice_number', 'total_amount', 'status', 'created_at')
            ->orderBy('invoice_id', 'desc')
            ->get();

        return InvoiceResource::collection($invoices);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch invoices',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}



    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $validator = Validator::make($request->all(), [
                'booking_id' => 'required|exists:bookings,booking_id',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $booking = Booking::findOrFail($request->booking_id);
            $invoiceNumber = $this->generateInvoiceNumber();

            $invoice = Invoice::create([
                'user_id' => $user->id,
                'booking_id' => $booking->booking_id,
                'total_amount' => $booking->total_cost,
                'status' => 'unpaid',
                'invoice_number' => $invoiceNumber,
            ]);

            $this->sendUserInvoiceNotification($user, $invoice);
            $admins = User::where('role_id', 1)->get();
            foreach ($admins as $admin) {
                $this->sendAdminInvoiceNotification($admin, $invoice, $user->name);
            }

            return (new InvoiceResource($invoice->load('booking')))
                ->additional(['message' => 'Invoice generated successfully'])
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['message' => 'Failed to generate invoice', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($invoice_id)
    {
        try {
            $invoice = Invoice::with(['user', 'booking'])->findOrFail($invoice_id);
            return new InvoiceResource($invoice);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invoice not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function update(Request $request, $invoice_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'nullable|in:unpaid,paid,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $invoice = Invoice::findOrFail($invoice_id);
            $invoice->update($request->all());
            return (new InvoiceResource($invoice->load('booking')))
                ->additional(['message' => 'Invoice updated successfully'])
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update invoice',
                'error' => $e->getMessage()
            ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($invoice_id)
    {
        try {
            $invoice = Invoice::findOrFail($invoice_id);
            $invoice->delete();
            return response()->json([
                'message' => 'Invoice deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete invoice',
                'error' => $e->getMessage()
            ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function generateInvoiceNumber()
    {
        do {
            $randomNumber = rand(1000000, 9999999);
            $invoiceNumber = "INV" . $randomNumber;
            $exists = Invoice::where('invoice_number', $invoiceNumber)->exists();
        } while ($exists);

        return $invoiceNumber;
    }

    private function sendUserInvoiceNotification(User $user, Invoice $invoice)
    {
        $createdAt = $invoice->created_at->format('Y-m-d H:i:s');
        $booking = $invoice->booking;
        $adSlot = $booking->adSlot;

        $emailBody = "Dear {$user->name},\n\n"
            . "Your invoice has been generated:\n"
            . "Invoice Number: {$invoice->invoice_number}\n"
            . "Ad Slot: {$adSlot->ad_unit} ({$adSlot->dimensions}, {$adSlot->platform})\n"
            . "Total Amount: {$invoice->total_amount}\n"
            . "Generated At: {$createdAt}\n\n"
            . "Please proceed to payment.\n\n"
            . "Thank you.";

        try {
            Mail::raw($emailBody, function ($message) use ($user) {
                $message->to($user->email)->subject('Your Invoice Generated');
            });
            \Log::info('Invoice notification sent to user', [
                'user_id' => $user->id,
                'invoice_id' => $invoice->invoice_id
            ]);
            return true;
        } catch (Exception $e) {
            \Log::error('User invoice email failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'invoice_id' => $invoice->invoice_id
            ]);
            return false;
        }
    }

    private function sendAdminInvoiceNotification(User $admin, Invoice $invoice, $userName)
    {
        $createdAt = $invoice->created_at->format('Y-m-d H:i:s');
        $booking = $invoice->booking;
        $adSlot = $booking->adSlot;

        $emailBody = "Dear {$admin->name},\n\n"
            . "A new invoice has been generated by {$userName}:\n"
            . "Invoice Number: {$invoice->invoice_number}\n"
            . "Ad Slot: {$adSlot->ad_unit} ({$adSlot->dimensions}, {$adSlot->platform})\n"
            . "Total Amount: {$invoice->total_amount}\n"
            . "Generated At: {$createdAt}\n\n"
            . "Please review the invoice.\n\n"
            . "Thank you.";

        try {
            Mail::raw($emailBody, function ($message) use ($admin) {
                $message->to($admin->email)->subject('New Invoice Generated');
            });
            \Log::info('Invoice notification sent to admin', [
                'admin_id' => $admin->id,
                'invoice_id' => $invoice->invoice_id
            ]);
            return true;
        } catch (Exception $e) {
            \Log::error('Admin invoice email failed: ' . $e->getMessage(), [
                'admin_id' => $admin->id,
                'invoice_id' => $invoice->invoice_id
            ]);
            return false;
        }
    }



    public function totalInvoices()
{
    try {
        $totalCount = Invoice::count(); 
        return response()->json([
            'message' => 'Total invoices retrieved successfully',
            'total_invoices' => $totalCount
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to retrieve total invoices',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}