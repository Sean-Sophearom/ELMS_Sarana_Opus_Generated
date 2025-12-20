<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $currentYear = date('Y');

        $holidays = [
            [
                'name' => "New Year's Day",
                'date' => "{$currentYear}-01-01",
                'is_recurring' => true,
            ],
            [
                'name' => 'Independence Day',
                'date' => "{$currentYear}-06-12",
                'is_recurring' => true,
            ],
            [
                'name' => 'Labor Day',
                'date' => "{$currentYear}-05-01",
                'is_recurring' => true,
            ],
            [
                'name' => 'Christmas Day',
                'date' => "{$currentYear}-12-25",
                'is_recurring' => true,
            ],
            [
                'name' => 'Christmas Eve',
                'date' => "{$currentYear}-12-24",
                'is_recurring' => true,
            ],
            [
                'name' => "New Year's Eve",
                'date' => "{$currentYear}-12-31",
                'is_recurring' => true,
            ],
            [
                'name' => 'All Saints Day',
                'date' => "{$currentYear}-11-01",
                'is_recurring' => true,
            ],
            [
                'name' => 'Bonifacio Day',
                'date' => "{$currentYear}-11-30",
                'is_recurring' => true,
            ],
            [
                'name' => 'Rizal Day',
                'date' => "{$currentYear}-12-30",
                'is_recurring' => true,
            ],
        ];

        foreach ($holidays as $holiday) {
            Holiday::create($holiday);
        }
    }
}
