import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { CategoryIconKey, CategoryItem, TransactionType } from '../../types';

export type CategoryFormInput = {
  category: string;
  type: TransactionType;
  icon: CategoryIconKey;
};

type CategoryFormModalProps = {
  visible: boolean;
  initialCategory: CategoryItem | null;
  onClose: () => void;
  onSave: (input: CategoryFormInput) => void;
};

const CATEGORY_ICON_OPTIONS: CategoryIconKey[] = [
  CategoryIconKey.Restaurant,
  CategoryIconKey.Car,
  CategoryIconKey.BagHandle,
  CategoryIconKey.Medkit,
  CategoryIconKey.Receipt,
  CategoryIconKey.EllipsisHorizontal,
  CategoryIconKey.Cash,
  CategoryIconKey.Card,
  CategoryIconKey.Wallet,
  CategoryIconKey.Home,
  CategoryIconKey.Airplane,
  CategoryIconKey.Bus,
  CategoryIconKey.Train,
  CategoryIconKey.Bicycle,
  CategoryIconKey.Gift,
  CategoryIconKey.Briefcase,
  CategoryIconKey.Cart,
  CategoryIconKey.Cafe,
  CategoryIconKey.FastFood,
  CategoryIconKey.Pizza,
  CategoryIconKey.GameController,
  CategoryIconKey.PhonePortrait,
  CategoryIconKey.Book,
  CategoryIconKey.Calendar,
];

export function CategoryFormModal({
  visible,
  initialCategory,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [nameInput, setNameInput] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconKey>(CategoryIconKey.Cart);

  const isEditing = Boolean(initialCategory);
  const categoryName = nameInput.trim();

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNameInput(initialCategory?.category ?? '');
    setType(initialCategory?.type ?? TransactionType.Expense);
    setSelectedIcon(
      initialCategory?.icon ??
      (initialCategory?.type === TransactionType.Income
        ? CategoryIconKey.Cash
        : CategoryIconKey.Cart)
    );
  }, [initialCategory, visible]);

  function handleSave() {
    if (!categoryName) {
      Alert.alert('Invalid category', 'Category name cannot be empty.');
      return;
    }

    onSave({ category: categoryName, type, icon: selectedIcon });
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
            {isEditing ? 'Edit category' : 'Add category'}
          </Text>

          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.modalInput}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Category name"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />

          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeRow}>
            <Pressable
              style={[styles.typeButton, type === TransactionType.Expense && styles.typeButtonActive]}
              onPress={() => setType(TransactionType.Expense)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === TransactionType.Expense && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, type === TransactionType.Income && styles.typeButtonActive]}
              onPress={() => setType(TransactionType.Income)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === TransactionType.Income && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Icon</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.iconMenuContent}
          >
            {CATEGORY_ICON_OPTIONS.map((icon) => {
              const isSelected = icon === selectedIcon;
              return (
                <Pressable
                  key={icon}
                  style={[styles.iconOption, isSelected && styles.iconOptionActive]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons
                    name={icon}
                    size={18}
                    color={isSelected ? colors.accentPrimary : colors.textPrimary}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.modalActions}>
            <Pressable style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalSaveButton} onPress={handleSave}>
              <Text style={styles.modalSaveText}>{isEditing ? 'Save' : 'Add'}</Text>
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
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  typeButtonActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.accentPrimarySoft,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.accentPrimary,
  },
  iconMenuContent: {
    gap: 8,
    paddingRight: 4,
  },
  iconOption: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  iconOptionActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.accentPrimarySoft,
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
