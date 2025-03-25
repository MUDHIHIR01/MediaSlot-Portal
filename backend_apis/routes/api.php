<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
 use App\Http\Controllers\RoleController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\AdSlotController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RestockAssetController;

// Public Routes
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized user! Please login to access the API'], 401);
})->name('login');


// Authentication Routes
Route::post('/auth/add-user', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
// Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
// Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::post('/auth/request-reset', [PasswordResetController::class, 'requestPasswordReset']);
Route::post('/auth/password-reset', [PasswordResetController::class, 'resetPassword']);
Route::get('/ad-slots_v1', [AdSlotController::class, 'indexV1']);


// Protected Routes
Route::middleware(['auth:sanctum', 'token.expiration'])->group(function () {

//user route
     Route::get('/all/users', [AuthController::class, 'users']);
     Route::get('/users/byname', [AuthController::class, 'dropdownUsersByName']);
     Route::get('/users/byrole', [AuthController::class, 'dropdownUsersByRole']);
    Route::get('user/profile', [AuthController::class, 'getLoggedUserProfile']);
    Route::get('/user/withrole', [AuthController::class, 'getUsersWithRoles']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/count/users', [AuthController::class, 'countUsers']);
    Route::get('/logged-user/name', [AuthController::class, 'getLoggedUserName']);



    // Route to show a specific user by user_id
    Route::get('/user/{user_id}', [AuthController::class, 'showUserById']);
    // Route to update a specific user by user_id
    Route::put('/update-user/{user_id}', [AuthController::class, 'updateUser']);
    Route::delete('/auth/user/{user_id}', [AuthController::class, 'deleteUser']);
    Route::get('/audit-trail', [AuthController::class, 'getAuditTrail']);
    Route::post('/store-cookies', [AuthController::class, 'storeCookies']);
    

//admin,hod,account and engineers rout drop dropdown
Route::get('/dropdown/engineer', [AuthController::class, 'EngineersDropDown']);


    //roles route
    Route::apiResource('/auth/roles', RoleController::class);
    Route::get('/count/roles', [RoleController::class, 'countRoles']);
    Route::get('roles/dropdown-options', [RoleController::class, 'getDropdownOptions']);


    //slots rout(create,view,edit and delete)
    Route::apiResource('/ad-slots', AdSlotController::class);
    
    

    // Bookings(create,view,edit and delete)
    Route::apiResource('/bookings',BookingController::class);
    Route::get('/loggedUserBookings', [BookingController::class, 'loggedUserBookings']);

    // Invoices(create,view,edit and delete)
    Route::apiResource('/invoices', InvoiceController::class);
    Route::get('/loggedUserInvoices', [ InvoiceController::class, 'loggedUserInvoices']);

    // Payments(create,view,edit and delete)
    Route::apiResource('/payments', PaymentController::class);
   


});
