import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  type PublicRestaurantMenuCategory,
  type PublicRestaurantMenuPriceVariant,
  type RestaurantMenuLocale,
} from "@/lib/restaurant-menu-shared";

const MENU_IMAGE_BASE = "/restaurant-menu";

function priceVariants(
  variants: Array<[label: string, price: number]>
): PublicRestaurantMenuPriceVariant[] {
  return variants.map(([label, price]) => ({ label, price }));
}

interface DefaultRestaurantMenuItem {
  allergens?: string;
  descriptionDe?: string;
  descriptionEn?: string;
  imageSlug: string;
  isSignature?: boolean;
  isVegetarian?: boolean;
  nameDe: string;
  nameEn?: string;
  price: number;
  priceNoteDe?: string;
  priceNoteEn?: string;
  priceVariants?: PublicRestaurantMenuPriceVariant[];
  slug: string;
}

interface DefaultRestaurantMenuCategory {
  descriptionDe?: string;
  descriptionEn?: string;
  items: DefaultRestaurantMenuItem[];
  slug: string;
  titleDe: string;
  titleEn?: string;
}

const DEFAULT_RESTAURANT_MENU: DefaultRestaurantMenuCategory[] = [
  {
    slug: "spargelzeit",
    titleDe: "Spargelzeit",
    titleEn: "Asparagus Season",
    descriptionDe:
      "Frischer Spargel vom Spargelhof Kutzleben, jetzt als saisonale Spezialität.",
    descriptionEn:
      "Fresh asparagus from Spargelhof Kutzleben, served as a seasonal special.",
    items: [
      {
        slug: "spargel-kokos-chilisuppe",
        imageSlug: "spargel-kokos-chilisuppe",
        nameDe: "Spargel-Kokos-Chilisuppe",
        nameEn: "Asparagus, Coconut & Chili Soup",
        descriptionDe:
          "Mit Spargeleinlage, serviert mit unserem hausgebackenen Brot.",
        descriptionEn:
          "With asparagus garnish, served with our house-baked bread.",
        price: 8.5,
        isVegetarian: true,
        allergens: "A",
      },
      {
        slug: "spargel-anti-pasti",
        imageSlug: "spargel-anti-pasti",
        nameDe: "Spargel-Anti-Pasti",
        nameEn: "Asparagus Anti-Pasti",
        descriptionDe:
          "Wrap mit Bärlauchrahm und gegrilltem Spargel, marinierter Spargelsalat und rosa Roastbeef.",
        descriptionEn:
          "Wrap with wild garlic cream and grilled asparagus, marinated asparagus salad and pink roast beef.",
        price: 16.9,
        isSignature: true,
      },
      {
        slug: "flammkuchen-spargel",
        imageSlug: "flammkuchen-spargel",
        nameDe: "Flammkuchen Spargel",
        nameEn: "Asparagus Flammkuchen",
        descriptionDe:
          "Belegt mit Bärlauchrahm, roten Zwiebeln, Frühlingslauch und gegrilltem Spargel.",
        descriptionEn:
          "Topped with wild garlic cream, red onions, spring onion and grilled asparagus.",
        price: 16.9,
        isVegetarian: true,
        allergens: "A, E, F, G, H, L, M",
      },
      {
        slug: "portion-frischer-stangenspargel",
        imageSlug: "portion-frischer-stangenspargel",
        nameDe: "Portion frischer Stangenspargel",
        nameEn: "Fresh White Asparagus",
        descriptionDe:
          "Wahlweise mit Sauce Hollandaise oder Semmelbutter mit gehacktem Ei, dazu Salzkartoffeln.",
        descriptionEn:
          "With sauce hollandaise or breadcrumb butter with chopped egg, served with boiled potatoes.",
        price: 19.9,
        isVegetarian: true,
      },
      {
        slug: "stangenspargel-schweineschnitzel",
        imageSlug: "stangenspargel-schweineschnitzel",
        nameDe: "Stangenspargel mit Schweineschnitzel",
        nameEn: "Asparagus with Pork Schnitzel",
        descriptionDe:
          "Frischer Spargel mit Sauce Hollandaise oder Semmelbutter, Salzkartoffeln und saftigem Schnitzel.",
        descriptionEn:
          "Fresh asparagus with sauce hollandaise or breadcrumb butter, boiled potatoes and pork schnitzel.",
        price: 26.5,
      },
      {
        slug: "stangenspargel-lachsfilet",
        imageSlug: "stangenspargel-lachsfilet",
        nameDe: "Stangenspargel mit Lachsfilet",
        nameEn: "Asparagus with Salmon Fillet",
        descriptionDe:
          "Frischer Spargel mit Salzkartoffeln und gebratenem Lachsfilet.",
        descriptionEn:
          "Fresh asparagus with boiled potatoes and seared salmon fillet.",
        price: 27.5,
      },
      {
        slug: "stangenspargel-rinderrueckensteak",
        imageSlug: "stangenspargel-rinderrueckensteak",
        nameDe: "Stangenspargel mit Rinderrückensteak",
        nameEn: "Asparagus with Beef Sirloin Steak",
        descriptionDe:
          "Frischer Spargel mit Salzkartoffeln und gebratenem Rinderrückensteak.",
        descriptionEn:
          "Fresh asparagus with boiled potatoes and seared beef sirloin steak.",
        price: 28.5,
        isSignature: true,
      },
      {
        slug: "spargel-panna-cotta",
        imageSlug: "spargel-panna-cotta",
        nameDe: "Spargel-Panna-Cotta",
        nameEn: "Asparagus Panna Cotta",
        descriptionDe: "Mit frischen Erdbeeren.",
        descriptionEn: "Served with fresh strawberries.",
        price: 9.9,
        isVegetarian: true,
      },
      {
        slug: "frische-erdbeeren-vanilleeis",
        imageSlug: "frische-erdbeeren-vanilleeis",
        nameDe: "Frische Erdbeeren",
        nameEn: "Fresh Strawberries",
        descriptionDe: "Mit zwei Kugeln Vanilleeis und Sahne.",
        descriptionEn: "With two scoops of vanilla ice cream and whipped cream.",
        price: 8.5,
        isVegetarian: true,
      },
    ],
  },
  {
    slug: "vorspeisen",
    titleDe: "Vorspeisen",
    titleEn: "Starters",
    descriptionDe:
      "Zu allen Vorspeisen reichen wir unser frisch gebackenes Hausbrot.",
    descriptionEn: "All starters are served with our fresh house-baked bread.",
    items: [
      {
        slug: "soljanka",
        imageSlug: "soljanka",
        nameDe: "Soljanka nach Art des Hauses",
        nameEn: "House-style Soljanka",
        descriptionDe: "Kräftige Soljanka nach Waldschlösschen Art.",
        descriptionEn: "A hearty soljanka prepared in Waldschlösschen style.",
        price: 7.9,
        allergens: "L, A, G",
      },
      {
        slug: "kleiner-gemischter-salat",
        imageSlug: "kleiner-gemischter-salat",
        nameDe: "Kleiner gemischter Salat",
        nameEn: "Small Mixed Salad",
        descriptionDe: "Mit Hausdressing.",
        descriptionEn: "With house dressing.",
        price: 7.9,
        isVegetarian: true,
        allergens: "L, A, M, 10, E",
      },
      {
        slug: "wuerzfleisch",
        imageSlug: "wuerzfleisch",
        nameDe: "Würzfleisch",
        nameEn: "Creamy Pork Ragout",
        descriptionDe: "Feines Ragout vom Schwein, gratiniert mit Käse.",
        descriptionEn: "Fine pork ragout gratinated with cheese.",
        price: 8.9,
        allergens: "A, G, L, M, O, E, H",
      },
      {
        slug: "gratinierter-fetakaese",
        imageSlug: "gratinierter-fetakaese",
        nameDe: "Gratinierter Fetakäse",
        nameEn: "Gratinated Feta Cheese",
        descriptionDe:
          "Mariniert mit Oliven, getrockneten Tomaten, Kräutern, Knoblauch und Olivenöl.",
        descriptionEn:
          "Marinated with olives, dried tomatoes, herbs, garlic and olive oil.",
        price: 8.9,
        isVegetarian: true,
        allergens: "2, 6, A, G, L, O",
      },
    ],
  },
  {
    slug: "flammkuchen",
    titleDe: "Flammkuchen",
    titleEn: "Flammkuchen",
    descriptionDe: "Kross, lecker und perfekt für den kleinen Hunger.",
    descriptionEn: "Crisp, savoury and perfect for a light bite.",
    items: [
      {
        slug: "flammkuchen-klassisch",
        imageSlug: "flammkuchen-klassisch",
        nameDe: "Flammkuchen Klassisch",
        nameEn: "Classic Flammkuchen",
        descriptionDe:
          "Belegt mit Bärlauchrahm, roten Zwiebeln, Frühlingslauch und Schinken.",
        descriptionEn:
          "Topped with wild garlic cream, red onions, spring onion and ham.",
        price: 13.5,
        allergens: "A, E, F, G, H, L, M",
      },
      {
        slug: "flammkuchen-schweizer-art",
        imageSlug: "flammkuchen-schweizer-art",
        nameDe: "Flammkuchen Schweizer Art",
        nameEn: "Swiss-style Flammkuchen",
        descriptionDe:
          "Mit Bärlauchrahm, roten Zwiebeln, Frühlingslauch, Schinken und Käse.",
        descriptionEn:
          "With wild garlic cream, red onions, spring onion, ham and cheese.",
        price: 14.5,
        allergens: "A, E, F, G, H, L, M",
      },
      {
        slug: "flammkuchen-waldschloesschen",
        imageSlug: "flammkuchen-waldschloesschen",
        nameDe: "Flammkuchen Waldschlösschen",
        nameEn: "Waldschlösschen Flammkuchen",
        descriptionDe:
          "Der Besondere mit Bärlauchrahm, Kräuter-Rinderfilet, Parmesan und Rucola.",
        descriptionEn:
          "Our special with wild garlic cream, herb beef fillet, parmesan and rocket.",
        price: 17.5,
        isSignature: true,
        allergens: "A, E, F, G, H, L, M",
      },
    ],
  },
  {
    slug: "hauptgerichte",
    titleDe: "Hauptgerichte",
    titleEn: "Main Courses",
    descriptionDe:
      "Regionale Klassiker nach Waldschlösschen Art interpretiert.",
    descriptionEn:
      "Regional classics interpreted in Waldschlösschen style.",
    items: [
      {
        slug: "schuesselsuelze",
        imageSlug: "schuesselsuelze",
        nameDe: "Schüsselsülze von unserem Hausfleischer",
        nameEn: "House Butcher's Aspic",
        descriptionDe:
          "Serviert mit hausgemachter Remoulade und Bratkartoffeln.",
        descriptionEn: "Served with house-made remoulade and fried potatoes.",
        price: 18.9,
        allergens: "2, A, C, E, F, G, H, L, M, O",
      },
      {
        slug: "forelle-muellerin-art",
        imageSlug: "forelle-muellerin-art",
        nameDe: "Gebratene Forelle Müllerin Art",
        nameEn: "Trout Müllerin Style",
        descriptionDe:
          "Serviert mit zerlassener Butter, Salzkartoffeln und Meerrettich.",
        descriptionEn:
          "Served with melted butter, boiled potatoes and horseradish.",
        price: 25.9,
        allergens: "7, D, G, L, O",
      },
      {
        slug: "salatvariation-waldschloesschen",
        imageSlug: "salatvariation-waldschloesschen",
        nameDe: "Salatvariation Waldschlösschen",
        nameEn: "Waldschlösschen Salad",
        descriptionDe:
          "Mit gebratenen Streifen von der Hähnchenbrust und unserem Hausbrot.",
        descriptionEn:
          "With seared chicken breast strips and our house-baked bread.",
        price: 22.9,
        allergens: "A, E, F, H, L, M, O, G",
      },
      {
        slug: "koestritzer-bierfleisch",
        imageSlug: "koestritzer-bierfleisch",
        nameDe: "Köstritzer Bierfleisch",
        nameEn: "Köstritzer Beer-braised Pork",
        descriptionDe:
          "Kräftig geschmortes Ragout vom Schweinenacken im Bier-Sud mit gebratenen Kräutersemmelknödelscheiben.",
        descriptionEn:
          "Rich pork-neck ragout braised in beer, served with fried herb bread dumpling slices.",
        price: 21.6,
        isSignature: true,
        allergens: "1, A, C, E, G, H, L, M",
      },
      {
        slug: "lachsfilet-rote-beete-pueree",
        imageSlug: "lachsfilet-rote-beete-pueree",
        nameDe: "Auf der Hautseite gebratenes Lachsfilet",
        nameEn: "Crispy-skin Salmon Fillet",
        descriptionDe: "Mit Kartoffel-Rote-Beete-Püree und Salat.",
        descriptionEn: "With potato and beetroot puree and salad.",
        price: 25.9,
        allergens: "A, D, F, G, H, L, M, O, 10, 7",
      },
      {
        slug: "wildschweinroulade",
        imageSlug: "wildschweinroulade",
        nameDe: "Geschmorte Wildschweinroulade",
        nameEn: "Braised Wild Boar Roulade",
        descriptionDe:
          "Waldschlösschen Art mit Rosmarin-Rotweinsauce, Apfelrotkraut und handgemachten Kartoffelklößen.",
        descriptionEn:
          "Waldschlösschen style with rosemary red-wine sauce, apple red cabbage and handmade potato dumplings.",
        price: 25.9,
        isSignature: true,
        allergens: "2, H, L, M",
      },
      {
        slug: "waldschloesschen-burger",
        imageSlug: "waldschloesschen-burger",
        nameDe: "Waldschlösschen-Burger",
        nameEn: "Waldschlösschen Burger",
        descriptionDe:
          "Rindfleisch-Burger mit Cheddar, Bacon, Rotwein-Zwiebeln, BBQ-Sauce und Weißkrautsalat, dazu Süßkartoffelpommes.",
        descriptionEn:
          "Beef burger with cheddar, bacon, red-wine onions, BBQ sauce and cabbage slaw, served with sweet potato fries.",
        price: 21.9,
        allergens: "10, A, H, 1, 4, L, 2",
      },
      {
        slug: "wangener-rostbraten",
        imageSlug: "wangener-rostbraten",
        nameDe: "Wangener Rostbraten",
        nameEn: "Wangen-style Sirloin Steak",
        descriptionDe:
          "Gebratenes Rinderrückensteak mit Rotwein-Zwiebeln und Bratkartoffeln.",
        descriptionEn:
          "Seared beef sirloin steak with red-wine onions and fried potatoes.",
        price: 29.9,
        allergens: "2, 7, G, H, M",
      },
      {
        slug: "kraeuter-rinderfilet",
        imageSlug: "kraeuter-rinderfilet",
        nameDe: "Gebratenes Kräuter-Rinderfilet",
        nameEn: "Herb Beef Fillet",
        descriptionDe:
          "Serviert mit geschwenkten Bohnen und Kartoffel-Reibekuchen.",
        descriptionEn:
          "Served with tossed beans and potato fritters.",
        price: 29.9,
        isSignature: true,
        allergens: "2, 7, G, H, M",
      },
      {
        slug: "schni-pi-po",
        imageSlug: "schni-pi-po",
        nameDe: "Schni-Pi-Po",
        nameEn: "Pork Schnitzel with Mushrooms and Fries",
        descriptionDe:
          "Der Klassiker: saftig gebratenes Schweineschnitzel mit cremigen Pilzen und Pommes.",
        descriptionEn:
          "The classic: juicy pork schnitzel with creamy mushrooms and fries.",
        price: 22.9,
        allergens: "A, C, 4, 11, G, L, O",
      },
    ],
  },
  {
    slug: "desserts",
    titleDe: "Desserts",
    titleEn: "Desserts",
    descriptionDe:
      "Süße Klassiker, Eisbecher und hausgemachte Lieblingsstücke.",
    descriptionEn: "Sweet classics, ice cream cups and house-made favourites.",
    items: [
      {
        slug: "apfelstrudel",
        imageSlug: "apfelstrudel",
        nameDe: "Apfelstrudel",
        nameEn: "Apple Strudel",
        descriptionDe:
          "An Vanillesauce mit einer Kugel Vanilleeis und Sahne.",
        descriptionEn:
          "With vanilla sauce, a scoop of vanilla ice cream and whipped cream.",
        price: 8.5,
        isVegetarian: true,
        allergens: "G, E, H, A, O",
      },
      {
        slug: "joghurtbecher",
        imageSlug: "joghurtbecher",
        nameDe: "Joghurtbecher",
        nameEn: "Yoghurt Sundae",
        descriptionDe:
          "Zwei Kugeln Joghurteis mit marinierten Beerenfrüchten und Naturjoghurt.",
        descriptionEn:
          "Two scoops of yoghurt ice cream with marinated berries and natural yoghurt.",
        price: 7.5,
        isVegetarian: true,
        allergens: "G, E, H, A, O",
      },
      {
        slug: "schokoladenbecher",
        imageSlug: "schokoladenbecher",
        nameDe: "Schokoladenbecher",
        nameEn: "Chocolate Sundae",
        descriptionDe:
          "Drei Kugeln Eis mit Schokoladensauce und Sahne.",
        descriptionEn:
          "Three scoops of ice cream with chocolate sauce and whipped cream.",
        price: 7.9,
        isVegetarian: true,
        allergens: "1, 2, A, C, E, G, H, O",
      },
      {
        slug: "gemischtes-eis",
        imageSlug: "gemischtes-eis",
        nameDe: "Gemischtes Eis",
        nameEn: "Mixed Ice Cream",
        descriptionDe: "Drei Kugeln Eis mit Sahne.",
        descriptionEn: "Three scoops of ice cream with whipped cream.",
        price: 6.9,
        isVegetarian: true,
        allergens: "G, E, H, A",
      },
      {
        slug: "eis-und-heiss",
        imageSlug: "eis-und-heiss",
        nameDe: "Eis & Heiß",
        nameEn: "Vanilla Ice Cream & Hot Raspberries",
        descriptionDe:
          "Drei Kugeln Vanilleeis mit warmen Himbeeren und Sahne.",
        descriptionEn:
          "Three scoops of vanilla ice cream with warm raspberries and whipped cream.",
        price: 8.5,
        isVegetarian: true,
        allergens: "G, E, H, A, O",
      },
      {
        slug: "warmer-schokoladenkuchen",
        imageSlug: "warmer-schokoladenkuchen",
        nameDe: "Warmer Schokoladenkuchen",
        nameEn: "Warm Chocolate Cake",
        descriptionDe:
          "Mit Jogurt-Himbeereis und marinierten Waldfrüchten.",
        descriptionEn:
          "With yoghurt-raspberry ice cream and marinated forest berries.",
        price: 8.5,
        isVegetarian: true,
        allergens: "10, A, C, E, G, H, O",
      },
      {
        slug: "coppa-bella",
        imageSlug: "coppa-bella",
        nameDe: "Coppa Bella",
        nameEn: "Coppa Bella",
        descriptionDe:
          "Stracciatella- und Schokoladeneis mit Schokoladensauce, Eierlikör und Sahne.",
        descriptionEn:
          "Stracciatella and chocolate ice cream with chocolate sauce, egg liqueur and whipped cream.",
        price: 8.9,
        isVegetarian: true,
        allergens: "1, 2, A, C, E, G, H, O",
      },
      {
        slug: "eiskaffee-eisschokolade",
        imageSlug: "eiskaffee-eisschokolade",
        nameDe: "Eiskaffee / Eisschokolade",
        nameEn: "Iced Coffee / Iced Chocolate",
        descriptionDe:
          "Mit einer Kugel Vanilleeis und Sahne.",
        descriptionEn:
          "With a scoop of vanilla ice cream and whipped cream.",
        price: 4.9,
        isVegetarian: true,
        allergens: "A, C, E, F, G, H, O",
      },
      {
        slug: "creme-brulee",
        imageSlug: "creme-brulee",
        nameDe: "Hausgemachte Creme Brûlée",
        nameEn: "House-made Creme Brulee",
        descriptionDe: "Fein karamellisiert und klassisch serviert.",
        descriptionEn: "Delicately caramelised and served classic.",
        price: 6.5,
        isVegetarian: true,
        allergens: "D, G, L, A, O",
      },
    ],
  },
  {
    slug: "hausweine",
    titleDe: "Hausweine",
    titleEn: "House Wines",
    descriptionDe:
      "Unsere Schlossgeist-Hausweine zum 10-jährigen Jubiläum.",
    descriptionEn:
      "Our Schlossgeist house wines for the 10th anniversary.",
    items: [
      {
        slug: "hauswein-marlene-bacchus",
        imageSlug: "hauswein-marlene-bacchus",
        nameDe: "Marlene · 2024er Bacchus",
        nameEn: "Marlene · 2024 Bacchus",
        descriptionDe:
          "DQW, trocken. Frisch und fruchtig mit saftiger Aprikose und Mango.",
        descriptionEn:
          "Dry quality wine. Fresh and fruity with juicy apricot and mango.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "hauswein-julian-kernling",
        imageSlug: "hauswein-julian-kernling",
        nameDe: "Julian · 2023er Kernling",
        nameEn: "Julian · 2023 Kernling",
        descriptionDe:
          "QmP, Auslese trocken. Dezente Säure, Aromen von Äpfeln und Birnennote.",
        descriptionEn:
          "Dry Auslese. Delicate acidity with apple and pear notes.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "hauswein-alma-muscaris",
        imageSlug: "hauswein-alma-muscaris",
        nameDe: "Alma · 2024er Muscaris",
        nameEn: "Alma · 2024 Muscaris",
        descriptionDe: "QmP, Auslese süß. Fruchtig süß und lecker süffig.",
        descriptionEn: "Sweet Auslese. Fruity, sweet and easy-drinking.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "hauswein-willi-spaetburgunder",
        imageSlug: "hauswein-willi-spaetburgunder",
        nameDe: "Willi · 2023er Spätburgunder weißgekeltert",
        nameEn: "Willi · 2023 Pinot Noir Blanc de Noirs",
        descriptionDe:
          "QmP, Auslese trocken. Weiß gekeltert, trockener fruchtbetonter Weißwein.",
        descriptionEn:
          "Dry Auslese. Blanc de noirs, a dry fruit-forward white wine.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
    ],
  },
  {
    slug: "empfehlungen",
    titleDe: "Empfehlungen",
    titleEn: "Recommendations",
    descriptionDe:
      "Aperitif, Schorlen und besondere Empfehlungen aus unserer Karte.",
    descriptionEn:
      "Aperitifs, spritzers and special recommendations from our menu.",
    items: [
      {
        slug: "schokoladenwein-hausmarke",
        imageSlug: "schokoladenwein-hausmarke",
        nameDe: "Schokoladenwein Hausmarke",
        nameEn: "House Chocolate Wine",
        descriptionDe:
          "Intensive Aromen dunkler, reifer Früchte mit weichen Vanilletönen und Schokoladennote.",
        descriptionEn:
          "Intense aromas of dark ripe fruit with soft vanilla tones and chocolate notes.",
        price: 5.2,
        priceVariants: priceVariants([["0,2l", 5.2]]),
      },
      {
        slug: "holunderbluetenschorle",
        imageSlug: "holunderbluetenschorle",
        nameDe: "Holunderblütenschorle",
        nameEn: "Elderflower Spritzer",
        descriptionDe: "Fruchtig und erfrischend.",
        descriptionEn: "Fruity and refreshing.",
        price: 4.5,
        priceVariants: priceVariants([["0,2l", 4.5]]),
      },
      {
        slug: "hugo",
        imageSlug: "hugo",
        nameDe: "Hugo",
        nameEn: "Hugo",
        price: 7.5,
        priceVariants: priceVariants([["0,2l", 7.5]]),
      },
      {
        slug: "aperol",
        imageSlug: "aperol",
        nameDe: "Aperol",
        nameEn: "Aperol",
        price: 7.5,
        priceVariants: priceVariants([["0,2l", 7.5]]),
      },
      {
        slug: "lillet-wild-berry",
        imageSlug: "lillet-wild-berry",
        nameDe: "Lillet Wild Berry",
        nameEn: "Lillet Wild Berry",
        price: 7.5,
        priceVariants: priceVariants([["0,2l", 7.5]]),
      },
    ],
  },
  {
    slug: "alkoholfreie-getraenke",
    titleDe: "Alkoholfreie Getränke",
    titleEn: "Non-alcoholic Drinks",
    descriptionDe:
      "Wasser, Limonaden, Schorlen und Fruchtsäfte von Glockengold aus Laucha.",
    descriptionEn:
      "Water, lemonades, spritzers and fruit juices by Glockengold from Laucha.",
    items: [
      {
        slug: "mineralwasser",
        imageSlug: "mineralwasser",
        nameDe: "Mineralwasser medium oder Naturelle",
        nameEn: "Mineral Water Still or Sparkling",
        price: 3.2,
        priceVariants: priceVariants([["Fl. 0,25l", 3.2], ["Fl. 0,7l", 7.2]]),
      },
      {
        slug: "cola-limonaden",
        imageSlug: "cola-limonaden",
        nameDe: "Cola, Orangenlimonade, Zitronenlimonade, Cola light",
        nameEn: "Cola, Orange Lemonade, Lemonade, Cola Light",
        price: 3.1,
        priceVariants: priceVariants([["0,2l", 3.1], ["0,4l", 4.1]]),
        allergens: "1, 2, 3",
      },
      {
        slug: "rote-fassbrause",
        imageSlug: "rote-fassbrause",
        nameDe: "Rote Fassbrause",
        nameEn: "Red Fassbrause",
        price: 3.1,
        priceVariants: priceVariants([["0,2l", 3.1], ["0,4l", 4.1]]),
        allergens: "1, 11",
      },
      {
        slug: "tonic-ginger-bitter-lemon",
        imageSlug: "tonic-ginger-bitter-lemon",
        nameDe: "Tonic, Ginger Ale, Bitter Lemon",
        nameEn: "Tonic, Ginger Ale, Bitter Lemon",
        price: 3.1,
        priceVariants: priceVariants([["0,2l", 3.1], ["0,4l", 4.1]]),
        allergens: "1, 3",
      },
      {
        slug: "apfelsaft",
        imageSlug: "apfelsaft",
        nameDe: "Apfelsaft",
        nameEn: "Apple Juice",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "kirschnektar",
        imageSlug: "kirschnektar",
        nameDe: "Kirschnektar",
        nameEn: "Cherry Nectar",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "orangensaft",
        imageSlug: "orangensaft",
        nameDe: "Orangensaft",
        nameEn: "Orange Juice",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "schwarzer-johannisbeernektar",
        imageSlug: "schwarzer-johannisbeernektar",
        nameDe: "Schwarzer Johannisbeernektar",
        nameEn: "Blackcurrant Nectar",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "multivitaminsaft",
        imageSlug: "multivitaminsaft",
        nameDe: "Multivitaminsaft",
        nameEn: "Multivitamin Juice",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "roter-traubensaft",
        imageSlug: "roter-traubensaft",
        nameDe: "Roter Traubensaft",
        nameEn: "Red Grape Juice",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
      {
        slug: "bananensaft",
        imageSlug: "bananensaft",
        nameDe: "Bananensaft",
        nameEn: "Banana Juice",
        price: 3.2,
        priceVariants: priceVariants([["0,2l", 3.2], ["0,4l", 4.5]]),
      },
    ],
  },
  {
    slug: "heissgetraenke",
    titleDe: "Heißgetränke",
    titleEn: "Hot Drinks",
    descriptionDe:
      "Kaffeespezialitäten, heiße Schokolade, heiße Zitrone und Teeauswahl.",
    descriptionEn:
      "Coffee specialities, hot chocolate, hot lemon and tea selection.",
    items: [
      {
        slug: "tasse-kaffee-creme",
        imageSlug: "tasse-kaffee-creme",
        nameDe: "Tasse Kaffee crème",
        nameEn: "Cup of Cafe Creme",
        price: 3.2,
        allergens: "9",
      },
      {
        slug: "pott-kaffee-creme",
        imageSlug: "pott-kaffee-creme",
        nameDe: "Pott Kaffee crème",
        nameEn: "Large Cafe Creme",
        price: 4.9,
        allergens: "9",
      },
      {
        slug: "tasse-kaffee-koffeinfrei",
        imageSlug: "tasse-kaffee-koffeinfrei",
        nameDe: "Tasse Kaffee koffeinfrei",
        nameEn: "Decaffeinated Coffee",
        price: 2.7,
      },
      {
        slug: "cappuccino",
        imageSlug: "cappuccino",
        nameDe: "Cappuccino",
        nameEn: "Cappuccino",
        price: 3.6,
        allergens: "9, G",
      },
      {
        slug: "latte-macchiato",
        imageSlug: "latte-macchiato",
        nameDe: "Latte Macchiato",
        nameEn: "Latte Macchiato",
        price: 4.5,
        allergens: "9, G",
      },
      {
        slug: "milchkaffee",
        imageSlug: "milchkaffee",
        nameDe: "Milchkaffee",
        nameEn: "Cafe au Lait",
        price: 4.8,
        allergens: "9, G",
      },
      {
        slug: "espresso",
        imageSlug: "espresso",
        nameDe: "Espresso",
        nameEn: "Espresso",
        price: 3.2,
        allergens: "9",
      },
      {
        slug: "espresso-macciato",
        imageSlug: "espresso-macciato",
        nameDe: "Espresso Macciato",
        nameEn: "Espresso Macchiato",
        price: 3.5,
        allergens: "9, G",
      },
      {
        slug: "doppelter-espresso",
        imageSlug: "doppelter-espresso",
        nameDe: "Doppelter Espresso",
        nameEn: "Double Espresso",
        price: 4.9,
        allergens: "9",
      },
      {
        slug: "heisse-schokolade",
        imageSlug: "heisse-schokolade",
        nameDe: "Heiße Schokolade",
        nameEn: "Hot Chocolate",
        price: 4.5,
        allergens: "E, G, H",
      },
      {
        slug: "heisse-zitrone",
        imageSlug: "heisse-zitrone",
        nameDe: "Heiße Zitrone",
        nameEn: "Hot Lemon",
        price: 3,
      },
      {
        slug: "teeauswahl",
        imageSlug: "teeauswahl",
        nameDe: "Teeauswahl",
        nameEn: "Tea Selection",
        descriptionDe:
          "Früchtetee, Grüner Tee, Kräutertee, Pfefferminztee, Kamillentee, Schwarztee oder Rooibos.",
        descriptionEn:
          "Fruit tea, green tea, herbal tea, peppermint, chamomile, black tea or rooibos.",
        price: 2.9,
        priceVariants: priceVariants([["Glas", 2.9]]),
      },
    ],
  },
  {
    slug: "biere",
    titleDe: "Biere",
    titleEn: "Beers",
    descriptionDe:
      "Meisterwerke aus Hopfen und Malz, vom Fass und aus der Flasche.",
    descriptionEn:
      "Masterpieces of hops and malt, draught and bottled.",
    items: [
      {
        slug: "koenig-pilsener",
        imageSlug: "koenig-pilsener",
        nameDe: "König Pilsener",
        nameEn: "König Pilsener",
        price: 3.9,
        priceVariants: priceVariants([["0,25l", 3.9], ["0,4l", 5.1]]),
      },
      {
        slug: "koestritzer-kellerbier",
        imageSlug: "koestritzer-kellerbier",
        nameDe: "Köstritzer Kellerbier",
        nameEn: "Köstritzer Kellerbier",
        price: 4.4,
        priceVariants: priceVariants([["0,3l", 4.4], ["0,5l", 5.5]]),
      },
      {
        slug: "koestritzer-schwarzbier",
        imageSlug: "koestritzer-schwarzbier",
        nameDe: "Köstritzer Schwarzbier",
        nameEn: "Köstritzer Black Beer",
        price: 4.4,
        priceVariants: priceVariants([["0,3l", 4.4], ["0,5l", 5.5]]),
      },
      {
        slug: "koestritzer-radler",
        imageSlug: "koestritzer-radler",
        nameDe: "Köstritzer Radler",
        nameEn: "Köstritzer Radler",
        price: 4.4,
        priceVariants: priceVariants([["0,3l", 4.4], ["0,5l", 5.5]]),
      },
      {
        slug: "waldschloesschen-mix",
        imageSlug: "waldschloesschen-mix",
        nameDe: "Waldschlösschen MIX",
        nameEn: "Waldschlösschen MIX",
        descriptionDe: "Köstritzer Kellerbier mit roter Fassbrause.",
        descriptionEn: "Köstritzer Kellerbier with red Fassbrause.",
        price: 4.4,
        priceVariants: priceVariants([["0,3l", 4.4], ["0,5l", 5.5]]),
      },
      {
        slug: "waldschloesschen-hell",
        imageSlug: "waldschloesschen-hell",
        nameDe: "Waldschlösschen hell · Hausmarke",
        nameEn: "Waldschlösschen Hell · House Beer",
        descriptionDe:
          "Lagerbier mit leicht herber Note, goldgelber Farbe und angenehmer Malzsüße.",
        descriptionEn:
          "Lager beer with a lightly bitter note, golden colour and pleasant malt sweetness.",
        price: 5.5,
        priceVariants: priceVariants([["0,5l", 5.5]]),
        isSignature: true,
      },
      {
        slug: "benediktiner-hefe-hell",
        imageSlug: "benediktiner-hefe-hell",
        nameDe: "Benediktiner Hefe hell",
        nameEn: "Benediktiner Wheat Beer Pale",
        price: 5.5,
        priceVariants: priceVariants([["0,5l", 5.5]]),
      },
      {
        slug: "nebraer-bier-st-georg",
        imageSlug: "nebraer-bier-st-georg",
        nameDe: "Nebraer Bier St. Georg",
        nameEn: "Nebraer Beer St. Georg",
        descriptionDe:
          "Feinmilde untergärige Bierspezialität, naturbelassen, ungefiltert, bernsteinfarben und naturtrüb.",
        descriptionEn:
          "A finely mild bottom-fermented beer speciality, natural, unfiltered, amber-coloured and cloudy.",
        price: 5.5,
        priceVariants: priceVariants([["0,5l", 5.5]]),
        isSignature: true,
      },
      {
        slug: "benediktiner-hefe-alkoholfrei",
        imageSlug: "benediktiner-hefe-alkoholfrei",
        nameDe: "Benediktiner Hefe alkoholfrei",
        nameEn: "Benediktiner Wheat Beer Alcohol-free",
        price: 5.1,
        priceVariants: priceVariants([["0,5l", 5.1]]),
      },
      {
        slug: "benediktiner-hefe-dunkel",
        imageSlug: "benediktiner-hefe-dunkel",
        nameDe: "Benediktiner Hefe dunkel",
        nameEn: "Benediktiner Dark Wheat Beer",
        price: 5.1,
        priceVariants: priceVariants([["0,5l", 5.1]]),
      },
      {
        slug: "bitburger-alkoholfrei",
        imageSlug: "bitburger-alkoholfrei",
        nameDe: "Bitburger alkoholfrei",
        nameEn: "Bitburger Alcohol-free",
        price: 3.8,
        priceVariants: priceVariants([["0,33l", 3.8]]),
      },
      {
        slug: "berliner-weisse-himbeere",
        imageSlug: "berliner-weisse-himbeere",
        nameDe: "Berliner Weisse Himbeere",
        nameEn: "Berliner Weisse Raspberry",
        price: 3.8,
        priceVariants: priceVariants([["0,33l", 3.8]]),
        allergens: "1",
      },
      {
        slug: "berliner-weisse-waldmeister",
        imageSlug: "berliner-weisse-waldmeister",
        nameDe: "Berliner Weisse Waldmeister",
        nameEn: "Berliner Weisse Woodruff",
        price: 3.8,
        priceVariants: priceVariants([["0,33l", 3.8]]),
        allergens: "1",
      },
    ],
  },
  {
    slug: "spirituosen",
    titleDe: "Spirituosen",
    titleEn: "Spirits",
    descriptionDe: "Klassiker und Digestifs, überwiegend 4 cl.",
    descriptionEn: "Classic spirits and digestifs, mostly 4 cl.",
    items: [
      {
        slug: "malteser-kreuz",
        imageSlug: "malteser-kreuz",
        nameDe: "Malteser Kreuz Aquavit",
        nameEn: "Malteser Kreuz Aquavit",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "becherovka",
        imageSlug: "becherovka",
        nameDe: "Becherovka",
        nameEn: "Becherovka",
        descriptionDe: "38 % Vol.",
        descriptionEn: "38% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "campari",
        imageSlug: "campari",
        nameDe: "Campari",
        nameEn: "Campari",
        descriptionDe: "25 % Vol.",
        descriptionEn: "25% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
        allergens: "2",
      },
      {
        slug: "remy-martin-vsop",
        imageSlug: "remy-martin-vsop",
        nameDe: "Remy Martin V.S.O.P",
        nameEn: "Remy Martin V.S.O.P",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 5.5,
        priceVariants: priceVariants([["4 cl", 5.5]]),
      },
      {
        slug: "kuemmerling",
        imageSlug: "kuemmerling",
        nameDe: "Kümmerling",
        nameEn: "Kümmerling",
        descriptionDe: "35 % Vol.",
        descriptionEn: "35% ABV.",
        price: 3.4,
        priceVariants: priceVariants([["4 cl", 3.4]]),
      },
      {
        slug: "underberg",
        imageSlug: "underberg",
        nameDe: "Underberg",
        nameEn: "Underberg",
        descriptionDe: "44 % Vol.",
        descriptionEn: "44% ABV.",
        price: 2.2,
        priceVariants: priceVariants([["2 cl", 2.2]]),
      },
      {
        slug: "fernet-branca",
        imageSlug: "fernet-branca",
        nameDe: "Fernet Branca",
        nameEn: "Fernet Branca",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "ramazzotti",
        imageSlug: "ramazzotti",
        nameDe: "Ramazzotti",
        nameEn: "Ramazzotti",
        descriptionDe: "30 % Vol.",
        descriptionEn: "30% ABV.",
        price: 4.3,
        priceVariants: priceVariants([["4 cl", 4.3]]),
      },
      {
        slug: "schierker-feuerstein",
        imageSlug: "schierker-feuerstein",
        nameDe: "Schierker Feuerstein",
        nameEn: "Schierker Feuerstein",
        descriptionDe: "35 % Vol.",
        descriptionEn: "35% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "jaegermeister",
        imageSlug: "jaegermeister",
        nameDe: "Jägermeister",
        nameEn: "Jägermeister",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "nordhaeuser-doppelkorn",
        imageSlug: "nordhaeuser-doppelkorn",
        nameDe: "Nordhäuser Doppelkorn",
        nameEn: "Nordhäuser Doppelkorn",
        descriptionDe: "38 % Vol.",
        descriptionEn: "38% ABV.",
        price: 3.8,
        priceVariants: priceVariants([["4 cl", 3.8]]),
      },
      {
        slug: "baileys",
        imageSlug: "baileys",
        nameDe: "Baileys",
        nameEn: "Baileys",
        descriptionDe: "17 % Vol.",
        descriptionEn: "17% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "obstler-hausmarke",
        imageSlug: "obstler-hausmarke",
        nameDe: "Obstler Hausmarke",
        nameEn: "House Fruit Brandy",
        descriptionDe:
          "Birne, Himbeere, Zwetschge, Kirschwasser oder alte Aprikose, 40 % Vol.",
        descriptionEn:
          "Pear, raspberry, plum, cherry brandy or aged apricot, 40% ABV.",
        price: 3.9,
        priceVariants: priceVariants([["4 cl", 3.9]]),
      },
      {
        slug: "bacardi",
        imageSlug: "bacardi",
        nameDe: "Bacardi",
        nameEn: "Bacardi",
        descriptionDe: "37,5 % Vol.",
        descriptionEn: "37.5% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "havanna-club-3-jahre",
        imageSlug: "havanna-club-3-jahre",
        nameDe: "Havanna Club 3 Jahre",
        nameEn: "Havana Club 3 Years",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 4.1,
        priceVariants: priceVariants([["4 cl", 4.1]]),
      },
      {
        slug: "feiner-alter-wilthener",
        imageSlug: "feiner-alter-wilthener",
        nameDe: "Feiner Alter Wilthener",
        nameEn: "Feiner Alter Wilthener",
        descriptionDe: "36 % Vol.",
        descriptionEn: "36% ABV.",
        price: 3.5,
        priceVariants: priceVariants([["4 cl", 3.5]]),
      },
      {
        slug: "jim-beam",
        imageSlug: "jim-beam",
        nameDe: "Jim Beam Bourbon",
        nameEn: "Jim Beam Bourbon",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 4.5,
        priceVariants: priceVariants([["4 cl", 4.5]]),
      },
      {
        slug: "four-roses",
        imageSlug: "four-roses",
        nameDe: "Four Roses Bourbon",
        nameEn: "Four Roses Bourbon",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 5.5,
        priceVariants: priceVariants([["4 cl", 5.5]]),
      },
      {
        slug: "glenfiddich-15",
        imageSlug: "glenfiddich-15",
        nameDe: "Glenfiddich Single Malt 15 Jahre",
        nameEn: "Glenfiddich Single Malt 15 Years",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 8.5,
        priceVariants: priceVariants([["4 cl", 8.5]]),
      },
      {
        slug: "glenfiddich-12",
        imageSlug: "glenfiddich-12",
        nameDe: "Glenfiddich Single Malt 12 Jahre",
        nameEn: "Glenfiddich Single Malt 12 Years",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 6.5,
        priceVariants: priceVariants([["4 cl", 6.5]]),
      },
      {
        slug: "glen-grant",
        imageSlug: "glen-grant",
        nameDe: "Glen Grant Single Malt",
        nameEn: "Glen Grant Single Malt",
        descriptionDe: "40 % Vol.",
        descriptionEn: "40% ABV.",
        price: 6.5,
        priceVariants: priceVariants([["4 cl", 6.5]]),
      },
      {
        slug: "herzer-weinlikoer-dornfelder",
        imageSlug: "herzer-weinlikoer-dornfelder",
        nameDe: "Weingut Herzer · Weinlikör vom Dornfelder",
        nameEn: "Weingut Herzer · Dornfelder Wine Liqueur",
        descriptionDe: "Regionale Digestif-Empfehlung, 20 % Vol.",
        descriptionEn: "Regional digestif recommendation, 20% ABV.",
        price: 6.5,
        priceVariants: priceVariants([["4 cl", 6.5]]),
      },
      {
        slug: "herzer-tresterbrand-grauer-burgunder",
        imageSlug: "herzer-tresterbrand-grauer-burgunder",
        nameDe: "Weingut Herzer · Tresterbrand vom Grauen Burgunder",
        nameEn: "Weingut Herzer · Pinot Gris Pomace Brandy",
        descriptionDe: "Regionale Digestif-Empfehlung, 40 % Vol.",
        descriptionEn: "Regional digestif recommendation, 40% ABV.",
        price: 7.9,
        priceVariants: priceVariants([["4 cl", 7.9]]),
      },
      {
        slug: "schulze-traubenlikoer-rot",
        imageSlug: "schulze-traubenlikoer-rot",
        nameDe: "Weingut Schulze · Traubenlikör rot",
        nameEn: "Weingut Schulze · Red Grape Liqueur",
        descriptionDe: "25 % Vol.",
        descriptionEn: "25% ABV.",
        price: 5.5,
        priceVariants: priceVariants([["4 cl", 5.5]]),
      },
      {
        slug: "schulze-traubenlikoer-weiss",
        imageSlug: "schulze-traubenlikoer-weiss",
        nameDe: "Weingut Schulze · Traubenlikör weiß",
        nameEn: "Weingut Schulze · White Grape Liqueur",
        descriptionDe: "25 % Vol.",
        descriptionEn: "25% ABV.",
        price: 5.5,
        priceVariants: priceVariants([["4 cl", 5.5]]),
      },
      {
        slug: "schulze-weinbrand",
        imageSlug: "schulze-weinbrand",
        nameDe: "Weingut Schulze · Weinbrand",
        nameEn: "Weingut Schulze · Brandy",
        descriptionDe: "38 % Vol.",
        descriptionEn: "38% ABV.",
        price: 6.5,
        priceVariants: priceVariants([["4 cl", 6.5]]),
      },
    ],
  },
  {
    slug: "weine-saale-unstrut",
    titleDe: "Weine aus der Saale-Unstrut Region",
    titleEn: "Wines from the Saale-Unstrut Region",
    descriptionDe:
      "Auswahl regionaler Rebsäfte direkt vom Winzer.",
    descriptionEn:
      "A selection of regional wines directly from local winemakers.",
    items: [
      {
        slug: "schulze-solaris",
        imageSlug: "schulze-solaris",
        nameDe: "Weingut Schulze · 2024er Solaris",
        nameEn: "Weingut Schulze · 2024 Solaris",
        descriptionDe:
          "QmP, Auslese lieblich. Fruchtiger Wein mit komplexen Aromen exotischer Früchte.",
        descriptionEn:
          "Medium-sweet Auslese with complex aromas of exotic fruits.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "schulze-grauburgunder",
        imageSlug: "schulze-grauburgunder",
        nameDe: "Weingut Schulze · 2024er Grauburgunder",
        nameEn: "Weingut Schulze · 2024 Pinot Gris",
        descriptionDe:
          "DQW, trocken. Kräftiger Körper, Aromen von Quitte und Ananas.",
        descriptionEn:
          "Dry quality wine with body, quince and pineapple aromas.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "schulze-traminer",
        imageSlug: "schulze-traminer",
        nameDe: "Weingut Schulze · 2024er Traminer",
        nameEn: "Weingut Schulze · 2024 Traminer",
        descriptionDe:
          "QmP, Auslese trocken. Angenehme Frische durch mittleren Säuregehalt.",
        descriptionEn:
          "Dry Auslese with pleasant freshness and medium acidity.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "schulze-spaetburgunder",
        imageSlug: "schulze-spaetburgunder",
        nameDe: "Weingut Schulze · 2023er Spätburgunder",
        nameEn: "Weingut Schulze · 2023 Pinot Noir",
        descriptionDe:
          "DQW, trocken. Kräftig, würzig, Bukett von Kirschen und Johannisbeere.",
        descriptionEn:
          "Dry quality wine, full and spicy with cherry and redcurrant bouquet.",
        price: 7.5,
        priceVariants: priceVariants([["0,20l", 7.5], ["0,75l", 26]]),
      },
      {
        slug: "cabernet-mitos-geiseltalsee",
        imageSlug: "cabernet-mitos-geiseltalsee",
        nameDe: "Weinanbau Geiseltalsee · 2024er Cabernet Mitos",
        nameEn: "Geiseltalsee Winegrowing · 2024 Cabernet Mitos",
        descriptionDe:
          "DQW, trocken. Tiefrote Farbe, Bukett von Johannisbeeren und Brombeeren.",
        descriptionEn:
          "Dry quality wine with deep red colour and currant and blackberry bouquet.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "boehme-weissburgunder",
        imageSlug: "boehme-weissburgunder",
        nameDe: "Weingut Böhme · 2024er Weißburgunder",
        nameEn: "Weingut Böhme · 2024 Pinot Blanc",
        descriptionDe:
          "DQW, trocken. Duft von Banane, reifen Früchten und Butter-Karamell.",
        descriptionEn:
          "Dry quality wine with banana, ripe fruit and butter-caramel notes.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "boehme-gutedel",
        imageSlug: "boehme-gutedel",
        nameDe: "Weingut Böhme · 2025er Gutedel",
        nameEn: "Weingut Böhme · 2025 Gutedel",
        descriptionDe:
          "DQW, trocken. Leichter und dezenter Speisebegleiter, eine Spezialität von der Unstrut.",
        descriptionEn:
          "Dry quality wine, a light and subtle food companion from the Unstrut.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "boehme-silvaner",
        imageSlug: "boehme-silvaner",
        nameDe: "Weingut Böhme · 2024er Silvaner",
        nameEn: "Weingut Böhme · 2024 Silvaner",
        descriptionDe:
          "DQW, trocken. Klassiker mit Heuduft und grünen Apfelnoten.",
        descriptionEn:
          "Dry quality wine, a classic with hay scent and green apple notes.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "boehme-kerner-veitsgrube",
        imageSlug: "boehme-kerner-veitsgrube",
        nameDe: "Weingut Böhme · 2023er Kerner-Veitsgrube",
        nameEn: "Weingut Böhme · 2023 Kerner-Veitsgrube",
        descriptionDe:
          "DQW, trocken. Feinfruchtiger Bukettwein mit frischer Säure und angenehmer Restsüße.",
        descriptionEn:
          "Dry quality wine, finely fruity bouquet with fresh acidity and pleasant residual sweetness.",
        price: 9.6,
        priceVariants: priceVariants([["0,20l", 9.6], ["0,75l", 31.9]]),
      },
      {
        slug: "boehme-alles-rosa",
        imageSlug: "boehme-alles-rosa",
        nameDe: "Weingut Böhme · 2024er Alles Rosa Rosé",
        nameEn: "Weingut Böhme · 2024 Alles Rosa Rose",
        descriptionDe:
          "DQW, trocken. Spritziger leichter Sommerwein mit feinen Tanninen und Waldbeeren.",
        descriptionEn:
          "Dry quality rosé, lively and light with fine tannins and forest berries.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "herzer-mueller-thurgau",
        imageSlug: "herzer-mueller-thurgau",
        nameDe: "Weingut Herzer · 2024er Müller Thurgau",
        nameEn: "Weingut Herzer · 2024 Müller Thurgau",
        descriptionDe:
          "DQW, trocken. Angenehme Muskatnote, blumig, fruchtig würzig.",
        descriptionEn:
          "Dry quality wine, pleasant muscat note, floral and fruity-spicy.",
        price: 7.9,
        priceVariants: priceVariants([["0,20l", 7.9], ["0,75l", 27.9]]),
      },
      {
        slug: "herzer-riesling",
        imageSlug: "herzer-riesling",
        nameDe: "Weingut Herzer · 2024er Riesling",
        nameEn: "Weingut Herzer · 2024 Riesling",
        descriptionDe:
          "DQW, trocken. Aprikosen- und Pfirsichnoten, ausgewogenes Säurespiel.",
        descriptionEn:
          "Dry quality wine with apricot and peach notes and balanced acidity.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "herzer-cuvee-3-0",
        imageSlug: "herzer-cuvee-3-0",
        nameDe: "Weingut Herzer · 2024er 3.0 Cuvée",
        nameEn: "Weingut Herzer · 2024 3.0 Cuvee",
        descriptionDe:
          "Fruchtige Cuvée von Silvaner, Weißburgunder und Müller Thurgau.",
        descriptionEn:
          "Fruity cuvee of Silvaner, Pinot Blanc and Müller Thurgau.",
        price: 7.9,
        priceVariants: priceVariants([["0,20l", 7.9], ["0,75l", 27.9]]),
      },
      {
        slug: "herzer-rotling",
        imageSlug: "herzer-rotling",
        nameDe: "Weingut Herzer · 2024er Rotling",
        nameEn: "Weingut Herzer · 2024 Rotling",
        descriptionDe:
          "DQW, trocken. Fruchtig frisch mit Aromen von Limette und Erdbeere.",
        descriptionEn:
          "Dry quality wine, fruity fresh aromas of lime and strawberry.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "herzer-dornfelder",
        imageSlug: "herzer-dornfelder",
        nameDe: "Weingut Herzer · 2023er Dornfelder",
        nameEn: "Weingut Herzer · 2023 Dornfelder",
        descriptionDe:
          "DQW, halbtrocken. Bukett von Kirschen, Brombeeren und Holunderbeeren.",
        descriptionEn:
          "Medium-dry quality wine with cherry, blackberry and elderberry bouquet.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "herzer-blauer-zweigelt",
        imageSlug: "herzer-blauer-zweigelt",
        nameDe: "Weingut Herzer · 2023er Blauer Zweigelt",
        nameEn: "Weingut Herzer · 2023 Blauer Zweigelt",
        descriptionDe:
          "DQW, trocken. Jugendlich, an Waldbeeren erinnernd, gute Tanninstruktur.",
        descriptionEn:
          "Dry quality wine, youthful forest berry notes and good tannin structure.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
      {
        slug: "herzer-portugieser",
        imageSlug: "herzer-portugieser",
        nameDe: "Weingut Herzer · 2022er Portugieser",
        nameEn: "Weingut Herzer · 2022 Portugieser",
        descriptionDe:
          "DQW, trocken. Charaktervoll, fruchtig, rubinrot, weich und harmonisch.",
        descriptionEn:
          "Dry quality wine, characterful, fruity, ruby-red, soft and harmonious.",
        price: 8.6,
        priceVariants: priceVariants([["0,20l", 8.6], ["0,75l", 29.9]]),
      },
    ],
  },
];

let defaultRestaurantMenuSeedChecked = false;

export function slugifyMenuValue(value: string) {
  const normalized = value
    .replace(/ß/g, "ss")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "menu";
}

export function normalizeMenuPriceVariants(
  value: unknown
): PublicRestaurantMenuPriceVariant[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const entry = item as { label?: unknown; price?: unknown };
      const label = typeof entry.label === "string" ? entry.label.trim() : "";
      const price = Number(entry.price);

      if (!label || !Number.isFinite(price) || price < 0) {
        return null;
      }

      return {
        label,
        price,
      };
    })
    .filter((item): item is PublicRestaurantMenuPriceVariant => Boolean(item));
}

export async function ensureDefaultRestaurantMenu() {
  if (defaultRestaurantMenuSeedChecked) {
    return;
  }

  const [categoryCount, itemCount] = await Promise.all([
    prisma.restaurantMenuCategory.count(),
    prisma.restaurantMenuItem.count(),
  ]);

  if (categoryCount > 0 || itemCount > 0) {
    defaultRestaurantMenuSeedChecked = true;
    return;
  }

  for (const [categoryIndex, category] of DEFAULT_RESTAURANT_MENU.entries()) {
    const savedCategory = await prisma.restaurantMenuCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {},
      create: {
        slug: category.slug,
        titleDe: category.titleDe,
        titleEn: category.titleEn ?? null,
        descriptionDe: category.descriptionDe ?? null,
        descriptionEn: category.descriptionEn ?? null,
        sortOrder: categoryIndex + 1,
        isActive: true,
      },
    });

    await Promise.all(
      category.items.map(async (item, itemIndex) => {
        const defaultPriceVariants = item.priceVariants
          ? (item.priceVariants as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull;
        const savedItem = await prisma.restaurantMenuItem.upsert({
          where: {
            slug: item.slug,
          },
          update: {},
          create: {
            slug: item.slug,
            categoryId: savedCategory.id,
            nameDe: item.nameDe,
            nameEn: item.nameEn ?? null,
            descriptionDe: item.descriptionDe ?? null,
            descriptionEn: item.descriptionEn ?? null,
            price: new Prisma.Decimal(item.price),
            priceNoteDe: item.priceNoteDe ?? null,
            priceNoteEn: item.priceNoteEn ?? null,
            priceVariants: defaultPriceVariants,
            imageUrl: `${MENU_IMAGE_BASE}/${item.imageSlug}.webp`,
            allergens: item.allergens ?? null,
            isSignature: item.isSignature ?? false,
            isVegetarian: item.isVegetarian ?? false,
            isPublished: true,
            sortOrder: itemIndex + 1,
          },
        });

        if (
          item.priceVariants?.length &&
          !normalizeMenuPriceVariants(savedItem.priceVariants).length
        ) {
          await prisma.restaurantMenuItem.update({
            where: {
              id: savedItem.id,
            },
            data: {
              priceVariants: defaultPriceVariants,
            },
          });
        }
      })
    );
  }

  defaultRestaurantMenuSeedChecked = true;
}

