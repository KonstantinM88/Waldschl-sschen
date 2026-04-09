import { addDays, format } from "date-fns";
import { Coffee, Dog, Sparkles, UtensilsCrossed } from "lucide-react";
import BookingLanguageSwitcher from "@/components/booking/BookingLanguageSwitcher";
import BookingWidget from "@/components/booking/BookingWidget";
import RoomCard from "@/components/booking/RoomCard";
import {
  type BookingLocale,
  DOG_FEE_PER_NIGHT,
  FREE_BICYCLE_PRICE,
  getAvailableRooms,
  getDefaultRestaurantTimeOptions,
} from "@/lib/booking-engine";
import {
  buildBookingHref,
  toBookingDisplayLocale,
  toBookingRouteLocale,
} from "@/lib/booking-navigation";
import { siteConfig } from "@/data/site";

export const dynamic = "force-dynamic";

interface HotelBookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    lang?: string;
  }>;
}

const pageCopy = {
  de: {
    languageLabel: "Sprache",
    badge: "Booking Engine",
    title: "Zimmer direkt und transparent buchen",
    description:
      "Prufen Sie freie Zimmer fur Ihren Zeitraum, inklusive Fruhstuck und optionalen Zusatzleistungen fur einen komfortablen Aufenthalt im Waldschlosschen.",
    resultsTitle: "Verfugbare Zimmer",
    resultsSubtitle: (count: number) =>
      count === 1 ? "1 Zimmertyp verfugbar" : `${count} Zimmertypen verfugbar`,
    noResultsTitle: "Fur diesen Zeitraum ist aktuell nichts frei",
    noResultsText:
      "Bitte andern Sie Datum oder Gastezahl. Alternativ unterstutzen wir Sie gern telefonisch oder per E-Mail.",
    contactCta: "Direkt anfragen",
    extrasBadge: "Zusatzleistungen",
    extrasTitle: "Mehr Komfort vor dem Checkout",
    extras: {
      dog: `Hund willkommen · + ${DOG_FEE_PER_NIGHT.toFixed(0)} € / Tag`,
      bike: `Kostenloser Fahrradverleih · ${FREE_BICYCLE_PRICE.toFixed(0)} €`,
      restaurant: "Tischreservierung am Abend der Anreise",
      breakfast: "Reichhaltiges Fruhstucksbuffet immer inklusive",
    },
  },
  en: {
    languageLabel: "Language",
    badge: "Booking engine",
    title: "Book your room directly and transparently",
    description:
      "Check available room types for your dates, including breakfast and optional extras for a comfortable stay at Waldschlosschen.",
    resultsTitle: "Available rooms",
    resultsSubtitle: (count: number) =>
      count === 1 ? "1 room type available" : `${count} room types available`,
    noResultsTitle: "No room type is currently available for these dates",
    noResultsText:
      "Please adjust dates or guest count. Alternatively, we can assist you directly by phone or email.",
    contactCta: "Request directly",
    extrasBadge: "Optional extras",
    extrasTitle: "Upsell options before checkout",
    extras: {
      dog: `Dog welcome · + €${DOG_FEE_PER_NIGHT.toFixed(0)} / day`,
      bike: `Free bicycle reservation · €${FREE_BICYCLE_PRICE.toFixed(0)}`,
      restaurant: "Restaurant table on arrival evening",
      breakfast: "Rich breakfast buffet always included",
    },
  },
  ru: {
    languageLabel: "Язык",
    badge: "Booking Engine",
    title: "Прямое и прозрачное бронирование номера",
    description:
      "Проверьте доступные типы номеров на ваши даты, с включённым завтраком и дополнительными услугами для комфортного проживания в Waldschlosschen.",
    resultsTitle: "Доступные номера",
    resultsSubtitle: (count: number) =>
      count === 1 ? "Доступен 1 тип номера" : `Доступно ${count} типов номеров`,
    noResultsTitle: "На выбранные даты свободных номеров сейчас нет",
    noResultsText:
      "Измените даты или количество гостей. Либо мы можем помочь вам напрямую по телефону или по e-mail.",
    contactCta: "Отправить запрос",
    extrasBadge: "Дополнительные услуги",
    extrasTitle: "Дополнения перед оформлением",
    extras: {
      dog: `Собака · + ${DOG_FEE_PER_NIGHT.toFixed(0)} € / день`,
      bike: `Бесплатный велосипед · ${FREE_BICYCLE_PRICE.toFixed(0)} €`,
      restaurant: "Столик в ресторане в вечер заезда",
      breakfast: "Богатый завтрак-буфет всегда включён",
    },
  },
} as const;

