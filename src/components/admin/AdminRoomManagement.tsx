import { ImageIcon, Layers3, Users } from "lucide-react";
import { updateRoomAction } from "@/app/admin/room-actions";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

interface AdminRoom {
  id: string;
  type: string;
  inventory: number;
  maxGuests: number;
  basePrice: number | string | { toString(): string };
  isActive: boolean;
  titleDe: string;
  titleEn: string;
  titleRu: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionRu: string;
  shortDescriptionDe: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionRu: string | null;
  imageUrl: string | null;
  amenities: unknown;
}

interface AdminRoomManagementProps {
  activeBookingCounts: Record<string, number>;
  locale: AdminLocale;
  rooms: AdminRoom[];
}

function amenitiesToTextarea(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.filter((item): item is string => typeof item === "string").join("\n");
}

function formatCurrency(value: AdminRoom["basePrice"], locale: AdminLocale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export default function AdminRoomManagement({
  activeBookingCounts,
  locale,
  rooms,
}: AdminRoomManagementProps) {
  const t = getAdminDictionary(locale);

  return (
    <section className="mt-5 rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
      <div className="max-w-[58rem]">
        <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
          {t.dashboard.sections.roomsBadge}
        </div>
        <h2 className="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
          {t.dashboard.sections.roomsTitle}
        </h2>
        <p className="mt-4 text-sm font-light leading-relaxed text-[#5d564c]">
          {t.dashboard.sections.roomsDescription}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5">
        {rooms.map((room) => (
          <form
            key={room.id}
            action={updateRoomAction}
            className="rounded-[1.7rem] border border-[#ece2d3] bg-[#fcfaf6] p-4 shadow-[0_10px_24px_rgba(28,21,16,0.04)] sm:p-5"
          >
            <input type="hidden" name="id" value={room.id} />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#eadfcf] bg-white px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                    {room.type}
                  </span>
                  {!room.isActive ? (
                    <span className="rounded-full border border-[#f1c7bb] bg-[#fff1ed] px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#a14f43]">
                      {t.dashboard.sections.roomsInactive}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[#e1d8c8] bg-[#f5efe4] px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                    {t.dashboard.sections.roomsBookingCount(activeBookingCounts[room.id] ?? 0)}
                  </span>
                  <span className="rounded-full border border-[#e1d8c8] bg-white px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                    {t.dashboard.sections.roomsBreakfastIncluded}
                  </span>
                </div>
                <h3 className="mt-3 font-[var(--font-display)] text-[1.85rem] leading-none text-[#201b17]">
                  {room.titleDe}
                </h3>
                <p className="mt-2 text-sm font-light text-[#5d564c]">
                  {formatCurrency(room.basePrice, locale)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-4 py-3">
                  <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                    {t.dashboard.sections.roomsForm.price}
                  </span>
                  <input
                    name="basePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={Number(room.basePrice)}
                    className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </label>
                <label className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                    <Layers3 className="h-3.5 w-3.5 stroke-[1.8]" />
                    {t.dashboard.sections.roomsForm.inventory}
                  </span>
                  <input
                    name="inventory"
                    type="number"
                    min="0"
                    defaultValue={room.inventory}
                    className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </label>
                <label className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                    <Users className="h-3.5 w-3.5 stroke-[1.8]" />
                    {t.dashboard.sections.roomsForm.maxGuests}
                  </span>
                  <input
                    name="maxGuests"
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={room.maxGuests}
                    className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.titleDe}
                </span>
                <input
                  name="titleDe"
                  type="text"
                  defaultValue={room.titleDe}
                  className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.titleEn}
                </span>
                <input
                  name="titleEn"
                  type="text"
                  defaultValue={room.titleEn}
                  className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.titleRu}
                </span>
                <input
                  name="titleRu"
                  type="text"
                  defaultValue={room.titleRu}
                  className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.shortDe}
                </span>
                <textarea
                  name="shortDescriptionDe"
                  defaultValue={room.shortDescriptionDe ?? ""}
                  rows={3}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.shortEn}
                </span>
                <textarea
                  name="shortDescriptionEn"
                  defaultValue={room.shortDescriptionEn ?? ""}
                  rows={3}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.shortRu}
                </span>
                <textarea
                  name="shortDescriptionRu"
                  defaultValue={room.shortDescriptionRu ?? ""}
                  rows={3}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.descriptionDe}
                </span>
                <textarea
                  name="descriptionDe"
                  defaultValue={room.descriptionDe}
                  rows={6}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.descriptionEn}
                </span>
                <textarea
                  name="descriptionEn"
                  defaultValue={room.descriptionEn}
                  rows={6}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.descriptionRu}
                </span>
                <textarea
                  name="descriptionRu"
                  defaultValue={room.descriptionRu}
                  rows={6}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="inline-flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  <ImageIcon className="h-3.5 w-3.5 stroke-[1.8]" />
                  {t.dashboard.sections.roomsForm.imageUrl}
                </span>
                <input
                  name="imageUrl"
                  type="text"
                  defaultValue={room.imageUrl ?? ""}
                  className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>

              <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
                <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.sections.roomsForm.amenities}
                </span>
                <textarea
                  name="amenities"
                  defaultValue={amenitiesToTextarea(room.amenities)}
                  rows={5}
                  className="mt-2 w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-sm font-light text-[#4f483f]">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={room.isActive}
                  className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                />
                {t.dashboard.sections.roomsForm.isActive}
              </label>

              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
              >
                {t.dashboard.sections.roomsSubmit}
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
