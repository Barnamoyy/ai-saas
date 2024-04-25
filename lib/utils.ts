import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// we need to give stripe an absolute url not /dashboard or any other. 
export function absolutePath(path: string){
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};
