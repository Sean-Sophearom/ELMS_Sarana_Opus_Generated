<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'leave_type_id',
        'year',
        'allocated_days',
        'used_days',
        'pending_days',
        'carried_over',
    ];

    protected $casts = [
        'year' => 'integer',
        'allocated_days' => 'decimal:2',
        'used_days' => 'decimal:2',
        'pending_days' => 'decimal:2',
        'carried_over' => 'decimal:2',
    ];

    /**
     * Get the user that owns the leave balance.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the leave type for this balance.
     */
    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    /**
     * Get the remaining balance.
     */
    public function getRemainingDaysAttribute(): float
    {
        return $this->allocated_days + $this->carried_over - $this->used_days - $this->pending_days;
    }

    /**
     * Get the total available days (allocated + carried over).
     */
    public function getTotalAvailableAttribute(): float
    {
        return $this->allocated_days + $this->carried_over;
    }

    /**
     * Scope a query to get balances for a specific year.
     */
    public function scopeForYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope a query to get balances for current year.
     */
    public function scopeCurrentYear($query)
    {
        return $query->where('year', now()->year);
    }
}
