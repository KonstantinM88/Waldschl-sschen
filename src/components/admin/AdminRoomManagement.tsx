import Image from "next/image";
import {
  BedDouble,
  Check,
  DoorOpen,
  Hash,
  ImageIcon,
  Layers3,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import {
  createRoomAction,
  deleteRoomAction,
  updateRoomAction,
} from "@/app/admin/room-actions";
import AdminConfirmButton from "@/components/admin/AdminConfirmButton";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

const MAX_ROOM_IMAGES = 5;

const fieldClassName =
  "min-w-0 rounded-xl border border-[#dfd2c0] bg-[#fffdf9] px-3.5 py-3 transition-colors duration-200 focus-within:border-[#c6aa7b] focus-within:bg-white";
const inputClassName =
  "mt-2 w-full min-w-0 bg-transparent text-sm text-[#201b17] outline-none";
const labelClassName =
  "text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]";
const primaryButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-center text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto";
const dangerButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#efc9bd] bg-[#fff3ef] px-5 text-center text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#9f4638] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dfa99b] hover:bg-white hover:text-[#7f3128] sm:w-auto";

const roomTypeOptions = [
  { label: "Einzelzimmer", value: "SINGLE" },
  { label: "Doppelzimmer", value: "DOUBLE" },
] as const;

const commonAmenities = [
  { value: "Kostenloses WLAN", de: "Kostenloses WLAN", ru: "Бесплатный Wi-Fi" },
  { value: "Eigenes Bad", de: "Eigenes Bad", ru: "Собственная ванная" },
  { value: "Dusche", de: "Dusche", ru: "Душ" },
  { value: "Badewanne", de: "Badewanne", ru: "Ванна" },
  { value: "TV", de: "TV", ru: "Телевизор" },
  { value: "Schreibtisch", de: "Schreibtisch", ru: "Рабочий стол" },
  { value: "Sitzbereich", de: "Sitzbereich", ru: "Зона отдыха" },
  { value: "Kleiderschrank", de: "Kleiderschrank", ru: "Шкаф" },
  { value: "Haartrockner", de: "Haartrockner", ru: "Фен" },
  { value: "Pflegeprodukte", de: "Pflegeprodukte", ru: "Косметика" },
  { value: "Handtücher", de: "Handtücher", ru: "Полотенца" },
  { value: "Bettwäsche", de: "Bettwäsche", ru: "Постельное бельё" },
  { value: "Frühstück inklusive", de: "Frühstück inklusive", ru: "Завтрак включён" },
  { value: "Nichtraucherzimmer", de: "Nichtraucherzimmer", ru: "Для некурящих" },
  { value: "Heizung", de: "Heizung", ru: "Отопление" },
  { value: "Safe", de: "Safe", ru: "Сейф" },
  { value: "Minibar", de: "Minibar", ru: "Минибар" },
  { value: "Kaffee/Tee", de: "Kaffee/Tee", ru: "Кофе/чай" },
  { value: "Babybett auf Anfrage", de: "Babybett auf Anfrage", ru: "Детская кроватка по запросу" },
  { value: "Hund erlaubt auf Anfrage", de: "Hund erlaubt auf Anfrage", ru: "С собакой по запросу" },
  { value: "Parkplatz", de: "Parkplatz", ru: "Парковка" },
] as const;

interface AdminRoom {
  id: string;
  slug: string;
  roomNumber: string | null;
  type: string;
  inventory: number;
  maxGuests: number;
  basePrice: number | string | { toString(): string };
  priceOneGuest: number | string | { toString(): string } | null;
  priceTwoGuests: number | string | { toString(): string } | null;
  priceThreeGuests: number | string | { toString(): string } | null;
  priceFourGuests: number | string | { toString(): string } | null;
  breakfastPricePerGuest: number | string | { toString(): string };
  halfBoardPricePerGuest: number | string | { toString(): string };
  defaultMealPlan: string;
  extraBedMax: number;
  extraBedPrice: number | string | { toString(): string };
  breakfastIncluded: boolean;
  isActive: boolean;
  sortOrder: number;
  titleDe: string;
  titleEn: string;
  titleRu: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionRu: string;
  shortDescriptionDe: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionRu: string | null;
  recommendationDe: string | null;
  recommendationEn: string | null;
  recommendationRu: string | null;
  imageUrl: string | null;
  imageUrls: unknown;
  amenities: unknown;
}

interface AdminRoomManagementProps {
  activeBookingCounts: Record<string, number>;
  locale: AdminLocale;
  returnTo: string;
  rooms: AdminRoom[];
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function getRoomImages(room: AdminRoom) {
  const gallery = normalizeStringArray(room.imageUrls);

  if (gallery.length) {
    return gallery.slice(0, MAX_ROOM_IMAGES);
  }

  return room.imageUrl ? [room.imageUrl] : [];
}

function getRoomAmenities(room: Pick<AdminRoom, "amenities">) {
  return normalizeStringArray(room.amenities);
}

function getCustomAmenities(amenities: string[]) {
  const presetValues = new Set<string>(
    commonAmenities.map((amenity) => amenity.value)
  );

  return amenities.filter((amenity) => !presetValues.has(amenity)).join("\n");
}

function formatCurrency(value: AdminRoom["basePrice"], locale: AdminLocale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function toInputNumber(value: AdminRoom["basePrice"] | null | undefined) {
  return value === null || value === undefined ? "" : Number(value);
}

function getDisplayRoomPrice(room: AdminRoom) {
  return room.priceTwoGuests ?? room.priceOneGuest ?? room.basePrice;
}

function formatRoomType(type: string, copy: ReturnType<typeof getCopy>) {
  return type === "SINGLE" ? copy.typeSingle : copy.typeDouble;
}

function getCopy(locale: AdminLocale) {
  if (locale === "ru") {
    return {
      addRoom: "Добавить комнату",
      addRoomHint: "Создайте новый номер или категорию. Тексты можно доработать сразу после создания.",
      active: "Активно",
      advanced: "Контент, фото и удобства",
      amenityCustom: "Дополнительные удобства",
      amenityPreset: "Основные удобства",
      breakfast: "Завтрак включён",
      deleteRoom: "Удалить",
      details: "Детали",
      gallery: "Фотографии",
      galleryHint: "До 5 фото. Новые изображения сохраняются как WebP и автоматически используются адаптивно.",
      guests: "Гостей",
      inactive: "Неактивно",
      inventory: "Инвентарь",
      newImages: "Добавить фото",
      noPhotos: "Фото не добавлены",
      number: "Номер",
      numberPlaceholder: "101",
      price: "Цена",
      priceFallback: "Fallback-цена",
      prices: "Тарифы",
      priceOneGuest: "1 гость",
      priceTwoGuests: "2 гостя",
      priceThreeGuests: "3 гостя",
      priceFourGuests: "4 гостя",
      defaultMealPlan: "По умолчанию",
      roomOnly: "Без завтрака",
      withBreakfast: "С завтраком",
      halfBoard: "Завтрак + ужин",
      breakfastPrice: "Завтрак / гость",
      halfBoardPrice: "Завтрак+ужин / гость",
      extraBeds: "Доп. кровати",
      extraBedMax: "Кол-во доп. кроватей",
      extraBedPrice: "Цена доп. кровати",
      recommendation: "Рекомендация",
      recommendationDe: "Рекомендация DE",
      recommendationEn: "Рекомендация EN",
      recommendationRu: "Рекомендация RU",
      removePhoto: "Удалить фото",
      rooms: "Номера",
      save: "Сохранить",
      slug: "Slug",
      sort: "Порядок",
      typeDouble: "Двухместный",
      typeSingle: "Одноместный",
      type: "Тип",
      uploadHelp: "JPG, PNG, AVIF или WebP. Сервер конвертирует в WebP до 1600x1200.",
    };
  }

  return {
    addRoom: "Zimmer anlegen",
    addRoomHint: "Legen Sie ein neues Zimmer oder eine neue Kategorie an. Texte konnen danach direkt verfeinert werden.",
    active: "Aktiv",
    advanced: "Inhalte, Fotos und Amenities",
    amenityCustom: "Weitere Amenities",
    amenityPreset: "Hotel-Amenities",
    breakfast: "Fruhstuck inklusive",
    deleteRoom: "Loschen",
    details: "Details",
    gallery: "Fotos",
    galleryHint: "Bis zu 5 Fotos. Neue Bilder werden als WebP gespeichert und responsiv ausgespielt.",
    guests: "Gaste",
    inactive: "Inaktiv",
    inventory: "Inventar",
    newImages: "Fotos hinzufugen",
    noPhotos: "Noch keine Fotos",
    number: "Nummer",
    numberPlaceholder: "101",
    price: "Preis",
    priceFallback: "Fallback-Preis",
    prices: "Raten",
    priceOneGuest: "1 Gast",
    priceTwoGuests: "2 Gaste",
    priceThreeGuests: "3 Gaste",
    priceFourGuests: "4 Gaste",
    defaultMealPlan: "Standard",
    roomOnly: "Ohne Fruhstuck",
    withBreakfast: "Mit Fruhstuck",
    halfBoard: "Fruhstuck + Abendessen",
    breakfastPrice: "Fruhstuck / Gast",
    halfBoardPrice: "Halbpension / Gast",
    extraBeds: "Zusatzbetten",
    extraBedMax: "Zusatzbetten",
    extraBedPrice: "Preis Zusatzbett",
    recommendation: "Empfehlung",
    recommendationDe: "Empfehlung DE",
    recommendationEn: "Empfehlung EN",
    recommendationRu: "Empfehlung RU",
    removePhoto: "Foto entfernen",
    rooms: "Zimmer",
    save: "Speichern",
    slug: "Slug",
    sort: "Sortierung",
    typeDouble: "Doppelzimmer",
    typeSingle: "Einzelzimmer",
    type: "Typ",
    uploadHelp: "JPG, PNG, AVIF oder WebP. Der Server konvertiert zu WebP bis 1600x1200.",
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className={labelClassName}>{children}</span>;
}

function TextInput({
  defaultValue,
  maxLength,
  min,
  name,
  pattern,
  placeholder,
  step,
  type = "text",
}: {
  defaultValue?: number | string | null;
  maxLength?: number;
  min?: number | string;
  name: string;
  pattern?: string;
  placeholder?: string;
  step?: string;
  type?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      min={min}
      step={step}
      pattern={pattern}
      maxLength={maxLength}
      placeholder={placeholder}
      defaultValue={defaultValue ?? ""}
      className={inputClassName}
    />
  );
}

function TextArea({
  defaultValue,
  name,
  rows = 3,
}: {
  defaultValue?: string | null;
  name: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      rows={rows}
      className={`${inputClassName} resize-y leading-relaxed`}
    />
  );
}

function GalleryFields({
  copy,
  images,
}: {
  copy: ReturnType<typeof getCopy>;
  images: string[];
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#dfd2c0] bg-white p-3.5 shadow-[0_10px_24px_rgba(37,28,20,0.035)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <FieldLabel>{copy.gallery}</FieldLabel>
          <p className="mt-1 text-xs font-light leading-relaxed text-[#7a7064]">
            {copy.galleryHint}
          </p>
        </div>
        <div className="text-xs font-light text-[#9e927f]">
          {images.length}/{MAX_ROOM_IMAGES}
        </div>
      </div>

      {images.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((imageUrl, index) => (
            <label
              key={`${imageUrl}-${index}`}
              className="group relative min-h-[8rem] overflow-hidden rounded-xl border border-[#dfd2c0] bg-[#f5efe4]"
            >
              <input type="hidden" name="existingImageUrls" value={imageUrl} />
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute left-2 top-2 rounded-lg bg-black/45 px-2 py-1 text-[0.62rem] text-white backdrop-blur">
                {index + 1}
              </span>
              <span className="absolute inset-x-2 bottom-2 inline-flex items-center gap-2 rounded-lg bg-white/92 px-2.5 py-1.5 text-[0.62rem] font-semibold text-[#7f3128] shadow-sm">
                <input
                  name="deleteImageUrls"
                  type="checkbox"
                  value={imageUrl}
                  className="h-3.5 w-3.5 rounded border-[#d2b9a7] text-[#9f4638]"
                />
                {copy.removePhoto}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-3 py-6 text-center text-sm font-light text-[#7a7064]">
          {copy.noPhotos}
        </div>
      )}

      <label className="mt-3 block rounded-xl border border-dashed border-[#d7c7b2] bg-[#faf6ef] px-3.5 py-3 transition-colors duration-200 hover:bg-white">
        <span className="inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#8f836f]">
          <ImageIcon className="h-3.5 w-3.5 stroke-[1.8]" />
          {copy.newImages}
        </span>
        <input
          name="imageFiles"
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-xs text-[#5d564c] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eadfcf] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#5d564c]"
        />
        <span className="mt-2 block text-xs font-light leading-relaxed text-[#8f836f]">
          {copy.uploadHelp}
        </span>
      </label>
    </div>
  );
}

function AmenityFields({
  amenities,
  copy,
  locale,
}: {
  amenities: string[];
  copy: ReturnType<typeof getCopy>;
  locale: AdminLocale;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#dfd2c0] bg-white p-3.5 shadow-[0_10px_24px_rgba(37,28,20,0.035)]">
      <FieldLabel>{copy.amenityPreset}</FieldLabel>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {commonAmenities.map((amenity) => (
          <label
            key={amenity.value}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-[#efe4d5] bg-[#fcfaf6] px-3 py-2 text-sm font-light text-[#4f483f] transition-colors duration-200 hover:border-[#dcccb7] hover:bg-white"
          >
            <input
              name="amenity"
              type="checkbox"
              value={amenity.value}
              defaultChecked={amenities.includes(amenity.value)}
              className="h-4 w-4 shrink-0 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
            />
            <span className="min-w-0 break-words">
              {locale === "ru" ? amenity.ru : amenity.de}
            </span>
          </label>
        ))}
      </div>
      <label className="mt-3 block rounded-xl border border-[#dfd2c0] bg-[#fcfaf6] px-3.5 py-3">
        <FieldLabel>{copy.amenityCustom}</FieldLabel>
        <TextArea
          name="customAmenities"
          defaultValue={getCustomAmenities(amenities)}
          rows={3}
        />
      </label>
    </div>
  );
}

function CoreFields({
  copy,
  room,
}: {
  copy: ReturnType<typeof getCopy>;
  room?: AdminRoom;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <label className={fieldClassName}>
        <FieldLabel>{copy.number}</FieldLabel>
        <TextInput
          name="roomNumber"
          defaultValue={room?.roomNumber}
          placeholder={copy.numberPlaceholder}
          pattern="[0-9]{3}"
          maxLength={3}
        />
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.type}</FieldLabel>
        <select
          name="type"
          defaultValue={room?.type ?? "DOUBLE"}
          className={inputClassName}
        >
          {roomTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.inventory}</FieldLabel>
        <TextInput name="inventory" type="number" min="0" defaultValue={room?.inventory ?? 1} />
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.guests}</FieldLabel>
        <TextInput name="maxGuests" type="number" min="1" defaultValue={room?.maxGuests ?? 2} />
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.sort}</FieldLabel>
        <TextInput name="sortOrder" type="number" min="0" defaultValue={room?.sortOrder ?? 0} />
      </label>
    </div>
  );
}

function PricingFields({
  copy,
  room,
}: {
  copy: ReturnType<typeof getCopy>;
  room?: AdminRoom;
}) {
  const defaultBasePrice = room ? Number(room.basePrice) : 125;
  const priceOneGuest = room ? toInputNumber(room.priceOneGuest) : 105;
  const priceTwoGuests = room ? toInputNumber(room.priceTwoGuests) : defaultBasePrice;
  const priceThreeGuests = room ? toInputNumber(room.priceThreeGuests) : "";
  const priceFourGuests = room ? toInputNumber(room.priceFourGuests) : "";

  return (
    <div className="rounded-2xl border border-[#dfd2c0] bg-white p-3.5 shadow-[0_10px_24px_rgba(37,28,20,0.035)]">
      <FieldLabel>{copy.prices}</FieldLabel>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-10">
        <label className={fieldClassName}>
          <FieldLabel>{copy.priceOneGuest}</FieldLabel>
          <TextInput
            name="priceOneGuest"
            type="number"
            min="0"
            step="0.01"
            defaultValue={priceOneGuest}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.priceTwoGuests}</FieldLabel>
          <TextInput
            name="priceTwoGuests"
            type="number"
            min="0"
            step="0.01"
            defaultValue={priceTwoGuests}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.priceThreeGuests}</FieldLabel>
          <TextInput
            name="priceThreeGuests"
            type="number"
            min="0"
            step="0.01"
            defaultValue={priceThreeGuests}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.priceFourGuests}</FieldLabel>
          <TextInput
            name="priceFourGuests"
            type="number"
            min="0"
            step="0.01"
            defaultValue={priceFourGuests}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.priceFallback}</FieldLabel>
          <TextInput
            name="basePrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultBasePrice}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.defaultMealPlan}</FieldLabel>
          <select
            name="defaultMealPlan"
            defaultValue={room?.defaultMealPlan ?? "BREAKFAST"}
            className={inputClassName}
          >
            <option value="ROOM_ONLY">{copy.roomOnly}</option>
            <option value="BREAKFAST">{copy.withBreakfast}</option>
            <option value="HALF_BOARD">{copy.halfBoard}</option>
          </select>
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.breakfastPrice}</FieldLabel>
          <TextInput
            name="breakfastPricePerGuest"
            type="number"
            min="0"
            step="0.01"
            defaultValue={room ? Number(room.breakfastPricePerGuest) : 0}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.halfBoardPrice}</FieldLabel>
          <TextInput
            name="halfBoardPricePerGuest"
            type="number"
            min="0"
            step="0.01"
            defaultValue={room ? Number(room.halfBoardPricePerGuest) : 35}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.extraBedPrice}</FieldLabel>
          <TextInput
            name="extraBedPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={room ? Number(room.extraBedPrice) : 0}
          />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>{copy.extraBedMax}</FieldLabel>
          <TextInput
            name="extraBedMax"
            type="number"
            min="0"
            defaultValue={room?.extraBedMax ?? 0}
          />
        </label>
      </div>
    </div>
  );
}

