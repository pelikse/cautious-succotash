import { useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Holiday {
  date: string;
  name: string;
}

export default function MacCalendar({
  date,
  onPrevMonth,
  onNextMonth,
  onClose,
  holidays,
}: {
  date: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClose: () => void;
  holidays: Holiday[];
}) {
  const calendarRef = useRef<HTMLDivElement>(null);

  // 👇 Close calendar if click is outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d: Date) => {
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const renderDays = () => {
    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6 && day <= daysInMonth; i++) {
      const days = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > daysInMonth) {
          days.push(<td key={j}></td>);
        } else {
          const current = new Date(year, month, day);
          const today = isToday(current);

          days.push(
            <td
              key={j}
              className={`text-center p-1 rounded-md transition cursor-pointer ${
                today ? 'bg-white text-black font-bold' : 'text-white/90'
              }`}
            >
              {day}
            </td>
          );
          day++;
        }
      }
      weeks.push(<tr key={i}>{days}</tr>);
    }

    return weeks;
  };

  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <div
      ref={calendarRef}
      className="absolute right-4 top-7 bg-neutral-800 text-white p-3 rounded-md shadow-lg z-50 w-64"
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition"
        >
          <FaChevronLeft size={12} />
        </button>
        <span className="font-medium text-sm text-white">
          {year}/{month + 1} ({monthName})
        </span>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/60">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderDays()}</tbody>
      </table>
    </div>
  );
}
