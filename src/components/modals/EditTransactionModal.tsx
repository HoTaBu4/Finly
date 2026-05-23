import { Ionicons } from '@expo/vector-icons';
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
import { CategoryItem, HistoryTransaction, TransactionType } from '../../types';

type EditTransactionModalProps = {
  visible: boolean;
  transaction: HistoryTransaction | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (transaction: HistoryTransaction) => void;
};

export function EditTransactionModal({
  visible,
  transaction,
  categories,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {

    if (!transaction) {
      return;
    }

    setSelectedCategoryId(transaction.categoryId);
    setAmountInput(String(Math.abs(transaction.amount)));
  }, [transaction, visible]);

  const categoryById = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories]
  );
  const selectedCategory = selectedCategoryId
    ? categoryById.get(selectedCategoryId) ?? null
    : null;
  const selectedType: TransactionType = selectedCategory?.type ?? 'expense';

  function handleSave() {
    if (!transaction) {
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Invalid category', 'Please select a category.');
      return;
    }

    const parsedAmount = Number(amountInput.trim());
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid amount greater than 0.');
      return;
    }

    onSave({
      ...transaction,
      type: selectedType,
      categoryId: selectedCategory.id,
      amount: Math.abs(parsedAmount),
    });
  }

  if (!transaction) {
    return null;
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
          <View style={styles.headerRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="create-outline" size={16} color={colors.accentPrimary} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.modalTitle}>Edit transaction</Text>
              <Text style={styles.modalSubtitle}>
                {selectedType === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Category</Text>
          <CategorySelectDropdown
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={(category) => setSelectedCategoryId(category.id)}
          />

          <Text style={styles.fieldLabel}>Amount</Text>
          <TextInput
            style={styles.modalInput}
            value={amountInput}
            onChangeText={setAmountInput}
            placeholder="Amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalSaveButton} onPress={handleSave}>
              <Text style={styles.modalSaveText}>Save</Text>
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
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 18,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimarySoft,
  },
  headerTextWrap: {
    flex: 1,
    gap: 2,
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
    borderWidth: 1,
    borderColor: colors.panelBorder,
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
