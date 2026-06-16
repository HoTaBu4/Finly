import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryFormInput, CategoryFormModal } from '../modals/CategoryFormModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { PaywallModal } from '../modals/PaywallModal';
import { useFinanceData } from '../state/FinanceDataContext';
import { FREE_LIMITS, usePremium } from '../state/usePremium';
import { usePaywall } from '../hooks/usePaywall';
import { colors } from '../theme/colors';
import { CategoryItem, TransactionType } from '../types';

const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
};

export function ManageCategoriesScreen() {
  const router = useRouter();
  const { categories, addCategory, updateCategory, deleteCategory: removeCategory, historyItems } = useFinanceData();
  const { isPremium } = usePremium();
  const { isOfflinePaywallVisible, showPaywall, handleOfflinePurchaseAttempt, closeOfflinePaywall } = usePaywall();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((first, second) => first.category.localeCompare(second.category)),
    [categories]
  );

  function openAddForm() {
    if (!isPremium) {
      const expenseCount = categories.filter((c) => c.type === TransactionType.Expense).length;
      const incomeCount = categories.filter((c) => c.type === TransactionType.Income).length;
      const atLimit =
        expenseCount >= FREE_LIMITS.maxExpenseCategories &&
        incomeCount >= FREE_LIMITS.maxIncomeCategories;

      if (atLimit) {
        showPaywall();
        return;
      }
    }
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditForm(category: CategoryItem) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingCategory(null);
  }

  function saveCategory(input: CategoryFormInput) {
    const normalizedName = input.category.trim().toLowerCase();
    const hasDuplicate = categories.some((item) =>
      item.id === editingCategory?.id
        ? false
        : item.category.trim().toLowerCase() === normalizedName && item.type === input.type
    );

    if (hasDuplicate) {
      Alert.alert('Category exists', 'Category with this name and type already exists.');
      return;
    }

    const isEditingUsedCategory = editingCategory
      ? historyItems.some((item) => item.categoryId === editingCategory.id)
      : false;
    if (editingCategory && isEditingUsedCategory && editingCategory.type !== input.type) {
      Alert.alert(
        'Type cannot be changed',
        'This category is already used in transactions. Create a new category with another type.'
      );
      return;
    }

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        category: input.category,
        type: input.type,
        icon: input.icon,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Перевірка ліміту для конкретного типу
      if (!isPremium) {
        const count = categories.filter((c) => c.type === input.type).length;
        const limit = input.type === TransactionType.Expense
          ? FREE_LIMITS.maxExpenseCategories
          : FREE_LIMITS.maxIncomeCategories;

        if (count >= limit) {
          showPaywall();
          closeForm();
          return;
        }
      }

      addCategory({
        id: `${Date.now()}`,
        category: input.category,
        type: input.type,
        limit: null,
        icon: input.icon,
        updatedAt: new Date().toISOString(),
      });
    }

    closeForm();
  }

  function deleteCategory(category: CategoryItem) {
    setCategoryToDelete(category);
  }

  function confirmDeleteCategory() {
    if (categoryToDelete) {
      removeCategory(categoryToDelete.id);
    }
    setCategoryToDelete(null);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Manage categories</Text>
        <Pressable style={styles.addButton} onPress={openAddForm}>
          <Ionicons name="add" size={16} color={colors.cardBackground} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {sortedCategories.map((category) => (
          <View key={category.id} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Ionicons name={category.icon} size={22} color={colors.textPrimary} />
              </View>
              <View>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryMeta}>
                  {TRANSACTION_TYPE_LABEL[category.type]}
                </Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <Pressable style={styles.rowActionButton} onPress={() => openEditForm(category)}>
                <Ionicons name="create-outline" size={16} color={colors.textPrimary} />
              </Pressable>
              <Pressable style={styles.rowActionButton} onPress={() => deleteCategory(category)}>
                <Ionicons name="trash-outline" size={16} color={colors.orange} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <CategoryFormModal
        visible={isFormOpen}
        initialCategory={editingCategory}
        onClose={closeForm}
        onSave={saveCategory}
      />
      <PaywallModal
        visible={isOfflinePaywallVisible}
        onClose={closeOfflinePaywall}
        onPurchasePress={handleOfflinePurchaseAttempt}
      />
      <ConfirmModal
        visible={Boolean(categoryToDelete)}
        title="Delete category"
        message={
          categoryToDelete
            ? (() => {
                const count = historyItems.filter((t) => t.categoryId === categoryToDelete.id).length;
                return count > 0
                  ? `Delete "${categoryToDelete.category}" and ${count} transaction${count > 1 ? 's' : ''}?`
                  : `Delete "${categoryToDelete.category}"?`;
              })()
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        onConfirm={confirmDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerButton: {
    minWidth: 74,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addButton: {
    minWidth: 74,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: colors.cardBackground,
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    paddingBottom: 28,
  },
  row: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    minHeight: 64,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  rowActionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
});
