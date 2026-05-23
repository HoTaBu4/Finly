export type TransactionType = 'income' | 'expense';

export enum HistoryTransactionFilter {
  Expense = 'expense',
  Income = 'income',
  All = 'all',
}

export enum TrackingMode {
  ExpensesOnly = 'expenses_only',
  Both = 'both',
}

export type HistoryTransaction = {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
};


export enum CategoryIconKey {
  Restaurant = 'restaurant',
  Car = 'car',
  BagHandle = 'bag-handle',
  Medkit = 'medkit',
  Receipt = 'receipt',
  EllipsisHorizontal = 'ellipsis-horizontal',
  Cash = 'cash',
  Card = 'card',
  Wallet = 'wallet',
  Home = 'home',
  Airplane = 'airplane',
  Bus = 'bus',
  Train = 'train',
  Bicycle = 'bicycle',
  Fitness = 'fitness',
  Gift = 'gift',
  School = 'school',
  Briefcase = 'briefcase',
  GameController = 'game-controller',
  PhonePortrait = 'phone-portrait',
  Laptop = 'laptop',
  Book = 'book',
  Film = 'film',
  Paw = 'paw',
  Cart = 'cart',
  Cafe = 'cafe',
  FastFood = 'fast-food',
  Pizza = 'pizza',
  Nutrition = 'nutrition',
  Beer = 'beer',
  Wine = 'wine',
  Water = 'water',
  Medical = 'medical',
  Heart = 'heart',
  Flash = 'flash',
  Flower = 'flower',
  Leaf = 'leaf',
  Build = 'build',
  Construct = 'construct',
  HardwareChip = 'hardware-chip',
  Settings = 'settings',
  Camera = 'camera',
  Image = 'image',
  Chatbubbles = 'chatbubbles',
  Mail = 'mail',
  Call = 'call',
  Globe = 'globe',
  Earth = 'earth',
  Compass = 'compass',
  Map = 'map',
  Locate = 'locate',
  Calendar = 'calendar',
  Time = 'time',
}


export type CategoryItem = {
  id: string;
  category: string;
  type: TransactionType;
  limit: number | null;
  icon: CategoryIconKey;
};

export type CategoryChartItem = CategoryItem & {
  amount: number;
};
