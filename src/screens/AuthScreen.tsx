import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { signInWithEmail, signUpWithEmail } from '../services/supabaseClient';
import { onAuthComplete, migrateLocalToSupabase, loadDataFromSupabase } from '../services/syncService';
import { usePremium } from '../state/usePremium';
import { usePaywall } from '../hooks/usePaywall';
import { PaywallModal } from '../modals/PaywallModal';

type AuthMode = 'signIn' | 'signUp';

export function AuthScreen() {
  const router = useRouter();
  const { isPremium } = usePremium();
  const { showPaywall, isOfflinePaywallVisible, handleOfflinePurchaseAttempt, closeOfflinePaywall } = usePaywall();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = translations.auth[mode];
  const isFormValid = useMemo(
    () => email.trim().includes('@') && password.trim().length >= 6,
    [email, password]
  );

  async function handleSubmit() {
    if (!isFormValid) {
      Alert.alert(
        translations.auth.validationError.title,
        translations.auth.validationError.message
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === 'signIn') {
        const { user } = await signInWithEmail(email.trim(), password);
        if (user) {
          await onAuthComplete(user.id);
          await loadDataFromSupabase(user.id);
          await usePremium.getState().syncPremiumStatus();
        }
        Alert.alert(
          translations.auth.signInSuccess.title,
          translations.auth.signInSuccess.message
        );
      } else {
        const { user } = await signUpWithEmail(email.trim(), password);
        if (user) {
          await onAuthComplete(user.id);
          await migrateLocalToSupabase(user.id);
          await usePremium.getState().syncPremiumStatus();
        }
        Alert.alert(
          translations.auth.signUpSuccess.title,
          translations.auth.signUpSuccess.message
        );
      }

      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : translations.auth.authError.message;
      Alert.alert(translations.auth.authError.title, message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.headerButtonText}>{translations.common.back}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="person-circle" size={36} color={colors.accentPrimary} />
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <View style={styles.modeSwitch}>
          <Pressable
            style={[styles.modeButton, mode === 'signIn' && styles.modeButtonActive]}
            onPress={() => setMode('signIn')}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'signIn' }}
          >
            <Text style={[styles.modeText, mode === 'signIn' && styles.modeTextActive]}>
              {translations.auth.signIn.buttonLabel}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.modeButton, mode === 'signUp' && styles.modeButtonActive]}
            onPress={() => {
              if (!isPremium) {
                showPaywall();
                return;
              }
              setMode('signUp');
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'signUp' }}
          >
            <Text style={[styles.modeText, mode === 'signUp' && styles.modeTextActive]}>
              {translations.auth.signUp.buttonLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{translations.auth.email}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={translations.auth.emailPlaceholder}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{translations.auth.password}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={translations.auth.passwordPlaceholder}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                secureTextEntry
                textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                style={styles.input}
              />
            </View>
          </View>

          {mode === 'signIn' && (
            <Pressable
              style={styles.forgotPasswordButton}
              onPress={() => router.push('/reset-password')}
              accessibilityRole="button"
            >
              <Text style={styles.forgotPasswordText}>{translations.auth.forgotPassword}</Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.submitButton,
              (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? translations.auth.submitting : copy.buttonLabel}
            </Text>
            <Ionicons name="arrow-forward" size={17} color={colors.cardBackground} />
          </Pressable>
        </View>

        <View style={styles.note}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.green} />
          <Text style={styles.noteText}>
            {translations.auth.note}
          </Text>
        </View>
      </ScrollView>
      <PaywallModal
        visible={isOfflinePaywallVisible}
        onClose={closeOfflinePaywall}
        onPurchasePress={handleOfflinePurchaseAttempt}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerButton: {
    alignSelf: 'flex-start',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimarySoft,
    marginBottom: 20,
  },
  titleWrap: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  modeSwitch: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    backgroundColor: colors.filterChipBackground,
    borderWidth: 1,
    borderColor: colors.filterChipBorder,
    marginBottom: 18,
  },
  modeButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTextActive: {
    color: colors.textPrimary,
  },
  form: {
    gap: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotPasswordText: {
    color: colors.accentPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    backgroundColor: colors.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: colors.accentPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    color: colors.cardBackground,
    fontSize: 15,
    fontWeight: '800',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 20,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.cardBackground,
    padding: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
