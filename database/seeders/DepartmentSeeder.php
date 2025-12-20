<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Human Resources',
                'code' => 'HR',
                'description' => 'Human Resources and People Management',
                'is_active' => true,
            ],
            [
                'name' => 'Information Technology',
                'code' => 'IT',
                'description' => 'IT Infrastructure and Software Development',
                'is_active' => true,
            ],
            [
                'name' => 'Finance',
                'code' => 'FIN',
                'description' => 'Financial Planning and Accounting',
                'is_active' => true,
            ],
            [
                'name' => 'Marketing',
                'code' => 'MKT',
                'description' => 'Marketing and Communications',
                'is_active' => true,
            ],
            [
                'name' => 'Operations',
                'code' => 'OPS',
                'description' => 'Operations and Logistics',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
