# Kontakt & Anfahrt Page — Инструкция по установке

## 📁 НОВЫЕ ФАЙЛЫ (создать)

### 1. `contact_page.tsx`
**Куда:** `src/app/[locale]/kontakt/page.tsx`
**Действие:** Создать папку `kontakt` внутри `src/app/[locale]/` и положить как `page.tsx`

### 2. `ContactPageContent.tsx`
**Куда:** `src/components/sections/ContactPageContent.tsx`

---

## 📝 ИЗМЕНЁННЫЕ ФАЙЛЫ (заменить целиком)

### 3. `de.json` → `src/data/messages/de.json`
### 4. `en.json` → `src/data/messages/en.json`
### 5. `Header.tsx` → `src/components/layout/Header.tsx`
### 6. `Footer.tsx` → `src/components/layout/Footer.tsx`

---

## ⚠️ ВРУЧНУЮ — `src/app/sitemap.ts`

```ts
const pages = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/hotel", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/restaurant", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/events", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/ausflugsziele", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" as const },  // ← ДОБАВИТЬ
];
```

## ⚠️ Этот пакет содержит ВСЕ предыдущие изменения
(Hotel + Restaurant + Events + Ausflugsziele + Kontakt)

---

## 🔗 Маршруты: `/de/kontakt` · `/en/kontakt`

## 🏗 Теперь ВСЕ 5 навигационных ссылок — полноценные страницы:
- `/hotel` ✅
- `/restaurant` ✅
- `/events` ✅
- `/ausflugsziele` ✅
- `/kontakt` ✅

## ✅ Проверить
1. Хедер «Kontakt» → `/de/kontakt`
2. Футер «Kontakt» → `/kontakt`
3. 6 секций: Hero → Contact Cards (3 карточки) → Hours (Restaurant + Hotel) → Contact Form → Directions (4 способа + Google Maps) → CTA
4. Форма отправляет на `/api/contact` (уже существует)
5. Google Maps iframe встроен
6. SEO: LocalBusiness + BreadcrumbList + FAQPage (5 FAQ)
