import type { RoomType } from "@prisma/client";

export type BookingLocale = "de" | "en" | "ru";

export interface AvailableRoom {
  amenities: string[];
  availableCount: number;
  basePrice: number;
  bookedCount: number;
  breakfastIncluded: boolean;
  description: string;
  guests: number;
  id: string;
  imageUrl: string | null;
  inventory: number;
  locale: BookingLocale;
  maxGuests: number;
  nights: number;
  shortDescription: string | null;
  slug: string;
  title: string;
  totalBasePrice: number;
  type: RoomType;
}

export const DOG_FEE_PER_NIGHT = 15;
export const FREE_BICYCLE_PRICE = 0;
