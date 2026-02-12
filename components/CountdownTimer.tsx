
import React, { useState, useEffect } from 'react';
import { CountdownTime } from '../types';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-01-05T08:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 min-w-[60px] sm:min-w-[90px]">
      <span className="text-xl sm:text-5xl font-black text-white leading-none">{value.toLocaleString('bn-BD', { minimumIntegerDigits: 2 })}</span>
      <span className="text-[8px] sm:text-sm tracking-wide text-green-200 mt-1 font-bold">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 py-4 sm:py-8">
      <TimeUnit label="দিন" value={timeLeft.days} />
      <TimeUnit label="ঘণ্টা" value={timeLeft.hours} />
      <TimeUnit label="মিনিট" value={timeLeft.minutes} />
      <TimeUnit label="সেকেন্ড" value={timeLeft.seconds} />
    </div>
  );
};

export default CountdownTimer;
