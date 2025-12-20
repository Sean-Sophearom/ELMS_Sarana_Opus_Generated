<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'description',
        'is_recurring',
    ];

    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
    ];

    /**
     * Scope a query to get holidays for a specific year.
     */
    public function scopeForYear($query, int $year)
    {
        return $query->whereYear('date', $year);
    }

    /**
     * Scope a query to get upcoming holidays.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->startOfDay())
            ->orderBy('date');
    }

    /**
     * Check if a given date is a holiday.
     */
    public static function isHoliday($date): bool
    {
        return self::whereDate('date', $date)->exists();
    }
}
