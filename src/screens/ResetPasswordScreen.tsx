import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
import {
  sendPasswordResetEmail,
  setAuthSession,
  updateUserPassword,
} from '../services/supabaseClient';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { getAuthUrlParams } from '../utils/authUrl';

type ResetMode = 'requestEmail' | 'setPassword';

export function ResetPasswordScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<ResetMode>('requestEmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const copy = translations.resetPassword;

  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitSeconds]);
  const isEmailValid = useMemo(() => email.trim().includes('@'), [email]);
  const isPasswordValid = useMemo(
    () => password.trim().length >= 6 && password === confirmPassword,
    [confirmPassword, password]
  );

  useEffect(() => {
    async function handleRecoveryUrl(url: string | null) {
      if (!url) {
        return;
      }

      const params = getAuthUrlParams(url);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      if (accessToken && refreshToken && type === 'recovery') {
        try {
          await setAuthSession(accessToken, refreshToken);
          setMode('setPassword');
        } catch (error) {
          const message = error instanceof Error ? error.message : copy.error.message;
          Alert.alert(copy.error.title, message);
        }
      }
    }

    Linking.getInitialURL().then(handleRecoveryUrl);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleRecoveryUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [copy.error.message, copy.error.title]);

  async function handleSendResetEmail() {
    if (!isEmailValid) {
      Alert.alert(copy.invalidEmail.title, copy.invalidEmail.message);
      return;
    }

    if (rateLimitSeconds > 0) {
      Alert.alert('Please wait', `Try again in ${rateLimitSeconds} seconds.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(email.trim());
      setRateLimitSeconds(60);
      Alert.alert(copy.emailSent.title, copy.emailSent.message);
    } catch (error) {
      console.log('[ResetPassword] Error:', JSON.stringify(error, null, 2));
      const isRateLimit =
        (error as any)?.code === 'over_email_send_rate_limit' ||
        (error as any)?.status === 429;

      if (isRateLimit) {
        Alert.alert('Too many requests', 'Please try again later.');
      } else {
        const message = error instanceof Error ? error.message : copy.error.message;
        Alert.alert(copy.error.title, message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdatePassword() {
    if (!isPasswordValid) {
      Alert.alert(copy.invalidPassword.title, copy.invalidPassword.message);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateUserPassword(password);
      Alert.alert(copy.passwordUpdated.title, copy.passwordUpdated.message);
      router.replace('/auth');
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.error.message;
      Alert.alert(copy.error.title, message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonDisabled =
    isSubmitting || (mode === 'requestEmail' ? !isEmailValid : !isPasswordValid);

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
          <Ionicons name="key-outline" size={34} color={colors.accentPrimary} />
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>
            {mode === 'requestEmail' ? copy.requestTitle : copy.updateTitle}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'requestEmail' ? copy.requestSubtitle : copy.updateSubtitle}
          </Text>
        </View>

        <View style={styles.form}>
          {mode === 'requestEmail' ? (
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
          ) : (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>{copy.newPassword}</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={translations.auth.passwordPlaceholder}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    secureTextEntry
                    textContentType="newPassword"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>{copy.confirmPassword}</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={copy.confirmPasswordPlaceholder}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    secureTextEntry
                    textContentType="newPassword"
                    style={styles.input}
                  />
                </View>
              </View>
            </>
          )}

          <Pressable
            style={[styles.submitButton, (buttonDisabled || rateLimitSeconds > 0) && styles.submitButtonDisabled]}
            onPress={mode === 'requestEmail' ? handleSendResetEmail : handleUpdatePassword}
            disabled={buttonDisabled || (mode === 'requestEmail' && rateLimitSeconds > 0)}
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {rateLimitSeconds > 0 && mode === 'requestEmail'
                ? `Wait ${rateLimitSeconds}s`
                : isSubmitting
                  ? translations.auth.submitting
                  : mode === 'requestEmail'
                    ? copy.sendLink
                    : copy.updatePassword}
            </Text>
            <Ionicons name="arrow-forward" size={17} color={colors.cardBackground} />
          </Pressable>
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={18} color={colors.accentPrimary} />
          <Text style={styles.noteText}>{copy.note}</Text>
        </View>
      </ScrollView>
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
  form: {
    gap: 14,
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
