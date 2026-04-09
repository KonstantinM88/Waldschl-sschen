"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Bike,
  CalendarDays,
  CheckCircle2,
  Dog,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import type { AvailableRoom, BookingLocale } from "@/lib/booking-engine";
import { DOG_FEE_PER_NIGHT } from "@/lib/booking-engine";
import {
  submitHotelBookingAction,
  type SubmitHotelBookingState,
} from "@/lib/booking-actions";

interface BookingCheckoutFormProps {
  backToSearchHref: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  locale: BookingLocale;
  restaurantOptions: {
    label: string;
    options: string[];
  };
  room: AvailableRoom;
}

const copy = {
  de: {
    badge: "Gastedaten",
    title: "Buchung abschließen",
    description:
      "Ergänzen Sie Ihre Kontaktdaten und optionalen Wünsche. Wir legen die Reservierung direkt als Anfrage in unserem System an.",
    extrasTitle: "Zusatzleistungen",
    guestTitle: "Ihre Kontaktdaten",
    secureNote:
      "Nach dem Absenden erscheint die Reservierung in der Verwaltung als neue Buchung.",
    dogLabel: `Hund willkommen (+ ${DOG_FEE_PER_NIGHT.toFixed(0)} € / Nacht)`,
    bikeLabel: "Kostenlosen Fahrradverleih reservieren",
    restaurantLabel: "Tisch im Restaurant am Anreiseabend reservieren",
    restaurantPlaceholder: "Bitte Zeit wählen",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    phone: "Telefon",
    notes: "Anmerkungen",
    notesPlaceholder: "Besondere Wünsche, späte Anreise oder Hinweise für unser Team",
    summaryTitle: "Preisübersicht",
    summaryRoom: "Zimmer",
    summaryDog: "Hund",
    summaryBike: "Fahrrad",
    summaryRestaurant: "Restaurant",
    summaryBreakfast: "Frühstück",
    breakfastIncluded: "inklusive",
    total: "Gesamtsumme",
    submit: "Buchung anfragen",
    submitting: "Wird gespeichert...",
    changeSelection: "Zimmerauswahl ändern",
    successBadge: "Reservierung erfasst",
    successTitle: "Vielen Dank für Ihre Anfrage",
    successText:
      "Ihre Reservierung wurde gespeichert und erscheint bereits in der Verwaltung. Unser Team meldet sich zur Bestätigung bei Ihnen.",
    bookingNumber: "Buchungsnummer",
    selectedTime: "Reservierte Zeit",
  },
  en: {
    badge: "Guest details",
    title: "Complete your booking",
    description:
      "Add your contact details and optional extras. We will place the reservation directly in our system as a booking request.",
    extrasTitle: "Optional extras",
    guestTitle: "Your contact details",
    secureNote:
      "After submitting, the reservation appears in the admin area as a new booking.",
    dogLabel: `Dog welcome (+ €${DOG_FEE_PER_NIGHT.toFixed(0)} / night)`,
    bikeLabel: "Reserve a complimentary bicycle",
    restaurantLabel: "Reserve a restaurant table for your arrival evening",
    restaurantPlaceholder: "Please select a time",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    notes: "Notes",
    notesPlaceholder:
      "Special requests, late arrival or any details for our team",
    summaryTitle: "Price summary",
    summaryRoom: "Room",
    summaryDog: "Dog",
    summaryBike: "Bicycle",
    summaryRestaurant: "Restaurant",
    summaryBreakfast: "Breakfast",
    breakfastIncluded: "included",
    total: "Total",
    submit: "Request booking",
    submitting: "Saving...",
    changeSelection: "Change room selection",
    successBadge: "Reservation captured",
    successTitle: "Thank you for your request",
    successText:
      "Your reservation has been saved and is already visible in the admin area. Our team will contact you to confirm it.",
    bookingNumber: "Booking number",
    selectedTime: "Reserved time",
  },
  ru: {
    badge: "Данные гостя",
    title: "Завершение бронирования",
    description:
      "Добавьте контактные данные и нужные услуги. Заявка сразу будет записана в систему как новое бронирование.",
    extrasTitle: "Дополнительные услуги",
    guestTitle: "Ваши контактные данные",
    secureNote:
      "После отправки бронь сразу появится в административной панели как новая заявка.",
    dogLabel: `Собака (+ ${DOG_FEE_PER_NIGHT.toFixed(0)} € / ночь)`,
    bikeLabel: "Забронировать бесплатный велосипед",
    restaurantLabel: "Забронировать столик в ресторане на вечер заезда",
    restaurantPlaceholder: "Выберите время",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "E-mail",
    phone: "Телефон",
    notes: "Комментарий",
    notesPlaceholder:
      "Особые пожелания, поздний заезд или важные детали для нашей команды",
    summaryTitle: "Расчёт стоимости",
    summaryRoom: "Номер",
    summaryDog: "Собака",
    summaryBike: "Велосипед",
    summaryRestaurant: "Ресторан",
    summaryBreakfast: "Завтрак",
    breakfastIncluded: "включён",
    total: "Итого",
    submit: "Отправить бронь",
    submitting: "Сохраняем...",
    changeSelection: "Изменить выбор номера",
    successBadge: "Бронь записана",
    successTitle: "Спасибо за вашу заявку",
    successText:
      "Бронирование сохранено и уже видно в админке. Наша команда свяжется с вами для подтверждения.",
    bookingNumber: "Номер брони",
    selectedTime: "Выбранное время",
  },
} as const;

