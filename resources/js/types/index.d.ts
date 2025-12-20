export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    employee_id?: string;
    role: 'admin' | 'manager' | 'employee';
    department?: string;
    position?: string;
    hire_date?: string;
    is_active: boolean;
}

export interface LeaveBalance {
    id: number;
    leave_type: string;
    color: string;
    allocated: number;
    used: number;
    pending: number;
    remaining: number;
}

export interface LeaveRequest {
    id: number;
    leave_type: string;
    leave_type_color: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    status_label: string;
    status_color: string;
    reason: string;
    rejection_reason?: string;
    created_at: string;
    can_cancel: boolean;
}

export interface LeaveType {
    id: number;
    name: string;
    code: string;
    description?: string;
    color: string;
    days_per_year: number;
    is_paid: boolean;
    requires_approval: boolean;
    is_active: boolean;
    balance?: {
        allocated: number;
        used: number;
        remaining: number;
    };
}

export interface Department {
    id: number;
    name: string;
    code: string;
    description?: string;
    employees_count: number;
    is_active: boolean;
}

export interface Holiday {
    id: number;
    name: string;
    date: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
