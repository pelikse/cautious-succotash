import { useEffect, useState } from 'react';
import { MdWifi } from 'react-icons/md';
import { IoSearchSharp, IoBatteryHalfOutline, IoCellular } from 'react-icons/io5';
import { VscVscode } from 'react-icons/vsc';
import MacCalendar from './MacCalendar'; // import the component

export default function MacToolbar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const holidays = [
    { date: '2025-08-17', name: 'Independence Day' },
    { date: '2025-12-25', name: 'Christmas' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
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
      <div className='sticky top-0 z-50 md:hidden bg-transparent text-white h-12 px-8 flex items-center justify-between text-base font-medium'>
        <span className='font-semibold'>
          {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className='flex items-center gap-1.5'>
          <IoCellular size={20} />
          <MdWifi size={20} />
          <IoBatteryHalfOutline size={24} />
        </div>
      </div>

      <div className='sticky top-0 z-50 hidden md:flex bg-black/20 backdrop-blur-md text-white h-6 px-4 items-center justify-between text-sm relative'>
        <div className='flex items-center space-x-4'>
          {/* Apple menu, File, etc. */}
        </div>
        <div className='flex items-center space-x-4'>
          <VscVscode
            size={16}
            className='cursor-pointer hover:opacity-80 transition-opacity'
            onClick={() => (window.location.href = 'vscode:/')}
            title='Open in VSCode'
          />
          <MdWifi size={16} />
          <IoSearchSharp size={16} />
          <span className='cursor-pointer hover:opacity-80' onClick={toggleCalendar}>
            {formatMacDate(currentDateTime)}
          </span>
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
            holidays={holidays}
          />
        )}
      </div>
    </>
  );
}
