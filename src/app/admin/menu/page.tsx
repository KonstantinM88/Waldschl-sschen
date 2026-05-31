import {
  ChevronDown,
  Image as ImageIcon,
  Layers3,
  Tags,
  UtensilsCrossed,
} from "lucide-react";
import {
  createMenuCategoryAction,
  createMenuItemAction,
  deleteMenuCategoryAction,
  deleteMenuItemAction,
  updateMenuCategoryAction,
  updateMenuItemAction,
} from "@/app/admin/menu-actions";
import AdminConfirmButton from "@/components/admin/AdminConfirmButton";
import MenuImageUploadPreview from "@/components/admin/MenuImageUploadPreview";
import MenuVideoUploadField from "@/components/admin/MenuVideoUploadField";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminEmptyState,
  AdminFilterBar,
  AdminField,
  AdminMetricCard,
  AdminPanel,
  AdminSelectField,
} from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  getAdminFeedbackFromSearchParams,
} from "@/lib/admin-feedback";
import {
  formatAdminCurrency,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import { getAdminRestaurantMenu } from "@/lib/restaurant-menu";

export const dynamic = "force-dynamic";

const inputClassName = "w-full bg-transparent text-sm text-[#201b17] outline-none";
const actionButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-center text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)] sm:w-auto";
const subtleButtonClassName =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-center text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17] sm:w-auto";
const dangerButtonClassName =
  "inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#ead5d1] bg-[#fff7f5] px-4 text-center text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9b4a3c] transition-all duration-300 hover:border-[#d8aaa1] hover:text-[#6f2e25] sm:w-auto";
const detailsSummaryClassName =
  "flex cursor-pointer list-none items-center justify-between gap-3 rounded-[1.15rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-3 transition-all duration-300 hover:border-[#d8c8b2] hover:bg-white [&::-webkit-details-marker]:hidden";

type MenuVisibilityFilter = "all" | "draft" | "published";
type MenuImageFilter = "all" | "missing" | "with";
type MenuFlagFilter = "all" | "signature" | "vegetarian";

const menuImageGuidelines = {
  de:
    "Empfehlung: 1600 x 1200 px im 4:3-Format, mindestens 1200 x 900 px. Maximale Upload-Größe: 8 MB. JPEG, PNG, WebP, AVIF und GIF werden automatisch auf max. 1600 x 1200 px verkleinert und als WebP gespeichert.",
  ru:
    "Рекомендация: 1600 x 1200 px в формате 4:3, минимум 1200 x 900 px. Максимальный размер загрузки: 8 MB. JPEG, PNG, WebP, AVIF и GIF автоматически уменьшаются до max. 1600 x 1200 px и сохраняются как WebP.",
} as const;

const menuVideoGuidelines = {
  de:
    "Empfehlung: MP4, WebM oder MOV, 6-12 Sekunden, 1080 x 1350 px oder 1920 x 1080 px. Maximale Upload-Größe: 40 MB. Das Video wird beim Speichern als WebM konvertiert.",
  ru:
    "Рекомендация: MP4, WebM или MOV, 6-12 секунд, 1080 x 1350 px или 1920 x 1080 px. Максимальный размер загрузки: 40 MB. Видео при сохранении конвертируется в WebM.",
} as const;

const menuVideoCopy = {
  de: {
    current: "Aktuelles Video",
    file: "Video hochladen",
    maxFileSize: "Video ist groesser als 40 MB",
    newPreview: "Video-Vorschau",
    url: "Video-URL",
  },
  ru: {
    current: "Текущее видео",
    file: "Загрузить видео",
    maxFileSize: "Видео больше 40 MB",
    newPreview: "Предпросмотр видео",
    url: "URL видео",
  },
} as const;

