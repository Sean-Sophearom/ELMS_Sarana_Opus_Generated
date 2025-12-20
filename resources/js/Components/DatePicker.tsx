import { useState, useEffect } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    minDate?: string;
    maxDate?: string;
    holidays?: string[];
    disableWeekends?: boolean;
    placeholder?: string;
    error?: string;
    id?: string;
    disabled?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({
    value,
    onChange,
    minDate,
    maxDate,
    holidays = [],
    disableWeekends = true,
    placeholder = 'Select date',
    error,
    id,
    disabled = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    useEffect(() => {
        if (value) {
            setSelectedDate(new Date(value));
            setCurrentMonth(new Date(value));
        }
    }, [value]);

    const holidayDates = holidays;

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days: (Date | null)[] = [];
        
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const isDateDisabled = (date: Date): boolean => {
        const dateStr = formatDateForInput(date);
        
        // Check weekend
        if (disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
            return true;
        }
        
        // Check holidays
        if (holidayDates.includes(dateStr)) {
            return true;
        }
        
        // Check min date
        if (minDate && dateStr < minDate) {
            return true;
        }
        
        // Check max date
        if (maxDate && dateStr > maxDate) {
            return true;
        }
        
        return false;
    };

    const isHoliday = (date: Date): boolean => {
        const dateStr = formatDateForInput(date);
        return holidayDates.includes(dateStr);
    };

    const isWeekend = (date: Date): boolean => {
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const formatDateForDisplay = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;
        
        setSelectedDate(date);
        onChange(formatDateForInput(date));
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        if (!isDateDisabled(today)) {
            handleDateClick(today);
        }
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return formatDateForInput(date) === formatDateForInput(today);
    };

    const isSelected = (date: Date): boolean => {
        return selectedDate ? formatDateForInput(date) === formatDateForInput(selectedDate) : false;
    };

    return (
        <div className="relative">
            <button
                type="button"
                id={id}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    relative w-full cursor-pointer rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm 
                    focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm
                    ${error ? 'border-red-300' : 'border-gray-300'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
            >
                <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 mt-1 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="text-sm font-semibold text-gray-900">
                                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* Day names */}
                            <div className="grid grid-cols-7 mb-1">
                                {DAYS.map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth(currentMonth).map((date, index) => (
                                    <div key={index} className="aspect-square">
                                        {date ? (
                                            <button
                                                type="button"
                                                onClick={() => handleDateClick(date)}
                                                disabled={isDateDisabled(date)}
                                                className={`
                                                    w-full h-full flex items-center justify-center text-sm rounded-full
                                                    transition-colors duration-150
                                                    ${isSelected(date) 
                                                        ? 'bg-orange-600 text-white' 
                                                        : isToday(date)
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : isDateDisabled(date)
                                                                ? isHoliday(date)
                                                                    ? 'bg-red-50 text-red-300 cursor-not-allowed'
                                                                    : isWeekend(date)
                                                                        ? 'text-gray-300 cursor-not-allowed'
                                                                        : 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-900 hover:bg-gray-100'
                                                    }
                                                `}
                                                title={isHoliday(date) 
                                                    ? 'Holiday' 
                                                    : undefined
                                                }
                                            >
                                                {date.getDate()}
                                            </button>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleToday}
                                    className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                                >
                                    Today
                                </button>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-red-200 mr-1"></span>
                                        Holiday
                                    </span>
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-gray-200 mr-1"></span>
                                        Weekend
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
