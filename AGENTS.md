# AGENTS.md

## Назначение файла

Этот файл является рабочей памятью проекта для следующих сессий Codex и других
агентов. Перед существенными изменениями сначала читать этот файл, затем
проверять актуальный код.

Обновлять этот файл, когда меняются:

- архитектура, ключевые модули или границы client/server;
- публичные маршруты, admin-маршруты или основные пользовательские сценарии;
- Prisma schema, важные миграции или способ работы с данными;
- обязательные переменные окружения, команды запуска или проверки;
- условия деплоя, хранение uploads или обработка медиа.

Не записывать сюда секреты, значения из `.env`, временные логи, мелкие правки
верстки и подробности, которые быстро устаревают.

## Кратко о проекте

- Проект: сайт отеля и ресторана Waldschloesschen.
- Основной стек на 2026-05-21: Next.js App Router `16.2.3`, React `19`,
  TypeScript, Tailwind CSS `4`, `next-intl`, Prisma `7.7.0`, PostgreSQL.
- Основные пользовательские области: публичный сайт, ресторанное меню,
  прямое бронирование номеров и admin-панель.
- При ответах владельцу проекта по умолчанию использовать русский язык, если
  пользователь не просит иначе.

## Источники истины

Проверять фактическое состояние проекта в таком порядке:

1. `package.json` для версий, scripts и библиотек.
2. `src/app` для маршрутов и точек входа страниц/API.
3. `prisma/schema.prisma` и `prisma/migrations` для модели данных.
4. `src/lib` для доменной и server-side логики.
5. `src/components`, `src/data/messages` и `src/data/site.ts` для UI и контента.

`README.md` содержит старое описание и может отставать от кода. Датированные
файлы `README300426.md` и `Readme030526.md` полезны как рабочие заметки, но их
тоже нужно сверять с реализацией.

## Структура проекта

### Верхний уровень

- `src/` - основной код приложения.
- `prisma/` - Prisma schema и миграции PostgreSQL.
- `public/` - статические изображения, видео, menu assets и uploads.
- `scripts/` - вспомогательные scripts для Prisma runtime и brand assets.
- `downloads/` - импортированные/вспомогательные материалы, не считать их
  главным источником текущей реализации без проверки.

### `src/app`

- `src/app/page.tsx` перенаправляет `/` на `/de`.
- `src/app/[locale]` содержит публичные страницы с locale-префиксом:
  `/de` и `/en`.
- Публичные разделы сейчас включают home, `hotel`, `hotel/buchen`,
  `hotel/buchen/checkout`, `restaurant`, `events`, `kontakt`,
  `ausflugsziele`.
- `src/app/api/contact/route.ts` сохраняет contact submissions через Prisma.
- `src/app/admin` содержит dashboard и рабочие admin-разделы:
  `contacts`, `bookings`, `bookings/calendar`, `bookings/new`, `analytics`,
  `vouchers`, `events`, `rooms`, `menu`, `login`.
- `src/app/api/admin` содержит login/logout, admin locale route, CSV export и
  защищенный cron route `/api/admin/cron` для авто-освобождения номеров.

### `src/components`

- `layout/` - общие `Header` и `Footer`.
- `sections/` - публичные секции home и content-компоненты страниц.
- `booking/` - виджеты, карточки номеров и checkout flow.
- `admin/` - shell, формы, badges, notices и общие admin UI-компоненты.
- `ui/` - небольшие общие UI-обертки.

### `src/lib`

- `prisma.ts` - singleton Prisma client с `PrismaPg` adapter и нормализацией
  PostgreSQL SSL mode.
- `i18n/` и `src/proxy.ts` - locale routing для публичной части и защита
  `/admin`.
- `booking-*` - availability, booking creation, date parsing, shared types,
  navigation и server action бронирования.
- `booking-lifecycle.ts` - admin lifecycle бронирований: допустимые переходы
  статусов, ручное создание брони, auto-sweep прошедших броней, календарь и
  аналитика.
