"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { BookingMealPlan } from "@prisma/client";
import {
  Bike,
  CalendarDays,
  CheckCircle2,
  Dog,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import {
  DOG_FEE_PER_NIGHT,
  HOTEL_CHECK_IN_TIME,
  HOTEL_CHECK_OUT_TIME,
  HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME,
  type AvailableRoom,
  type BookingLocale,
} from "@/lib/booking-shared";
import {
  submitHotelBookingAction,
  type SubmitHotelBookingState,
} from "@/lib/booking-actions";
import { BOOKING_TERMS_DE, BOOKING_TERMS_VERSION } from "@/lib/booking-terms";

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
    stayTitle: "Aufenthalt",
    arrival: "Check-in",
    departure: "Check-out",
    arrivalTime: `ab ${HOTEL_CHECK_IN_TIME} Uhr`,
    departureTime: `bis ${HOTEL_CHECK_OUT_TIME} Uhr`,
    sameDayRule: `Heute bis ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} Uhr Berliner Zeit`,
    dogLabel: `Hund willkommen (+ ${DOG_FEE_PER_NIGHT.toFixed(0)} € / Nacht)`,
    bikeLabel: "Kostenlosen Fahrradverleih reservieren",
    mealPlanTitle: "Verpflegung",
    perNight: "/ Nacht",
    restaurantLabel: "Tisch im Restaurant am Anreiseabend reservieren",
    restaurantPlaceholder: "Bitte Zeit wählen",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    phone: "Telefon",
    addressTitle: "Rechnungs- und Wohnanschrift",
    addressHint:
      "Für Rechnung und Buchungsvertrag benötigen wir Ihre Wohnanschrift. Ausländische Gäste füllen den gesetzlichen Meldeschein bei der Anreise vor Ort aus.",
    street: "Straße und Hausnummer",
    postalCode: "PLZ",
    city: "Ort",
    country: "Land",
    notes: "Anmerkungen",
    notesPlaceholder: "Besondere Wünsche, späte Anreise oder Hinweise für unser Team",
    summaryTitle: "Preisübersicht",
    summaryRoom: "Zimmer",
    summaryAccommodation: "Übernachtung",
    summaryMeals: "Verpflegung",
    summaryExtraBeds: "Zusatzbetten",
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
      "Ihre E-Mail-Adresse wurde bestätigt. Die Reservierung wurde gespeichert und erscheint bereits in der Verwaltung. Unser Team meldet sich zur Bestätigung bei Ihnen.",
    bookingNumber: "Buchungsnummer",
    selectedTime: "Reservierte Zeit",
    termsTitle: "Buchungsbedingungen",
    termsDescription:
      "Bitte lesen Sie die Buchungsbedingungen, bevor Sie den Bestätigungscode anfordern.",
    termsShow: "Buchungsbedingungen anzeigen",
    termsHideHint: "Version",
    termsAccept:
      "Ich habe die Buchungsbedingungen gelesen und akzeptiert.",
    sendCode: "Code per E-Mail senden",
    sendingCode: "Code wird gesendet...",
    codeTitle: "E-Mail bestätigen",
    codeDescription: (email: string) =>
      `Wir haben einen sechsstelligen Code an ${email} gesendet. Bitte geben Sie ihn ein, um die Buchung abzuschließen.`,
    codeLabel: "Bestätigungscode",
    codePlaceholder: "123456",
    confirmCode: "Buchung bestätigen",
    confirmingCode: "Code wird geprüft...",
    codeExpires: "Der Code ist 15 Minuten gültig.",
    fieldsLocked:
      "Die Buchungsdaten sind für diese Code-Prüfung fixiert. Wenn Sie etwas ändern möchten, starten Sie die Anfrage bitte erneut.",
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
    stayTitle: "Stay",
    arrival: "Check-in",
    departure: "Check-out",
    arrivalTime: `from ${HOTEL_CHECK_IN_TIME}`,
    departureTime: `until ${HOTEL_CHECK_OUT_TIME}`,
    sameDayRule: `Today until ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} Berlin time`,
    dogLabel: `Dog welcome (+ €${DOG_FEE_PER_NIGHT.toFixed(0)} / night)`,
    bikeLabel: "Reserve a complimentary bicycle",
    mealPlanTitle: "Meal plan",
    perNight: "/ night",
    restaurantLabel: "Reserve a restaurant table for your arrival evening",
    restaurantPlaceholder: "Please select a time",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    addressTitle: "Billing and home address",
    addressHint:
      "We need your home address for the invoice and booking contract. Foreign guests complete the statutory registration form on site at check-in.",
    street: "Street and house number",
    postalCode: "Postal code",
    city: "City",
    country: "Country",
    notes: "Notes",
    notesPlaceholder:
      "Special requests, late arrival or any details for our team",
    summaryTitle: "Price summary",
    summaryRoom: "Room",
    summaryAccommodation: "Accommodation",
    summaryMeals: "Meal plan",
    summaryExtraBeds: "Extra beds",
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
      "Your email address has been confirmed. The reservation has been saved and is already visible in the admin area. Our team will contact you to confirm it.",
    bookingNumber: "Booking number",
    selectedTime: "Reserved time",
    termsTitle: "Booking conditions",
    termsDescription:
      "Please read the booking conditions before requesting the confirmation code.",
    termsShow: "Show booking conditions",
    termsHideHint: "Version",
    termsAccept:
      "I have read and accept the booking conditions.",
    sendCode: "Send code by email",
    sendingCode: "Sending code...",
    codeTitle: "Confirm email",
    codeDescription: (email: string) =>
      `We have sent a six-digit code to ${email}. Please enter it to complete the booking.`,
    codeLabel: "Confirmation code",
    codePlaceholder: "123456",
    confirmCode: "Confirm booking",
    confirmingCode: "Checking code...",
    codeExpires: "The code is valid for 15 minutes.",
    fieldsLocked:
      "The booking details are fixed for this code check. To change anything, please start the request again.",
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
    stayTitle: "Проживание",
    arrival: "Заезд",
    departure: "Выезд",
    arrivalTime: `с ${HOTEL_CHECK_IN_TIME}`,
    departureTime: `до ${HOTEL_CHECK_OUT_TIME}`,
    sameDayRule: `Сегодня до ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} по Берлину`,
    dogLabel: `Собака (+ ${DOG_FEE_PER_NIGHT.toFixed(0)} € / ночь)`,
    bikeLabel: "Забронировать бесплатный велосипед",
    mealPlanTitle: "Питание",
    perNight: "/ ночь",
    restaurantLabel: "Забронировать столик в ресторане на вечер заезда",
    restaurantPlaceholder: "Выберите время",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "E-mail",
    phone: "Телефон",
    addressTitle: "Адрес для счёта и проживания",
    addressHint:
      "Для счёта и договора бронирования нужен ваш адрес проживания. Иностранные гости заполняют обязательный регистрационный лист на месте при заезде.",
    street: "Улица и номер дома",
    postalCode: "Индекс",
    city: "Город",
    country: "Страна",
    notes: "Комментарий",
    notesPlaceholder:
      "Особые пожелания, поздний заезд или важные детали для нашей команды",
    summaryTitle: "Расчёт стоимости",
    summaryRoom: "Номер",
    summaryAccommodation: "Проживание",
    summaryMeals: "Питание",
    summaryExtraBeds: "Доп. кровати",
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
      "Ваш e-mail подтверждён. Бронирование сохранено и уже видно в админке. Наша команда свяжется с вами для подтверждения.",
    bookingNumber: "Номер брони",
    selectedTime: "Выбранное время",
    termsTitle: "Условия бронирования",
    termsDescription:
      "Ознакомьтесь с условиями бронирования перед отправкой кода подтверждения.",
    termsShow: "Показать условия бронирования",
    termsHideHint: "Версия",
    termsAccept:
      "Я прочитал(а) и принимаю условия бронирования.",
    sendCode: "Отправить код на e-mail",
    sendingCode: "Отправляем код...",
    codeTitle: "Подтверждение e-mail",
    codeDescription: (email: string) =>
      `Мы отправили шестизначный код на ${email}. Введите его, чтобы завершить бронирование.`,
    codeLabel: "Код подтверждения",
    codePlaceholder: "123456",
    confirmCode: "Подтвердить бронь",
    confirmingCode: "Проверяем код...",
    codeExpires: "Код действует 15 минут.",
    fieldsLocked:
      "Данные бронирования зафиксированы для этой проверки кода. Если нужно что-то изменить, начните заявку заново.",
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
  const [selectedMealPlan, setSelectedMealPlan] = useState<BookingMealPlan>(
    room.defaultMealPlan
  );
  const isAwaitingCode = state.status === "code-sent";

  const selectedMealOption = useMemo(
    () =>
      room.mealOptions.find((option) => option.value === selectedMealPlan) ??
      room.mealOptions.find((option) => option.value === "BREAKFAST") ??
      room.mealOptions[0],
    [room.mealOptions, selectedMealPlan]
  );

  const dogFeeTotal = useMemo(
    () => (dogSelected ? DOG_FEE_PER_NIGHT * room.nights : 0),
    [dogSelected, room.nights]
  );
  const accommodationTotal = room.occupancyBasePrice * room.nights;
  const mealPlanTotal = selectedMealOption?.totalPrice ?? 0;
  const extraBedTotal = room.extraBedTotalPerNight * room.nights;
  const totalAmount =
    accommodationTotal + mealPlanTotal + extraBedTotal + dogFeeTotal;

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
      <input
        type="hidden"
        name="intent"
        value={isAwaitingCode ? "confirm-code" : "request-code"}
      />
      {isAwaitingCode && state.verificationId ? (
        <input type="hidden" name="verificationId" value={state.verificationId} />
      ) : null}

      <section className="mt-6 rounded-[1.35rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
        <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.stayTitle}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[1.15rem] border border-[#eadfcf] bg-white px-4 py-3">
            <div className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              {t.arrival}
            </div>
            <div className="mt-2 text-sm font-medium text-[#201b17]">
              {checkIn}
            </div>
            <div className="mt-1 text-xs font-light text-[#7b7368]">
              {t.arrivalTime}
            </div>
          </div>
          <div className="rounded-[1.15rem] border border-[#eadfcf] bg-white px-4 py-3">
            <div className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              {t.departure}
            </div>
            <div className="mt-2 text-sm font-medium text-[#201b17]">
              {checkOut}
            </div>
            <div className="mt-1 text-xs font-light text-[#7b7368]">
              {t.departureTime}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs font-light leading-relaxed text-[#7b7368]">
          {t.sameDayRule}
        </p>
      </section>

      <section className="mt-6">
        <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.mealPlanTitle}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {room.mealOptions.map((option) => (
            <label
              key={option.value}
              className={[
                "flex cursor-pointer flex-col gap-3 rounded-[1.25rem] border px-4 py-4 transition-colors duration-200",
                selectedMealPlan === option.value
                  ? "border-[#c9a96e] bg-[#fff8ec]"
                  : "border-[#eadfcf] bg-[#fcfaf6] hover:bg-white",
              ].join(" ")}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="mealPlan"
                  value={option.value}
                  checked={selectedMealPlan === option.value}
                  onChange={() => setSelectedMealPlan(option.value)}
                  disabled={isAwaitingCode}
                  className="mt-1 h-4 w-4 border-[#ccb28b] text-[#b4884c] focus:ring-[#d8bd84]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[#201b17]">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs font-light leading-relaxed text-[#6c6459]">
                    {option.description}
                  </span>
                </span>
              </span>
              <span className="text-sm font-medium text-[#201b17]">
                {formatCurrency(option.pricePerNight, locale)} {t.perNight}
              </span>
            </label>
          ))}
        </div>
      </section>

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
              disabled={isAwaitingCode}
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
              disabled={isAwaitingCode}
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
                disabled={isAwaitingCode}
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
              readOnly={isAwaitingCode}
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
              readOnly={isAwaitingCode}
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
              readOnly={isAwaitingCode}
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
              readOnly={isAwaitingCode}
              autoComplete="tel"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>
        </div>

        <div className="mt-6 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.addressTitle}
        </div>
        <p className="mt-2 max-w-[44rem] text-xs font-light leading-relaxed text-[#7b7368]">
          {t.addressHint}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3 md:col-span-2">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <Home className="h-4 w-4 stroke-[1.8]" />
              {t.street}
            </span>
            <input
              name="street"
              required
              readOnly={isAwaitingCode}
              autoComplete="street-address"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <MapPin className="h-4 w-4 stroke-[1.8]" />
              {t.postalCode}
            </span>
            <input
              name="postalCode"
              required
              readOnly={isAwaitingCode}
              autoComplete="postal-code"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <MapPin className="h-4 w-4 stroke-[1.8]" />
              {t.city}
            </span>
            <input
              name="city"
              required
              readOnly={isAwaitingCode}
              autoComplete="address-level2"
              className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
            />
          </label>

          <label className="rounded-[1.25rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-3 md:col-span-2">
            <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              <MapPin className="h-4 w-4 stroke-[1.8]" />
              {t.country}
            </span>
            <input
              name="country"
              required
              readOnly={isAwaitingCode}
              defaultValue={locale === "de" ? "Deutschland" : ""}
              autoComplete="country-name"
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
            readOnly={isAwaitingCode}
            placeholder={t.notesPlaceholder}
            className="mt-3 w-full resize-none bg-transparent text-sm leading-relaxed text-[#201b17] outline-none"
          />
        </label>
      </section>

      <section className="mt-6 rounded-[1.35rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4 sm:px-5">
        <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          {t.termsTitle}
        </div>
        <p className="mt-2 text-xs font-light leading-relaxed text-[#6c6459]">
          {t.termsDescription}
        </p>

        <details className="group/terms mt-4 rounded-[1.15rem] border border-[#dfd4c2] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#5d564c] [&::-webkit-details-marker]:hidden">
            <span>{t.termsShow}</span>
            <span className="text-[#9c7b4b]">
              {t.termsHideHint} {BOOKING_TERMS_VERSION}
            </span>
          </summary>
          <div className="max-h-[24rem] overflow-y-auto border-t border-[#eadfcf] px-4 py-4 text-sm leading-relaxed text-[#4f483f]">
            <h3 className="font-[var(--font-display)] text-[1.7rem] leading-none text-[#201b17]">
              {BOOKING_TERMS_DE.title}
            </h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#5d564c]">
              {BOOKING_TERMS_DE.intro}
            </p>
            <div className="mt-5 space-y-5">
              {BOOKING_TERMS_DE.sections.map((section) => (
                <section key={section.title}>
                  <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#9c7b4b]">
                    {section.title}
                  </h4>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm font-light leading-relaxed">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </details>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-[1.15rem] border border-[#dfd4c2] bg-white px-4 py-3 text-sm text-[#3a342c]">
          <input
            key={isAwaitingCode ? "terms-locked" : "terms-editable"}
            type="checkbox"
            name="termsAccepted"
            required={!isAwaitingCode}
            disabled={isAwaitingCode}
            defaultChecked={isAwaitingCode}
            className="mt-1 h-4 w-4 rounded border-[#ccb28b] text-[#b4884c] focus:ring-[#d8bd84]"
          />
          <span>{t.termsAccept}</span>
        </label>
      </section>

      {isAwaitingCode ? (
        <section className="mt-6 rounded-[1.35rem] border border-[#c9a96e] bg-[#fff8ec] px-4 py-4 sm:px-5">
          <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
            {t.codeTitle}
          </div>
          <p className="mt-2 text-sm font-light leading-relaxed text-[#5d564c]">
            {t.codeDescription(state.maskedEmail ?? t.email)}
          </p>
          <p className="mt-2 text-xs font-light leading-relaxed text-[#7b7368]">
            {t.codeExpires} {t.fieldsLocked}
          </p>
          {state.errorMessage ? (
            <div className="mt-4 rounded-[1rem] border border-[#f0cfc7] bg-[#fff3ef] px-4 py-3 text-sm font-light text-[#8f4337]">
              {state.errorMessage}
            </div>
          ) : null}
          <label className="mt-4 block rounded-[1.15rem] border border-[#dfd4c2] bg-white px-4 py-3">
            <span className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
              {t.codeLabel}
            </span>
            <input
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              placeholder={t.codePlaceholder}
              className="mt-3 w-full bg-transparent text-lg tracking-[0.24em] text-[#201b17] outline-none"
            />
          </label>
        </section>
      ) : null}

      <section className="mt-6 rounded-[1.35rem] border border-[#eadfcf] bg-[linear-gradient(145deg,rgba(250,247,241,0.98),rgba(255,255,255,0.96))] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
          <CalendarDays className="h-4 w-4 stroke-[1.8]" />
          {t.summaryTitle}
        </div>

        <div className="mt-4 space-y-3 text-sm font-light text-[#4f483f]">
          <div className="flex items-center justify-between gap-4">
            <span>
              {t.summaryAccommodation} · {room.nights} x {formatCurrency(room.occupancyBasePrice, locale)}
            </span>
            <span className="font-medium text-[#201b17]">
              {formatCurrency(accommodationTotal, locale)}
            </span>
          </div>

          {selectedMealOption ? (
            <div className="flex items-center justify-between gap-4">
              <span>
                {t.summaryMeals} · {selectedMealOption.label}
              </span>
              <span className="font-medium text-[#201b17]">
                {formatCurrency(mealPlanTotal, locale)}
              </span>
            </div>
          ) : null}

          {room.extraBeds > 0 ? (
            <div className="flex items-center justify-between gap-4">
              <span>
                {t.summaryExtraBeds} · {room.extraBeds}
              </span>
              <span className="font-medium text-[#201b17]">
                {formatCurrency(extraBedTotal, locale)}
              </span>
            </div>
          ) : null}

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
        <SubmitButton
          idleLabel={isAwaitingCode ? t.confirmCode : t.sendCode}
          pendingLabel={isAwaitingCode ? t.confirmingCode : t.sendingCode}
        />
      </div>

      <p className="mt-4 text-xs font-light leading-relaxed text-[#7b7368]">
        {t.secureNote}
      </p>
    </form>
  );
}
