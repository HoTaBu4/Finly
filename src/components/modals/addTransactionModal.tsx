import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CategorySelectDropdown } from '../CategorySelectDropdown';
import { colors } from '../../theme/colors';
import { CategoryItem, TransactionType } from '../../types';

export type AddTransactionInput = {
  amount: number;
  categoryId: string;
  type: TransactionType;
};

type AddTransactionModalProps = {
  visible: boolean;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (transaction: AddTransactionInput) => void;
};

export function AddTransactionModal({
  visible,
  categories,
  onClose,
  onSave,
}: AddTransactionModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setAmountInput('');
    setSelectedCategoryId(categories[0]?.id ?? null);
  }, [visible]);

  const categoryById = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories]
  );
  const selectedCategory = selectedCategoryId
    ? categoryById.get(selectedCategoryId) ?? null
    : null;

  function handleSave() {
    if (!selectedCategory) {
      Alert.alert('No category', 'Please choose a category.');
      return;
    }

    const parsedAmount = Number(amountInput.trim());
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount greater than 0.');
      return;
    }

    onSave({
      amount: Math.abs(parsedAmount),
      categoryId: selectedCategory.id,
      type: selectedCategory.type,
    });
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
          <Text style={styles.modalTitle}>Add transaction</Text>
          <Text style={styles.modalSubtitle}>
            {selectedCategory?.type === TransactionType.Income ? 'Income' : 'Expense'}
          </Text>

          <Text style={styles.fieldLabel}>Category</Text>
          <CategorySelectDropdown
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={(category) => setSelectedCategoryId(category.id)}
            visible={visible}
          />

          <Text style={styles.fieldLabel}>Amount</Text>
          <TextInput
            style={styles.modalInput}
            value={amountInput}
            onChangeText={setAmountInput}
            placeholder="Amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            autoFocus
          />

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalSaveButton} onPress={handleSave}>
              <Text style={styles.modalSaveText}>Add</Text>
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
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.panelBorder,
    padding: 18,
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
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
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalSaveButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
});
