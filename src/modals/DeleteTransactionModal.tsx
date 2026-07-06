import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { CategoryItem, HistoryTransaction } from '../types';
import { formatMoney } from '../utils/formatters';

type DeleteTransactionModalProps = {
  visible: boolean;
  transaction: HistoryTransaction | null;
  categories: CategoryItem[];
  onClose: () => void;
  onConfirm: (transaction: HistoryTransaction) => void;
};

export function DeleteTransactionModal({
  visible,
  transaction,
  categories,
  onClose,
  onConfirm,
}: DeleteTransactionModalProps) {
  const transactionCategoryName = transaction
    ? categories.find((item) => item.id === transaction.categoryId)?.category ?? translations.common.unknown
    : translations.common.unknown;

  function handleConfirm() {
    if (!transaction) {
      return;
    }

    onConfirm(transaction);
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
              <Ionicons name="warning-outline" size={16} color={colors.orange} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.modalTitle}>{translations.deleteTransaction.title}</Text>
              <Text style={styles.modalSubtitle}>{translations.deleteTransaction.subtitle}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{translations.common.category}</Text>
            <Text style={styles.summaryValue}>{transactionCategoryName}</Text>
            <Text style={styles.summaryLabel}>{translations.common.amount}</Text>
            <Text style={styles.summaryValue}>
              {transaction ? formatMoney(Math.abs(transaction.amount)) : '-'}
            </Text>
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>{translations.common.cancel}</Text>
            </Pressable>
            <Pressable style={styles.modalDeleteButton} onPress={handleConfirm}>
              <Text style={styles.modalDeleteText}>{translations.common.delete}</Text>
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
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningSoft,
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
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.appBackground,
    padding: 12,
    gap: 3,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  summaryValue: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalActions: {
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
  modalDeleteButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cardBackground,
  },
});
