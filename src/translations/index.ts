const en = {
  common: {
    add: 'Add',
    all: 'All',
    amount: 'Amount',
    apply: 'Apply',
    back: 'Back',
    cancel: 'Cancel',
    category: 'Category',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    expense: 'Expense',
    income: 'Income',
    save: 'Save',
    unknown: 'Unknown',
  },
  formatting: {
    locale: 'en-US',
  },
  alerts: {
    noInternet: {
      title: 'No internet',
      message: 'Connect to the internet to purchase.',
    },
    voiceInput: {
      title: 'Voice input',
      message: 'Start voice capture',
    },
  },
  auth: {
    signIn: {
      title: 'Welcome back',
      subtitle: 'Sign in to sync your premium data across devices.',
      buttonLabel: 'Sign in',
    },
    signUp: {
      title: 'Create account',
      subtitle: 'Link your premium purchase and protect your Finly data.',
      buttonLabel: 'Create account',
    },
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',
    note: 'Account linking is used only for premium sync and purchase recovery.',
    validationError: {
      title: 'Check details',
      message: 'Enter a valid email and at least 6 characters password.',
    },
    pendingSupabase: {
      title: 'Supabase auth',
      message: 'This screen is ready. Next step is connecting Supabase sign in and sign up.',
    },
  },
  categoryForm: {
    addTitle: 'Add category',
    editTitle: 'Edit category',
    name: 'Name',
    namePlaceholder: 'Category name',
    type: 'Type',
    icon: 'Icon',
    invalidCategory: {
      title: 'Invalid category',
      message: 'Category name cannot be empty.',
    },
  },
  categorySelect: {
    empty: 'No categories yet',
    expenseCategories: 'Expense categories',
    incomeCategories: 'Income categories',
    placeholder: 'Select category',
  },
  categoryChart: {
    overLimit: (amount: string) => `Over ${amount}`,
  },
  dateRange: {
    apply: 'Apply',
    cancel: 'Cancel',
    choosePeriod: 'Choose period',
    customHint: 'Tap start and end date',
    customRange: 'Custom range',
    quickOrCustom: 'Quick range or custom dates',
    thisMonth: 'This month',
    thisYear: 'This year',
    week: (weekNumber: string) => `Week ${weekNumber}`,
    weeksOfThisMonth: 'Weeks of this month',
  },
  deleteCategory: {
    title: 'Delete category',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    withTransactions: (category: string, count: number) =>
      `Delete "${category}" and ${count} transaction${count > 1 ? 's' : ''}?`,
    withoutTransactions: (category: string) => `Delete "${category}"?`,
  },
  deleteTransaction: {
    title: 'Delete transaction',
    subtitle: 'This action cannot be undone.',
  },
  history: {
    title: 'History',
    categoryTitle: (category: string) => `History: ${category}`,
    addLimit: 'Add limit',
    editLimit: 'Edit limit',
    empty: 'No transactions found',
  },
  limit: {
    addTitle: 'Add limit',
    editTitle: 'Edit limit',
    placeholder: 'Enter limit amount',
    invalidLimit: {
      title: 'Invalid limit',
      message: 'Enter a valid non-negative number.',
    },
  },
  manageCategories: {
    title: 'Manage categories',
    categoryExists: {
      title: 'Category exists',
      message: 'Category with this name and type already exists.',
    },
    typeCannotBeChanged: {
      title: 'Type cannot be changed',
      message: 'This category is already used in transactions. Create a new category with another type.',
    },
  },
  paywall: {
    title: 'Get premium',
    continue: 'Continue',
    restorePurchases: 'Restore Purchases',
    terms: 'Terms',
    privacy: 'Privacy',
    features: {
      categoryLimit: {
        title: 'Category limit',
        description: 'Remove limits on categories.',
      },
      voiceInput: {
        title: 'Voice input',
        description: 'Just dictate your type of expense and it will be added automatically',
      },
      expenseTracking: {
        title: 'Track of expenses',
        description: 'You can track your expenses through Apple Pay or Google Pay',
      },
    },
    plans: {
      yearly: {
        badge: '19% OFF',
        name: 'Yearly',
        price: '$79.99/yr',
        subtext: 'Only $6.66/mo',
      },
      monthly: {
        name: 'Monthly',
        price: '$9.99/mo',
        subtext: 'Billed at $9.99/mo.',
      },
    },
  },
  settings: {
    title: 'Settings',
    trackingMode: 'Tracking mode',
    trackingModeAccessibility: (label: string) => `Tracking mode: ${label}`,
    expensesOnly: 'Expenses only',
    expensesAndIncome: 'Expenses + Income',
    getPremium: 'Get Premium',
    premiumActive: 'Premium Active',
    manageCategories: 'Manage categories',
    accountSettings: 'Account settings',
  },
  topBalance: {
    balance: 'Balance',
    openSettings: 'Open settings',
    showAllTransactions: 'Show all transactions',
    showExpenses: 'Show expenses',
    showIncome: 'Show income',
  },
  transactionForm: {
    addTitle: 'Add transaction',
    editTitle: 'Edit transaction',
    noCategory: {
      title: 'No category',
      message: 'Please choose a category.',
    },
    invalidCategory: {
      title: 'Invalid category',
      message: 'Please select a category.',
    },
    invalidAmount: {
      title: 'Invalid amount',
      message: 'Enter a valid amount greater than 0.',
    },
  },
};