- `admin-booking-views.ts` - server-side helpers для admin calendar/new
  booking/analytics страниц и lazy auto-sweep.
- `email.ts` и `email-templates.ts` - dependency-free Resend REST email flow
  для booking уведомлений; отсутствие `RESEND_API_KEY` не должно ломать
  сохранение брони.
- `restaurant-menu*` - default menu data, public/admin menu queries и shared
  menu types.
- `admin-*` - admin auth, dashboard data, feedback, i18n и media upload logic.
- `seo.ts` - SEO helpers.

### `src/data`

- `site.ts` - site config и часть общего контента.
- `messages/de.json` и `messages/en.json` - переводы публичного сайта для
  `next-intl`.

## Маршрутизация и языки

- Глобальный `next-intl` routing настроен для `de` и `en`; default locale -
  `de`; locale prefix используется всегда.
- Публичный home собирается из секций в `src/app/[locale]/page.tsx`.
- Booking flow живет внутри route locale `de`/`en`, но дополнительно имеет
  русские тексты через booking helpers и query parameter `lang=ru`.
- При изменении навигации сначала проверять `src/lib/i18n`, `src/proxy.ts`,
  locale pages и booking navigation helpers.

## Данные и домены

Основные Prisma models:

- `ContactSubmission` - обращения с contact form.
- `GiftVoucher` - подарочные сертификаты.
- `Event` - события.
- `RestaurantMenuCategory` и `RestaurantMenuItem` - ресторанное меню,
  price variants, изображения и видео.
- `Guest`, `Room`, `Booking` - бронирование номеров.

Важные детали:

- `RoomType`: `SINGLE`, `DOUBLE`.
- `Room` поддерживает опциональный `roomNumber` в формате трех цифр,
  `imageUrls` как JSON-галерею до 5 фото, `imageUrl` как основное/первое фото
  для существующего booking UI, а также `recommendationDe/En/Ru`.
- `Room` хранит редактируемые тарифы бронирования: `priceOneGuest` -
  `priceFourGuests`, `breakfastPricePerGuest`, `halfBoardPricePerGuest`,
  `defaultMealPlan`, `extraBedMax`, `extraBedPrice`. `basePrice` оставлен как
  fallback для старого кода и если цена по числу гостей не заполнена.
- `BookingMealPlan`: `ROOM_ONLY`, `BREAKFAST`, `HALF_BOARD`. Публичный checkout
  предлагает `BREAKFAST` по умолчанию, но клиент может выбрать без завтрака или
  завтрак+ужин.
- `Booking` сохраняет снимок тарифа на момент заявки: `mealPlan`,
  `mealPlanPricePerGuest`, `mealPlanTotal`, `extraBeds`,
  `extraBedPricePerNight`, `extraBedTotal`. Исторические брони не должны
  пересчитываться от новых тарифов комнаты.
- `BookingSource`: `WEB`, `ADMIN`, `PHONE`, `EMAIL`, `WALK_IN`.
- `Booking` также хранит lifecycle/admin-поля: `source`, `adminNotes`,
  `cancellationReason`, `confirmedAt`, `cancelledAt`, `checkedInAt`,
  `checkedOutAt`, `autoCompletedAt`.
- `BookingStatus`: `PENDING`, `CONFIRMED`, `CANCELLED`, `CHECKED_IN`,
  `CHECKED_OUT`, `NO_SHOW`.
- Booking time rules use Berlin time (`Europe/Berlin`): public check-in is from
  `15:00`, check-out is until `12:00`, and same-day online booking is allowed
  only until `13:00` Berlin time (2 hours before check-in). Keep these values in
  `src/lib/booking-shared.ts` and enforce public booking validity through
  `src/lib/booking-dates.ts`/`booking-engine.ts`.
- `Guest` хранит адресные поля `street`, `postalCode`, `city`, `country` для
  счета и booking contract. Публичный checkout требует эти поля при создании
  брони; для иностранных гостей обязательный Meldeschein/паспорт/подпись все
  равно остается офлайн-процессом при заезде.
