import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { setAuthSession } from '../services/supabaseClient';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { getAuthUrlParams } from '../utils/authUrl';

type ConfirmationStatus = 'verifying' | 'confirmed' | 'missingSession';

export function AuthConfirmScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<ConfirmationStatus>('verifying');
  const copy = translations.authConfirm;

  useEffect(() => {
    async function handleConfirmationUrl(url: string | null) {
      if (!url) {
        setStatus('missingSession');
        return;
      }

      const params = getAuthUrlParams(url);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      if (!accessToken || !refreshToken || type !== 'signup') {
        setStatus('missingSession');
        return;
      }

      try {
        await setAuthSession(accessToken, refreshToken);
        setStatus('confirmed');
      } catch (error) {
        const message = error instanceof Error ? error.message : copy.error.message;
        Alert.alert(copy.error.title, message);
        setStatus('missingSession');
      }
    }

    Linking.getInitialURL().then(handleConfirmationUrl);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleConfirmationUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [copy.error.message, copy.error.title]);

  const isVerifying = status === 'verifying';
  const title = status === 'confirmed' ? copy.successTitle : copy.title;
  const message = status === 'missingSession' ? copy.missingSessionMessage : copy.message;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          {isVerifying ? (
            <ActivityIndicator color={colors.accentPrimary} />
          ) : (
            <Ionicons
              name={status === 'confirmed' ? 'checkmark-circle' : 'mail-open'}
              size={36}
              color={colors.accentPrimary}
            />
          )}
        </View>

        <Text style={styles.title}>{isVerifying ? copy.verifyingTitle : title}</Text>
        <Text style={styles.message}>{isVerifying ? copy.verifyingMessage : message}</Text>

        {!isVerifying && (
          <Pressable style={styles.button} onPress={() => router.replace('/')}>
            <Text style={styles.buttonText}>{copy.buttonLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    padding: 24,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentPrimarySoft,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
