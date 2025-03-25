<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class PaymentController extends Controller
{
    protected $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);
    }

    public function index()
    {
        try {
            $payments = Payment::with(['user', 'invoice'])->get();
            return PaymentResource::collection($payments);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payments',
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
                'invoice_id' => 'required|exists:invoices,invoice_id',
                'amount_paid' => 'required|numeric|min:0',
                'ref_number' => 'required|string|max:255',
                'receipt_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'payment_method' => 'required|in:credit_card,paypal,bank_transfer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $invoice = Invoice::findOrFail($request->invoice_id);
            if ($invoice->status === 'paid') {
                return response()->json([
                    'message' => 'Invoice already paid'
                ], Response::HTTP_BAD_REQUEST);
            }

            if ($request->amount_paid < $invoice->total_amount) {
                return response()->json([
                    'message' => 'Amount paid is less than the invoice total'
                ], Response::HTTP_BAD_REQUEST);
            }

            $receiptUrl = $this->uploadReceiptToCloudinary($request);
            if (!$receiptUrl) {
                return response()->json([
                    'message' => 'Failed to upload receipt picture'
                ], Response::HTTP_BAD_REQUEST);
            }

            $payment = Payment::create([
                'invoice_id' => $invoice->invoice_id,
                'user_id' => Auth::id(), // Captured via Auth
                'amount_paid' => $request->amount_paid,
                'ref_number' => $request->ref_number,
                'receipt_picture' => $receiptUrl,
                'payment_method' => $request->payment_method,
                'status' => 'pending', // Admin will verify receipt
            ]);

            $this->sendPaymentNotification($user, $payment);

            return (new PaymentResource($payment->load('invoice')))
                ->additional(['message' => 'Payment submitted successfully, awaiting verification'])
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error('Payment creation failed', [
                'invoice_id' => $request->invoice_id ?? null,
                'user_id' => Auth::id() ?? null,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Failed to process payment',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($payment_id)
    {
        try {
            $payment = Payment::with(['user', 'invoice'])->findOrFail($payment_id);
            return new PaymentResource($payment);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Payment not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function update(Request $request, $payment_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'nullable|in:pending,completed,failed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $payment = Payment::findOrFail($payment_id);
            $oldStatus = $payment->status;

            $payment->update($request->all());

            if ($request->status === 'completed' && $oldStatus !== 'completed') {
                $invoice = $payment->invoice;
                $invoice->update(['status' => 'paid']);
                $invoice->booking->update(['status' => 'confirmed']);
            }

            return (new PaymentResource($payment->load('invoice')))
                ->additional(['message' => 'Payment updated successfully'])
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update payment',
                'error' => $e->getMessage()
            ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($payment_id)
    {
        try {
            $payment = Payment::findOrFail($payment_id);
            $payment->delete();
            return response()->json([
                'message' => 'Payment deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage()
            ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function uploadReceiptToCloudinary(Request $request)
    {
        if ($request->hasFile('receipt_picture')) {
            $file = $request->file('receipt_picture');
            $uploadResult = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
                'folder' => 'payment_receipts',
                'resource_type' => 'image',
            ]);

            Log::info('Cloudinary Upload Result for Payment Receipt:', (array) $uploadResult);
            return $uploadResult['secure_url'];
        }
        return null;
    }

    private function sendPaymentNotification(User $user, Payment $payment)
    {
        $createdAt = $payment->created_at->format('Y-m-d H:i:s');
        $invoice = $payment->invoice;

        $emailBody = "Dear {$user->name},\n\n"
            . "Your payment has been submitted:\n"
            . "Invoice Number: {$invoice->invoice_number}\n"
            . "Amount Paid: {$payment->amount_paid}\n"
            . "Reference Number: {$payment->ref_number}\n"
            . "Receipt: {$payment->receipt_picture}\n"
            . "Payment Method: {$payment->payment_method}\n"
            . "Submitted At: {$createdAt}\n\n"
            . "Awaiting verification.\n\n"
            . "Thank you.";

        try {
            Mail::raw($emailBody, function ($message) use ($user) {
                $message->to($user->email)->subject('Payment Submitted');
            });
            return true;
        } catch (Exception $e) {
            \Log::error('Payment email failed: ' . $e->getMessage());
            return false;
        }
    }
}