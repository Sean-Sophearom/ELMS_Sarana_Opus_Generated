<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\LeaveTypeController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Leave Requests
    Route::prefix('leave')->name('leave.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::get('/create', [LeaveRequestController::class, 'create'])->name('create');
        Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
        Route::get('/{leaveRequest}', [LeaveRequestController::class, 'show'])->name('show');
        Route::post('/{leaveRequest}/cancel', [LeaveRequestController::class, 'cancel'])->name('cancel');
    });

    // Approvals (for managers and admins)
    Route::middleware('manager')->prefix('approvals')->name('approvals.')->group(function () {
        Route::get('/', [ApprovalController::class, 'index'])->name('index');
        Route::get('/{leaveRequest}', [ApprovalController::class, 'show'])->name('show');
        Route::post('/{leaveRequest}/approve', [ApprovalController::class, 'approve'])->name('approve');
        Route::post('/{leaveRequest}/reject', [ApprovalController::class, 'reject'])->name('reject');
    });

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        // Employees
        Route::resource('employees', EmployeeController::class);

        // Departments
        Route::resource('departments', DepartmentController::class);

        // Leave Types
        Route::resource('leave-types', LeaveTypeController::class);

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    });
});

require __DIR__.'/auth.php';
