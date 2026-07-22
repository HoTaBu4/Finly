# Finzelo — Product Requirements

## Модель монетизації

Freemium з чітким поділом на безкоштовний і преміум тир.
Користувач бачить продукт до оплати, звикає до нього, і потім платить щоб зняти обмеження.

---

## Free тир (обмеження)

- Максимум **2 категорії витрат** і **1 категорія доходів**
- **Немає** голосового вводу (кнопка є, але веде на Paywall)
- **Немає** автоімпорту транзакцій з Apple Pay / Google Pay
- **Немає** синхронізації між пристроями — дані зберігаються локально на девайсі
- **Немає** спільного профілю / мульти-акаунту

## Premium тир (що відкривається)

- **Необмежена кількість категорій** (витрати + доходи)
- **Офлайн-режим** — дані кешуються локально (MMKV), синхронізація при появі мережі
- **Голосовий ввід** транзакцій
- **Автоімпорт** — автоматично підтягує транзакції з Apple Pay / Google Pay
- **Синхронізація між пристроями** — після купівлі юзер прив'язує Google або email,
  локальні дані мігрують у Supabase і доступні на будь-якому девайсі
- **Спільний профіль** — кілька людей (наприклад, сім'я) бачать і редагують спільний бюджет (Фаза 9)

---

## Фічі (обидва тири)

- Додавання, редагування, видалення транзакцій
- Категорії витрат і доходів з іконками
- Ліміти на категорії витрат
- Графік витрат по категоріях (bar chart)
- Історія транзакцій з фільтрацією по типу і категорії
- Режими відстеження: тільки витрати / витрати + доходи

---

## Технічний стек

| Шар | Технологія |
|-----|-----------|
| Мобільний фреймворк | React Native + Expo (expo-router) |
| Стейт менеджмент | Zustand (persist middleware) |
| Локальне сховище | MMKV (react-native-mmkv v4) |
| Платежі | RevenueCat (react-native-purchases) |
| Бекенд / Auth (тільки premium) | Supabase (PostgreSQL + Auth + Realtime) |
| Голосовий ввід (premium) | TBD (on-device або Whisper API) |

---

## Зовнішні сервіси

| Сервіс | Для чого | Коли потрібен |
|--------|----------|---------------|
| **RevenueCat** | Підписки, перевірка premium статусу, Paywall UI | Фаза 4 |
| **Supabase** | БД, Auth, Realtime sync | Фаза 5 (тільки premium) |
| **Apple App Store** | In-app purchases (iOS) | Публікація |
| **Google Play Billing** | In-app purchases (Android) | Публікація |

---

## Архітектура застосунку

```
┌─────────────────────────────────────────────────────┐
│                    UI (React Native)                 │
│  HomeScreen · ManageCategoriesScreen · PaywallModal  │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────┐
│              State Layer (Zustand + MMKV)            │
│                                                     │
│  useFinanceData        usePremium                   │
│  ├─ categories         ├─ isPremium                 │
│  ├─ historyItems       ├─ setPremium                │
│  ├─ addCategory        └─ syncPremiumStatus         │
│  ├─ updateCategory                                  │
│  ├─ deleteCategory                                  │
│  ├─ addTransaction                                  │
│  ├─ updateTransaction                               │
│  └─ deleteTransaction                               │
│                                                     │
│  persist → MMKV (локальний диск)                    │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────┐
│              Services Layer                          │
│                                                     │
│  revenueCat.ts                                      │
│  ├─ initRevenueCat() — ініціалізація при старті     │
│  └─ checkPremiumStatus() — перевірка підписки       │
│                                                     │
│  supabaseClient.ts (Фаза 5)                         │
│  ├─ auth (login, linkAccount)                       │
│  ├─ categories CRUD                                 │
│  ├─ transactions CRUD                               │
│  └─ syncQueue (офлайн черга)                        │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────┐
│              External Services                       │
│                                                     │
│  RevenueCat API ←→ Apple/Google Billing              │
│  Supabase (PostgreSQL + Auth + Realtime)            │
└─────────────────────────────────────────────────────┘
```

### Flow при старті застосунку

```
1. app/_layout.tsx → initRevenueCat()
2. Zustand stores → завантажують стейт з MMKV (persist)
3. usePremium.syncPremiumStatus() → перевіряє RevenueCat (якщо є інтернет)
4. UI рендериться з локальних даних (моментально)
```

### Flow покупки Premium

```
1. Юзер натискає обмежену дію → PaywallModal
2. Є інтернет → RevenueCat UI Paywall (основний)
3. Нема інтернету → наша модалка (fallback) з "Підключіть інтернет"
4. Юзер купує → RevenueCat підтверджує → isPremium = true (кеш локально)
5. Пропозиція прив'язати акаунт (Google/email) → Supabase Auth
6. Міграція MMKV → Supabase (одноразово)
```

### Flow офлайн (premium)

```
1. Юзер додає транзакцію офлайн
2. Записується в MMKV + sync queue
3. Мережа з'явилась → NetInfo listener
4. Sync queue → відправляє всі операції в Supabase
5. Pull свіжий стейт з Supabase → оновити MMKV
6. Конфлікти → updatedAt порівняння (last write wins)
```

### Flow Apple Pay / card transaction automation

Автоімпорт через Apple Pay / card transaction планується як automation bridge, а не як прямий доступ Finzelo до Wallet. Додаток не читає історію Apple Pay напряму — спочатку дані має передати Shortcuts automation, bank notification або bank sync.

```
Apple Pay / card transaction
→ Shortcuts automation
→ отримуємо дані: amount, merchant, date
→ AI класифікує merchant
→ Finzelo deep link/API
→ addTransaction(...)
```

Очікуваний payload для Finzelo:

```json
{
  "amount": 42.5,
  "merchant": "Uber",
  "date": "2026-06-29T12:30:00.000Z",
  "source": "apple_pay"
}
```

AI має отримати список реальних категорій юзера і повернути `categoryId`, а не вигадану назву категорії:

```json
{
  "action": "use_existing",
  "categoryId": "2",
  "confidence": 0.94,
  "reason": "Uber схожий на транспортну витрату"
}
```

Після класифікації Finzelo:

```
1. Перевіряє, що categoryId існує і належить юзеру
2. Якщо confidence низький → просить юзера підтвердити категорію
3. Створює витрату → addTransaction(...)
4. Зберігає merchant і source = 'apple_pay' або 'google_pay'
```

MVP deep link для Shortcuts:

```txt
finzelo://add-transaction?amount=42.50&merchant=Uber&source=apple_pay
```

Поточна реалізація в застосунку:

```
1. Finzelo відкривається через deep link
2. Парсить amount, merchant, date, source
3. Вибирає першу expense категорію як безпечний fallback
4. Відкриває AddTransactionModal з уже заповненою сумою
5. Після підтвердження юзером викликає addTransaction(...)
```

AI категоризацію не можна викликати напряму з мобільного застосунку, бо API key буде доступний у клієнті. Правильний production flow:

```
Shortcuts / bank sync
→ backend /classify-transaction
→ OpenAI gpt-5.4-nano з structured output
→ categoryId / ask_user
→ Finzelo deep link/API
→ addTransaction(...)
```

Для дешевого AI варіанту використовуємо малу модель для classification / data extraction зі structured outputs. AI викликається тільки на backend, бо API key не можна класти в мобільний застосунок.

---

## Структура файлів

```
src/
├── state/
│   ├── mmkv.ts                  — MMKV адаптер для Zustand
│   ├── FinanceDataContext.ts    — основний store (categories, transactions)
│   └── usePremium.ts            — premium status store
├── services/
│   ├── revenueCat.ts            — RevenueCat ініціалізація і helpers
│   └── supabaseClient.ts        — Supabase Auth client
├── modals/
│   ├── PaywallModal.tsx         — fallback paywall (офлайн)
│   ├── addTransactionModal.tsx
│   ├── EditTransactionModal.tsx
│   ├── DeleteTransactionModal.tsx
│   ├── CategoryFormModal.tsx
│   └── LimitModal.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── HomeScreen.constants.ts  — initial data (буде видалений в Фазі 5)
│   └── ManageCategoriesScreen.tsx
├── components/
├── types/
├── theme/
└── utils/

app/
├── _layout.tsx                  — root layout, initRevenueCat()
├── index.tsx                    — main page
├── auth.tsx                     — email login / sign up
├── reset-password.tsx           — password reset flow
└── manage-categories.tsx

app.config.ts                    — Expo config (читає .env)
```

### Environment variables

```env
REVENUECAT_API_KEY=your_key
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

`EXPO_PUBLIC_SUPABASE_URL` should be the project origin only, without `/rest/v1` or `/auth/v1`.

Supabase Auth redirect URL for password reset:

```text
finzelo://reset-password
```

---

## Архітектура даних

### Принцип

```
Free юзер:
  → дані зберігаються локально в MMKV
  → Supabase не використовується взагалі
  → видалив застосунок = втратив дані (це нормально для free)

Premium юзер:
  → купив преміум → прив'язав Google або email
  → локальні дані (MMKV) мігрують у Supabase один раз
  → далі Supabase є основним сховищем
  → MMKV залишається як офлайн-кеш з синхронізацією
```

### База даних (Supabase — тільки для premium)

```sql
-- Профілі користувачів
profiles (
  id uuid primary key,           -- = auth.users.id
  email text,
  is_premium boolean default false,
  premium_expires_at timestamptz,
  created_at timestamptz
)

-- Категорії
categories (
  id uuid primary key,
  user_id uuid references profiles(id),
  name text,
  type text,                     -- 'income' | 'expense'
  icon text,
  spending_limit numeric,
  created_at timestamptz
)

-- Транзакції
transactions (
  id uuid primary key,
  user_id uuid references profiles(id),
  category_id uuid references categories(id),
  amount numeric,
  type text,                     -- 'income' | 'expense'
  date timestamptz,
  note text,
  source text,                   -- 'manual' | 'apple_pay' | 'google_pay' | 'voice'
  created_at timestamptz
)
```

> **Майбутнє (Фаза 9):** додаються таблиці `spaces` і `space_members`,
> `user_id` замінюється на `space_id`. Кожен user стає owner свого space — міграція тривіальна.

---

## Плани реалізації

### UX Backlog
- Додати toast-повідомлення для результатів дій користувача: sign in/sign up, confirm email,
  reset password, CRUD операції, помилки мережі. Toast має коротко пояснювати, що відбулося,
  і замінити частину blocking `Alert.alert`, де не потрібна негайна дія.

### Фаза 1 — Локальний стейт без persistence ✅ (поточний стан)
- Zustand store з хардкодженими даними
- Всі CRUD операції працюють в пам'яті

### Фаза 2 — Локальне сховище (MMKV)
- Встановити `react-native-mmkv`
- Замінити хардкод з `HomeScreen.constants.ts` на MMKV
- Zustand persist middleware → зберігає `categories` і `transactions` в MMKV
- Дані переживають перезапуск застосунку

### Фаза 3 — Premium Gate
- Хук `usePremium()` — читає `isPremium` з MMKV (локально)
- При спробі створити 3-ю категорію витрат або 2-у доходів → Paywall modal
- Голосовий ввід — кнопка є, тапнути → Paywall
- Автоімпорт — тільки premium

### Фаза 4 — Paywall + прив'язка акаунту
- RevenueCat UI Paywall — основний екран (A/B тести, аналітика конверсії)
- Наша кастомна `PaywallModal` — fallback при офлайн
- Логіка: є інтернет → RevenueCat UI, нема → наша модалка з "Підключіть інтернет"
- Кнопка "Купити" → RevenueCat SDK для обробки платежу
- Після оплати: RevenueCat кешує статус локально → `isPremium = true`
- Одразу після купівлі — пропозиція прив'язати акаунт (Google або email)
- Анонімний акаунт конвертується через `supabase.auth.linkWithOAuth()` або `linkWithEmail()`
- Дані не губляться — той самий `user_id`

### Фаза 5 — Supabase + міграція даних
- Підключити `@supabase/supabase-js`
- Логін через Google або email (тільки для premium юзерів)
- Одноразова міграція: локальні дані з MMKV → Supabase
- Далі Supabase є основним сховищем, MMKV — офлайн-кеш
- Синхронізація при появі мережі (conflict resolution — last write wins)

### Фаза 6 — Голосовий ввід (premium)
- Кнопка мікрофону в `StickyAddBar`
- **TBD: вибір рішення для розпізнавання мови**
  - `@react-native-voice/voice` — on-device, безкоштовно, крос-платформно
  - Whisper API (OpenAI) — найкраща якість, $0.006/хв (платно)
  10,000 × 5 × $0.001 = $50/день = ~$1,500/місяць
  - Комбінація: on-device як основне, Whisper як fallback
- Парсинг тексту → сума + категорія → автозаповнення форми транзакції

### Фаза 7 — Автоімпорт Apple Pay / Google Pay (premium)
- iOS: читання push-сповіщень від банків, розпізнавання транзакцій
- Android: читання SMS з дозволом користувача
- Розпізнані транзакції потрапляють у список "на підтвердження"

### Фаза 8 — Мульти-акаунт / спільний профіль (premium, далеке майбутнє)
- Логін вже є з Фази 4 — тут додається запрошення інших юзерів
- Додати таблиці `spaces` і `space_members` в Supabase
- Міграція: кожен user стає owner свого особистого space
- `user_id` → `space_id` в categories/transactions
- Екран управління простором (запросити учасника по email)
- Realtime синхронізація через Supabase Realtime
- Відображення хто і коли додав транзакцію (`created_by`)
- Права: owner може видаляти, member тільки додає

---

## Поточний пріоритет

> **Фаза 2** ✅ — MMKV підключений, дані зберігаються локально.
> **Фаза 3** ✅ — Premium Gate реалізований (usePremium, PaywallModal, ліміти категорій).
> **Фаза 4** 🔄 — RevenueCat ініціалізований, потрібно встановити `react-native-purchases`.
