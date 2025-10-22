import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../button";
import { cn } from "../../lib/utils";

const CalendarComponent = ({ onDateSelect, initialDate = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    onDateSelect && onDateSelect(selectedDate);
  }, [selectedDate, onDateSelect]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const startDay = firstDayOfMonth.getDay(); // 0: Sun ...
    const days = [];

    // leading blanks
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const handleDateClick = (date) => {
    if (date) setSelectedDate(date);
  };

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const monthName = currentMonth.toLocaleDateString("ko-KR", { month: "long" });
  const year = currentMonth.getFullYear();
  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className="w-full bg-white rounded-[10px] border-2 border-[#628af9] p-4 flex flex-col">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="w-8 h-8 p-0 hover:bg-transparent"
          aria-label="이전 달"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#232323]" />
        </Button>
        <span className="font-bold text-[#232323] text-lg [font-family:'Noto_Sans_KR',Helvetica]">
          {year}년 {monthName}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="w-8 h-8 p-0 hover:bg-transparent"
          aria-label="다음 달"
        >
          <ChevronRightIcon className="w-5 h-5 text-[#232323]" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#23232380] [font-family:'Noto_Sans_KR',Helvetica] mb-2">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-medium",
              !day && "opacity-0 cursor-default",
              day && "text-[#232323] hover:bg-[#e7edff]",
              day && isSameDay(day, today) && "bg-[#e7edff] text-[#628af9]",
              day && isSameDay(day, selectedDate) && "bg-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]",
              day && day.getDay() === 0 && "text-[#ff6b6b]",
              day && day.getDay() === 6 && "text-[#628af9]"
            )}
            aria-label={day ? `${day.getDate()}일` : undefined}
          >
            {day ? day.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;
