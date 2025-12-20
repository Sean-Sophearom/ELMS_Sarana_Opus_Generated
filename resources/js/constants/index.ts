// Application-wide constants

export const APP_NAME = 'LeaveMgmtSystem';
export const APP_TAGLINE = 'Streamline your leave management';

// Brand Colors
export const COLORS = {
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
    },
    success: {
        light: '#D1FAE5',
        DEFAULT: '#10B981',
        dark: '#059669',
    },
    warning: {
        light: '#FEF3C7',
        DEFAULT: '#F59E0B',
        dark: '#D97706',
    },
    error: {
        light: '#FEE2E2',
        DEFAULT: '#EF4444',
        dark: '#DC2626',
    },
    info: {
        light: '#DBEAFE',
        DEFAULT: '#3B82F6',
        dark: '#2563EB',
    },
} as const;

// Leave Type Color Options
export const LEAVE_TYPE_COLORS = [
    { value: '#3B82F6', label: 'Blue', tailwind: 'bg-blue-500' },
    { value: '#10B981', label: 'Green', tailwind: 'bg-emerald-500' },
    { value: '#F59E0B', label: 'Yellow', tailwind: 'bg-amber-500' },
    { value: '#EF4444', label: 'Red', tailwind: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Purple', tailwind: 'bg-violet-500' },
    { value: '#EC4899', label: 'Pink', tailwind: 'bg-pink-500' },
    { value: '#06B6D4', label: 'Cyan', tailwind: 'bg-cyan-500' },
    { value: '#F97316', label: 'Orange', tailwind: 'bg-orange-500' },
] as const;

export const DEFAULT_LEAVE_TYPE_COLOR = '#3B82F6';

// Leave Status Configuration
export const LEAVE_STATUS = {
    pending: {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: 'clock',
    },
    approved: {
        label: 'Approved',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: 'check',
    },
    rejected: {
        label: 'Rejected',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: 'x',
    },
    cancelled: {
        label: 'Cancelled',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        icon: 'ban',
    },
} as const;

// User Roles
export const USER_ROLES = {
    admin: {
        label: 'Administrator',
        color: 'bg-purple-100 text-purple-800',
    },
    manager: {
        label: 'Manager',
        color: 'bg-blue-100 text-blue-800',
    },
    employee: {
        label: 'Employee',
        color: 'bg-gray-100 text-gray-800',
    },
} as const;

// Date Formats
export const DATE_FORMATS = {
    display: 'MMM dd, yyyy',
    input: 'yyyy-MM-dd',
    api: 'yyyy-MM-dd',
} as const;

// Pagination
export const PAGINATION = {
    perPage: 10,
    perPageOptions: [10, 25, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxSizeLabel: '5MB',
    acceptedTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    acceptedExtensions: '.pdf,.jpg,.jpeg,.png,.gif,.doc,.docx',
} as const;

// Helper function to get status config
export const getStatusConfig = (status: keyof typeof LEAVE_STATUS) => {
    return LEAVE_STATUS[status] || LEAVE_STATUS.pending;
};

// Helper function to get role config
export const getRoleConfig = (role: keyof typeof USER_ROLES) => {
    return USER_ROLES[role] || USER_ROLES.employee;
};