function formatCurrency(value: number, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function SubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[3.8rem] items-center justify-center rounded-[1.3rem] border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_22px_40px_rgba(128,92,39,0.3)] disabled:cursor-wait disabled:opacity-75"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export default function BookingCheckoutForm({
  backToSearchHref,
  checkIn,
  checkOut,
  guests,
  locale,
  restaurantOptions,
  room,
}: BookingCheckoutFormProps) {
  const t = copy[locale];
  const initialSubmitHotelBookingState: SubmitHotelBookingState = {
    status: "idle",
  };
  const [state, formAction] = useActionState(
    submitHotelBookingAction,
    initialSubmitHotelBookingState
  );
  const [dogSelected, setDogSelected] = useState(false);
  const [bikeSelected, setBikeSelected] = useState(false);
  const [restaurantTime, setRestaurantTime] = useState("");

  const dogFeeTotal = useMemo(
    () => (dogSelected ? DOG_FEE_PER_NIGHT * room.nights : 0),
    [dogSelected, room.nights]
  );
  const totalAmount = room.totalBasePrice + dogFeeTotal;

  if (state.status === "success") {
    return (
      <div className="rounded-[1.85rem] border border-[rgba(184,136,76,0.24)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(249,243,235,0.95))] p-6 shadow-[0_24px_60px_rgba(32,24,16,0.08)] sm:p-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/86 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
          <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.9]" />
          {t.successBadge}
        </div>
        <h2 className="mt-5 font-[var(--font-display)] text-[2.3rem] leading-[0.96] text-[#201b17]">
          {t.successTitle}
        </h2>
        <p className="mt-4 max-w-[40rem] text-sm font-light leading-relaxed text-[#5d564c] sm:text-[0.98rem]">
          {t.successText}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white/88 px-4 py-4">
            <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              {t.bookingNumber}
            </div>
            <div className="mt-2 text-sm font-medium text-[#201b17]">
              {state.bookingId}
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white/88 px-4 py-4">
            <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              {t.summaryRoom}
            </div>
            <div className="mt-2 text-sm font-medium text-[#201b17]">
              {state.roomType ?? room.title}
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-[#eadfcf] bg-white/88 px-4 py-4">
            <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              {t.total}
            </div>
            <div className="mt-2 text-sm font-medium text-[#201b17]">
              {formatCurrency(state.totalAmount ?? totalAmount, locale)}
            </div>
          </div>
        </div>

        <Link
          href={backToSearchHref}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#e0d5c3] bg-white px-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#5d564c] transition-all duration-300 hover:border-[#cbb18a] hover:text-[#201b17]"
        >
          {t.changeSelection}
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-[1.85rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_24px_60px_rgba(32,24,16,0.06)] sm:p-6"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-[#faf7f1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
        <ShieldCheck className="h-3.5 w-3.5 stroke-[1.9]" />
        {t.badge}
      </div>
      <h2 className="mt-4 font-[var(--font-display)] text-[2.2rem] leading-[0.96] text-[#201b17]">
        {t.title}
      </h2>
      <p className="mt-3 max-w-[42rem] text-sm font-light leading-relaxed text-[#5d564c] sm:text-[0.98rem]">
        {t.description}
      </p>

      {state.status === "error" && state.errorMessage ? (
        <div className="mt-5 rounded-[1.25rem] border border-[#f0cfc7] bg-[#fff3ef] px-4 py-4 text-sm font-light text-[#8f4337]">
          {state.errorMessage}
        </div>
      ) : null}

      <input type="hidden" name="roomId" value={room.id} />
      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
      <input type="hidden" name="guests" value={guests} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="dogCount" value={dogSelected ? 1 : 0} />

      <section className="mt-6">
        <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.extrasTitle}
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
            <input
              type="checkbox"
              checked={dogSelected}
              onChange={(event) => setDogSelected(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#ccb28b] text-[#b4884c] focus:ring-[#d8bd84]"
            />
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#201b17]">
                <Dog className="h-4 w-4 stroke-[1.8] text-[#b4884c]" />
                {t.dogLabel}
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
            <input
              type="checkbox"
              name="bicycleReserved"
              checked={bikeSelected}
              onChange={(event) => setBikeSelected(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#ccb28b] text-[#b4884c] focus:ring-[#d8bd84]"
            />
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[#201b17]">
              <Bike className="h-4 w-4 stroke-[1.8] text-[#b4884c]" />
              {t.bikeLabel}
            </div>
          </label>

          <div className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
            <label className="block">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#201b17]">
                <UtensilsCrossed className="h-4 w-4 stroke-[1.8] text-[#b4884c]" />
                {t.restaurantLabel}
              </span>
              <select
                name="restaurantReservationTime"
                value={restaurantTime}
                onChange={(event) => setRestaurantTime(event.target.value)}
                className="mt-3 w-full rounded-[1rem] border border-[#e1d5c5] bg-white px-4 py-3 text-sm text-[#201b17] outline-none"
              >
                <option value="">{t.restaurantPlaceholder}</option>
                {restaurantOptions.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.guestTitle}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <UserRound className="h-4 w-4 stroke-[1.8]" />
              {t.firstName}
            </span>
            <input
              name="firstName"
              required
              autoComplete="given-name"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <UserRound className="h-4 w-4 stroke-[1.8]" />
              {t.lastName}
            </span>
            <input
              name="lastName"
              required
              autoComplete="family-name"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <Mail className="h-4 w-4 stroke-[1.8]" />
              {t.email}
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <Phone className="h-4 w-4 stroke-[1.8]" />
              {t.phone}
            </span>
            <input
              name="phone"
              autoComplete="tel"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>
        </div>

        <label className="mt-3 block rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
          <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
            <MessageSquare className="h-4 w-4 stroke-[1.8]" />
            {t.notes}
          </span>
          <textarea
            name="notes"
            rows={4}
            placeholder={t.notesPlaceholder}
            className="mt-3 w-full resize-none bg-transparent text-sm leading-relaxed text-[#201b17] outline-none"
          />
        </label>
      </section>

      <section className="mt-6 rounded-[1.35rem] border border-[#eadfcf] bg-[linear-gradient(145deg,rgba(250,247,241,0.98),rgba(255,255,255,0.96))] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          <CalendarDays className="h-4 w-4 stroke-[1.8]" />
          {t.summaryTitle}
        </div>

        <div className="mt-4 space-y-3 text-sm font-light text-[#4f483f]">
          <div className="flex items-center justify-between gap-4">
            <span>
              {t.summaryRoom} · {room.nights} x {formatCurrency(room.basePrice, locale)}
            </span>
            <span className="font-medium text-[#201b17]">
              {formatCurrency(room.totalBasePrice, locale)}
            </span>
          </div>

          {dogSelected ? (
            <div className="flex items-center justify-between gap-4">
              <span>{t.summaryDog}</span>
              <span className="font-medium text-[#201b17]">
                {formatCurrency(dogFeeTotal, locale)}
              </span>
            </div>
          ) : null}

          {bikeSelected ? (
            <div className="flex items-center justify-between gap-4">
              <span>{t.summaryBike}</span>
              <span className="font-medium text-[#201b17]">{formatCurrency(0, locale)}</span>
            </div>
          ) : null}

          {restaurantTime ? (
            <div className="flex items-center justify-between gap-4">
              <span>{t.summaryRestaurant}</span>
              <span className="font-medium text-[#201b17]">
                {restaurantTime}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <span>{t.summaryBreakfast}</span>
            <span className="font-medium text-[#201b17]">{t.breakfastIncluded}</span>
          </div>

          <div className="h-px bg-[#eadfcf]" />

          <div className="flex items-center justify-between gap-4 font-medium text-[#201b17]">
            <span>{t.total}</span>
            <span className="font-[var(--font-display)] text-[2rem] leading-none">
              {formatCurrency(totalAmount, locale)}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backToSearchHref}
          className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-[#e0d5c3] bg-[#faf7f1] px-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#5d564c] transition-all duration-300 hover:border-[#cbb18a] hover:text-[#201b17]"
        >
          {t.changeSelection}
        </Link>
        <SubmitButton idleLabel={t.submit} pendingLabel={t.submitting} />
      </div>

      <p className="mt-4 text-xs font-light leading-relaxed text-[#7b7368]">
        {t.secureNote}
      </p>
    </form>
  );
}