const menuFilterCopy = {
  de: {
    categoryAll: "Alle Kategorien",
    categoryLabel: "Kategorie",
    draft: "Nur Entwürfe",
    imageAll: "Alle Bilder",
    imageLabel: "Bildstatus",
    imageMissing: "Ohne Bild",
    imageWith: "Mit Bild",
    itemCount: (count: number) => `${count} ${count === 1 ? "Gericht" : "Gerichte"}`,
    maxFileSize: "Datei ist größer als 8 MB",
    maxVideoFileSize: "Video ist groesser als 40 MB",
    flagAll: "Alle Typen",
    flagLabel: "Typ",
    flagSignature: "Empfehlungen",
    flagVegetarian: "Vegetarisch",
    previewCurrent: "Aktuelles Bild",
    previewNew: "Neue Vorschau",
    published: "Nur sichtbare",
    videoCurrent: "Aktuelles Video",
    videoFile: "Video hochladen",
    videoNew: "Video-Vorschau",
    videoUrl: "Video-URL",
    searchLabel: "Suche",
    searchPlaceholder: "Gericht, Kategorie, Beschreibung oder Allergene",
    statusAll: "Alle Status",
    statusLabel: "Sichtbarkeit",
  },
  ru: {
    categoryAll: "Все категории",
    categoryLabel: "Категория",
    draft: "Только черновики",
    imageAll: "Все изображения",
    imageLabel: "Изображение",
    imageMissing: "Без изображения",
    imageWith: "С изображением",
    itemCount: (count: number) => `${count} ${count === 1 ? "блюдо" : "блюд"}`,
    maxFileSize: "Файл больше 8 MB",
    flagAll: "Все типы",
    flagLabel: "Тип",
    flagSignature: "Рекомендации",
    flagVegetarian: "Вегетарианское",
    previewCurrent: "Текущее изображение",
    previewNew: "Новый предпросмотр",
    published: "Только опубликованные",
    searchLabel: "Поиск",
    searchPlaceholder: "Блюдо, категория, описание или аллергены",
    statusAll: "Все статусы",
    statusLabel: "Публикация",
  },
} as const;

function normalizeVisibilityFilter(value?: string | null): MenuVisibilityFilter {
  return value === "draft" || value === "published" ? value : "all";
}

function normalizeImageFilter(value?: string | null): MenuImageFilter {
  return value === "missing" || value === "with" ? value : "all";
}

function normalizeFlagFilter(value?: string | null): MenuFlagFilter {
  return value === "signature" || value === "vegetarian" ? value : "all";
}

function normalizeCategoryFilter(
  value: string | undefined,
  categories: Awaited<ReturnType<typeof getAdminRestaurantMenu>>
) {
  return value && categories.some((category) => category.id === value)
    ? value
    : "all";
}

function buildMenuHref(
  path: string,
  filters: {
    categoryId: string;
    flag: MenuFlagFilter;
    image: MenuImageFilter;
    query: string;
    visibility: MenuVisibilityFilter;
  }
) {
  const searchParams = new URLSearchParams();

  if (filters.query) {
    searchParams.set("q", filters.query);
  }

  if (filters.categoryId !== "all") {
    searchParams.set("category", filters.categoryId);
  }

  if (filters.visibility !== "all") {
    searchParams.set("visibility", filters.visibility);
  }

  if (filters.image !== "all") {
    searchParams.set("image", filters.image);
  }

  if (filters.flag !== "all") {
    searchParams.set("flag", filters.flag);
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

function normalizeSearchValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function includesSearch(value: string | null | undefined, query: string) {
  return Boolean(value?.toLowerCase().includes(query));
}

function BooleanField({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="inline-flex min-h-12 w-full min-w-0 items-center gap-3 rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3 text-sm font-light text-[#4f483f]">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 shrink-0 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
      />
      <span className="min-w-0 break-words">{label}</span>
    </label>
  );
}

function formatPriceVariantsForTextarea(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const entry = item as { label?: unknown; price?: unknown };
      const label = typeof entry.label === "string" ? entry.label : "";
      const price = Number(entry.price);

      if (!label || !Number.isFinite(price)) {
        return "";
      }

      return `${label} | ${String(price).replace(".", ",")}`;
    })
    .filter(Boolean)
    .join("\n");
}

