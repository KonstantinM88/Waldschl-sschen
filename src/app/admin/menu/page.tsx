import Image from "next/image";
import {
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
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminEmptyState,
  AdminField,
  AdminMetricCard,
  AdminPanel,
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
  "inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]";
const subtleButtonClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]";
const dangerButtonClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-[#ead5d1] bg-[#fff7f5] px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9b4a3c] transition-all duration-300 hover:border-[#d8aaa1] hover:text-[#6f2e25]";

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
    <label className="inline-flex min-h-12 items-center gap-3 rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3 text-sm font-light text-[#4f483f]">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
      />
      {label}
    </label>
  );
}

function MenuImagePreview({
  alt,
  src,
}: {
  alt: string;
  src: string | null;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-[#eadfcf] bg-[#f3ede2]">
      <Image
        src={src || "/restaurant-menu/default.webp"}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 260px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(18,12,8,0.42)_100%)]" />
    </div>
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
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <AdminPanel badge={menuText.badge} title={menuText.form.categoryTitle}>
          <form action={createMenuCategoryAction}>
            <input type="hidden" name="returnTo" value={currentPath} />
            <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 sm:flex-row sm:items-center sm:justify-between">
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
        </AdminPanel>

        <AdminPanel badge={menuText.badge} title={menuText.form.itemTitle}>
          <form action={createMenuItemAction} encType="multipart/form-data">
            <input type="hidden" name="returnTo" value={currentPath} />
            <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
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

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
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

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_0.7fr]">
                <AdminField label={menuText.fields.imageFile}>
                  <input
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-[#201b17] file:mr-4 file:rounded-full file:border-0 file:bg-[#f3ede2] file:px-4 file:py-2 file:text-[0.62rem] file:font-medium file:uppercase file:tracking-[0.14em] file:text-[#7b6140]"
                  />
                </AdminField>
                <AdminField label={menuText.fields.imageUrl}>
                  <input name="imageUrl" type="text" className={inputClassName} />
                </AdminField>
                <AdminField label={menuText.fields.allergens}>
                  <input name="allergens" type="text" className={inputClassName} />
                </AdminField>
              </div>

              <p className="mt-3 text-xs font-light leading-relaxed text-[#7a7165]">
                {menuText.form.uploadHint}
              </p>

              <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        </AdminPanel>
      </div>

      <AdminPanel
        badge={menuText.badge}
        description={menuText.description}
        title={menuText.title}
      >
        {categories.length ? (
          <div className="space-y-5">
            {categories.map((category) => (
              <section
                key={category.id}
                className="rounded-[1.6rem] border border-[#eadfcf] bg-[#fcfaf6] p-4 sm:p-5"
              >
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                  <form action={updateMenuCategoryAction}>
                    <input type="hidden" name="returnTo" value={currentPath} />
                    <input type="hidden" name="id" value={category.id} />
                    <AdminPendingFieldset>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                  <form action={deleteMenuCategoryAction} className="xl:pt-1">
                    <input type="hidden" name="returnTo" value={currentPath} />
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

                <div className="mt-5 space-y-4">
                  {category.items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.45rem] border border-[#eee5d9] bg-white p-4 shadow-[0_12px_28px_rgba(28,21,16,0.04)]"
                    >
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                        <MenuImagePreview alt={item.nameDe} src={item.imageUrl} />

                        <form action={updateMenuItemAction} encType="multipart/form-data">
                          <input type="hidden" name="returnTo" value={currentPath} />
                          <input type="hidden" name="id" value={item.id} />
                          <AdminPendingFieldset>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
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

                            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
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

                            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                              <AdminField label={menuText.fields.imageFile}>
                                <input
                                  name="imageFile"
                                  type="file"
                                  accept="image/*"
                                  className="w-full text-sm text-[#201b17] file:mr-4 file:rounded-full file:border-0 file:bg-[#f3ede2] file:px-4 file:py-2 file:text-[0.62rem] file:font-medium file:uppercase file:tracking-[0.14em] file:text-[#7b6140]"
                                />
                              </AdminField>
                              <div className="flex items-center gap-2 rounded-[1.2rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-3 text-sm text-[#5d564c]">
                                <ImageIcon className="h-4 w-4 text-[#b4884c]" />
                                {formatAdminCurrency(item.price.toString(), locale)}
                              </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 xl:flex-row xl:items-center xl:justify-between">
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                              <div className="flex flex-col gap-3 sm:flex-row">
                                <AdminSubmitButton
                                  pendingLabel={`${t.dashboard.controls.save}...`}
                                  className={subtleButtonClassName}
                                >
                                  {t.dashboard.controls.save}
                                </AdminSubmitButton>
                              </div>
                            </div>
                          </AdminPendingFieldset>
                        </form>
                      </div>

                      <form action={deleteMenuItemAction} className="mt-4 flex justify-end">
                        <input type="hidden" name="returnTo" value={currentPath} />
                        <input type="hidden" name="id" value={item.id} />
                        <AdminConfirmButton
                          confirmMessage={t.dashboard.controls.confirmDelete}
                          pendingLabel={`${t.dashboard.controls.delete}...`}
                          className={dangerButtonClassName}
                        >
                          {t.dashboard.controls.delete}
                        </AdminConfirmButton>
                      </form>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <AdminEmptyState>{menuText.description}</AdminEmptyState>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
