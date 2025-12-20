<?php

namespace Database\Seeders;

use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeaveBalanceSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $leaveTypes = LeaveType::all();
        $currentYear = date('Y');

        foreach ($users as $user) {
            foreach ($leaveTypes as $leaveType) {
                // Skip maternity leave for simplicity
                if ($leaveType->code === 'ML') {
                    continue;
                }

                LeaveBalance::create([
                    'user_id' => $user->id,
                    'leave_type_id' => $leaveType->id,
                    'year' => $currentYear,
                    'allocated_days' => $leaveType->days_per_year,
                    'used_days' => rand(0, min(5, $leaveType->days_per_year)),
                ]);
            }
        }
    }
}
