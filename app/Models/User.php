<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'employee_id',
        'role',
        'department_id',
        'manager_id',
        'phone',
        'hire_date',
        'position',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'hire_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the department the user belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the user's manager.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get the employees managed by this user.
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    /**
     * Get all leave requests for this user.
     */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Get all leave balances for this user.
     */
    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /**
     * Get leave requests that this user needs to approve.
     */
    public function pendingApprovals(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'user_id')
            ->whereHas('user', function ($query) {
                $query->where('manager_id', $this->id);
            })
            ->pending();
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    /**
     * Check if the user is a manager.
     */
    public function isManager(): bool
    {
        return $this->role === UserRole::MANAGER;
    }

    /**
     * Check if the user is an employee.
     */
    public function isEmployee(): bool
    {
        return $this->role === UserRole::EMPLOYEE;
    }

    /**
     * Check if the user can approve a leave request.
     */
    public function canApprove(LeaveRequest $leaveRequest): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        return $this->isManager() && $leaveRequest->user->manager_id === $this->id;
    }

    /**
     * Get the leave balance for a specific leave type and year.
     */
    public function getLeaveBalance(int $leaveTypeId, int $year = null): ?LeaveBalance
    {
        $year = $year ?? now()->year;

        return $this->leaveBalances()
            ->where('leave_type_id', $leaveTypeId)
            ->where('year', $year)
            ->first();
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by role.
     */
    public function scopeRole($query, UserRole $role)
    {
        return $query->where('role', $role);
    }
}