function TextFields({
  room,
  showPrimaryTitle = true,
}: {
  room?: AdminRoom;
  showPrimaryTitle?: boolean;
}) {
  return (
    <>
      <div
        className={[
          "grid grid-cols-1 gap-3",
          showPrimaryTitle ? "lg:grid-cols-3" : "lg:grid-cols-2",
        ].join(" ")}
      >
        {showPrimaryTitle ? (
          <label className={fieldClassName}>
            <FieldLabel>Titel DE</FieldLabel>
            <TextInput name="titleDe" defaultValue={room?.titleDe} />
          </label>
        ) : null}
        <label className={fieldClassName}>
          <FieldLabel>Titel EN</FieldLabel>
          <TextInput name="titleEn" defaultValue={room?.titleEn} />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>Titel RU</FieldLabel>
          <TextInput name="titleRu" defaultValue={room?.titleRu} />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <label className={fieldClassName}>
          <FieldLabel>Kurztext DE</FieldLabel>
          <TextArea name="shortDescriptionDe" defaultValue={room?.shortDescriptionDe} />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>Kurztext EN</FieldLabel>
          <TextArea name="shortDescriptionEn" defaultValue={room?.shortDescriptionEn} />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>Kurztext RU</FieldLabel>
          <TextArea name="shortDescriptionRu" defaultValue={room?.shortDescriptionRu} />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <label className={fieldClassName}>
          <FieldLabel>Beschreibung DE</FieldLabel>
          <TextArea name="descriptionDe" defaultValue={room?.descriptionDe} rows={4} />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>Beschreibung EN</FieldLabel>
          <TextArea name="descriptionEn" defaultValue={room?.descriptionEn} rows={4} />
        </label>
        <label className={fieldClassName}>
          <FieldLabel>Beschreibung RU</FieldLabel>
          <TextArea name="descriptionRu" defaultValue={room?.descriptionRu} rows={4} />
        </label>
      </div>
    </>
  );
}

