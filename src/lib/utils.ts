import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice (value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

export function formatDate(date: Date) {
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function calculateDuration(startTime:string, endTime:string) {
  // Parse the start and end time
  const startParts = startTime.split(':');
  const endParts = endTime.split(':');

  const startHours = parseInt(startParts[0], 10);
  const startMinutes = parseInt(startParts[1], 10);
  const endHours = parseInt(endParts[0], 10);
  const endMinutes = parseInt(endParts[1], 10);

  // Convert both times to minutes since midnight
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Calculate the difference in minutes
  let differenceInMinutes: number;
  if (endTotalMinutes >= startTotalMinutes) {
      differenceInMinutes = endTotalMinutes - startTotalMinutes;
  } else {
      // If the end time is earlier in the day than the start time, it means the end time is on the next day
      differenceInMinutes = (endTotalMinutes + 24 * 60) - startTotalMinutes;
  }

  // Convert the difference back to hours and minutes
  const diffHours = Math.floor(differenceInMinutes / 60);
  const diffMinutes = differenceInMinutes % 60;

  // Format the result as HH:MM
  const formattedDiffHours = diffHours.toString().padStart(2, '0');
  const formattedDiffMinutes = diffMinutes.toString().padStart(2, '0');

  return `${formattedDiffHours}h ${formattedDiffMinutes}p`;
}

interface City {
  CityID: string;
  CityName: string;
}

// Define types for arrays
type CitiesArray = City[];

// Function to find city name by ID
export function findCityNameByID(cityID: string, cities: CitiesArray): string {
  const city = cities.find(city => city.CityID === cityID);
  return city ? city.CityName : "City not found";
}

export function formatDateString(dateString: string) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function formatSeatCode(seatCode: string) {
  const words = seatCode.split('');
  if(words[1] === '0') {
    return `${words[0]}${words[2]}`
  }
  return seatCode;
}

export function isWithin12Hours(dateString: string, timeString: string): boolean {
  // Combine the date and time strings into a single date-time string
  const dateTimeString = `${dateString}T${timeString}:00`;
  
  // Convert the date-time string into a Date object
  const givenDateTime = new Date(dateTimeString);
  
  // Get the current date-time
  const now = new Date();
  
  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(givenDateTime.getTime() - now.getTime());
  
  // Convert the difference from milliseconds to hours
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  // Check if the difference is less than 12 hours
  return diffInHours < 12;
}