- Booking emails отправляются через `src/lib/email.ts` и
  `src/lib/email-templates.ts`: guest received, hotel notification, guest
  confirmed, guest cancelled. Email delivery fail-safe: ошибки Resend или
  отсутствие `RESEND_API_KEY` не должны откатывать уже сохраненную бронь.
- Admin lifecycle переходы держать в `BOOKING_STATUS_TRANSITIONS` внутри
  `src/lib/booking-lifecycle.ts`; UI не должен предлагать переходы, которые
  сервер запрещает.
- Auto-sweep: `CHECKED_IN` с прошедшим `checkOut` переводится в `CHECKED_OUT`;
  `PENDING`/`CONFIRMED` с прошедшим `checkOut` переводятся в `NO_SHOW`.
- `booking-engine.ts` создает default rooms, если они еще отсутствуют, но не
  перезаписывает существующие комнаты через `ensureDefaultRooms`, чтобы
  admin-тарифы и вместимость не сбрасывались при открытии booking-страниц.
- `restaurant-menu.ts` наполняет default menu, если таблицы меню пустые.
- Проверку доступности номеров и создание booking держать на server side;
  client-компоненты не должны тянуть Prisma/Node зависимости.

## Admin и безопасность

- Admin login использует `ADMIN_USERNAME`, `ADMIN_PASSWORD` и
  `ADMIN_SESSION_SECRET`.
- Admin session подписывается HMAC и хранится в httpOnly cookie.
- `src/proxy.ts` пропускает `/admin/login`, а остальные `/admin` маршруты
  требует открыть с валидной session.
- Admin mutations в основном реализованы server actions в `src/app/admin`.
- `/api/admin/cron` требует `CRON_SECRET` и заголовок
  `Authorization: Bearer <CRON_SECRET>` или query `?secret=...`; без секрета
  route закрыт fail-closed. Даже без внешнего cron admin-страницы запускают
  lazy auto-sweep не чаще одного раза в 5 минут.
- Никогда не переносить секреты из `.env` или других env-файлов в docs,
  ответы, commits или логи.

## Медиа и uploads

- Статические изображения и видео публичной части лежат в `public/`.
- Admin menu upload сохраняет изображения как WebP через `sharp`.
- Admin menu upload конвертирует видео в WebM через `ffmpeg-static` или
  путь из `FFMPEG_PATH`.
- Uploaded files сохраняются под `public/uploads`, сейчас для меню в
  `public/uploads/restaurant-menu`, для комнат в `public/uploads/rooms`.
- Admin room upload сохраняет изображения как WebP через общий helper
  `src/lib/admin-image-upload.ts`; удаление файлов разрешено только внутри
  `/uploads/...`.
- Для production на обычном Node.js сервере `public/uploads` должен жить на
  постоянном диске. Для serverless/Vercel такой local uploads flow нельзя
  считать надежным без отдельного storage/worker решения.

## Переменные окружения

Ожидаемый env contract:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CRON_SECRET` - опционально для внешнего планировщика auto-sweep
  `/api/admin/cron`; без него cron route отключен.
- `RESEND_API_KEY` - опционально для отправки booking email через Resend REST;
  если отсутствует, письма пропускаются без ошибки для брони.
- `RESEND_FROM` - отправитель booking email; домен должен быть
  подтвержден в Resend.
- `BOOKING_NOTIFY_EMAIL` - опциональный адрес отеля для уведомлений о новых
  бронированиях; fallback берется из `siteConfig.email`.
- `FFMPEG_PATH` - опционально, если bundled ffmpeg не подходит.

Записывать только имена переменных и назначение. Значения не сохранять в этом
файле.

## Команды

Основные команды из `package.json`:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:studio`
- `npm run db:seed`
- `npm run brand:assets`

После значимых изменений предпочитать `npm run build` как основную проверку.
После изменений Prisma schema отдельно проверить необходимость миграции,
генерации Prisma client и обновления зависимых server-side модулей.

### Практические проверки в Codex/Windows

