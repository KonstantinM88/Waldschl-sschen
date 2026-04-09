export const ADMIN_LOCALE_COOKIE = "wald_admin_locale";

export type AdminLocale = "de" | "ru";

interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
}

const adminDictionaries = {
  de: {
    common: {
      localeLabel: "Sprache",
      languages: {
        de: "DE",
        ru: "RU",
      },
    },
    loginPage: {
      badge: "Separater Admin-Zugang",
      title: "Internes Dashboard fur Anfragen und Buchungen",
      description:
        "Der Zugriff auf Kontaktanfragen, Buchungen, Gutscheine und Eventdaten ist nur nach Login moglich.",
      features: [
        "Kontaktanfragen",
        "Buchungen und Gutscheine",
        "Geschutzter Admin-Bereich",
      ],
      formBadge: "Admin-Anmeldung",
      formTitle: "Login mit Benutzername und Passwort",
      formDescription:
        "Die Zugangsdaten werden aus den Umgebungsvariablen gelesen und die Session wird in einem sicheren HttpOnly-Cookie gespeichert.",
    },
    loginForm: {
      usernameLabel: "Login",
      usernamePlaceholder: "admin",
      passwordLabel: "Passwort",
      passwordPlaceholder: "••••••••",
      submitIdle: "Anmelden",
      submitPending: "Anmeldung...",
      errors: {
        generic: "Anmeldung fehlgeschlagen.",
        internal: "Interner Fehler. Bitte erneut versuchen.",
        invalidCredentials: "Ungultiger Benutzername oder Passwort.",
        invalidPayload: "Bitte Login und Passwort korrekt ausfullen.",
        notConfigured:
          "Admin-Zugang ist noch nicht konfiguriert. Setzen Sie ADMIN_USERNAME, ADMIN_PASSWORD und ADMIN_SESSION_SECRET.",
      },
    },
    dashboard: {
      badge: "Admin-Dashboard",
      title: "Internes Kontrollzentrum",
      loggedInAsPrefix: "Angemeldet als",
      loggedInAsSuffix:
        "Dieser Bereich ist vom offentlichen Auftritt getrennt und nur fur die interne Verwaltung gedacht.",
      openWebsite: "Website offnen",
      logout: "Abmelden",
      statCards: {
        contacts: {
          label: "Kontaktanfragen",
          detail: (count: number) => `${count} ungelesen`,
        },
        bookings: {
          label: "Buchungen",
          detail: (count: number) => `${count} offen`,
        },
        vouchers: {
          label: "Offene Gutscheine",
          detail: "Noch nicht eingelost",
        },
        events: {
          label: "Veroffentlichte Events",
          detail: (count: number) => `${count} geplant`,
        },
      },
      sections: {
        inboxBadge: "Posteingang",
        inboxTitle: "Neueste Kontaktanfragen",
        items: (count: number) => `${count} Eintrage`,
        unread: "Ungelesen",
        noContacts: "Noch keine Kontaktanfragen vorhanden.",
        bookingBadge: "Buchungsfluss",
        bookingTitle: "Neueste Buchungen",
        noBookings: "Noch keine Buchungen vorhanden.",
        vouchersBadge: "Geschenkgutscheine",
        vouchersTitle: "Neueste Gutscheinverkaufe",
        noVouchers: "Noch keine Gutscheine verkauft.",
        eventsBadge: "Kommende Events",
        eventsTitle: "Planungsubersicht",
        noEvents: "Aktuell sind keine kommenden Events geplant.",
        noDescription: "Noch keine Beschreibung vorhanden.",
        roomsBadge: "Zimmerverwaltung",
        roomsTitle: "Zimmer, Preise und Inhalte",
        roomsDescription:
          "Pflegen Sie hier die sichtbaren Zimmertypen fur die Buchungsstrecke, inklusive Preis, Bild, Inventar und Texten in allen Sprachen.",
        roomsSubmit: "Zimmer speichern",
        roomsSaving: "Wird gespeichert...",
        roomsSaved: "Zimmerdaten aktualisiert.",
        roomsInactive: "Inaktiv",
        roomsBreakfastIncluded: "Frühstück inklusive",
        roomsBookingCount: (count: number) => `${count} aktive Buchungen`,
        roomsForm: {
          price: "Preis pro Nacht",
          inventory: "Inventar",
          maxGuests: "Max. Gaste",
          imageUrl: "Bild-URL",
          amenities: "Amenities (eine Zeile pro Punkt)",
          titleDe: "Titel DE",
          titleEn: "Titel EN",
          titleRu: "Titel RU",
          shortDe: "Kurztext DE",
          shortEn: "Kurztext EN",
          shortRu: "Kurztext RU",
          descriptionDe: "Beschreibung DE",
          descriptionEn: "Beschreibung EN",
          descriptionRu: "Beschreibung RU",
          isActive: "Aktiv im Buchungs-Widget",
        },
      },
      bookingStatuses: {
        PENDING: "Offen",
        CONFIRMED: "Bestatigt",
        CANCELLED: "Storniert",
        CHECKED_IN: "Eingecheckt",
        CHECKED_OUT: "Ausgecheckt",
        NO_SHOW: "Nicht erschienen",
      },
    },
  },
  ru: {
    common: {
      localeLabel: "Язык",
      languages: {
        de: "DE",
        ru: "RU",
      },
    },
    loginPage: {
      badge: "Отдельный вход администратора",
      title: "Внутренняя панель для заявок и бронирований",
      description:
        "Доступ к контактным заявкам, бронированиям, сертификатам и событиям открыт только после входа.",
      features: [
        "Контактные заявки",
        "Бронирования и сертификаты",
        "Защищённая админ-зона",
      ],
      formBadge: "Вход в админку",
      formTitle: "Вход по логину и паролю",
      formDescription:
        "Учётные данные берутся из переменных окружения, а сессия хранится в защищённой HttpOnly-cookie.",
    },
    loginForm: {
      usernameLabel: "Логин",
      usernamePlaceholder: "admin",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      submitIdle: "Войти",
      submitPending: "Вход...",
      errors: {
        generic: "Не удалось выполнить вход.",
        internal: "Внутренняя ошибка. Попробуйте ещё раз.",
        invalidCredentials: "Неверный логин или пароль.",
        invalidPayload: "Корректно заполните логин и пароль.",
        notConfigured:
          "Админ-доступ ещё не настроен. Укажите ADMIN_USERNAME, ADMIN_PASSWORD и ADMIN_SESSION_SECRET.",
      },
    },
    dashboard: {
      badge: "Панель администратора",
      title: "Внутренний центр управления",
      loggedInAsPrefix: "Вы вошли как",
      loggedInAsSuffix:
        "Эта зона отделена от публичного сайта и предназначена только для внутреннего управления.",
      openWebsite: "Открыть сайт",
      logout: "Выйти",
      statCards: {
        contacts: {
          label: "Контактные заявки",
          detail: (count: number) => `${count} непрочитанных`,
        },
        bookings: {
          label: "Бронирования",
          detail: (count: number) => `${count} в ожидании`,
        },
        vouchers: {
          label: "Активные сертификаты",
          detail: "Ещё не использованы",
        },
        events: {
          label: "Опубликованные события",
          detail: (count: number) => `${count} запланировано`,
        },
      },
      sections: {
        inboxBadge: "Входящие",
        inboxTitle: "Последние контактные заявки",
        items: (count: number) => `${count} записей`,
        unread: "Не прочитано",
        noContacts: "Контактных заявок пока нет.",
        bookingBadge: "Поток бронирований",
        bookingTitle: "Последние бронирования",
        noBookings: "Бронирований пока нет.",
        vouchersBadge: "Подарочные сертификаты",
        vouchersTitle: "Последние продажи сертификатов",
        noVouchers: "Продаж сертификатов пока нет.",
        eventsBadge: "Ближайшие события",
        eventsTitle: "Обзор планирования",
        noEvents: "Ближайшие события пока не запланированы.",
        noDescription: "Описание пока не добавлено.",
        roomsBadge: "Управление номерами",
        roomsTitle: "Номера, цены и контент",
        roomsDescription:
          "Здесь редактируются типы номеров для модуля бронирования, включая цену, изображение, инвентарь и тексты на всех языках.",
        roomsSubmit: "Сохранить номер",
        roomsSaving: "Сохранение...",
        roomsSaved: "Данные номера обновлены.",
        roomsInactive: "Неактивно",
        roomsBreakfastIncluded: "Завтрак включён",
        roomsBookingCount: (count: number) => `${count} активных бронирований`,
        roomsForm: {
          price: "Цена за ночь",
          inventory: "Инвентарь",
          maxGuests: "Макс. гостей",
          imageUrl: "URL изображения",
          amenities: "Удобства (по одному пункту в строке)",
          titleDe: "Название DE",
          titleEn: "Название EN",
          titleRu: "Название RU",
          shortDe: "Короткий текст DE",
          shortEn: "Короткий текст EN",
          shortRu: "Короткий текст RU",
          descriptionDe: "Описание DE",
          descriptionEn: "Описание EN",
          descriptionRu: "Описание RU",
          isActive: "Активно в виджете бронирования",
        },
      },
      bookingStatuses: {
        PENDING: "В ожидании",
        CONFIRMED: "Подтверждено",
        CANCELLED: "Отменено",
        CHECKED_IN: "Заехал",
        CHECKED_OUT: "Выехал",
        NO_SHOW: "Не приехал",
      },
    },
  },
} as const;

export function resolveAdminLocale(value?: string | null): AdminLocale {
  return value === "ru" ? "ru" : "de";
}

export function getAdminLocaleFromCookieStore(cookieStore: CookieStoreLike): AdminLocale {
  return resolveAdminLocale(cookieStore.get(ADMIN_LOCALE_COOKIE)?.value);
}

export function getAdminDictionary(locale: AdminLocale) {
  return adminDictionaries[locale];
}

export function getAdminLocaleCookieOptions() {
  return {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/admin",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getAdminIntlLocale(locale: AdminLocale) {
  return locale === "ru" ? "ru-RU" : "de-DE";
}