function RecommendationFields({
  copy,
  room,
}: {
  copy: ReturnType<typeof getCopy>;
  room?: AdminRoom;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <label className={fieldClassName}>
        <FieldLabel>{copy.recommendationDe}</FieldLabel>
        <TextArea name="recommendationDe" defaultValue={room?.recommendationDe} rows={3} />
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.recommendationEn}</FieldLabel>
        <TextArea name="recommendationEn" defaultValue={room?.recommendationEn} rows={3} />
      </label>
      <label className={fieldClassName}>
        <FieldLabel>{copy.recommendationRu}</FieldLabel>
        <TextArea name="recommendationRu" defaultValue={room?.recommendationRu} rows={3} />
      </label>
    </div>
  );
}

function StatusToggles({
  copy,
  defaultIsActive = true,
}: {
  copy: ReturnType<typeof getCopy>;
  defaultIsActive?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#dfd2c0] bg-white px-3 text-sm font-light text-[#4f483f]">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={defaultIsActive}
          className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
        />
        {copy.active}
      </label>
    </div>
  );
}

function CreateRoomForm({
  copy,
  locale,
  returnTo,
}: {
  copy: ReturnType<typeof getCopy>;
  locale: AdminLocale;
  returnTo: string;
}) {
  const defaultAmenities = [
    "Kostenloses WLAN",
    "Eigenes Bad",
    "TV",
    "Frühstück inklusive",
    "Nichtraucherzimmer",
  ];

  return (
    <details className="group/create rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl border border-[#eadfce] bg-[#faf6ef] px-4 py-3 transition-colors duration-200 hover:bg-white">
        <span className="min-w-0">
          <span className="inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
            <Plus className="h-3.5 w-3.5 stroke-[1.8]" />
            {copy.addRoom}
          </span>
          <span className="mt-1 block text-sm font-light leading-relaxed text-[#6c6459]">
            {copy.addRoomHint}
          </span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dfd2c0] bg-white text-[#8f836f] transition-transform duration-300 group-open/create:rotate-45">
          <Plus className="h-4 w-4 stroke-[1.8]" />
        </span>
      </summary>

      <form action={createRoomAction} className="mt-4">
        <input type="hidden" name="returnTo" value={returnTo} />
        <AdminPendingFieldset className="space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <label className={fieldClassName}>
              <FieldLabel>Titel DE</FieldLabel>
              <TextInput name="titleDe" placeholder="Doppelzimmer 101" />
            </label>
            <label className={fieldClassName}>
              <FieldLabel>{copy.slug}</FieldLabel>
              <TextInput name="slug" placeholder="zimmer-101" />
            </label>
          </div>
          <CoreFields copy={copy} />
          <PricingFields copy={copy} />
          <StatusToggles copy={copy} />
          <details className="rounded-2xl border border-[#dfd2c0] bg-[#fcfaf6] p-3">
            <summary className="cursor-pointer list-none text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8f836f]">
              {copy.advanced}
            </summary>
            <div className="mt-4 space-y-4">
              <TextFields showPrimaryTitle={false} />
              <RecommendationFields copy={copy} />
              <GalleryFields copy={copy} images={[]} />
              <AmenityFields amenities={defaultAmenities} copy={copy} locale={locale} />
            </div>
          </details>
          <div className="flex justify-end">
            <AdminSubmitButton pendingLabel={`${copy.addRoom}...`} className={primaryButtonClassName}>
              {copy.addRoom}
            </AdminSubmitButton>
          </div>
        </AdminPendingFieldset>
      </form>
    </details>
  );
}

