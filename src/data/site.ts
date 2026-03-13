export const siteConfig = {
  name: "Hotel & Restaurant Waldschlösschen",
  shortName: "Waldschlösschen",
  tagline: "Saale-Unstrut",
  url: "https://waldschlösschen-saale-unstrut.de",
  phone: "+49 34461 255360",
  phoneDisplay: "+49 (0) 34461 / 255 360",
  email: "info@waldschloesschen-wangen.de",
  address: {
    street: "An der Steinklöbe 13",
    city: "Nebra OT Wangen",
    zip: "06642",
    country: "Deutschland",
  },
  coordinates: {
    lat: 51.2856,
    lng: 11.5594,
  },
  socials: {
    facebook: "https://www.facebook.com/waldschloesschen.wangen",
    instagram: "#",
  },
  pricing: {
    single: "ab 79,00 €",
    double: "ab 125,00 €",
  },
  rooms: 24,
} as const;

export const testimonials = [
  {
    id: "1",
    text: {
      de: "Ganz zauberhafte Unterkunft und ein Muss für alle, die die Arche Nebra besuchen wollen. Prima regionale Küche und wunderschön gestaltete Räume.",
      en: "A truly charming accommodation and a must for anyone visiting the Arche Nebra. Excellent regional cuisine and beautifully designed rooms.",
    },
    author: { de: "Gast aus Thüringen", en: "Guest from Thuringia" },
    source: "Booking.com",
    rating: 5,
  },
  {
    id: "2",
    text: {
      de: "Sehr ruhige Lage, liebevolle Ausstattung der Zimmer, hervorragende Matratzenqualität. Kommt ganz klar auf meine Favoritenliste.",
      en: "Very quiet location, lovingly furnished rooms, outstanding mattress quality. Definitely going on my favorites list.",
    },
    author: { de: "Radtourist", en: "Cycling Tourist" },
    source: "HRS",
    rating: 5,
  },
  {
    id: "3",
    text: {
      de: "Die Lage ist sehr idyllisch und ruhig mit einer parkähnlichen Außenanlage. Die Lobby und Gasträume sind sehr liebevoll gestaltet.",
      en: "The location is very idyllic and quiet with a park-like outdoor area. The lobby and guest rooms are very lovingly designed.",
    },
    author: { de: "Paar aus Berlin", en: "Couple from Berlin" },
    source: "Booking.com",
    rating: 5,
  },
] as const;

export const destinations = [
  {
    id: "arche-nebra",
    name: { de: "Arche Nebra", en: "Arche Nebra" },
    distance: { de: "4 Min. entfernt", en: "4 min away" },
    description: {
      de: "Das Museum zur weltberühmten Himmelsscheibe von Nebra — ein archäologisches Highlight direkt vor unserer Tür.",
      en: "The museum dedicated to the world-famous Nebra Sky Disc — an archaeological highlight right at our doorstep.",
    },
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80",
  },
  {
    id: "weinberge",
    name: { de: "Weinberge Saale-Unstrut", en: "Saale-Unstrut Vineyards" },
    distance: { de: "Weinregion", en: "Wine Region" },
    description: {
      de: "Erkunden Sie die nördlichste Qualitätsweinregion Deutschlands mit ihren malerischen Steilterrassen und Trockenmauern.",
      en: "Explore Germany's northernmost quality wine region with its picturesque steep terraces and dry stone walls.",
    },
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: "unstrutradweg",
    name: { de: "Unstrutradweg", en: "Unstrut Cycle Path" },
    distance: { de: "Ab Hotel", en: "From Hotel" },
    description: {
      de: "189 km Radweg entlang der Unstrut — direkt ab Hotel. Fahrräder können kostenlos bei uns ausgeliehen werden.",
      en: "189 km cycle path along the Unstrut — directly from the hotel. Bicycles can be borrowed from us free of charge.",
    },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
  },
  {
    id: "rotkaeppchen",
    name: { de: "Rotkäppchen Sektkellerei", en: "Rotkäppchen Sparkling Wine Cellar" },
    distance: { de: "27 km", en: "27 km" },
    description: {
      de: "Besichtigen Sie die berühmte Sektkellerei in Freyburg — 365 Tage im Jahr geöffnet.",
      en: "Visit the famous sparkling wine cellar in Freyburg — open 365 days a year.",
    },
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
  },
  {
    id: "memleben",
    name: { de: "Kloster & Kaiserpfalz Memleben", en: "Memleben Monastery & Imperial Palace" },
    distance: { de: "12 km", en: "12 km" },
    description: {
      de: "Historische Klosteranlage von großer Bedeutung — Sterbeort zweier deutscher Kaiser.",
      en: "Historic monastery complex of great significance — the place where two German emperors passed away.",
    },
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  },
  {
    id: "mittelberg",
    name: { de: "Mittelberg & Himmelsauge", en: "Mittelberg & Sky Eye" },
    distance: { de: "Am Fuße", en: "At the Foot" },
    description: {
      de: "Fundort der Himmelsscheibe mit 30 m hohem Aussichtsturm — atemberaubender Blick über die Region.",
      en: "Discovery site of the Sky Disc with a 30m observation tower — breathtaking views across the region.",
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
] as const;
