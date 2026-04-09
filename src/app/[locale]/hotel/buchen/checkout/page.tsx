import { addDays, format } from "date-fns";
import { CalendarDays, Coffee, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import BookingCheckoutForm from "@/components/booking/BookingCheckoutForm";
import BookingLanguageSwitcher from "@/components/booking/BookingLanguageSwitcher";
import {
  type BookingLocale,
  getAvailableRooms,
  getDefaultRestaurantTimeOptions,
} from "@/lib/booking-engine";
import {
  buildBookingHref,
  toBookingDisplayLocale,
  toBookingRouteLocale,
} from "@/lib/booking-navigation";

export const dynamic = "force-dynamic";

interface HotelBookingCheckoutPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    room?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    lang?: string;
  }>;
}

const pageCopy = {
  de: {
    languageLabel: "Sprache",
    badge: "Checkout",
    title: "Ihre Buchungsanfrage im letzten Schritt",
    description:
      "Prufen Sie noch einmal Ihren Aufenthalt und senden Sie anschließend die Reservierungsdaten direkt an unser Team.",
    summaryBadge: "Ausgewähltes Zimmer",
    summaryTitle: "Ihr Aufenthalt im Überblick",
    arrival: "Check-in",
    departure: "Check-out",
    guests: "Gäste",
    includedTitle: "Immer inklusive",
    includedBreakfast: "Reichhaltiges Frühstücksbuffet",
    includedHospitality: "Persönliche Betreuung durch unser Team",
    fallbackTitle: "Bitte wählen Sie zuerst ein verfügbares Zimmer",
    fallbackText:
      "Ohne ausgewähltes Zimmer können wir die Buchung nicht abschließen. Gehen Sie zurück zur Verfügbarkeitsübersicht und wählen Sie eine passende Kategorie.",
    fallbackCta: "Zur Zimmerauswahl",
    from: "ab",
    night: "/ Nacht",
  },
  en: {
    languageLabel: "Language",
    badge: "Checkout",
    title: "Your booking request in the final step",
    description:
      "Review your stay one more time and then send the reservation details directly to our team.",
    summaryBadge: "Selected room",
    summaryTitle: "Your stay at a glance",
    arrival: "Check-in",
    departure: "Check-out",
    guests: "Guests",
    includedTitle: "Always included",
    includedBreakfast: "Generous breakfast buffet",
    includedHospitality: "Personal care from our team",
    fallbackTitle: "Please select an available room first",
    fallbackText:
      "We cannot complete the booking without a selected room. Please go back to the availability list and choose a suitable category.",
    fallbackCta: "Back to room selection",
    from: "from",
    night: "/ night",
  },
  ru: {
    languageLabel: "Язык",
    badge: "Checkout",
    title: "Финальный шаг оформления бронирования",
    description:
      "Проверьте детали проживания и затем отправьте данные бронирования напрямую нашей команде.",
    summaryBadge: "Выбранный номер",
    summaryTitle: "Ваше проживание",
    arrival: "Заезд",
    departure: "Выезд",
    guests: "Гости",
    includedTitle: "Всегда включено",
    includedBreakfast: "Богатый завтрак-буфет",
    includedHospitality: "Персональное сопровождение нашей команды",
    fallbackTitle: "Сначала выберите доступный номер",
    fallbackText:
      "Без выбранного номера нельзя завершить бронирование. Вернитесь к списку доступности и выберите подходящую категорию.",
    fallbackCta: "Назад к выбору номера",
    from: "от",
    night: "/ ночь",
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

export default async function HotelBookingCheckoutPage({
  params,
  searchParams,
}: HotelBookingCheckoutPageProps) {
  const { locale } = await params;
  const { room, checkIn, checkOut, guests, lang } = await searchParams;
  const routeLocale = toBookingRouteLocale(locale);
  const today = new Date();
  const fallbackCheckIn = format(addDays(today, 1), "yyyy-MM-dd");
  const fallbackCheckOut = format(addDays(today, 2), "yyyy-MM-dd");
  const selectedCheckIn = checkIn || fallbackCheckIn;
  const selectedCheckOut = checkOut || fallbackCheckOut;
  const selectedGuests = guests === "1" ? 1 : 2;
  const normalizedLocale = toBookingDisplayLocale(routeLocale, lang);
  const t = pageCopy[normalizedLocale];
  const flowState = {
    checkIn: selectedCheckIn,
    checkOut: selectedCheckOut,
    guests: selectedGuests,
    roomId: room,
  };
  const searchHref = buildBookingHref({
    pathSuffix: "/hotel/buchen",
    routeLocale,
    targetLocale: normalizedLocale,
    state: {
      checkIn: selectedCheckIn,
      checkOut: selectedCheckOut,
      guests: selectedGuests,
    },
  });
  const availableRooms = await getAvailableRooms(
    selectedCheckIn,
    selectedCheckOut,
    selectedGuests,
    normalizedLocale
  );
  const selectedRoom = room
    ? availableRooms.find((availableRoom) => availableRoom.id === room)
    : null;
  const restaurantOptions = getDefaultRestaurantTimeOptions(normalizedLocale);

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-[#201b17] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <section className="overflow-hidden rounded-[2rem] border border-[#dfd4c2] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,242,234,0.92))] p-5 shadow-[0_24px_70px_rgba(32,24,16,0.08)] sm:p-7">
          <BookingLanguageSwitcher
            currentLocale={normalizedLocale}
            label={t.languageLabel}
            pathSuffix="/hotel/buchen/checkout"
            routeLocale={routeLocale}
            state={flowState}
          />

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/72 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              <Sparkles className="h-3.5 w-3.5 stroke-[1.8]" />
              {t.badge}
            </span>
            <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2.3rem,6vw,4.4rem)] leading-[0.94] text-[#201b17]">
              {t.title}
            </h1>
            <p className="mt-4 max-w-[46rem] text-[0.98rem] font-light leading-relaxed text-[#5d564c] sm:text-[1.05rem]">
              {t.description}
            </p>
          </div>
        </section>

        {selectedRoom ? (
          <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.04fr_0.96fr]">
            <BookingCheckoutForm
              backToSearchHref={searchHref}
              checkIn={selectedCheckIn}
              checkOut={selectedCheckOut}
              guests={selectedGuests}
              locale={normalizedLocale}
              restaurantOptions={restaurantOptions}
              room={selectedRoom}
            />

            <aside className="rounded-[1.9rem] border border-[#dfd4c2] bg-[linear-gradient(145deg,rgba(34,28,24,0.98),rgba(21,17,15,0.98))] p-5 text-white shadow-[0_18px_40px_rgba(28,21,16,0.14)] sm:p-6">
              <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#f1dfba]">
                {t.summaryBadge}
              </div>
              <h2 className="mt-2 font-[var(--font-display)] text-[2rem] leading-none">
                {t.summaryTitle}
              </h2>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={selectedRoom.imageUrl ?? "/Hotel/room_1600.webp"}
                    alt={selectedRoom.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.08)_0%,rgba(12,10,9,0.22)_45%,rgba(12,10,9,0.78)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="font-[var(--font-display)] text-[2rem] leading-[0.95] text-white">
                      {selectedRoom.title}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] text-white/72">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 stroke-[1.8]" />
                        {selectedGuests}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 stroke-[1.8]" />
                        {selectedRoom.nights}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#f1dfba]">
                        {t.from}
                      </div>
                      <div className="mt-1 font-[var(--font-display)] text-[2.3rem] leading-none text-white">
                        {formatCurrency(selectedRoom.basePrice, normalizedLocale)}
                        <span className="ml-2 text-base text-white/58">{t.night}</span>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-white/72">
                      {selectedRoom.availableCount}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                      <div className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#f1dfba]">
                        {t.arrival}
                      </div>
                      <div className="mt-2 text-sm font-light text-white/86">
                        {selectedCheckIn}
                      </div>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                      <div className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#f1dfba]">
                        {t.departure}
                      </div>
                      <div className="mt-2 text-sm font-light text-white/86">
                        {selectedCheckOut}
                      </div>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                      <div className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#f1dfba]">
                        {t.guests}
                      </div>
                      <div className="mt-2 text-sm font-light text-white/86">
                        {selectedGuests}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#f1dfba]">
                      {t.includedTitle}
                    </div>
                    <div className="mt-4 space-y-3 text-sm font-light text-white/78">
                      <div className="flex items-start gap-3">
                        <Coffee className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.8] text-[#f1dfba]" />
                        <span>{t.includedBreakfast}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.8] text-[#f1dfba]" />
                        <span>{t.includedHospitality}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <section className="mt-6 rounded-[1.9rem] border border-[#dfd4c2] bg-white p-6 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-7">
            <h2 className="font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
              {t.fallbackTitle}
            </h2>
            <p className="mt-4 max-w-[40rem] text-sm font-light leading-relaxed text-[#5d564c] sm:text-[0.98rem]">
              {t.fallbackText}
            </p>
            <Link
              href={searchHref}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)]"
            >
              {t.fallbackCta}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
