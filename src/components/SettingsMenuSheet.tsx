import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { TrackingMode } from '../types';

type SettingsMenuSheetProps = {
  visible: boolean;
  trackingMode: TrackingMode;
  onClose: () => void;
  onTrackingModeChange: (mode: TrackingMode) => void;
  onManageCategoriesPress: () => void;
  onAccountPress: () => void;
};

type ToggleOption<T extends string> = {
  value: T;
  label: string;
};

const TRACKING_OPTIONS: ToggleOption<TrackingMode>[] = [
  { value: TrackingMode.ExpensesOnly, label: 'Expenses only' },
  { value: TrackingMode.Both, label: 'Expenses + Income' },
];

export function SettingsMenuSheet({
  visible,
  trackingMode,
  onClose,
  onTrackingModeChange,
  onManageCategoriesPress,
  onAccountPress,
}: SettingsMenuSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.sheet}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.grabber} />
          <Text style={styles.title}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Tracking mode</Text>
            <View style={styles.toggleRow}>
              {TRACKING_OPTIONS.map((option) => {
                const isActive = option.value === trackingMode;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
                    onPress={() => onTrackingModeChange(option.value)}
                    accessibilityRole="button"
                    accessibilityLabel={`Tracking mode: ${option.label}`}
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[styles.toggleText, isActive && styles.toggleTextActive]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.listWrap}>
            <Pressable style={styles.listItem} onPress={onManageCategoriesPress}>
              <View style={styles.listItemLeft}>
                <Ionicons name="grid-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.listText}>Manage categories</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.listItem} onPress={onAccountPress}>
              <View style={styles.listItemLeft}>
                <Ionicons name="person-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.listText}>Account settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.panelBorder,
    gap: 12,
  },
  grabber: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.borderSoft,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  toggleButton: {
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.cardBackground,
  },
  toggleButtonActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.accentPrimarySoft,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.accentPrimary,
  },
  listWrap: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.panelBorder,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
