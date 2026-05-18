import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { CategoryItem, HistoryTransaction, TransactionType } from '../../types';

type EditTransactionModalProps = {
  transaction: HistoryTransaction;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (transaction: HistoryTransaction) => void;
};

const MENU_MAX_HEIGHT = 180;
const MENU_OPEN_DURATION = 240;
const MENU_CLOSE_DURATION = 190;

export function EditTransactionModal({
  transaction,
  categories,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const initialSelectedCategory =
    categories.find((item) => item.id === transaction.categoryId) ??
    null;
    
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    initialSelectedCategory
  );
  const [amountInput, setAmountInput] = useState(String(Math.abs(transaction.amount)));
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isCategoryMenuMounted, setCategoryMenuMounted] = useState(false);
  const categoryMenuAnimation = useRef(new Animated.Value(0)).current;
  
  const selectedType = selectedCategory?.type ?? transaction.type;
  function resetCategoryMenu() {
    setCategoryMenuOpen(false);
    setCategoryMenuMounted(false);
    categoryMenuAnimation.setValue(0);
  }

  function animateCategoryMenu(
    toValue: 0 | 1,
    duration: number,
    easing: (value: number) => number,
    onEnd?: () => void
  ) {
    Animated.timing(categoryMenuAnimation, {
      toValue,
      duration,
      easing,
      useNativeDriver: false,
    }).start(onEnd);
  }

  function openCategoryMenu() {
    setCategoryMenuMounted(true);
    setCategoryMenuOpen(true);
    animateCategoryMenu(1, MENU_OPEN_DURATION, Easing.out(Easing.cubic));
  }

  function closeCategoryMenu() {
    animateCategoryMenu(
      0,
      MENU_CLOSE_DURATION,
      Easing.in(Easing.cubic),
      resetCategoryMenu
    );
  }

  function toggleCategoryMenu() {
    isCategoryMenuOpen ? closeCategoryMenu() : openCategoryMenu();
  }

  function handleSave() {
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

  const filteredCategoriesIncome = categories.filter((cat) => cat.type === 'income');
  const filteredCategoriesExpense = categories.filter((cat) => cat.type === 'expense');

  const categorySections: Array<{
    type: TransactionType;
    title: string;
    categories: CategoryItem[];
  }> = [
    { 
      type: 'income', 
      title: 'Income categories', 
      categories: filteredCategoriesIncome
    },
    { 
      type: 'expense', 
      title: 'Expense categories', 
      categories: filteredCategoriesExpense
    },
  ];

  return (
    <Modal
      visible
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
          <View style={styles.dropdownWrap}>
            <Pressable
              style={styles.dropdownTrigger}
              onPress={toggleCategoryMenu}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !selectedCategory && styles.dropdownPlaceholderText,
                ]}
              >
                {selectedCategory?.category || 'Select category'}
              </Text>
              <Ionicons
                name={isCategoryMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.textSecondary}
              />
            </Pressable>

            {isCategoryMenuMounted ? (
              <Animated.View
                pointerEvents={isCategoryMenuOpen ? 'auto' : 'none'}
                style={[
                  styles.dropdownMenu,
                  {
                    opacity: categoryMenuAnimation,
                    maxHeight: categoryMenuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, MENU_MAX_HEIGHT],
                    }),
                    transform: [
                      {
                        translateY: categoryMenuAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <ScrollView
                  style={styles.dropdownScroll}
                  contentContainerStyle={styles.dropdownScrollContent}
                  showsVerticalScrollIndicator
                >
                  {categorySections.map((section) => (
                    <View key={section.type} style={styles.dropdownSection}>
                      <Text style={styles.dropdownSectionTitle}>{section.title}</Text>
                      {section.categories.length === 0 ? (
                        <Text style={styles.dropdownSectionEmptyText}>No categories yet</Text>
                      ) : (
                        section.categories.map((category) => {
                          const isSelected =
                            selectedCategory?.id === category.id &&
                            selectedType === section.type;
                          return (
                            <Pressable
                              key={category.id}
                              style={styles.dropdownOption}
                              onPress={() => {
                                setSelectedCategory(category);
                                closeCategoryMenu();
                              }}
                            >
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  isSelected && styles.dropdownOptionTextSelected,
                                ]}
                              >
                                {category.category}
                              </Text>
                              {isSelected ? (
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color={colors.accentPrimary}
                                />
                              ) : null}
                            </Pressable>
                          );
                        })
                      )}
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>
            ) : null}
          </View>

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
    backgroundColor: 'rgba(17, 17, 28, 0.35)',
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
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownWrap: {
    position: 'relative',
    zIndex: 2,
  },
  dropdownTrigger: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
  },
  dropdownTriggerText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownPlaceholderText: {
    color: colors.textSecondary,
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: MENU_MAX_HEIGHT,
  },
  dropdownScrollContent: {
    paddingBottom: 6,
    gap: 2,
  },
  dropdownSection: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  dropdownSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  dropdownSectionEmptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  dropdownOption: {
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  dropdownOptionTextSelected: {
    color: colors.accentPrimary,
    fontWeight: '600',
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
