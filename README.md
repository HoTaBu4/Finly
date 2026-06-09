# Finly — Product Requirements

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
| Стейт менеджмент | Zustand |
| Локальне сховище (free + premium офлайн кеш) | MMKV |
| Бекенд / Auth (тільки premium) | Supabase (PostgreSQL + Auth + Realtime) |
| Голосовий ввід (premium) | Whisper API |
| Платежі | RevenueCat (App Store + Google Play) або Stripe |

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

> **Фаза 2** — підключити MMKV, зберігати дані локально, прибрати хардкод.
