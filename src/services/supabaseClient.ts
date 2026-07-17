import 'react-native-url-polyfill/auto';

import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { mmkvStorage } from '../state/mmkv';

let supabaseClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string) {
  return new URL(url).origin;
}

function getSupabaseConfig() {
  const rawSupabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? Constants.expoConfig?.extra?.supabaseUrl;
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? Constants.expoConfig?.extra?.supabaseAnonKey;

  if (!rawSupabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return {
    supabaseUrl: normalizeSupabaseUrl(rawSupabaseUrl),
    supabaseAnonKey,
  };
}

export function getSupabaseClient() {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: mmkvStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseClient;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentAuthUser() {
  const { data, error } = await getSupabaseClient().auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export function subscribeToAuthUserChange(callback: (user: User | null) => void) {
  const { data } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return data.subscription;
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const redirectUrl = Linking.createURL('auth/confirm');

  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sendPasswordResetEmail(email: string) {
  const redirectUrl = Linking.createURL('auth/reset-password');

  const { data, error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateUserPassword(password: string) {
  const { data, error } = await getSupabaseClient().auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function setAuthSession(accessToken: string, refreshToken: string) {
  const { data, error } = await getSupabaseClient().auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }

  return data;
}
