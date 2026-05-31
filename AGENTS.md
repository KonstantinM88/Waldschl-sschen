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
  `contacts`, `bookings`, `vouchers`, `events`, `rooms`, `menu`, `login`.
- `src/app/api/admin` содержит login/logout, admin locale route и CSV export.

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
- `BookingStatus`: `PENDING`, `CONFIRMED`, `CANCELLED`, `CHECKED_IN`,
  `CHECKED_OUT`, `NO_SHOW`.
- `booking-engine.ts` создает default rooms, если они еще отсутствуют.
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
- Никогда не переносить секреты из `.env` или других env-файлов в docs,
  ответы, commits или логи.

## Медиа и uploads

- Статические изображения и видео публичной части лежат в `public/`.
- Admin menu upload сохраняет изображения как WebP через `sharp`.
- Admin menu upload конвертирует видео в WebM через `ffmpeg-static` или
  путь из `FFMPEG_PATH`.
- Uploaded files сохраняются под `public/uploads`, сейчас для меню в
  `public/uploads/restaurant-menu`.
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
| 2026-05-31 | Доработана desktop-версия первой карточки ресторанного меню. | В `RestaurantMenuMedia` добавлен режим `playInlineOnDesktopHover={false}`: для featured-карточки слева остается статичное фото/постер, а desktop hover-preview справа продолжает показывать видео. Заголовок featured-блюда уменьшен и настроен через `text-wrap: balance`, `hyphens:auto` и `overflow-wrap:normal`, чтобы немецкие названия не ломались некрасиво внутри слова. Проверено через `npm run lint` и smoke-запрос `/de/restaurant` со статусом `200`. |
| 2026-05-31 | Унифицированы мобильные карточки блюд в ресторанном меню. | В `src/components/sections/RestaurantPageContent.tsx` мобильный блок `lg:hidden` теперь рендерит `activeCategory.items` одним шаблоном карточки; отдельная большая первая карточка убрана. Десктопный блок оставлен без изменений. Проверено через `npm run lint` и smoke-запрос `/de/restaurant` со статусом `200`. |
| 2026-05-21 | Создан `AGENTS.md`. | Зафиксированы текущая структура Next.js приложения, Prisma-домены, booking/menu/admin контуры, env contract и правило поддерживать этот файл после значимых изменений. |