function CategorySelect({
  categories,
  defaultValue,
  label,
}: {
  categories: Awaited<ReturnType<typeof getAdminRestaurantMenu>>;
  defaultValue?: string;
  label: string;
}) {
  return (
    <AdminField label={label}>
      <select
        name="categoryId"
        defaultValue={defaultValue}
        required
        className={inputClassName}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.titleDe}
          </option>
        ))}
      </select>
    </AdminField>
  );
}

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const currentPath = "/admin/menu";

  const [{ locale, session, t }, summary, categories] = await Promise.all([
    getAdminPageContext(currentPath),
    getAdminSummary(),
    getAdminRestaurantMenu(),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );
  const menuText = t.dashboard.pages.menu;
  const filterText = menuFilterCopy[locale];
  const rawQuery = getAdminSearchParam(params, "q")?.trim() ?? "";
  const query = normalizeSearchValue(rawQuery);
  const categoryFilter = normalizeCategoryFilter(
    getAdminSearchParam(params, "category"),
    categories
  );
  const visibilityFilter = normalizeVisibilityFilter(
    getAdminSearchParam(params, "visibility")
  );
  const imageFilter = normalizeImageFilter(getAdminSearchParam(params, "image"));
  const flagFilter = normalizeFlagFilter(getAdminSearchParam(params, "flag"));
  const returnTo = buildMenuHref(currentPath, {
    categoryId: categoryFilter,
    flag: flagFilter,
    image: imageFilter,
    query: rawQuery,
    visibility: visibilityFilter,
  });
  const hasItemFilter =
    visibilityFilter !== "all" || imageFilter !== "all" || flagFilter !== "all";
  const filteredCategories = categories
    .filter((category) => categoryFilter === "all" || category.id === categoryFilter)
    .map((category) => {
      const categoryMatchesQuery =
        query.length === 0 ||
        includesSearch(category.titleDe, query) ||
        includesSearch(category.titleEn, query) ||
        includesSearch(category.descriptionDe, query) ||
        includesSearch(category.descriptionEn, query) ||
        includesSearch(category.slug, query);

      const items = category.items.filter((item) => {
        const matchesVisibility =
          visibilityFilter === "all" ||
          (visibilityFilter === "published" && item.isPublished) ||
          (visibilityFilter === "draft" && !item.isPublished);
        const matchesImage =
          imageFilter === "all" ||
          (imageFilter === "with" && Boolean(item.imageUrl)) ||
          (imageFilter === "missing" && !item.imageUrl);
        const matchesFlag =
          flagFilter === "all" ||
          (flagFilter === "signature" && item.isSignature) ||
          (flagFilter === "vegetarian" && item.isVegetarian);
        const itemMatchesQuery =
          query.length === 0 ||
          categoryMatchesQuery ||
          includesSearch(item.nameDe, query) ||
          includesSearch(item.nameEn, query) ||
          includesSearch(item.descriptionDe, query) ||
          includesSearch(item.descriptionEn, query) ||
          includesSearch(item.allergens, query) ||
          includesSearch(item.slug, query);

        return matchesVisibility && matchesImage && matchesFlag && itemMatchesQuery;
      });

      return {
        ...category,
        items:
          categoryMatchesQuery && query.length > 0 && !hasItemFilter
            ? category.items
            : items,
        matchesFilter:
          (query.length === 0 && !hasItemFilter) ||
          (query.length > 0 && categoryMatchesQuery && !hasItemFilter) ||
          items.length > 0 ||
          (categoryFilter !== "all" && category.id === categoryFilter),
      };
    })
    .filter((category) => category.matchesFilter);
  const filteredItemCount = filteredCategories.reduce(
    (count, category) => count + category.items.length,
    0
  );
  const imageGuidelineText = menuImageGuidelines[locale];
  const videoGuidelineText = menuVideoGuidelines[locale];
  const videoText = menuVideoCopy[locale];
  const expandFilteredCategories =
    query.length > 0 || categoryFilter !== "all" || hasItemFilter;

  return (
    <AdminShell
      badge={menuText.badge}
      currentPath={currentPath}
      description={menuText.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={menuText.title}
    >
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <AdminMetricCard
          detail={menuText.stats.categories}
          Icon={Layers3}
          label={menuText.stats.categories}
          value={summary.activeMenuCategories}
        />
        <AdminMetricCard
          detail={menuText.stats.published}
          Icon={UtensilsCrossed}
          label={menuText.stats.published}
          value={summary.publishedMenuItems}
        />
        <AdminMetricCard
          detail={menuText.stats.total}
          Icon={Tags}
          label={menuText.stats.total}
          value={summary.totalMenuItems}
        />
      </section>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] 2xl:gap-5">
        <AdminPanel badge={menuText.badge} title={menuText.form.categoryTitle}>
          <details className="group/create-category rounded-[1.35rem] border border-[#eadfcf] bg-[#fcfaf6] p-3 sm:p-4">
            <summary className={detailsSummaryClassName}>
              <span className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#8f836f]">
                {t.dashboard.controls.create}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/create-category:rotate-180" />
            </summary>

            <form action={createMenuCategoryAction} className="mt-4 border-t border-[#eee5d9] pt-4">
              <input type="hidden" name="returnTo" value={returnTo} />
              <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">
                <AdminField label={menuText.fields.titleDe}>
                  <input name="titleDe" type="text" required className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.titleEn}>
                  <input name="titleEn" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.slug}>
                  <input name="slug" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.sortOrder}>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={categories.length + 1}
                    className={inputClassName}
                  />
                </AdminField>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">
                <AdminField label={menuText.fields.descriptionDe}>
                  <textarea
                    name="descriptionDe"
                    rows={4}
                    className={`${inputClassName} resize-y`}
                  />
                </AdminField>
                <AdminField label={menuText.fields.descriptionEn}>
                  <textarea
                    name="descriptionEn"
                    rows={4}
                    className={`${inputClassName} resize-y`}
                  />
                </AdminField>
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5d9] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <BooleanField label={menuText.form.active} name="isActive" defaultChecked />
                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.create}...`}
                  className={actionButtonClassName}
                >
                  {t.dashboard.controls.create}
                </AdminSubmitButton>
              </div>
              </AdminPendingFieldset>
            </form>
          </details>
        </AdminPanel>

        <AdminPanel badge={menuText.badge} title={menuText.form.itemTitle}>
          <details className="group/create-item rounded-[1.35rem] border border-[#eadfcf] bg-[#fcfaf6] p-3 sm:p-4">
            <summary className={detailsSummaryClassName}>
              <span className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#8f836f]">
                {t.dashboard.controls.create}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/create-item:rotate-180" />
            </summary>

            <form action={createMenuItemAction} className="mt-4 border-t border-[#eee5d9] pt-4">
              <input type="hidden" name="returnTo" value={returnTo} />
              <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 sm:gap-4">
                <CategorySelect
                  categories={categories}
                  label={menuText.fields.category}
                />
                <AdminField label={menuText.fields.nameDe}>
                  <input name="nameDe" type="text" required className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.nameEn}>
                  <input name="nameEn" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.price}>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={inputClassName}
                  />
                </AdminField>
                <AdminField label={menuText.fields.slug}>
                  <input name="slug" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.sortOrder}>
                  <input name="sortOrder" type="number" defaultValue={1} className={inputClassName} />
                </AdminField>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
                <AdminField label={menuText.fields.descriptionDe}>
                  <textarea
                    name="descriptionDe"
                    rows={4}
                    className={`${inputClassName} resize-y`}
                  />
                </AdminField>
                <AdminField label={menuText.fields.descriptionEn}>
                  <textarea
                    name="descriptionEn"
                    rows={4}
                    className={`${inputClassName} resize-y`}
                  />
                </AdminField>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3 sm:gap-4">
                <AdminField label={menuText.fields.priceVariants}>
                  <textarea
                    name="priceVariants"
                    rows={3}
                    placeholder="0,2l | 7,50"
                    className={`${inputClassName} resize-y`}
                  />
                </AdminField>
                <AdminField label={menuText.fields.priceNoteDe}>
                  <input name="priceNoteDe" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.priceNoteEn}>
                  <input name="priceNoteEn" type="text" className={inputClassName} />
                </AdminField>
              </div>

              <p className="mt-3 text-xs font-light leading-relaxed text-[#7a7165]">
                {menuText.form.priceVariantsHint}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[270px_270px_minmax(0,1fr)] sm:gap-4">
                <MenuImageUploadPreview
                  alt={menuText.form.itemTitle}
                  emptyLabel={filterText.previewNew}
                  fileLabel={menuText.fields.imageFile}
                  helpText={imageGuidelineText}
                  maxFileSizeText={filterText.maxFileSize}
                />
                <MenuVideoUploadField
                  emptyLabel={videoText.newPreview}
                  fileLabel={videoText.file}
                  helpText={videoGuidelineText}
                  maxFileSizeText={videoText.maxFileSize}
                />
                <div className="grid content-start grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
                  <AdminField label={menuText.fields.imageUrl}>
                    <input name="imageUrl" type="text" className={inputClassName} />
                  </AdminField>
                  <AdminField label={videoText.url}>
                    <input name="videoUrl" type="text" className={inputClassName} />
                  </AdminField>
                  <AdminField label={menuText.fields.allergens}>
                    <input name="allergens" type="text" className={inputClassName} />
                  </AdminField>
                  <div className="rounded-[1.2rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-3 text-xs font-light leading-relaxed text-[#7a7165] lg:col-span-2">
                    {menuText.form.uploadHint}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5d9] pt-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <BooleanField label={menuText.form.published} name="isPublished" defaultChecked />
                  <BooleanField label={menuText.form.signature} name="isSignature" />
                  <BooleanField label={menuText.form.vegetarian} name="isVegetarian" />
                </div>
                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.create}...`}
                  className={actionButtonClassName}
                >
                  {t.dashboard.controls.create}
                </AdminSubmitButton>
              </div>
              </AdminPendingFieldset>
            </form>
          </details>
        </AdminPanel>
      </div>

      <AdminPanel
        badge={menuText.badge}
        description={`${menuText.description} ${filterText.itemCount(filteredItemCount)}.`}
        title={menuText.title}
      >
        <AdminFilterBar
          resetHref={currentPath}
          resetLabel={t.dashboard.controls.reset}
          searchLabel={filterText.searchLabel}
          searchPlaceholder={filterText.searchPlaceholder}
          searchValue={rawQuery}
          submitLabel={t.dashboard.controls.apply}
        >
          <AdminSelectField
            label={filterText.categoryLabel}
            name="category"
            value={categoryFilter}
            options={[
              { label: filterText.categoryAll, value: "all" },
              ...categories.map((category) => ({
                label: category.titleDe,
                value: category.id,
              })),
            ]}
          />
          <AdminSelectField
            label={filterText.statusLabel}
            name="visibility"
            value={visibilityFilter}
            options={[
              { label: filterText.statusAll, value: "all" },
              { label: filterText.published, value: "published" },
              { label: filterText.draft, value: "draft" },
            ]}
          />
          <AdminSelectField
            label={filterText.imageLabel}
            name="image"
            value={imageFilter}
            options={[
              { label: filterText.imageAll, value: "all" },
              { label: filterText.imageWith, value: "with" },
              { label: filterText.imageMissing, value: "missing" },
            ]}
          />
          <AdminSelectField
            label={filterText.flagLabel}
            name="flag"
            value={flagFilter}
            options={[
              { label: filterText.flagAll, value: "all" },
              { label: filterText.flagSignature, value: "signature" },
              { label: filterText.flagVegetarian, value: "vegetarian" },
            ]}
          />
        </AdminFilterBar>

        {filteredCategories.length ? (
          <div className="space-y-5">
            {filteredCategories.map((category) => (
              <details
                key={category.id}
                open={expandFilteredCategories}
                className="group/category rounded-[1.35rem] border border-[#eadfcf] bg-[#fcfaf6] p-3 sm:rounded-[1.6rem] sm:p-5"
              >
                <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-[1.15rem] border border-transparent px-1 py-1 transition-all duration-300 hover:border-[#eadfcf] hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-3 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <h3 className="break-words font-[var(--font-display)] text-[1.55rem] leading-none text-[#201b17]">
                      {category.titleDe}
                    </h3>
                    <p className="mt-1 text-xs font-light uppercase tracking-[0.14em] text-[#9e927f]">
                      {filterText.itemCount(category.items.length)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-full border border-[#eadfcf] bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                      {category.isActive ? menuText.form.active : "-"}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/category:rotate-180" />
                  </div>
                </summary>

                <div className="mt-4 border-t border-[#eee5d9] pt-4">
                  <details className="group/category-editor rounded-[1.25rem] border border-[#eadfcf] bg-white p-3 sm:p-4">
                    <summary className={detailsSummaryClassName}>
                      <span className="min-w-0 break-words text-sm font-medium text-[#4f483f]">
                        {menuText.form.editCategory}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/category-editor:rotate-180" />
                    </summary>

                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#eee5d9] pt-4 2xl:grid-cols-[minmax(0,1fr)_auto]">
                      <form action={updateMenuCategoryAction}>
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <input type="hidden" name="id" value={category.id} />
                        <AdminPendingFieldset>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 sm:gap-4">
                        <AdminField label={menuText.fields.titleDe}>
                          <input
                            name="titleDe"
                            type="text"
                            defaultValue={category.titleDe}
                            required
                            className={inputClassName}
                          />
                        </AdminField>
                        <AdminField label={menuText.fields.titleEn}>
                          <input
                            name="titleEn"
                            type="text"
                            defaultValue={category.titleEn ?? ""}
                            className={inputClassName}
                          />
                        </AdminField>
                        <AdminField label={menuText.fields.slug}>
                          <input
                            name="slug"
                            type="text"
                            defaultValue={category.slug}
                            className={inputClassName}
                          />
                        </AdminField>
                        <AdminField label={menuText.fields.sortOrder}>
                          <input
                            name="sortOrder"
                            type="number"
                            defaultValue={category.sortOrder}
                            className={inputClassName}
                          />
                        </AdminField>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
                        <AdminField label={menuText.fields.descriptionDe}>
                          <textarea
                            name="descriptionDe"
                            rows={3}
                            defaultValue={category.descriptionDe ?? ""}
                            className={`${inputClassName} resize-y`}
                          />
                        </AdminField>
                        <AdminField label={menuText.fields.descriptionEn}>
                          <textarea
                            name="descriptionEn"
                            rows={3}
                            defaultValue={category.descriptionEn ?? ""}
                            className={`${inputClassName} resize-y`}
                          />
                        </AdminField>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5d9] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <BooleanField
                          label={menuText.form.active}
                          name="isActive"
                          defaultChecked={category.isActive}
                        />
                        <AdminSubmitButton
                          pendingLabel={`${t.dashboard.controls.save}...`}
                          className={subtleButtonClassName}
                        >
                          {t.dashboard.controls.save}
                        </AdminSubmitButton>
                      </div>
                        </AdminPendingFieldset>
                      </form>

                      <form action={deleteMenuCategoryAction} className="2xl:pt-1">
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <input type="hidden" name="id" value={category.id} />
                        <AdminConfirmButton
                          confirmMessage={t.dashboard.controls.confirmDelete}
                          pendingLabel={`${t.dashboard.controls.delete}...`}
                          className={dangerButtonClassName}
                        >
                          {t.dashboard.controls.delete}
                        </AdminConfirmButton>
                      </form>
                    </div>
                  </details>

                <div className="mt-5 space-y-3 sm:space-y-4">
                  {category.items.map((item) => (
                    <details
                      key={item.id}
                      className="group/item rounded-[1.2rem] border border-[#eee5d9] bg-white p-3 shadow-[0_12px_28px_rgba(28,21,16,0.04)] sm:rounded-[1.45rem] sm:p-4"
                    >
                      <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-[1rem] border border-transparent px-1 py-1 transition-all duration-300 hover:border-[#eadfcf] hover:bg-[#fcfaf6] sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-3 [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0">
                          <h4 className="break-words font-[var(--font-display)] text-[1.35rem] leading-none text-[#201b17]">
                            {item.nameDe}
                          </h4>
                          <p className="mt-1 truncate text-xs font-light uppercase tracking-[0.14em] text-[#9e927f]">
                            {item.slug}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#eadfcf] bg-[#faf7f1] px-3 py-1.5 text-sm text-[#5d564c]">
                            <ImageIcon className="h-4 w-4 text-[#b4884c]" />
                            {formatAdminCurrency(item.price.toString(), locale)}
                          </div>
                          {item.isPublished ? (
                            <div className="rounded-full border border-[#d9e3cd] bg-[#f4faec] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#53683c]">
                              {menuText.form.published}
                            </div>
                          ) : null}
                          {item.isSignature ? (
                            <div className="rounded-full border border-[#eadfcf] bg-white px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                              {menuText.form.signature}
                            </div>
                          ) : null}
                          {item.isVegetarian ? (
                            <div className="rounded-full border border-[#d9e3cd] bg-white px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#53683c]">
                              {menuText.form.vegetarian}
                            </div>
                          ) : null}
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/item:rotate-180" />
                        </div>
                      </summary>

                      <div className="mt-4 border-t border-[#eee5d9] pt-4">
                        <form action={updateMenuItemAction}>
                          <input type="hidden" name="returnTo" value={returnTo} />
                          <input type="hidden" name="id" value={item.id} />
                          <AdminPendingFieldset>
                          <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[260px_minmax(0,1fr)] sm:gap-4">
                            <div className="space-y-3">
                              <MenuImageUploadPreview
                                alt={item.nameDe}
                                currentImageUrl={item.imageUrl}
                                emptyLabel={filterText.previewCurrent}
                                fileLabel={menuText.fields.imageFile}
                                helpText={imageGuidelineText}
                                maxFileSizeText={filterText.maxFileSize}
                              />
                              <MenuVideoUploadField
                                currentVideoUrl={item.videoUrl}
                                emptyLabel={videoText.current}
                                fileLabel={videoText.file}
                                helpText={videoGuidelineText}
                                maxFileSizeText={videoText.maxFileSize}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 sm:gap-4">
                                <CategorySelect
                                  categories={categories}
                                  defaultValue={item.categoryId}
                                  label={menuText.fields.category}
                                />
                                <AdminField label={menuText.fields.nameDe}>
                                  <input
                                    name="nameDe"
                                    type="text"
                                    defaultValue={item.nameDe}
                                    required
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.nameEn}>
                                  <input
                                    name="nameEn"
                                    type="text"
                                    defaultValue={item.nameEn ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.price}>
                                  <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={item.price.toString()}
                                    required
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.slug}>
                                  <input
                                    name="slug"
                                    type="text"
                                    defaultValue={item.slug}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.sortOrder}>
                                  <input
                                    name="sortOrder"
                                    type="number"
                                    defaultValue={item.sortOrder}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.allergens}>
                                  <input
                                    name="allergens"
                                    type="text"
                                    defaultValue={item.allergens ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.imageUrl}>
                                  <input
                                    name="imageUrl"
                                    type="text"
                                    defaultValue={item.imageUrl ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={videoText.url}>
                                  <input
                                    name="videoUrl"
                                    type="text"
                                    defaultValue={item.videoUrl ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
                                <AdminField label={menuText.fields.descriptionDe}>
                                  <textarea
                                    name="descriptionDe"
                                    rows={3}
                                    defaultValue={item.descriptionDe ?? ""}
                                    className={`${inputClassName} resize-y`}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.descriptionEn}>
                                  <textarea
                                    name="descriptionEn"
                                    rows={3}
                                    defaultValue={item.descriptionEn ?? ""}
                                    className={`${inputClassName} resize-y`}
                                  />
                                </AdminField>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3 sm:gap-4">
                                <AdminField label={menuText.fields.priceVariants}>
                                  <textarea
                                    name="priceVariants"
                                    rows={3}
                                    defaultValue={formatPriceVariantsForTextarea(
                                      item.priceVariants
                                    )}
                                    placeholder="0,2l | 7,50"
                                    className={`${inputClassName} resize-y`}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.priceNoteDe}>
                                  <input
                                    name="priceNoteDe"
                                    type="text"
                                    defaultValue={item.priceNoteDe ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                                <AdminField label={menuText.fields.priceNoteEn}>
                                  <input
                                    name="priceNoteEn"
                                    type="text"
                                    defaultValue={item.priceNoteEn ?? ""}
                                    className={inputClassName}
                                  />
                                </AdminField>
                              </div>

                              <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5d9] pt-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                  <BooleanField
                                    label={menuText.form.published}
                                    name="isPublished"
                                    defaultChecked={item.isPublished}
                                  />
                                  <BooleanField
                                    label={menuText.form.signature}
                                    name="isSignature"
                                    defaultChecked={item.isSignature}
                                  />
                                  <BooleanField
                                    label={menuText.form.vegetarian}
                                    name="isVegetarian"
                                    defaultChecked={item.isVegetarian}
                                  />
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                  <div className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-[#eadfcf] bg-[#faf7f1] px-4 py-2.5 text-sm text-[#5d564c] sm:w-auto">
                                    <ImageIcon className="h-4 w-4 text-[#b4884c]" />
                                    {formatAdminCurrency(item.price.toString(), locale)}
                                  </div>
                                  <AdminSubmitButton
                                    pendingLabel={`${t.dashboard.controls.save}...`}
                                    className={subtleButtonClassName}
                                  >
                                    {t.dashboard.controls.save}
                                  </AdminSubmitButton>
                                </div>
                              </div>
                            </div>
                          </div>
                          </AdminPendingFieldset>
                        </form>

                        <form action={deleteMenuItemAction} className="mt-4 flex justify-end">
                          <input type="hidden" name="returnTo" value={returnTo} />
                          <input type="hidden" name="id" value={item.id} />
                          <AdminConfirmButton
                            confirmMessage={t.dashboard.controls.confirmDelete}
                            pendingLabel={`${t.dashboard.controls.delete}...`}
                            className={dangerButtonClassName}
                          >
                            {t.dashboard.controls.delete}
                          </AdminConfirmButton>
                        </form>
                      </div>
                    </details>
                  ))}
                </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState>{menuText.description}</AdminEmptyState>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
