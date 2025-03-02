import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTo12Hour(dateString: string) {
  const date = new Date(dateString);

  if (isNaN(date)) {
    return "Invalid Date"; 
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; 

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}