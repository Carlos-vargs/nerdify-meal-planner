export interface MenuItem {
  id: string;
  name: string;
  guests: number;
  time: string;
  date?: string;
}

export interface MenuDay {
  date: string;
  items: MenuItem[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dishName: string;
}

export interface SavedMenu {
  id: string;
  name: string;
  days: MenuDay[];
  ingredients: Ingredient[];
}
