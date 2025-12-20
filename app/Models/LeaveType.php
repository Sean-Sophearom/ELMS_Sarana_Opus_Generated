<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'days_per_year',
        'is_paid',
        'requires_approval',
        'is_active',
        'color',
    ];

    protected $casts = [
        'days_per_year' => 'integer',
        'is_paid' => 'boolean',
        'requires_approval' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get all leave requests for this leave type.
     */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Get all leave balances for this leave type.
     */
    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /**
     * Scope a query to only include active leave types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
