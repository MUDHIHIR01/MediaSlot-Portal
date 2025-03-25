<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdSlotResource;
use App\Models\AdSlot;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;
use Exception;

class AdSlotController extends Controller
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

    public function indexV1()
{
    try {
        $adSlots = AdSlot::where('available', true)
                        ->orderBy('ad_slot_id', 'desc')
                        ->get();
        return AdSlotResource::collection($adSlots);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch ad slots',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

public function index()
{
    try {
        $adSlots = AdSlot::where('available', true)
                        ->orderBy('ad_slot_id', 'desc')
                        ->get();
        return AdSlotResource::collection($adSlots);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch ad slots',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ad_type' => 'required|string|max:255',
                'ad_unit' => 'required|string|max:255',
                'dimensions' => 'required|string|max:50',
                'device' => 'required|string|',
                'platform' => 'required|string|max:255',
                'placement_type' => 'required|string|max:255',
                'rate' => 'required|string',
                'rate_unit' => 'required|string',
                'duration_limit' => 'nullable|string|max:255',
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $imageUrl = $this->uploadImageToCloudinary($request);
            if (!$imageUrl) {
                return response()->json([
                    'message' => 'Failed to upload image'
                ], Response::HTTP_BAD_REQUEST);
            }

            $adSlot = AdSlot::create([
                'ad_type' => $request->ad_type,
                'ad_unit' => $request->ad_unit,
                'dimensions' => $request->dimensions,
                'device' => $request->device,
                'platform' => $request->platform,
                'placement_type' => $request->placement_type,
                'rate' => $request->rate,
                'rate_unit' => $request->rate_unit,
                'duration_limit' => $request->duration_limit,
                'available' => 1, // Explicitly set to true
                'image' => $imageUrl,
            ]);

            return (new AdSlotResource($adSlot))
                ->additional(['message' => 'Ad slot created successfully'])
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error('Ad slot creation failed', [
                'ad_unit' => $request->ad_unit ?? null,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Failed to create ad slot',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($ad_slot_id)
    {
        try {
            $adSlot = AdSlot::findOrFail($ad_slot_id);
            return new AdSlotResource($adSlot);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Ad slot not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

  
    public function update(Request $request, $ad_slot_id)
{
    try {
        $validator = Validator::make($request->all(), [
            'ad_type' => 'nullable|string|max:255',
            'ad_unit' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:50',
            'device' => 'nullable|string',
            'platform' => 'nullable|string|max:255',
            'placement_type' => 'nullable|string|max:255',
            'rate' => 'nullable|numeric|min:0',
            'rate_unit' => 'nullable|string',
            'duration_limit' => 'nullable|string|max:255',
            'available' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $adSlot = AdSlot::findOrFail($ad_slot_id);
        $data = $request->all();

        $adSlot->update($data);

        return (new AdSlotResource($adSlot))
            ->additional(['message' => 'Ad slot updated successfully'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);

    } catch (Exception $e) {
        Log::error('Ad slot update failed', [
            'ad_slot_id' => $ad_slot_id,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'message' => 'Failed to update ad slot',
            'error' => $e->getMessage()
        ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


    public function destroy($ad_slot_id)
    {
        try {
            $adSlot = AdSlot::findOrFail($ad_slot_id);
            $adSlot->delete();
            return response()->json([
                'message' => 'Ad slot deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete ad slot',
                'error' => $e->getMessage()
            ], $e->getCode() === '404' ? Response::HTTP_NOT_FOUND : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function uploadImageToCloudinary(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $uploadResult = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
                'folder' => 'ad_slots',
                'resource_type' => 'image',
            ]);

            Log::info('Cloudinary Upload Result for Ad Slot Image:', (array) $uploadResult);
            return $uploadResult['secure_url'];
        }
        return null;
    }


    public function totalSlots()
{
    try {
        $totalCount = AdSlot::count();
        return response()->json([
            'message' => 'Total ad slots retrieved successfully',
            'total_slots' => $totalCount
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Failed to retrieve total ad slots',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
}