export type Translations = typeof en;

const pl: Translations = {
  common: {
    add: 'Dodaj',
    all: 'Wszystko',
    amount: 'Kwota',
    apply: 'Zastosuj',
    back: 'Wstecz',
    cancel: 'Anuluj',
    category: 'Kategoria',
    confirm: 'Potwierdź',
    delete: 'Usuń',
    edit: 'Edytuj',
    expense: 'Wydatek',
    income: 'Przychód',
    save: 'Zapisz',
    unknown: 'Nieznane',
  },
  formatting: {
    locale: 'pl-PL',
  },
  alerts: {
    noInternet: {
      title: 'Brak internetu',
      message: 'Połącz się z internetem, aby dokonać zakupu.',
    },
    voiceInput: {
      title: 'Wprowadzanie głosowe',
      message: 'Rozpocznij nagrywanie głosu',
    },
  },
  auth: {
    signIn: {
      title: 'Witaj ponownie',
      subtitle: 'Zaloguj się, aby synchronizować dane premium między urządzeniami.',
      buttonLabel: 'Zaloguj się',
    },
    signUp: {
      title: 'Utwórz konto',
      subtitle: 'Połącz zakup premium i zabezpiecz swoje dane Finly.',
      buttonLabel: 'Utwórz konto',
    },
    email: 'Email',
    emailPlaceholder: 'ty@example.com',
    password: 'Hasło',
    passwordPlaceholder: 'Minimum 6 znaków',
    note: 'Połączenie konta służy tylko do synchronizacji premium i odzyskiwania zakupu.',
    validationError: {
      title: 'Sprawdź dane',
      message: 'Podaj poprawny email i hasło o długości co najmniej 6 znaków.',
    },
    pendingSupabase: {
      title: 'Supabase auth',
      message: 'Ten ekran jest gotowy. Następny krok to podłączenie logowania i rejestracji Supabase.',
    },
  },
  categoryForm: {
    addTitle: 'Dodaj kategorię',
    editTitle: 'Edytuj kategorię',
    name: 'Nazwa',
    namePlaceholder: 'Nazwa kategorii',
    type: 'Typ',
    icon: 'Ikona',
    invalidCategory: {
      title: 'Nieprawidłowa kategoria',
      message: 'Nazwa kategorii nie może być pusta.',
    },
  },
  categorySelect: {
    empty: 'Brak kategorii',
    expenseCategories: 'Kategorie wydatków',
    incomeCategories: 'Kategorie przychodów',
    placeholder: 'Wybierz kategorię',
  },
  categoryChart: {
    overLimit: (amount: string) => `Ponad ${amount}`,
  },
  dateRange: {
    apply: 'Zastosuj',
    cancel: 'Anuluj',
    choosePeriod: 'Wybierz okres',
    customHint: 'Wybierz datę początkową i końcową',
    customRange: 'Zakres niestandardowy',
    quickOrCustom: 'Szybki zakres albo własne daty',
    thisMonth: 'Ten miesiąc',
    thisYear: 'Ten rok',
    week: (weekNumber: string) => `Tydzień ${weekNumber}`,
    weeksOfThisMonth: 'Tygodnie tego miesiąca',
  },
  deleteCategory: {
    title: 'Usuń kategorię',
    confirmText: 'Usuń',
    cancelText: 'Anuluj',
    withTransactions: (category: string, count: number) =>
      `Usunąć "${category}" oraz ${count} transakcj${count === 1 ? 'ę' : 'e'}?`,
    withoutTransactions: (category: string) => `Usunąć "${category}"?`,
  },
  deleteTransaction: {
    title: 'Usuń transakcję',
    subtitle: 'Tej operacji nie można cofnąć.',
  },
  history: {
    title: 'Historia',
    categoryTitle: (category: string) => `Historia: ${category}`,
    addLimit: 'Dodaj limit',
    editLimit: 'Edytuj limit',
    empty: 'Nie znaleziono transakcji',
  },
  limit: {
    addTitle: 'Dodaj limit',
    editTitle: 'Edytuj limit',
    placeholder: 'Podaj kwotę limitu',
    invalidLimit: {
      title: 'Nieprawidłowy limit',
      message: 'Podaj poprawną liczbę nieujemną.',
    },
  },
  manageCategories: {
    title: 'Zarządzaj kategoriami',
    categoryExists: {
      title: 'Kategoria istnieje',
      message: 'Kategoria o tej nazwie i typie już istnieje.',
    },
    typeCannotBeChanged: {
      title: 'Nie można zmienić typu',
      message: 'Ta kategoria jest już używana w transakcjach. Utwórz nową kategorię z innym typem.',
    },
  },
  paywall: {
    title: 'Kup Premium',
    continue: 'Kontynuuj',
    restorePurchases: 'Przywróć zakupy',
    terms: 'Regulamin',
    privacy: 'Prywatność',
    features: {
      categoryLimit: {
        title: 'Limit kategorii',
        description: 'Usuń limity kategorii.',
      },
      voiceInput: {
        title: 'Wprowadzanie głosowe',
        description: 'Podyktuj wydatek, a zostanie dodany automatycznie.',
      },
      expenseTracking: {
        title: 'Śledzenie wydatków',
        description: 'Śledź wydatki przez Apple Pay lub Google Pay.',
      },
    },
    plans: {
      yearly: {
        badge: '19% TANIEJ',
        name: 'Rocznie',
        price: '$79.99/rok',
        subtext: 'Tylko $6.66/mies.',
      },
      monthly: {
        name: 'Miesięcznie',
        price: '$9.99/mies.',
        subtext: 'Rozliczane po $9.99/mies.',
      },
    },
  },
  settings: {
    title: 'Ustawienia',
    trackingMode: 'Tryb śledzenia',
    trackingModeAccessibility: (label: string) => `Tryb śledzenia: ${label}`,
    expensesOnly: 'Tylko wydatki',
    expensesAndIncome: 'Wydatki + przychody',
    getPremium: 'Kup Premium',
    premiumActive: 'Premium aktywne',
    manageCategories: 'Zarządzaj kategoriami',
    accountSettings: 'Ustawienia konta',
  },
  topBalance: {
    balance: 'Saldo',
    openSettings: 'Otwórz ustawienia',
    showAllTransactions: 'Pokaż wszystkie transakcje',
    showExpenses: 'Pokaż wydatki',
    showIncome: 'Pokaż przychody',
  },
  transactionForm: {
    addTitle: 'Dodaj transakcję',
    editTitle: 'Edytuj transakcję',
    noCategory: {
      title: 'Brak kategorii',
      message: 'Wybierz kategorię.',
    },
    invalidCategory: {
      title: 'Nieprawidłowa kategoria',
      message: 'Wybierz kategorię.',
    },
    invalidAmount: {
      title: 'Nieprawidłowa kwota',
      message: 'Podaj poprawną kwotę większą niż 0.',
    },
  },
};

export type AppLocale = 'en' | 'pl';

export const DEFAULT_LOCALE: AppLocale = 'pl';

export const translationCatalog: Record<AppLocale, Translations> = {
  en,
  pl,
};

export const translations = translationCatalog[DEFAULT_LOCALE];