export default async function HotelBookingPage({
  params,
  searchParams,
}: HotelBookingPageProps) {
  const { locale } = await params;
  const { checkIn, checkOut, guests, lang } = await searchParams;
  const routeLocale = toBookingRouteLocale(locale);
  const today = new Date();
  const fallbackCheckIn = format(addDays(today, 1), "yyyy-MM-dd");
  const fallbackCheckOut = format(addDays(today, 2), "yyyy-MM-dd");
  const selectedCheckIn = checkIn || fallbackCheckIn;
  const selectedCheckOut = checkOut || fallbackCheckOut;
  const selectedGuests = guests === "1" ? 1 : 2;
  const normalizedLocale = toBookingDisplayLocale(routeLocale, lang);
  const t = pageCopy[normalizedLocale];
  const languageState = {
    checkIn: selectedCheckIn,
    checkOut: selectedCheckOut,
    guests: selectedGuests,
  };
  const rooms = await getAvailableRooms(
    selectedCheckIn,
    selectedCheckOut,
    selectedGuests,
    normalizedLocale
  );
  const restaurantOptions = getDefaultRestaurantTimeOptions(normalizedLocale);

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-[#201b17] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <section className="overflow-hidden rounded-[2rem] border border-[#dfd4c2] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,242,234,0.92))] p-5 shadow-[0_24px_70px_rgba(32,24,16,0.08)] sm:p-7">
          <BookingLanguageSwitcher
            currentLocale={normalizedLocale}
            label={t.languageLabel}
            pathSuffix="/hotel/buchen"
            routeLocale={routeLocale}
            state={languageState}
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/72 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
                <Sparkles className="h-3.5 w-3.5 stroke-[1.8]" />
                {t.badge}
              </span>
              <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.92] text-[#201b17]">
                {t.title}
              </h1>
              <p className="mt-5 max-w-[42rem] text-[0.98rem] font-light leading-relaxed text-[#5d564c] sm:text-[1.05rem]">
                {t.description}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  t.extras.breakfast,
                  t.extras.dog,
                  t.extras.bike,
                  `${t.extras.restaurant}: ${restaurantOptions.options.join(" · ")}`,
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[1.3rem] border border-[#eadfcf] bg-white/74 px-4 py-4 text-sm font-light leading-relaxed text-[#4f483f]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <BookingWidget
              action={`/${routeLocale}/hotel/buchen`}
              languageQueryValue={
                normalizedLocale !== routeLocale ? normalizedLocale : undefined
              }
              locale={normalizedLocale}
              initialCheckIn={selectedCheckIn}
              initialCheckOut={selectedCheckOut}
              initialGuests={selectedGuests}
              className="self-start"
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
                  {t.resultsTitle}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                  {t.resultsSubtitle(rooms.length)}
                </h2>
              </div>
              <div className="text-sm font-light text-[#6c6459]">
                {selectedCheckIn} - {selectedCheckOut} · {selectedGuests}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5">
              {rooms.length ? (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    locale={normalizedLocale}
                    ctaHref={buildBookingHref({
                      pathSuffix: "/hotel/buchen/checkout",
                      routeLocale,
                      targetLocale: normalizedLocale,
                      state: {
                        ...languageState,
                        roomId: room.id,
                      },
                    })}
                  />
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-5 py-8">
                  <h3 className="font-[var(--font-display)] text-[1.9rem] text-[#201b17]">
                    {t.noResultsTitle}
                  </h3>
                  <p className="mt-4 max-w-[34rem] text-sm font-light leading-relaxed text-[#5d564c]">
                    {t.noResultsText}
                  </p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)]"
                  >
                    {t.contactCta}
                  </a>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#dfd4c2] bg-[linear-gradient(145deg,rgba(34,28,24,0.98),rgba(21,17,15,0.98))] p-5 text-white shadow-[0_18px_40px_rgba(28,21,16,0.14)] sm:p-6">
            <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#f1dfba]">
              {t.extrasBadge}
            </div>
            <h2 className="mt-2 font-[var(--font-display)] text-[2rem] leading-none">
              {t.extrasTitle}
            </h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  Icon: Dog,
                  title: t.extras.dog,
                },
                {
                  Icon: Coffee,
                  title: t.extras.bike,
                },
                {
                  Icon: UtensilsCrossed,
                  title: `${restaurantOptions.label}: ${restaurantOptions.options.join(", ")}`,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#f1dfba]">
                      <item.Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                    </div>
                    <div className="text-sm font-light leading-relaxed text-white/78">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
