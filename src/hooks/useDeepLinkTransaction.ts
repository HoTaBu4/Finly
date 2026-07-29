import { useEffect, useCallback, useRef } from 'react';
import * as Linking from 'expo-linking';
import { useFinanceData } from '../state/FinanceDataContext';
import { usePremium } from '../state/usePremium';
import { classifyMerchant } from '../services/classifyTransaction';
import { OTHER_EXPENSE_CATEGORY_ID } from '../screens/HomeScreen.constants';
import { TransactionType } from '../types';

const CONFIDENCE_THRESHOLD = 0.8;

/**
 * Listens for deep links like:
 * finzelo://add-transaction?amount=42.50&merchant=Uber&source=apple_pay
 *
 * If AI confidence is high enough, auto-adds the transaction to matched category.
 * Otherwise, auto-adds to "Other" category.
 */
export function useDeepLinkTransaction() {
  const { categories, addTransaction } = useFinanceData();
  const { isPremium } = usePremium();
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  const handleUrl = useCallback(
    async (url: string) => {
      if (!isPremium) return;

      const parsed = Linking.parse(url);
      if (parsed.path !== 'add-transaction') return;

      const params = parsed.queryParams ?? {};
      const amount = Number(params.amount);
      const merchant = typeof params.merchant === 'string' ? params.merchant : '';
      const source = typeof params.source === 'string' ? params.source : 'manual';
      const date = typeof params.date === 'string' ? params.date : new Date().toISOString();

      if (!amount || amount <= 0 || !merchant) return;

      // Get expense categories for classification
      const expenseCategories = categoriesRef.current
        .filter((c) => c.type === TransactionType.Expense)
        .map((c) => ({ id: c.id, name: c.category }));

      // Classify merchant via AI
      const classification = await classifyMerchant(merchant, expenseCategories);

      const suggestedCategoryId = classification?.categoryId ?? null;
      const confidence = classification?.confidence ?? 0;

      // Auto-add if confidence is high and category exists
      if (suggestedCategoryId && confidence >= CONFIDENCE_THRESHOLD) {
        const categoryExists = categoriesRef.current.some((c) => c.id === suggestedCategoryId);

        if (categoryExists) {
          addTransaction({
            id: `${Date.now()}`,
            amount,
            type: TransactionType.Expense,
            categoryId: suggestedCategoryId,
            date,
            updatedAt: new Date().toISOString(),
          });
          return;
        }
      }

      // Low confidence or no match — auto-add to "Other" category
      addTransaction({
        id: `${Date.now()}`,
        amount,
        type: TransactionType.Expense,
        categoryId: OTHER_EXPENSE_CATEGORY_ID,
        date,
        updatedAt: new Date().toISOString(),
      });
    },
    [isPremium, addTransaction]
  );

  useEffect(() => {
    // Handle deep link when app opens from closed state
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Handle deep link when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);
}
