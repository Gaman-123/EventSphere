import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, Maximize2, X } from 'lucide-react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CustomToolbar = ({ label, onNavigate, onView, view, views }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-lg">
                <button
                    onClick={() => onNavigate('PREV')}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    title="Previous"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onNavigate('TODAY')}
                    className="px-4 py-2 font-semibold hover:bg-slate-50 rounded-lg transition-colors text-slate-700 flex items-center gap-2"
                >
                    <CalendarDays className="w-4 h-4" /> Today
                </button>
                <button
                    onClick={() => onNavigate('NEXT')}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    title="Next"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
                {label}
            </h2>

            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-lg">
                {views.map(v => (
                    <button
                        key={v}
                        onClick={() => onView(v)}
                        className={`capitalize px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === v
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CalendarView = ({ events, onSelectSlot, onSelectEvent, isAdmin }) => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        resource: event,
    }));

    const eventStyleGetter = (event) => {
        // Generate a color based on status if admin, else department
        let backgroundColor = '#6366f1';

        if (isAdmin && event.resource.status) {
            const statusColors = {
                'approved': '#10b981',
                'pending': '#f59e0b',
                'rejected': '#ef4444'
            };
            backgroundColor = statusColors[event.resource.status.toLowerCase()] || backgroundColor;
        } else {
            const deptColors = {
                'CSE': '#3b82f6',
                'Mechanical': '#8b5cf6',
                'ECE': '#ec4899',
                'IT': '#06b6d4',
            };
            backgroundColor = deptColors[event.resource.department_name] || backgroundColor;
        }

        return {
            style: {
                backgroundColor,
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block',
            },
        };
    };

    return (
        <div className="h-full">
            <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                date={date}
                view={view}
                onNavigate={(newDate) => setDate(newDate)}
                onView={(newView) => setView(newView)}
                onSelectEvent={onSelectEvent || ((event) => navigate(`/events/${event.id}`))}
                onSelectSlot={onSelectSlot}
                selectable={!!onSelectSlot}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                components={{
                    toolbar: CustomToolbar
                }}
                className="font-['Inter']"
            />
        </div>
    );
};

export default CalendarView;
