<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->unique()->nullable()->after('id');
            $table->enum('role', ['admin', 'manager', 'employee'])->default('employee')->after('email');
            $table->foreignId('department_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->foreignId('manager_id')->nullable()->after('department_id')->constrained('users')->nullOnDelete();
            $table->string('phone')->nullable()->after('manager_id');
            $table->date('hire_date')->nullable()->after('phone');
            $table->string('position')->nullable()->after('hire_date');
            $table->boolean('is_active')->default(true)->after('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['manager_id']);
            $table->dropColumn([
                'employee_id',
                'role',
                'department_id',
                'manager_id',
                'phone',
                'hire_date',
                'position',
                'is_active'
            ]);
        });
    }
};
