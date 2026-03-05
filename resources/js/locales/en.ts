const en = {
    hero: {
        badge: 'Simple & Efficient Leave Management',
        h1_line1: 'Manage Leave',
        h1_line2: 'Effortlessly',
        tagline:
            'Streamline your leave management. Track time off, approve requests, and maintain work-life balance with our intuitive leave management system.',
        cta_register: 'Register',
        cta_signin: 'Sign In',
        leave_balance: 'Leave Balance',
        leave_types: {
            annual: 'Annual',
            sick: 'Sick',
            personal: 'Personal',
            emergency: 'Emergency',
        },
        used_of: '{used} used of {total}',
        recent_request: 'Recent Request',
        approved: 'Approved',
        sample_request: 'Annual Leave - Dec 23-27',
    },
    nav: {
        dashboard: 'Dashboard',
        signin: 'Sign In',
        get_started: 'Get Started',
        login: 'Login',
    },
    features: {
        title: 'Everything you need to manage leave',
        subtitle: 'Our comprehensive leave management system helps you track, approve, and analyze employee time off with ease.',
        items: {
            requests: {
                title: 'Easy Leave Requests',
                desc: 'Submit leave requests in seconds with our intuitive calendar interface and automatic day calculation.',
            },
            approvals: {
                title: 'Quick Approvals',
                desc: 'Managers can review and approve requests with one click, keeping the workflow moving smoothly.',
            },
            balance: {
                title: 'Balance Tracking',
                desc: 'Real-time leave balance updates ensure employees always know their available time off.',
            },
            visibility: {
                title: 'Team Visibility',
                desc: 'See who is on leave at a glance to better plan projects and manage team capacity.',
            },
            analytics: {
                title: 'Reports & Analytics',
                desc: 'Generate detailed reports on leave patterns, trends, and department statistics.',
            },
            access: {
                title: 'Role-Based Access',
                desc: 'Secure access control with distinct permissions for employees, managers, and admins.',
            },
        },
    },
    cta: {
        title: 'Ready to simplify leave management?',
        subtitle: 'Join companies that trust {app_name} to manage their employee time off efficiently.',
        button: 'Get Started for Free',
    },
    footer: {
        rights: 'All rights reserved.',
    },
};

export default en;
export type TranslationKeys = typeof en;
