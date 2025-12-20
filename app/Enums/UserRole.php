<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case EMPLOYEE = 'employee';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::MANAGER => 'Manager',
            self::EMPLOYEE => 'Employee',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::ADMIN => 'red',
            self::MANAGER => 'blue',
            self::EMPLOYEE => 'green',
        };
    }
}
