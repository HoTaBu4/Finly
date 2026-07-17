import Purchases from 'react-native-purchases';
import { getSupabaseClient } from './supabaseClient';
import { useFinanceData } from '../state/FinanceDataContext';
import { CategoryItem, HistoryTransaction } from '../types';

/**
 * Call after successful sign in or sign up.
 * Links RevenueCat to Supabase user and syncs data.
 */
export async function onAuthComplete(userId: string) {
  // Link RevenueCat to this user
  await Purchases.logIn(userId);
}

/**
 * Upload local data (MMKV) to Supabase.
 * Called after first sign up when user already has local data.
 */
export async function migrateLocalToSupabase(userId: string) {
  const { categories, historyItems } = useFinanceData.getState();

  const supabase = getSupabaseClient();

  // Upload categories
  if (categories.length > 0) {
    const categoryRows = categories.map((c) => ({
      id: c.id,
      user_id: userId,
      name: c.category,
      type: c.type,
      icon: c.icon,
      limit_amount: c.limit,
      updated_at: c.updatedAt,
    }));

    const { error: catError } = await supabase
      .from('categories')
      .upsert(categoryRows, { onConflict: 'id' });

    if (catError) {
      console.error('[Sync] Failed to migrate categories:', catError.message);
      throw catError;
    }
  }

  // Upload transactions
  if (historyItems.length > 0) {
    const transactionRows = historyItems.map((t) => ({
      id: t.id,
      user_id: userId,
      category_id: t.categoryId,
      amount: t.amount,
      type: t.type,
      date: t.date,
      updated_at: t.updatedAt,
    }));

    const { error: txError } = await supabase
      .from('transactions')
      .upsert(transactionRows, { onConflict: 'id' });

    if (txError) {
      console.error('[Sync] Failed to migrate transactions:', txError.message);
      throw txError;
    }
  }
}

/**
 * Download data from Supabase and replace local MMKV store.
 * Called after sign in when restoring from existing account.
 */
export async function loadDataFromSupabase(userId: string) {
  const supabase = getSupabaseClient();

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (catError) {
    console.error('[Sync] Failed to load categories:', catError.message);
    throw catError;
  }

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (txError) {
    console.error('[Sync] Failed to load transactions:', txError.message);
    throw txError;
  }

  // Map Supabase rows to local types.
  // Replaces local data entirely — this is correct for sign-in restore.
  if (categories && categories.length > 0) {
    const mappedCategories: CategoryItem[] = categories.map((row) => ({
      id: row.id,
      category: row.name,
      type: row.type,
      limit: row.limit_amount,
      icon: row.icon,
      updatedAt: row.updated_at,
    }));

    useFinanceData.setState({ categories: mappedCategories });
  }

  if (transactions && transactions.length > 0) {
    const mappedTransactions: HistoryTransaction[] = transactions.map((row) => ({
      id: row.id,
      amount: row.amount,
      type: row.type,
      categoryId: row.category_id,
      date: row.date,
      updatedAt: row.updated_at,
    }));

    useFinanceData.setState({ historyItems: mappedTransactions });
  }
}
