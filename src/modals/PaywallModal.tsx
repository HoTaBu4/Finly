import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';

type PlanOption = 'yearly' | 'monthly';

type PaywallModalProps = {
  visible: boolean;
  isOffline?: boolean;
  onClose: () => void;
  onPurchasePress: (plan: PlanOption) => void;
};

const FEATURES = [
  {
    icon: 'lock-closed' as const,
    color: colors.positiveBright,
    title: translations.paywall.features.categoryLimit.title,
    description: translations.paywall.features.categoryLimit.description,
  },
  {
    icon: 'notifications' as const,
    color: colors.attention,
    title: translations.paywall.features.voiceInput.title,
    description: translations.paywall.features.voiceInput.description,
  },
  {
    icon: 'star' as const,
    color: colors.accentSecondary,
    title: translations.paywall.features.expenseTracking.title,
    description: translations.paywall.features.expenseTracking.description,
  },
];

export function PaywallModal({ visible, isOffline = false, onClose, onPurchasePress }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>('yearly');

  function handleContinue() {
    onPurchasePress(selectedPlan);
  }

  function handleRestore() {
    onPurchasePress(selectedPlan);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.screen}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>

        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color={colors.warningBannerText} />
            <Text style={styles.offlineBannerText}>
              {translations.alerts.noInternet.message}
            </Text>
          </View>
        )}

        <View style={styles.iconContainer}>
          <View style={styles.appIcon}>
            <Ionicons name="wallet" size={40} color={colors.cardBackground} />
          </View>
        </View>

        <Text style={styles.title}>{translations.paywall.title}</Text>

        <View style={styles.featureList}>
          <View style={styles.featureBar} />
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureRow}>
              <View style={[styles.featureIconWrap, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon} size={16} color={colors.cardBackground} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={styles.plansContainer}>
          <Pressable
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{translations.paywall.plans.yearly.badge}</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{translations.paywall.plans.yearly.name}</Text>
              {selectedPlan === 'yearly' && (
                <Ionicons name="checkmark-circle" size={22} color={colors.accentSecondary} />
              )}
              {selectedPlan !== 'yearly' && (
                <Ionicons name="ellipse-outline" size={22} color={colors.textSecondary} />
              )}
            </View>
            <Text style={styles.planPrice}>{translations.paywall.plans.yearly.price}</Text>
            <Text style={styles.planSubtext}>{translations.paywall.plans.yearly.subtext}</Text>
          </Pressable>

          <Pressable
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{translations.paywall.plans.monthly.name}</Text>
              {selectedPlan === 'monthly' && (
                <Ionicons name="checkmark-circle" size={22} color={colors.accentSecondary} />
              )}
              {selectedPlan !== 'monthly' && (
                <Ionicons name="ellipse-outline" size={22} color={colors.textSecondary} />
              )}
            </View>
            <Text style={styles.planPrice}>{translations.paywall.plans.monthly.price}</Text>
            <Text style={styles.planSubtext}>{translations.paywall.plans.monthly.subtext}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{translations.paywall.continue}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Pressable onPress={handleRestore}>
            <Text style={styles.footerLink}>{translations.paywall.restorePurchases}</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.footerLink}>{translations.paywall.terms}</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.footerLink}>{translations.paywall.privacy}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 34,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningBannerBackground,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  offlineBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warningBannerText,
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureList: {
    gap: 20,
    paddingLeft: 8,
    position: 'relative',
  },
  featureBar: {
    position: 'absolute',
    left: 22,
    top: 16,
    bottom: 16,
    width: 3,
    backgroundColor: colors.positiveSoft,
    borderRadius: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textDescription,
    lineHeight: 18,
  },
  spacer: {
    flex: 1,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  planCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    padding: 14,
    paddingTop: 18,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.accentSecondary,
    backgroundColor: colors.accentSecondarySoft,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: colors.accentSecondary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  planBadgeText: {
    color: colors.cardBackground,
    fontSize: 10,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  planSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  continueButton: {
    backgroundColor: colors.accentSecondary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  continueButtonText: {
    color: colors.cardBackground,
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  footerLink: {
    fontSize: 13,
    color: colors.accentSecondary,
  },
});
