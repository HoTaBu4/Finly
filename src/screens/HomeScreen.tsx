import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { HistoryByPeriod } from '../components/HistoryByPeriod/HistoryByPeriodRow';
import { DeleteTransactionModal } from '../modals/DeleteTransactionModal';
import { EditTransactionModal } from '../modals/EditTransactionModal';
import { LimitModal } from '../modals/LimitModal';
import { PaywallModal } from '../modals/PaywallModal';
import { AddTransactionInput, AddTransactionModal } from '../modals/addTransactionModal';
import { SettingsMenuSheet } from '../components/SettingsMenuSheet';
import { StickyAddBar } from '../components/StickyAddBar';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { useFinanceData } from '../state/FinanceDataContext';
import { usePremium } from '../state/usePremium';
import { usePaywall } from '../hooks/usePaywall';
import { colors } from '../theme/colors';
import { toTransactionType } from '../utils/transactionFilters';
import {
  CategoryChartItem,
  HistoryTransactionFilter,
  HistoryTransaction,
  TransactionType,
  TrackingMode,
} from '../types';

export function HomeScreen() {
  const router = useRouter();
  const { categories, updateCategory, historyItems, addTransaction, updateTransaction, deleteTransaction } = useFinanceData();
  const { isPremium } = usePremium();
  const { isOfflinePaywallVisible, showPaywall, handleOfflinePurchaseAttempt, closeOfflinePaywall } = usePaywall();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [trackingMode, setTrackingMode] = useState<TrackingMode>(TrackingMode.ExpensesOnly);
  const [transactionFilter, setTransactionFilter] =
    useState<HistoryTransactionFilter>(HistoryTransactionFilter.Expense);
  const [transactionToEdit, setTransactionToEdit] = useState<HistoryTransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<HistoryTransaction | null>(null);

  const effectiveFilter =
    trackingMode === TrackingMode.ExpensesOnly
      ? HistoryTransactionFilter.Expense
      : transactionFilter;
  const effectiveTransactionType = toTransactionType(effectiveFilter);
  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (item) => effectiveTransactionType === null || item.type === effectiveTransactionType
      ),
    [categories, effectiveTransactionType]
  );

  const chartItems = useMemo<CategoryChartItem[]>(
    () =>
      visibleCategories.map((category) => {
        const amount = historyItems.reduce((sum, transaction) => {
          const isSameCategory = transaction.categoryId === category.id;
          const isSameType = transaction.type === category.type;
          return isSameCategory && isSameType
            ? sum + Math.abs(transaction.amount)
            : sum;
        }, 0);

        return {
          ...category,
          amount,
        };
      }),
    [historyItems, visibleCategories]
  );

  const selectedCategory =
    visibleCategories.find((item) => item.id === selectedCategoryId) ?? null;

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    const isVisible = visibleCategories.some((item) => item.id === selectedCategoryId);
    if (!isVisible) {
      setSelectedCategoryId(null);
    }
  }, [selectedCategoryId, visibleCategories]);

  function handleSelectionChange(category: CategoryChartItem | null) {
    setSelectedCategoryId(category?.id ?? null);
  }

  function setLimitModalVisibility(isOpen: boolean) {
    if (isOpen && selectedCategory?.type !== TransactionType.Expense) {
      return;
    }
    setLimitModalOpen(isOpen);
  }

  function saveLimit(limit: number | null) {
    if (!selectedCategory || selectedCategory.type !== TransactionType.Expense) {
      setLimitModalVisibility(false);
      return;
    }

    updateCategory({ ...selectedCategory, limit, updatedAt: new Date().toISOString() });
    setLimitModalVisibility(false);
  }

  function handleEditTransaction(transaction: HistoryTransaction) {
    setTransactionToEdit(transaction);
  }

  function handleDeleteTransaction(transaction: HistoryTransaction) {
    setTransactionToDelete(transaction);
  }

  function closeEditTransactionModal() {
    setTransactionToEdit(null);
  }

  function closeDeleteTransactionModal() {
    setTransactionToDelete(null);
  }

  function closeAddTransactionModal() {
    setAddTransactionModalOpen(false);
  }

  function handleTrackingModeChange(mode: TrackingMode) {
    setTrackingMode(mode);
    if (mode === TrackingMode.ExpensesOnly) {
      setTransactionFilter(HistoryTransactionFilter.Expense);
      return;
    }
    setTransactionFilter(HistoryTransactionFilter.All);
  }

  function handleAllPress() {
    if (trackingMode === TrackingMode.ExpensesOnly) {
      return;
    }
    setTrackingMode(TrackingMode.Both);
    setTransactionFilter(HistoryTransactionFilter.All);
  }

  function handleExpensePress() {
    setTransactionFilter(HistoryTransactionFilter.Expense);
  }

  function handleIncomePress() {
    if (trackingMode === TrackingMode.ExpensesOnly) {
      return;
    }
    setTrackingMode(TrackingMode.Both);
    setTransactionFilter(HistoryTransactionFilter.Income);
  }

  function openManageCategories() {
    setSettingsMenuOpen(false);
    router.push('/manage-categories');
  }

  function openAccountSettings() {
    setSettingsMenuOpen(false);
    Alert.alert('Account settings', 'Account settings screen will be added next.');
  }

  function saveAddedTransaction(newTransaction: AddTransactionInput) {
    addTransaction({
      id: `${Date.now()}`,
      amount: Math.abs(newTransaction.amount),
      type: newTransaction.type,
      categoryId: newTransaction.categoryId,
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    closeAddTransactionModal();
  }

  function saveEditedTransaction(updatedTransaction: HistoryTransaction) {
    updateTransaction({ ...updatedTransaction, updatedAt: new Date().toISOString() });
    closeEditTransactionModal();
  }

  function confirmDeleteTransaction(transaction: HistoryTransaction) {
    deleteTransaction(transaction.id);
    closeDeleteTransactionModal();
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopBalanceSection
          onSettingsPress={() => setSettingsMenuOpen(true)}
          onExpensePress={handleExpensePress}
          onIncomePress={handleIncomePress}
          onAllPress={handleAllPress}
          activeFilter={effectiveFilter}
          trackingMode={trackingMode}
        />
        <View style={styles.chartSection}>
          <CategoryBarChart
            items={chartItems}
            selectedItemId={selectedCategory?.id ?? null}
            onSelectionChange={handleSelectionChange}
          />
        </View>
        <HistoryByPeriod
          transactions={historyItems}
          categories={categories}
          title="History"
          transactionTypeFilter={effectiveFilter}
          categoryIdFilter={selectedCategory?.id ?? null}
          selectedCategory={selectedCategory}
          onActionPress={
            selectedCategory?.type === TransactionType.Expense
              ? () => setLimitModalVisibility(true)
              : undefined
          }
          onTransactionEdit={handleEditTransaction}
          onTransactionDelete={handleDeleteTransaction}
        />
      </ScrollView>
      <LimitModal
        visible={isLimitModalOpen && selectedCategory?.type === TransactionType.Expense}
        categoryName={selectedCategory?.category}
        currentLimit={selectedCategory?.limit ?? null}
        onClose={() => setLimitModalVisibility(false)}
        onSave={saveLimit}
      />
      {isAddTransactionModalOpen && (
        <AddTransactionModal
          visible
          categories={
            trackingMode === TrackingMode.ExpensesOnly
              ? categories.filter((item) => item.type === TransactionType.Expense)
              : categories
          }
          onClose={closeAddTransactionModal}
          onSave={saveAddedTransaction}
        />
      )}
      <SettingsMenuSheet
        visible={isSettingsMenuOpen}
        trackingMode={trackingMode}
        onClose={() => setSettingsMenuOpen(false)}
        onTrackingModeChange={handleTrackingModeChange}
        onManageCategoriesPress={openManageCategories}
        onAccountPress={openAccountSettings}
        onPremiumPress={() => {
          setSettingsMenuOpen(false);
          showPaywall();
        }}
        isPremium={isPremium}
      />
      {transactionToEdit && (
        <EditTransactionModal
          visible
          transaction={transactionToEdit}
          categories={categories}
          onClose={closeEditTransactionModal}
          onSave={saveEditedTransaction}
        />
      )}
      <DeleteTransactionModal
        visible={Boolean(transactionToDelete)}
        transaction={transactionToDelete}
        categories={categories}
        onClose={closeDeleteTransactionModal}
        onConfirm={confirmDeleteTransaction}
      />
      <PaywallModal
        visible={isOfflinePaywallVisible}
        onClose={closeOfflinePaywall}
        onPurchasePress={handleOfflinePurchaseAttempt}
      />
      <StickyAddBar
        onAddPress={() => setAddTransactionModalOpen(true)}
        onMicPress={() => {
          if (isPremium) {
            Alert.alert('Voice input', 'Start voice capture');
          } else {
            showPaywall();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    paddingHorizontal: 8,
    paddingBottom: 120,
  },
  chartSection: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
});
