"use client";

import { useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  Coffee,
  Dog,
  Mail,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { createAdminBookingAction } from "@/app/admin/booking-actions";
import type { AdminRoomOption } from "@/lib/admin-booking-views";
import type { AdminLocale } from "@/lib/admin-i18n";

type MealPlan = "ROOM_ONLY" | "BREAKFAST" | "HALF_BOARD";
type BookingSource = "ADMIN" | "PHONE" | "EMAIL" | "WALK_IN";
type InitialStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN";

const DOG_FEE = 15;

interface AdminBookingCreateFormProps {
  rooms: AdminRoomOption[];
  returnTo: string;
  locale: AdminLocale;
  initialCheckIn?: string;
  labels: AdminBookingFormLabels;
}

export interface AdminBookingFormLabels {
  sectionStay: string;
  sectionGuest: string;
  sectionInternal: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  mealPlan: string;
  mealPlans: Record<MealPlan, string>;
  dogs: string;
  bicycle: string;
  restaurant: string;
  restaurantPlaceholder: string;
  source: string;
  sources: Record<BookingSource, string>;
  status: string;
  statuses: Record<InitialStatus, string>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  guestLocale: string;
  notes: string;
  adminNotes: string;
  adminNotesHint: string;
  summary: string;
  nights: string;
  accommodation: string;
  meals: string;
  extraBeds: string;
  dogFee: string;
  total: string;
  submit: string;
  submitting: string;
  noRooms: string;
  capacityWarning: string;
  perNight: string;
}

const intlByLocale: Record<AdminLocale, string> = {
  de: "de-DE",
  ru: "ru-RU",
};

const fieldClass =
  "min-w-0 rounded-xl border border-[#dfd2c0] bg-[#fffdf9] px-3.5 py-3 transition-colors duration-200 focus-within:border-[#c6aa7b] focus-within:bg-white";
const inputClass =
  "mt-2 w-full min-w-0 bg-transparent text-sm text-[#201b17] outline-none";
const labelClass =
  "flex items-center gap-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]";

function todayIso(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T12:00:00Z`).getTime();
  const end = new Date(`${checkOut}T12:00:00Z`).getTime();
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function occupancyPrice(room: AdminRoomOption, guests: number) {
  const map: Record<number, number | null> = {
    1: room.priceOneGuest,
    2: room.priceTwoGuests,
    3: room.priceThreeGuests,
    4: room.priceFourGuests,
  };
  return map[guests] ?? room.basePrice;
}

export default function AdminBookingCreateForm({
  rooms,
  returnTo,
  locale,
  initialCheckIn,
  labels,
}: AdminBookingCreateFormProps) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState(initialCheckIn || todayIso(0));
  const [checkOut, setCheckOut] = useState(
    initialCheckIn
      ? todayIso(0) > initialCheckIn
        ? todayIso(1)
        : new Date(new Date(`${initialCheckIn}T12:00:00Z`).getTime() + 86400000)
            .toISOString()
            .slice(0, 10)
      : todayIso(1)
  );
  const [guests, setGuests] = useState(2);
  const [mealPlan, setMealPlan] = useState<MealPlan>("BREAKFAST");
  const [dogCount, setDogCount] = useState(0);

  const selectedRoom = rooms.find((room) => room.id === roomId) ?? rooms[0];

  const nights = nightsBetween(checkIn, checkOut);

  const guestOptions = useMemo(() => {
    if (!selectedRoom) {
      return [1, 2];
    }
    return Array.from({ length: selectedRoom.maxGuests }, (_, index) => index + 1);
  }, [selectedRoom]);

  const overCapacity = selectedRoom ? guests > selectedRoom.maxGuests : false;

  const breakdown = useMemo(() => {
    if (!selectedRoom || nights <= 0 || overCapacity) {
      return null;
    }

    const base = occupancyPrice(selectedRoom, guests);
    const mealPerGuest =
      mealPlan === "BREAKFAST"
        ? selectedRoom.breakfastPricePerGuest
        : mealPlan === "HALF_BOARD"
          ? selectedRoom.halfBoardPricePerGuest
          : 0;
    const mealPerNight = mealPerGuest * guests;
    const standardCapacity = selectedRoom.type === "SINGLE" ? 1 : 2;
    const extraBeds = Math.max(guests - standardCapacity, 0);
    const extraBedPerNight = extraBeds * selectedRoom.extraBedPrice;
    const dogPerNight = dogCount * DOG_FEE;

    const accommodation = base * nights;
    const meals = mealPerNight * nights;
    const extraBedTotal = extraBedPerNight * nights;
    const dogTotal = dogPerNight * nights;
    const total = accommodation + meals + extraBedTotal + dogTotal;

    return { accommodation, meals, extraBedTotal, dogTotal, extraBeds, total };
  }, [selectedRoom, nights, guests, mealPlan, dogCount, overCapacity]);

  const currency = (value: number) =>
    new Intl.NumberFormat(intlByLocale[locale], {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const roomTitle = (room: AdminRoomOption) =>
    locale === "ru" ? room.titleRu : room.titleDe;

  if (!rooms.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-6 text-sm font-light text-[#6c6459]">
        {labels.noRooms}
      </div>
    );
  }

  return (
    <form action={createAdminBookingAction} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#e3d6c4] bg-[#faf6ef] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              <BedDouble className="h-3.5 w-3.5 stroke-[2]" />
              {labels.sectionStay}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={[fieldClass, "sm:col-span-2"].join(" ")}>
                <span className={labelClass}>
                  <BedDouble className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.room}
                </span>
                <select
                  name="roomId"
                  value={roomId}
                  onChange={(event) => {
                    setRoomId(event.target.value);
                    const next = rooms.find((room) => room.id === event.target.value);
                    if (next && guests > next.maxGuests) {
                      setGuests(next.maxGuests);
                    }
                  }}
                  className={inputClass}
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {roomTitle(room)}
                      {room.roomNumber ? ` · ${room.roomNumber}` : ""} ·{" "}
                      {labels.guests}: {room.maxGuests}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>
                  <CalendarDays className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.checkIn}
                </span>
                <input
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  min={todayIso(-365)}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCheckIn(value);
                    if (value >= checkOut) {
                      const next = new Date(`${value}T12:00:00Z`);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().slice(0, 10));
                    }
                  }}
                  className={inputClass}
                />
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>
                  <CalendarDays className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.checkOut}
                </span>
                <input
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  min={checkIn}
                  onChange={(event) => setCheckOut(event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>
                  <Users className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.guests}
                </span>
                <select
                  name="guests"
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className={inputClass}
                >
                  {guestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>
                  <Coffee className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.mealPlan}
                </span>
                <select
                  name="mealPlan"
                  value={mealPlan}
                  onChange={(event) => setMealPlan(event.target.value as MealPlan)}
                  className={inputClass}
                >
                  <option value="ROOM_ONLY">{labels.mealPlans.ROOM_ONLY}</option>
                  <option value="BREAKFAST">{labels.mealPlans.BREAKFAST}</option>
                  <option value="HALF_BOARD">{labels.mealPlans.HALF_BOARD}</option>
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>
                  <Dog className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.dogs}
                </span>
                <select
                  name="dogCount"
                  value={dogCount}
                  onChange={(event) => setDogCount(Number(event.target.value))}
                  className={inputClass}
                >
                  {[0, 1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>{labels.restaurant}</span>
                <input
                  type="text"
                  name="restaurantReservationTime"
                  placeholder={labels.restaurantPlaceholder}
                  className={inputClass}
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#dfd2c0] bg-[#fffdf9] px-3.5 py-3">
                <input
                  type="checkbox"
                  name="bicycleReserved"
                  className="h-4 w-4 accent-[#bf9556]"
                />
                <span className="text-sm text-[#3a342c]">{labels.bicycle}</span>
              </label>
            </div>

            {overCapacity ? (
              <p className="mt-3 rounded-lg border border-[#efc9bd] bg-[#fff3ef] px-3 py-2 text-[0.7rem] font-medium text-[#9f4638]">
                {labels.capacityWarning}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#e3d6c4] bg-[#faf6ef] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              <UserRound className="h-3.5 w-3.5 stroke-[2]" />
              {labels.sectionGuest}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={fieldClass}>
                <span className={labelClass}>{labels.firstName}</span>
                <input type="text" name="firstName" required className={inputClass} />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>{labels.lastName}</span>
                <input type="text" name="lastName" required className={inputClass} />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>
                  <Mail className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.email}
                </span>
                <input type="email" name="email" required className={inputClass} />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>
                  <Phone className="h-3.5 w-3.5 stroke-[1.9]" />
                  {labels.phone}
                </span>
                <input type="tel" name="phone" className={inputClass} />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>{labels.guestLocale}</span>
                <select name="locale" defaultValue={locale} className={inputClass}>
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                  <option value="ru">RU</option>
                </select>
              </label>
              <label className={[fieldClass, "sm:col-span-2"].join(" ")}>
                <span className={labelClass}>{labels.notes}</span>
                <textarea name="notes" rows={2} className={inputClass} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e3d6c4] bg-[#faf6ef] p-4 sm:p-5">
            <div className="mb-4 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {labels.sectionInternal}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={fieldClass}>
                <span className={labelClass}>{labels.source}</span>
                <select name="source" defaultValue="ADMIN" className={inputClass}>
                  <option value="ADMIN">{labels.sources.ADMIN}</option>
                  <option value="PHONE">{labels.sources.PHONE}</option>
                  <option value="EMAIL">{labels.sources.EMAIL}</option>
                  <option value="WALK_IN">{labels.sources.WALK_IN}</option>
                </select>
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>{labels.status}</span>
                <select name="status" defaultValue="CONFIRMED" className={inputClass}>
                  <option value="PENDING">{labels.statuses.PENDING}</option>
                  <option value="CONFIRMED">{labels.statuses.CONFIRMED}</option>
                  <option value="CHECKED_IN">{labels.statuses.CHECKED_IN}</option>
                </select>
              </label>
              <label className={[fieldClass, "sm:col-span-2"].join(" ")}>
                <span className={labelClass}>{labels.adminNotes}</span>
                <textarea
                  name="adminNotes"
                  rows={2}
                  placeholder={labels.adminNotesHint}
                  className={inputClass}
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {labels.summary}
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-[#5d564c]">
                <span>{labels.nights}</span>
                <span className="font-semibold text-[#1f1b17]">{nights}</span>
              </div>

              {breakdown ? (
                <>
                  <div className="flex items-center justify-between text-[#5d564c]">
                    <span>{labels.accommodation}</span>
                    <span className="tabular-nums text-[#1f1b17]">
                      {currency(breakdown.accommodation)}
                    </span>
                  </div>
                  {breakdown.meals > 0 && (
                    <div className="flex items-center justify-between text-[#5d564c]">
                      <span>{labels.meals}</span>
                      <span className="tabular-nums text-[#1f1b17]">
                        {currency(breakdown.meals)}
                      </span>
                    </div>
                  )}
                  {breakdown.extraBedTotal > 0 && (
                    <div className="flex items-center justify-between text-[#5d564c]">
                      <span>
                        {labels.extraBeds} ×{breakdown.extraBeds}
                      </span>
                      <span className="tabular-nums text-[#1f1b17]">
                        {currency(breakdown.extraBedTotal)}
                      </span>
                    </div>
                  )}
                  {breakdown.dogTotal > 0 && (
                    <div className="flex items-center justify-between text-[#5d564c]">
                      <span>{labels.dogFee}</span>
                      <span className="tabular-nums text-[#1f1b17]">
                        {currency(breakdown.dogTotal)}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between border-t border-[#ece3d6] pt-3">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
                      {labels.total}
                    </span>
                    <span className="font-[var(--font-display)] text-2xl text-[#1f1b17]">
                      {currency(breakdown.total)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-[0.78rem] font-light text-[#9a8f7c]">
                  {overCapacity ? labels.capacityWarning : "—"}
                </p>
              )}
            </div>

            <AdminSubmitButton
              type="submit"
              disabled={!breakdown}
              pendingLabel={labels.submitting}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448]"
            >
              {labels.submit}
            </AdminSubmitButton>
          </div>
        </aside>
      </div>
    </form>
  );
}
