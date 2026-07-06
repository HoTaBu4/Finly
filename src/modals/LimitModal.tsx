import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';

type LimitModalProps = {
  visible: boolean;
  categoryName?: string;
  currentLimit: number | null;
  onClose: () => void;
  onSave: (limit: number | null) => void;
};

export function LimitModal({
  visible,
  categoryName,
  currentLimit,
  onClose,
  onSave,
}: LimitModalProps) {
  const [limitInput, setLimitInput] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setLimitInput(currentLimit != null ? String(currentLimit) : '');
  }, [categoryName, currentLimit, visible]);

  function handleSave() {
    const normalizedText = limitInput.trim();
    if (normalizedText.length === 0) {
      onSave(null);
      return;
    }

    const parsedValue = Number(normalizedText);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      Alert.alert(translations.limit.invalidLimit.title, translations.limit.invalidLimit.message);
      return;
    }

    onSave(Math.round(parsedValue));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.modalTitle}>
            {currentLimit != null ? translations.limit.editTitle : translations.limit.addTitle}
          </Text>
          <Text style={styles.modalSubtitle}>{categoryName}</Text>

          <TextInput
            style={styles.modalInput}
            value={limitInput}
            onChangeText={setLimitInput}
            placeholder={translations.limit.placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            autoFocus
          />

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>{translations.common.cancel}</Text>
            </Pressable>
            <Pressable style={styles.modalSaveButton} onPress={handleSave}>
              <Text style={styles.modalSaveText}>{translations.common.save}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalActions: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalCancelButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalSaveButton: {
    borderRadius: 10,
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
});