export default function AdminRoomManagement({
  activeBookingCounts,
  locale,
  returnTo,
  rooms,
}: AdminRoomManagementProps) {
  const t = getAdminDictionary(locale);
  const copy = getCopy(locale);

  return (
    <section className="mt-5 space-y-4">
      <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[58rem]">
            <div className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {t.dashboard.sections.roomsBadge}
            </div>
            <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.65rem,5vw,2.1rem)] leading-none text-[#1f1b17]">
              {t.dashboard.sections.roomsTitle}
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#5d564c]">
              {t.dashboard.sections.roomsDescription}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[24rem]">
            <div className="rounded-xl border border-[#eadfce] bg-[#faf6ef] px-3 py-2">
              <div className="font-[var(--font-display)] text-2xl leading-none text-[#201b17]">
                {rooms.length}
              </div>
              <div className="mt-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
                {copy.rooms}
              </div>
            </div>
            <div className="rounded-xl border border-[#eadfce] bg-[#faf6ef] px-3 py-2">
              <div className="font-[var(--font-display)] text-2xl leading-none text-[#201b17]">
                {rooms.reduce((sum, room) => sum + room.inventory, 0)}
              </div>
              <div className="mt-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
                {copy.inventory}
              </div>
            </div>
            <div className="rounded-xl border border-[#eadfce] bg-[#faf6ef] px-3 py-2">
              <div className="font-[var(--font-display)] text-2xl leading-none text-[#201b17]">
                {rooms.filter((room) => room.isActive).length}
              </div>
              <div className="mt-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
                {copy.active}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateRoomForm copy={copy} locale={locale} returnTo={returnTo} />

      <div className="grid grid-cols-1 gap-4">
        {rooms.map((room) => {
          const images = getRoomImages(room);
          const amenities = getRoomAmenities(room);
          const activeBookingCount = activeBookingCounts[room.id] ?? 0;

          return (
            <form
              key={room.id}
              action={updateRoomAction}
              className="overflow-hidden rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] transition-all duration-300 hover:border-[#d0bea6] hover:shadow-[0_20px_44px_rgba(37,28,20,0.085)] sm:p-4"
            >
              <input type="hidden" name="id" value={room.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <AdminPendingFieldset>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="relative aspect-[16/10] min-h-[12rem] overflow-hidden rounded-2xl bg-[#2b241c] sm:aspect-[16/9] xl:aspect-[4/3] xl:min-h-0">
                    {images[0] ? (
                      <Image
                        src={images[0]}
                        alt={room.titleDe}
                        fill
                        sizes="(max-width: 1280px) 100vw, 220px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#f5efe4] text-[#9e927f]">
                        <ImageIcon className="h-7 w-7 stroke-[1.6]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.54))]" />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                      <div className="flex flex-wrap gap-2">
                        {room.roomNumber ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/16 px-2.5 py-1 text-[0.62rem] backdrop-blur">
                            <Hash className="h-3 w-3" />
                            {room.roomNumber}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/16 px-2.5 py-1 text-[0.62rem] backdrop-blur">
                          <ImageIcon className="h-3 w-3" />
                          {images.length}/{MAX_ROOM_IMAGES}
                        </span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 break-words font-[var(--font-display)] text-[1.45rem] leading-[0.95] sm:text-[1.65rem] xl:text-[1.45rem]">
                        {room.titleDe}
                      </h3>
                      {room.recommendationDe ? (
                        <p className="mt-1.5 line-clamp-1 text-xs font-light leading-relaxed text-white/78">
                          {room.recommendationDe}
                        </p>
                      ) : null}
                    </div>
                  </div>

                    <div className="min-w-0 space-y-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#eadfce] bg-[#faf6ef] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#8f836f]">
                            <DoorOpen className="h-3.5 w-3.5 stroke-[1.8]" />
                            {room.slug}
                          </span>
                          {!room.isActive ? (
                            <span className="rounded-lg border border-[#f1c7bb] bg-[#fff1ed] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#a14f43]">
                              {copy.inactive}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e1d8c8] bg-white px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#8f836f]">
                            <Check className="h-3.5 w-3.5 stroke-[1.8]" />
                            {room.defaultMealPlan === "ROOM_ONLY"
                              ? copy.roomOnly
                              : room.defaultMealPlan === "HALF_BOARD"
                                ? copy.halfBoard
                                : copy.withBreakfast}
                          </span>
                          <span className="rounded-lg border border-[#e1d8c8] bg-[#f5efe4] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#8f836f]">
                            {t.dashboard.sections.roomsBookingCount(activeBookingCount)}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#5d564c] sm:flex sm:flex-wrap">
                          <span className="inline-flex items-center gap-1.5">
                            <BedDouble className="h-4 w-4 text-[#b4884c]" />
                            {formatRoomType(room.type, copy)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-[#b4884c]" />
                            {room.maxGuests}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Layers3 className="h-4 w-4 text-[#b4884c]" />
                            {room.inventory}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-[#b4884c]" />
                            {formatCurrency(getDisplayRoomPrice(room), locale)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                        <AdminSubmitButton pendingLabel={`${copy.save}...`} className={primaryButtonClassName}>
                          {copy.save}
                        </AdminSubmitButton>
                        <AdminConfirmButton
                          formAction={deleteRoomAction}
                          confirmMessage={t.dashboard.controls.confirmDelete}
                          pendingLabel={`${copy.deleteRoom}...`}
                          className={dangerButtonClassName}
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.8]" />
                          {copy.deleteRoom}
                        </AdminConfirmButton>
                      </div>
                    </div>

                    <CoreFields copy={copy} room={room} />
                    <StatusToggles
                      copy={copy}
                      defaultIsActive={room.isActive}
                    />
                  </div>
                  </div>

                  <PricingFields copy={copy} room={room} />

                  <details className="group/details rounded-2xl border border-[#dfd2c0] bg-[#fcfaf6] p-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8f836f]">
                      {copy.advanced}
                      <span className="rounded-lg border border-[#dfd2c0] bg-white px-3 py-1 text-[0.56rem] text-[#9e927f]">
                        {images.length}/{MAX_ROOM_IMAGES}
                      </span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <TextFields room={room} />
                      <RecommendationFields copy={copy} room={room} />
                      <GalleryFields copy={copy} images={images} />
                      <AmenityFields amenities={amenities} copy={copy} locale={locale} />
                    </div>
                  </details>
                </div>
              </AdminPendingFieldset>
            </form>
          );
        })}
      </div>
    </section>
  );
}