export async function getPublicRestaurantMenu(
  locale: RestaurantMenuLocale
): Promise<PublicRestaurantMenuCategory[]> {
  await ensureDefaultRestaurantMenu();

  const categories = await prisma.restaurantMenuCategory.findMany({
    where: {
      isActive: true,
      items: {
        some: {
          isPublished: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      items: {
        where: {
          isPublished: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: locale === "en" && category.titleEn ? category.titleEn : category.titleDe,
    description:
      locale === "en" && category.descriptionEn
        ? category.descriptionEn
        : category.descriptionDe,
    items: category.items.map((item) => ({
      id: item.id,
      name: locale === "en" && item.nameEn ? item.nameEn : item.nameDe,
      description:
        locale === "en" && item.descriptionEn
          ? item.descriptionEn
          : item.descriptionDe,
      price: Number(item.price),
      priceNote:
        locale === "en" && item.priceNoteEn ? item.priceNoteEn : item.priceNoteDe,
      priceVariants: normalizeMenuPriceVariants(item.priceVariants),
      imageUrl: item.imageUrl,
      allergens: item.allergens,
      isSignature: item.isSignature,
      isVegetarian: item.isVegetarian,
    })),
  }));
}

export async function getAdminRestaurantMenu() {
  await ensureDefaultRestaurantMenu();

  return prisma.restaurantMenuCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      items: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function getAdminRestaurantMenuItems(limit = 10_000) {
  await ensureDefaultRestaurantMenu();

  return prisma.restaurantMenuItem.findMany({
    orderBy: [
      { category: { sortOrder: "asc" } },
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
    take: limit,
    include: {
      category: true,
    },
  });
}
