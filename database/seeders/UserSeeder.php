<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP001',
            'role' => UserRole::ADMIN,
            'department_id' => 1, // HR
            'manager_id' => null,
            'hire_date' => '2023-01-15',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // IT Manager
        $itManager = User::create([
            'name' => 'Sinat Samuel',
            'email' => 'sam@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP002',
            'role' => UserRole::MANAGER,
            'department_id' => 2, // IT
            'manager_id' => 1,
            'hire_date' => '2024-03-15',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // HR Manager
        $hrManager = User::create([
            'name' => 'Sam Sreynim',
            'email' => 'sreynim@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP003',
            'role' => UserRole::MANAGER,
            'department_id' => 1, // HR
            'manager_id' => 1,
            'hire_date' => '2024-05-20',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // Finance Manager
        $finManager = User::create([
            'name' => 'Hak Kimheng',
            'email' => 'heng@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP004',
            'role' => UserRole::MANAGER,
            'department_id' => 3, // Finance
            'manager_id' => 1,
            'hire_date' => '2024-07-10',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // IT Employees
        User::create([
            'name' => 'Sean Sophearom',
            'email' => 'rom@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP005',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 2, // IT
            'manager_id' => $itManager->id,
            'hire_date' => '2025-01-10',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        User::create([
            'name' => 'Bob Davis',
            'email' => 'bob.davis@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP006',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 2, // IT
            'manager_id' => $itManager->id,
            'hire_date' => '2025-03-01',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        User::create([
            'name' => 'Charlie Miller',
            'email' => 'charlie.miller@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP007',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 2, // IT
            'manager_id' => $itManager->id,
            'hire_date' => '2025-06-15',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // HR Employees
        User::create([
            'name' => 'Diana Wilson',
            'email' => 'diana.wilson@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP008',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 1, // HR
            'manager_id' => $hrManager->id,
            'hire_date' => '2025-02-01',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        User::create([
            'name' => 'Edward Taylor',
            'email' => 'edward.taylor@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP009',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 1, // HR
            'manager_id' => $hrManager->id,
            'hire_date' => '2025-08-10',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        // Finance Employees
        User::create([
            'name' => 'Fiona Anderson',
            'email' => 'fiona.anderson@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP010',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 3, // Finance
            'manager_id' => $finManager->id,
            'hire_date' => '2025-04-05',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        User::create([
            'name' => 'George Thomas',
            'email' => 'george.thomas@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP011',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 3, // Finance
            'manager_id' => $finManager->id,
            'hire_date' => '2025-09-01',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);

        User::create([
            'name' => 'Hannah Jackson',
            'email' => 'hannah.jackson@example.com',
            'password' => Hash::make('123'),
            'employee_id' => 'EMP012',
            'role' => UserRole::EMPLOYEE,
            'department_id' => 3, // Finance
            'manager_id' => $finManager->id,
            'hire_date' => '2026-01-15',
            'is_active' => true,
            'two_factor_enabled' => false,
        ]);
    }
}
