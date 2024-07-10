import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice (value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}