- В некоторых PowerShell-сессиях Codex `npm` и `node` могут быть установлены,
  но отсутствовать в `PATH`. Перед проверками можно временно добавить:
  `$env:Path = 'C:\Program Files\nodejs;' + $env:Path`.
- Для быстрой проверки UI-правок без полного production build использовать
  `npm run lint`, затем запускать `npm run dev -- --port <port>` на свободном
  порту и проверять нужную страницу через HTTP.
- Для страницы ресторана быстрая smoke-проверка: открыть или запросить
  `/de/restaurant`; успешный ответ должен быть `200`.

## Рабочие правила для следующих изменений

- Сначала искать существующий паттерн в соседних route/component/lib файлах.
- Для UI публичной части учитывать locale messages, SEO metadata и assets.
- Для admin UI сначала проверять shared admin components и `admin-*` helpers,
  а не дублировать поведение на одной странице.
- Для booking и restaurant menu сохранять разделение shared/client-safe types
  и server-side Prisma logic.
- При изменении маршрутов обновлять sitemap/metadata/navigation, если это
  затрагивает публичную часть.
- При изменении структуры проекта обновлять этот файл и добавлять запись в
  журнал ниже.

## Журнал важных изменений

| Дата | Изменение | Контекст |
| --- | --- | --- |
| 2026-06-02 | Добавлены правила времени для публичного бронирования. | В `src/lib/booking-shared.ts` зафиксированы `HOTEL_CHECK_IN_TIME=15:00`, `HOTEL_CHECK_OUT_TIME=12:00`, `HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME=13:00`, `HOTEL_BOOKING_MIN_LEAD_HOURS=2`. `src/lib/booking-dates.ts` теперь считает минимальную дату заезда по `Europe/Berlin`: сегодня доступно только до 13:00 Berlin, после этого earliest check-in становится завтра. `booking-engine.ts` серверно запрещает публичные брони на уже недоступную дату, `/hotel/buchen` и `/hotel/buchen/checkout` нормализуют query dates и показывают время заезда/выезда, `BookingWidget` и `BookingCheckoutForm` выводят клиенту правила времени. `processExpiredBookings` освобождает checkout-date только после 12:00 Berlin, а не в полночь. Проверено через `npm run lint`, `npm run build` и `npx tsx` smoke для 12:59/13:01 Berlin и 11:59/12:01 Berlin. |
| 2026-06-01 | Установлен Stage 2 пакет booking email, адреса гостя и улучшенной room card. | Миграция `20260602100000_guest_address` добавляет в `Guest` поля `street`, `postalCode`, `city`, `country`. Публичный checkout теперь собирает адрес, `booking-engine.ts` сохраняет адрес и возвращает расширенный booking result, `booking-actions.ts` отправляет guest/hotel email после сохранения. Admin booking actions отправляют guest email при подтверждении и отмене. Добавлены `src/lib/email.ts`, `src/lib/email-templates.ts`; Resend работает через REST без новых npm-пакетов и fail-safe при отсутствии `RESEND_API_KEY`. `RoomCard` использует `room.gallery` из `Room.imageUrls` с миниатюрами и low-availability badge. Выполнены `prisma format`, `npx prisma migrate dev`, `npm run db:generate`, `npx prisma migrate status`, `npm run lint`, `npm run build`; новых npm-пакетов не потребовалось. Для production задать `RESEND_API_KEY`, `RESEND_FROM`, опционально `BOOKING_NOTIFY_EMAIL`, затем применить миграции через deploy-flow. |
| 2026-06-01 | Установлен пакет профессиональной админки бронирований. | Добавлены `src/lib/booking-lifecycle.ts`, `src/lib/admin-booking-views.ts`, страницы `/admin/bookings/calendar`, `/admin/bookings/new`, `/admin/analytics`, cron route `/api/admin/cron`, компоненты `AdminBookingCalendar`, `AdminBookingCreateForm`, `AdminAnalyticsPanel`. Миграция `20260601150000_booking_lifecycle_admin` добавляет `BookingSource`, `source`, `adminNotes`, `cancellationReason`, lifecycle timestamps и индексы `Booking_status_checkOut_idx`, `Booking_source_createdAt_idx`. `AdminShell` получил навигацию календаря и статистики, admin bookings получили ручное создание, lifecycle-переходы, отмену с причиной и внутренние заметки. Выполнены `prisma format`, `npx prisma migrate dev`, `npm run db:generate`, `npx prisma migrate status`, `npm run lint`, `npm run build`; новых npm-пакетов не потребовалось. Для production добавить `CRON_SECRET` и настроить внешний cron на `/api/admin/cron` раз в 10-15 минут. |
| 2026-06-01 | Добавлена тарифная модель комнат и питания для booking flow. | Миграция `20260601113000_room_booking_rate_plans` добавляет `BookingMealPlan`, цены комнаты для 1-4 гостей, стоимость завтрака/полупансиона за гостя, тариф по умолчанию, лимит/цену доп. кроватей и snapshot-поля в `Booking`. `booking-engine.ts` считает итог как проживание + питание + доп. кровати + доплаты, а checkout предлагает завтрак по умолчанию с выбором `ROOM_ONLY`/`BREAKFAST`/`HALF_BOARD`. `/admin/rooms` получил редактирование этих тарифов. После schema changes выполнены `prisma format`, `npm run db:generate`, `npm run lint`, `npm run build`. Для работающей БД нужно применить миграции. |
| 2026-06-01 | Обновлен общий визуальный стиль admin-панели. | `AdminShell`, `AdminUi`, `AdminLocaleSwitcher` и `/admin/rooms` приведены к более компактному, продуктово-операционному стилю: меньшие радиусы, плотнее метрики, более строгие панели, аккуратные кнопки и карточки комнат. На mobile admin-навигация в `AdminShell` реализована как hamburger/details-меню, не горизонтальная полоса. Desktop sidebar должен быть скроллируемым через `max-height`/`overflow-y-auto`, а не обрезаться `overflow-hidden`. Для React server-action forms не задавать `method`/`encType`, иначе React пишет warning. Проверено через `npm run lint` и `npm run build`; `/admin/login` отвечает `200` на локальном dev server. |
| 2026-06-01 | Переработана `/admin/rooms` и расширена модель `Room`. | Добавлена миграция `20260601100000_room_admin_gallery`: `roomNumber`, `imageUrls`, `recommendationDe/En/Ru`. Admin rooms теперь поддерживает создание, редактирование, удаление комнаты без бронирований, WebP-галерею до 5 фото, удаление фото, чеклист гостиничных удобств и компактный адаптивный UI. После schema changes выполнен `npm run db:generate`; проверено через `npm run lint` и `npm run build`. Для работающей БД нужно применить миграцию/`db:push` в целевом окружении. |
| 2026-05-31 | Доработана desktop-версия первой карточки ресторанного меню. | В `RestaurantMenuMedia` добавлен режим `playInlineOnDesktopHover={false}`: для featured-карточки слева остается статичное фото/постер, а desktop hover-preview справа продолжает показывать видео. Заголовок featured-блюда уменьшен и настроен через `text-wrap: balance`, `hyphens:auto` и `overflow-wrap:normal`, чтобы немецкие названия не ломались некрасиво внутри слова. Проверено через `npm run lint` и smoke-запрос `/de/restaurant` со статусом `200`. |
| 2026-05-31 | Унифицированы мобильные карточки блюд в ресторанном меню. | В `src/components/sections/RestaurantPageContent.tsx` мобильный блок `lg:hidden` теперь рендерит `activeCategory.items` одним шаблоном карточки; отдельная большая первая карточка убрана. Десктопный блок оставлен без изменений. Проверено через `npm run lint` и smoke-запрос `/de/restaurant` со статусом `200`. |
| 2026-05-21 | Создан `AGENTS.md`. | Зафиксированы текущая структура Next.js приложения, Prisma-домены, booking/menu/admin контуры, env contract и правило поддерживать этот файл после значимых изменений. |
