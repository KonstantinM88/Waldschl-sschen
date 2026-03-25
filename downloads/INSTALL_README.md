# Hotel Page — Инструкция по установке

## 📁 НОВЫЕ ФАЙЛЫ (создать)

### 1. `hotel_page.tsx`
**Куда:** `src/app/[locale]/hotel/page.tsx`
**Действие:** Создать папку `hotel` внутри `src/app/[locale]/` и положить туда этот файл как `page.tsx`

### 2. `HotelPageContent.tsx`
**Куда:** `src/components/sections/HotelPageContent.tsx`
**Действие:** Положить в `src/components/sections/`

---

## 📝 ИЗМЕНЁННЫЕ ФАЙЛЫ (заменить целиком)

### 3. `de.json`
**Куда:** `src/data/messages/de.json`
**Что изменилось:** Добавлен блок `"hotelPage"` с ~80 строками переводов (hero, intro, rooms, amenities, breakfast, location, checkin, cta)

### 4. `en.json`
**Куда:** `src/data/messages/en.json`
**Что изменилось:** Добавлен блок `"hotelPage"` — английские переводы

### 5. `Header.tsx`
**Куда:** `src/components/layout/Header.tsx`
**Что изменилось:**
- Ссылка `#hotel` заменена на `/hotel` (isPage: true)
- Desktop nav использует `NextLink` для page-роутов
- Mobile nav использует `NextLink` для page-роутов
- Остальные ссылки (#restaurant, #events и т.д.) без изменений

### 6. `Footer.tsx`
**Куда:** `src/components/layout/Footer.tsx`
**Что изменилось:** Ссылка Hotel заменена с `<a href="#hotel">` на `<Link href="/hotel">`

### 7. `DirectionsSection.tsx`
**Куда:** `src/components/sections/DirectionsSection.tsx`
**Что изменилось:**
- Карточка Hotel обёрнута в `NextLink` и ведёт на `/hotel`
- Добавлен `pageLink: "/hotel"` в данные карточки
- Импортирован `NextLink` и `usePathname`

### 8. `sitemap.ts`
**Куда:** `src/app/sitemap.ts`
**Что изменилось:** Добавлена страница `/hotel` в sitemap для обоих локалей (de/en)

---

## 🔗 Маршруты после установки

| URL | Страница |
|-----|----------|
| `/de/hotel` | Hotel страница (DE) |
| `/en/hotel` | Hotel страница (EN) |

## ✅ Проверить после установки

1. Клик "Hotel" в хедере → переход на `/de/hotel`
2. Клик "Hotel" в футере → переход на `/hotel`
3. Клик карточка Hotel в DirectionsSection → переход на `/de/hotel`
4. Переключатель языка на странице hotel → `/en/hotel`
5. SEO: проверить `<title>`, `<meta description>`, schema.org в DevTools
