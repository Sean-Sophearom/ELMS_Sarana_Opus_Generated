<?php

namespace Database\Seeders;

use App\Enums\LeaveStatus;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LeaveRequestSeeder extends Seeder
{
    public function run(): void
    {
        $employees = User::where('role', '!=', 'admin')->get();
        $leaveTypes = LeaveType::where('code', '!=', 'ML')->get();
        $statuses = [LeaveStatus::PENDING, LeaveStatus::APPROVED, LeaveStatus::REJECTED];
        
        $reasons = [
            'Family vacation',
            'Personal matters',
            'Medical appointment',
            'Home renovation',
            'Wedding attendance',
            'Rest and relaxation',
            'Family event',
            'Taking care of personal business',
            'Feeling unwell',
            'Doctor appointment',
        ];

        // Create some past leave requests
        foreach ($employees->take(8) as $employee) {
            $leaveType = $leaveTypes->random();
            $status = $statuses[array_rand($statuses)];
            $startDate = Carbon::now()->subDays(rand(30, 90));
            $endDate = (clone $startDate)->addDays(rand(1, 5));

            LeaveRequest::create([
                'user_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_days' => $startDate->diffInDays($endDate) + 1,
                'reason' => $reasons[array_rand($reasons)],
                'status' => $status,
                'approved_by' => $status !== LeaveStatus::PENDING ? $employee->manager_id : null,
                'approved_at' => $status !== LeaveStatus::PENDING ? $startDate->subDays(5) : null,
                'rejection_reason' => $status === LeaveStatus::REJECTED ? 'Insufficient team coverage during requested period' : null,
            ]);
        }

        // Create some upcoming/pending leave requests
        foreach ($employees->take(5) as $employee) {
            $leaveType = $leaveTypes->random();
            $startDate = Carbon::now()->addDays(rand(7, 30));
            $endDate = (clone $startDate)->addDays(rand(1, 3));

            LeaveRequest::create([
                'user_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_days' => $startDate->diffInDays($endDate) + 1,
                'reason' => $reasons[array_rand($reasons)],
                'status' => LeaveStatus::PENDING,
                'approved_by' => null,
                'approved_at' => null,
            ]);
        }

        // Create some approved future leave requests
        foreach ($employees->skip(5)->take(4) as $employee) {
            $leaveType = $leaveTypes->random();
            $startDate = Carbon::now()->addDays(rand(14, 45));
            $endDate = (clone $startDate)->addDays(rand(2, 5));

            LeaveRequest::create([
                'user_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_days' => $startDate->diffInDays($endDate) + 1,
                'reason' => $reasons[array_rand($reasons)],
                'status' => LeaveStatus::APPROVED,
                'approved_by' => $employee->manager_id,
                'approved_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }

        // Create current leave (someone on leave today)
        $currentEmployee = $employees->random();
        $leaveType = $leaveTypes->first();
        
        LeaveRequest::create([
            'user_id' => $currentEmployee->id,
            'leave_type_id' => $leaveType->id,
            'start_date' => Carbon::now()->subDay(),
            'end_date' => Carbon::now()->addDays(2),
            'total_days' => 4,
            'reason' => 'Taking some time off',
            'status' => LeaveStatus::APPROVED,
            'approved_by' => $currentEmployee->manager_id,
            'approved_at' => Carbon::now()->subDays(5),
        ]);
    }
}
