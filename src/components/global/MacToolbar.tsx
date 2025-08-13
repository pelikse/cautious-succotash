import { useEffect, useState } from 'react';
import { MdWifi } from 'react-icons/md';
import { IoSearchSharp } from 'react-icons/io5';
import { VscVscode } from 'react-icons/vsc';
import MacCalendar from './MacCalendar';

export default function MacToolbar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showTip, setShowTip] = useState(true); // beginner tip

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Hide tip after 5 seconds
    const tipTimer = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(tipTimer);
  }, []);

  const formatMacDate = (date: Date) => {
    const weekday = date.toLocaleString('en-US', { weekday: 'short' });
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hour = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
    const minute = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${weekday} ${month} ${day} ${hour.replace(/\s?[AP]M/, '')}:${minute} ${period}`;
  };

  const toggleCalendar = () => setShowCalendar((prev) => !prev);

  return (
    <>
      {/* Mobile toolbar */}
      <div className='sticky top-0 z-50 md:hidden bg-transparent text-white h-12 px-8 flex items-center justify-between text-base font-medium'>
        <span className='font-semibold'>
          {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Desktop toolbar */}
      <div className='sticky top-0 z-50 hidden md:flex bg-black/20 backdrop-blur-md text-white h-6 px-4 items-center justify-between text-sm relative'>
        <div className='flex items-center space-x-4'>
          {/* Apple menu, File, etc. */}
        </div>
        <div className='flex items-center space-x-4 relative'>
          <VscVscode
            size={16}
            className='cursor-pointer hover:opacity-80 transition-opacity'
            onClick={() => (window.location.href = 'vscode:/')}
            title='Open in VSCode'
          />
          <MdWifi size={16} />
          <IoSearchSharp size={16} />
          <span
            className='cursor-pointer hover:opacity-80 relative'
            onClick={toggleCalendar}
            title='Click to open calendar'
          >
            {formatMacDate(currentDateTime)}
          </span>

          {/* Beginner-friendly tip */}
          {showTip && (
            <div className='absolute -bottom-8 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in'>
              💡 Click the date to open the calendar
            </div>
          )}
        </div>

        {showCalendar && (
          <MacCalendar
            date={calendarDate}
            onPrevMonth={() =>
              setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
            }
            onNextMonth={() =>
              setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
            }
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>
    </>
  );
}
