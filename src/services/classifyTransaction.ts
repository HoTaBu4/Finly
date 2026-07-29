import { getSupabaseClient } from './supabaseClient';

type ClassifyResult = {
  categoryId: string;
  confidence: number;
};

/**
 * Calls Supabase Edge Function to classify a merchant into a category using AI.
 * Returns null if classification fails or is unavailable.
 */
export async function classifyMerchant(
  merchant: string,
  categories: { id: string; name: string }[]
): Promise<ClassifyResult | null> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke('classify-transaction', {
      body: { merchant, categories },
    });

    if (error || !data?.categoryId) {
      return null;
    }

    return {
      categoryId: data.categoryId,
      confidence: data.confidence ?? 0,
    };
  } catch {
    return null;
  }
}
