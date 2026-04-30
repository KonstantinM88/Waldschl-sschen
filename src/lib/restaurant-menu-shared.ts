export type RestaurantMenuLocale = "de" | "en";

export interface PublicRestaurantMenuItem {
  allergens: string | null;
  description: string | null;
  id: string;
  imageUrl: string | null;
  isSignature: boolean;
  isVegetarian: boolean;
  name: string;
  price: number;
  priceNote: string | null;
  priceVariants: PublicRestaurantMenuPriceVariant[];
}

export interface PublicRestaurantMenuPriceVariant {
  label: string;
  price: number;
}

export interface PublicRestaurantMenuCategory {
  description: string | null;
  id: string;
  items: PublicRestaurantMenuItem[];
  slug: string;
  title: string;
}
