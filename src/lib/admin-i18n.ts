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
      navigationLabel: "Bereiche",
      shell: {
        title: "Operations Hub",
        description:
          "Zentrale fur Monitoring, Anfragen, Buchungen und Zimmerpflege. Jeder Bereich hat jetzt seine eigene Arbeitsflache.",
        sessionLabel: "Aktive Session",
        occupancyLabel: "Auslastung",
        inventoryLabel: "Frei",
      },
      navigation: {
        overview: {
          label: "Overview",
          detail: "KPI & Monitoring",
        },
        contacts: {
          label: "Anfragen",
          detail: "Kontaktpostfach",
        },
        bookings: {
          label: "Buchungen",
          detail: "Reservierungen",
        },
        vouchers: {
          label: "Gutscheine",
          detail: "Verkauf & Status",
        },
        events: {
          label: "Events",
          detail: "Planungskalender",
        },
        rooms: {
          label: "Zimmer",
          detail: "Preise & Inhalte",
        },
      },
      controls: {
        searchLabel: "Suche",
        apply: "Anwenden",
        reset: "Zurucksetzen",
        save: "Speichern",
        create: "Anlegen",
        delete: "Loschen",
        edit: "Bearbeiten",
        markRead: "Als gelesen markieren",
        markUnread: "Als ungelesen markieren",
        saveStatus: "Status speichern",
        bulkMarkRead: "Markierte als gelesen",
        bulkMarkUnread: "Markierte als ungelesen",
        bulkSaveStatus: "Status fur markierte speichern",
        bulkPublish: "Markierte veroffentlichen",
        bulkUnpublish: "Markierte zu Entwurfen machen",
        bulkRedeem: "Markierte als eingelost setzen",
        bulkReopen: "Markierte wieder offnen",
        previous: "Zuruck",
        next: "Weiter",
        openDetails: "Details offnen",
        backToList: "Zur Liste",
        yes: "Ja",
        no: "Nein",
        exportCsv: "CSV exportieren",
        dismiss: "Hinweis schliessen",
        confirmDelete: "Diesen Eintrag wirklich loschen?",
      },
      feedback: {
        created: {
          title: "Eintrag erstellt",
          description: "Der neue Datensatz wurde gespeichert und ist sofort verfugbar.",
        },
        saved: {
          title: "Anderungen gespeichert",
          description: "Die Aktualisierung wurde erfolgreich ubernommen.",
        },
        deleted: {
          title: "Eintrag geloscht",
          description: "Der Datensatz wurde entfernt und die Liste aktualisiert.",
        },
        statusUpdated: {
          title: "Status aktualisiert",
          description: "Der Status wurde gespeichert und die Ubersicht aktualisiert.",
        },
        bulkUpdated: {
          title: "Sammelaktion abgeschlossen",
          description: "Die markierten Eintrage wurden erfolgreich aktualisiert.",
        },
        selectionRequired: {
          title: "Keine Auswahl getroffen",
          description: "Bitte markieren Sie mindestens einen Eintrag fur die Aktion.",
        },
      },
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
      overview: {
        badge: "Schnellmonitoring",
        title: "Live-Ubersicht fur den Tagesbetrieb",
        description:
          "Auf der Startseite bleiben nur Kennzahlen fur schnelle Entscheidungen. Die operative Arbeit liegt in den einzelnen Kategorien.",
        quickLinksTitle: "Schnellzugriff",
        quickLinksDescription:
          "Direkter Wechsel in die Bereiche, die heute bearbeitet werden mussen.",
        queueTitle: "Prioritaten",
        queueDescription:
          "Diese Kennzahlen zeigen, wo sofortiger Handlungsbedarf entsteht.",
        occupancyTitle: "Zimmerauslastung",
        occupancyDescription:
          "Kapazitat, belegte Einheiten und verfugbarer Bestand auf einen Blick.",
        bookingMixTitle: "Buchungsstatus",
        bookingMixDescription:
          "Verteilung der relevanten Buchungszustande fur den laufenden Betrieb.",
        stats: {
          occupancyRate: "Auslastung",
          availableInventory: "Freie Einheiten",
          occupiedInventory: "Belegte Einheiten",
          activeRooms: "Aktive Kategorien",
          unreadContacts: "Ungelesene Anfragen",
          pendingBookings: "Offene Buchungen",
          openVouchers: "Offene Gutscheine",
          upcomingEvents: "Kommende Events",
          confirmedBookings: "Bestatigt",
          checkedInBookings: "Check-ins",
        },
      },
      pages: {
        contacts: {
          badge: "Kontaktanfragen",
          title: "Inbox fur Kontaktformulare",
          description:
            "Alle eingegangenen Nachrichten aus dem Kontaktformular, sortiert nach Aktualitat und mit direktem Zugriff auf E-Mail und Telefon.",
          stats: {
            total: "Alle Anfragen",
            unread: "Ungelesen",
          },
          filters: {
            searchPlaceholder: "Name, E-Mail, Betreff oder Nachricht",
            readStateLabel: "Lesestatus",
            readStates: {
              all: "Alle",
              unread: "Nur ungelesen",
              read: "Nur gelesen",
            },
          },
          fields: {
            name: "Name",
            email: "E-Mail",
            phone: "Telefon",
            subject: "Betreff",
            message: "Nachricht",
            created: "Erstellt",
            locale: "Sprache",
          },
          detail: {
            title: "Anfragedetails",
            description:
              "Vollstandige Nachricht mit Kontaktinformationen und Lesestatus in einer separaten Detailansicht.",
          },
        },
        bookings: {
          badge: "Buchungen",
          title: "Buchungsmanagement",
          description:
            "Reservierungen mit Gastdaten, Zeitraum, Status und Umsatz auf einer eigenen Arbeitsflache statt im Dashboard-Mix.",
          stats: {
            total: "Alle Buchungen",
            pending: "Offen",
            confirmed: "Bestatigt",
            checkedIn: "Aktuell im Haus",
          },
          fields: {
            bookingId: "Buchungs-ID",
            room: "Zimmer",
            stay: "Aufenthalt",
            guests: "Gaste",
            nights: "Nachte",
            locale: "Sprache",
            total: "Gesamt",
            roomRate: "Preis pro Nacht",
            baseTotal: "Basisbetrag",
            dogFeeTotal: "Hundezuschlag",
            dogs: "Hunde",
            bicycle: "Fahrrader",
            restaurant: "Restaurant",
            breakfast: "Frühstück",
            guest: "Gast",
            notes: "Notizen",
            created: "Erfasst",
            updated: "Aktualisiert",
          },
          filters: {
            searchPlaceholder: "Gast, E-Mail, Buchungs-ID oder Zimmer",
            statusLabel: "Status",
            allStatuses: "Alle Status",
          },
          detail: {
            title: "Buchungsdetails",
            description:
              "Vollstandige Reservierungsdaten mit Gast, Zeitraum, Extras und Statusverwaltung.",
          },
        },
        vouchers: {
          badge: "Gutscheine",
          title: "Gutscheinubersicht",
          description:
            "Verkaufte Gutscheine mit Betrag, Code, Empfanger und Einlosestatus in einem separaten Bereich.",
          stats: {
            open: "Offen",
            redeemed: "Eingelost",
          },
          fields: {
            buyerName: "Kaufer",
            buyerEmail: "Kaufer E-Mail",
            code: "Code",
            amount: "Betrag",
            recipient: "Empfanger",
            message: "Nachricht",
            created: "Erstellt",
            redeemed: "Eingelost",
          },
          filters: {
            searchPlaceholder: "Code, Kaufer, E-Mail oder Empfanger",
            stateLabel: "Status",
            states: {
              all: "Alle",
              open: "Offen",
              redeemed: "Eingelost",
            },
          },
          form: {
            createTitle: "Neuen Gutschein erfassen",
            editTitle: "Gutschein bearbeiten",
            code: "Code",
            buyerName: "Kaufer",
            buyerEmail: "Kaufer E-Mail",
            recipient: "Empfanger",
            amount: "Betrag",
            message: "Nachricht",
            isRedeemed: "Bereits eingelost",
          },
          detail: {
            title: "Gutscheindetails",
            description:
              "Einzelansicht fur Betrage, Status, Empfanger und manuelle Pflege eines Gutscheins.",
          },
        },
        events: {
          badge: "Events",
          title: "Eventplanung",
          description:
            "Kommende Veranstaltungen und Veroffentlichungsstatus getrennt vom Tagesgeschaft der Reservierungen.",
          stats: {
            published: "Veroffentlicht",
            upcoming: "Kommend",
          },
          statuses: {
            unpublished: "Nicht veroffentlicht",
          },
          fields: {
            primaryTitle: "Titel Standard",
            secondaryTitle: "Titel EN",
            date: "Datum und Uhrzeit",
            description: "Beschreibung",
            descriptionEn: "Beschreibung EN",
            imageUrl: "Bild-URL",
            visibility: "Sichtbarkeit",
            created: "Erstellt",
          },
          filters: {
            searchPlaceholder: "Titel, Beschreibung oder EN-Inhalt",
            visibilityLabel: "Sichtbarkeit",
            timeLabel: "Zeitraum",
            visibilities: {
              all: "Alle",
              published: "Veroffentlicht",
              draft: "Entwurfe",
            },
            times: {
              all: "Alle",
              upcoming: "Kommend",
              past: "Vergangen",
            },
          },
          form: {
            createTitle: "Event anlegen",
            editTitle: "Event bearbeiten",
            title: "Titel",
            titleEn: "Titel EN",
            date: "Datum und Uhrzeit",
            description: "Beschreibung",
            descriptionEn: "Beschreibung EN",
            imageUrl: "Bild-URL",
            isPublished: "Sofort veroffentlichen",
          },
          detail: {
            title: "Eventdetails",
            description:
              "Einzelansicht fur Zeit, Inhalte, Veroffentlichungsstatus und Pflege eines Events.",
          },
        },
        rooms: {
          badge: "Zimmerverwaltung",
          title: "Zimmer, Preise und Verfugbarkeit",
          description:
            "Pflege von Zimmerdaten, Inventar und Texten in einer eigenen Verwaltungsansicht mit klarer Kapazitatsubersicht.",
          stats: {
            active: "Aktive Kategorien",
            inventory: "Gesamtinventar",
            available: "Frei",
            occupied: "Belegt",
          },
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
      navigationLabel: "Разделы",
      shell: {
        title: "Admin Operations",
        description:
          "Центральная точка для мониторинга, заявок, бронирований и управления номерами. У каждого направления теперь свой отдельный рабочий экран.",
        sessionLabel: "Активная сессия",
        occupancyLabel: "Загрузка",
        inventoryLabel: "Свободно",
      },
      navigation: {
        overview: {
          label: "Обзор",
          detail: "KPI и мониторинг",
        },
        contacts: {
          label: "Заявки",
          detail: "Контактная почта",
        },
        bookings: {
          label: "Бронирования",
          detail: "Резервации",
        },
        vouchers: {
          label: "Сертификаты",
          detail: "Продажи и статус",
        },
        events: {
          label: "События",
          detail: "Календарь планирования",
        },
        rooms: {
          label: "Номера",
          detail: "Цены и контент",
        },
      },
      controls: {
        searchLabel: "Поиск",
        apply: "Применить",
        reset: "Сбросить",
        save: "Сохранить",
        create: "Создать",
        delete: "Удалить",
        edit: "Редактировать",
        markRead: "Отметить как прочитанное",
        markUnread: "Вернуть в непрочитанные",
        saveStatus: "Сохранить статус",
        bulkMarkRead: "Отметить выбранные как прочитанные",
        bulkMarkUnread: "Вернуть выбранные в непрочитанные",
        bulkSaveStatus: "Сохранить статус для выбранных",
        bulkPublish: "Опубликовать выбранные",
        bulkUnpublish: "Вернуть выбранные в черновики",
        bulkRedeem: "Отметить выбранные как использованные",
        bulkReopen: "Снова открыть выбранные",
        previous: "Назад",
        next: "Дальше",
        openDetails: "Открыть детали",
        backToList: "К списку",
        yes: "Да",
        no: "Нет",
        exportCsv: "Экспорт CSV",
        dismiss: "Закрыть уведомление",
        confirmDelete: "Точно удалить эту запись?",
      },
      feedback: {
        created: {
          title: "Запись создана",
          description: "Новая запись сохранена и уже доступна в системе.",
        },
        saved: {
          title: "Изменения сохранены",
          description: "Обновление успешно применено.",
        },
        deleted: {
          title: "Запись удалена",
          description: "Данные удалены, список уже обновлен.",
        },
        statusUpdated: {
          title: "Статус обновлен",
          description: "Новый статус сохранен и отражен в панели.",
        },
        bulkUpdated: {
          title: "Массовое действие выполнено",
          description: "Выбранные записи успешно обновлены.",
        },
        selectionRequired: {
          title: "Ничего не выбрано",
          description: "Выберите хотя бы одну запись для выполнения действия.",
        },
      },
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
      overview: {
        badge: "Быстрый мониторинг",
        title: "Оперативный обзор по админке",
        description:
          "На главной странице остаются только ключевые метрики для быстрой оценки ситуации. Вся операционная работа перенесена в отдельные категории.",
        quickLinksTitle: "Быстрый доступ",
        quickLinksDescription:
          "Переходы в рабочие разделы, которые требуют внимания в течение дня.",
        queueTitle: "Приоритеты",
        queueDescription:
          "Эти показатели сразу показывают, где образуется текущая нагрузка.",
        occupancyTitle: "Загрузка номерного фонда",
        occupancyDescription:
          "Вместимость, занятые единицы и доступный остаток в одном блоке.",
        bookingMixTitle: "Статусы бронирований",
        bookingMixDescription:
          "Распределение ключевых состояний бронирований для текущей работы.",
        stats: {
          occupancyRate: "Загрузка",
          availableInventory: "Свободные единицы",
          occupiedInventory: "Занятые единицы",
          activeRooms: "Активные категории",
          unreadContacts: "Непрочитанные заявки",
          pendingBookings: "Открытые брони",
          openVouchers: "Активные сертификаты",
          upcomingEvents: "Ближайшие события",
          confirmedBookings: "Подтверждено",
          checkedInBookings: "Заселены",
        },
      },
      pages: {
        contacts: {
          badge: "Контактные заявки",
          title: "Inbox контактной формы",
          description:
            "Все сообщения из формы обратной связи, отсортированные по свежести, с быстрым доступом к email и телефону.",
          stats: {
            total: "Всего заявок",
            unread: "Непрочитано",
          },
          filters: {
            searchPlaceholder: "Имя, email, тема или текст сообщения",
            readStateLabel: "Статус чтения",
            readStates: {
              all: "Все",
              unread: "Только непрочитанные",
              read: "Только прочитанные",
            },
          },
          fields: {
            name: "Имя",
            email: "E-mail",
            phone: "Телефон",
            subject: "Тема",
            message: "Сообщение",
            created: "Создано",
            locale: "Язык",
          },
          detail: {
            title: "Детали заявки",
            description:
              "Полное сообщение с контактными данными и управлением статусом чтения на отдельной странице.",
          },
        },
        bookings: {
          badge: "Бронирования",
          title: "Управление бронированиями",
          description:
            "Резервации с данными гостя, периодом, статусом и суммой теперь вынесены в отдельный рабочий раздел.",
          stats: {
            total: "Всего бронирований",
            pending: "В ожидании",
            confirmed: "Подтверждено",
            checkedIn: "Сейчас проживают",
          },
          fields: {
            bookingId: "ID бронирования",
            room: "Номер",
            stay: "Период",
            guests: "Гости",
            nights: "Ночей",
            locale: "Язык",
            total: "Сумма",
            roomRate: "Цена за ночь",
            baseTotal: "Базовая сумма",
            dogFeeTotal: "Доплата за собак",
            dogs: "Собаки",
            bicycle: "Велосипеды",
            restaurant: "Ресторан",
            breakfast: "Завтрак",
            guest: "Гость",
            notes: "Примечания",
            created: "Создано",
            updated: "Обновлено",
          },
          filters: {
            searchPlaceholder: "Гость, email, ID брони или номер",
            statusLabel: "Статус",
            allStatuses: "Все статусы",
          },
          detail: {
            title: "Детали бронирования",
            description:
              "Полные данные по резервации: гость, даты, допуслуги, сумма и управление статусом.",
          },
        },
        vouchers: {
          badge: "Сертификаты",
          title: "Обзор сертификатов",
          description:
            "Проданные сертификаты с суммой, кодом, получателем и статусом использования в отдельном разделе.",
          stats: {
            open: "Активные",
            redeemed: "Использованы",
          },
          fields: {
            buyerName: "Покупатель",
            buyerEmail: "E-mail покупателя",
            code: "Код",
            amount: "Сумма",
            recipient: "Получатель",
            message: "Сообщение",
            created: "Создано",
            redeemed: "Использовано",
          },
          filters: {
            searchPlaceholder: "Код, покупатель, email или получатель",
            stateLabel: "Статус",
            states: {
              all: "Все",
              open: "Активные",
              redeemed: "Использованы",
            },
          },
          form: {
            createTitle: "Создать сертификат",
            editTitle: "Редактировать сертификат",
            code: "Код",
            buyerName: "Покупатель",
            buyerEmail: "E-mail покупателя",
            recipient: "Получатель",
            amount: "Сумма",
            message: "Сообщение",
            isRedeemed: "Уже использован",
          },
          detail: {
            title: "Детали сертификата",
            description:
              "Отдельная страница для суммы, получателя, статуса и ручного редактирования сертификата.",
          },
        },
        events: {
          badge: "События",
          title: "Планирование событий",
          description:
            "Ближайшие мероприятия и статус публикации отделены от ежедневной работы с бронированиями.",
          stats: {
            published: "Опубликовано",
            upcoming: "Предстоит",
          },
          statuses: {
            unpublished: "Не опубликовано",
          },
          fields: {
            primaryTitle: "Основной заголовок",
            secondaryTitle: "Заголовок EN",
            date: "Дата и время",
            description: "Описание",
            descriptionEn: "Описание EN",
            imageUrl: "URL изображения",
            visibility: "Публикация",
            created: "Создано",
          },
          filters: {
            searchPlaceholder: "Заголовок, описание или EN-контент",
            visibilityLabel: "Публикация",
            timeLabel: "Период",
            visibilities: {
              all: "Все",
              published: "Опубликованные",
              draft: "Черновики",
            },
            times: {
              all: "Все",
              upcoming: "Предстоящие",
              past: "Прошедшие",
            },
          },
          form: {
            createTitle: "Создать событие",
            editTitle: "Редактировать событие",
            title: "Заголовок",
            titleEn: "Заголовок EN",
            date: "Дата и время",
            description: "Описание",
            descriptionEn: "Описание EN",
            imageUrl: "URL изображения",
            isPublished: "Сразу опубликовать",
          },
          detail: {
            title: "Детали события",
            description:
              "Отдельная страница для времени, контента, публикации и ручного управления событием.",
          },
        },
        rooms: {
          badge: "Управление номерами",
          title: "Номера, цены и доступность",
          description:
            "Редактирование карточек номеров, инвентаря и контента вынесено в отдельный экран с понятной сводкой по вместимости.",
          stats: {
            active: "Активные категории",
            inventory: "Общий инвентарь",
            available: "Свободно",
            occupied: "Занято",
          },
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
