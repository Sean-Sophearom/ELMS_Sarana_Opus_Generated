<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Annual Leave',
                'code' => 'AL',
                'description' => 'Regular vacation leave for rest and recreation',
                'days_per_year' => 15,
                'is_paid' => true,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#3B82F6',
            ],
            [
                'name' => 'Sick Leave',
                'code' => 'SL',
                'description' => 'Leave for illness or medical appointments',
                'days_per_year' => 10,
                'is_paid' => true,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#EF4444',
            ],
            [
                'name' => 'Emergency Leave',
                'code' => 'EL',
                'description' => 'Leave for emergency situations',
                'days_per_year' => 5,
                'is_paid' => true,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#F59E0B',
            ],
            [
                'name' => 'Maternity Leave',
                'code' => 'ML',
                'description' => 'Leave for expecting mothers',
                'days_per_year' => 90,
                'is_paid' => true,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#EC4899',
            ],
            [
                'name' => 'Paternity Leave',
                'code' => 'PL',
                'description' => 'Leave for new fathers',
                'days_per_year' => 7,
                'is_paid' => true,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#06B6D4',
            ],
            [
                'name' => 'Unpaid Leave',
                'code' => 'UL',
                'description' => 'Leave without pay for personal reasons',
                'days_per_year' => 30,
                'is_paid' => false,
                'requires_approval' => true,
                'is_active' => true,
                'color' => '#6B7280',
            ],
        ];

        foreach ($leaveTypes as $leaveType) {
            LeaveType::create($leaveType);
        }
    }
}
