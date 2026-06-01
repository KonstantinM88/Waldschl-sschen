import type { BookingMealPlan, RoomType } from "@prisma/client";

export type BookingLocale = "de" | "en" | "ru";

export interface GuestAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface AvailableRoom {
  amenities: string[];
  availableCount: number;
  basePrice: number;
  bookedCount: number;
  breakfastIncluded: boolean;
  description: string;
  gallery: string[];
  guests: number;
  id: string;
  imageUrl: string | null;
  inventory: number;
  locale: BookingLocale;
  maxGuests: number;
  defaultMealPlan: BookingMealPlan;
  extraBedMax: number;
  extraBedPrice: number;
  extraBedTotalPerNight: number;
  extraBeds: number;
  mealOptions: AvailableMealPlanOption[];
  nights: number;
  occupancyBasePrice: number;
  shortDescription: string | null;
  slug: string;
  title: string;
  totalBasePrice: number;
  type: RoomType;
}

export interface AvailableMealPlanOption {
  description: string;
  label: string;
  pricePerGuest: number;
  pricePerNight: number;
  totalPrice: number;
  value: BookingMealPlan;
}

export const DOG_FEE_PER_NIGHT = 15;
export const FREE_BICYCLE_PRICE = 0;
export const HOTEL_CHECK_IN_TIME = "15:00";
export const HOTEL_CHECK_OUT_TIME = "12:00";
export const HOTEL_BOOKING_MIN_LEAD_HOURS = 2;
export const HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME = "13:00";
