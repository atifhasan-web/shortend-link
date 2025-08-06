import { cn } from '@/lib/utils';
import React from 'react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide lucide-flask-conical', className)}
    >
      <path d="M10.2 2.2c.2-.4.6-.6 1-.6s.8.2 1 .6l6.8 11.6c.2.4.2.8 0 1.2s-.6.6-1 .6H4.2c-.4 0-.8-.2-1-.6s-.2-.8 0-1.2L10.2 2.2Z" />
      <path d="M8.5 14h7" />
      <path d="M7 17h10" />
      <path d="M8.5 20h7" />
      <path d="M12 14v6" />
    </svg>
  );
};

export default Logo;
