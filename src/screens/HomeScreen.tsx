import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryBarChart } from '../components/CategoryBarChart/CategoryBarChart';
import { HistoryByPeriod } from '../components/HistoryByPeriod';
import { DeleteTransactionModal } from '../components/modals/DeleteTransactionModal';
import { EditTransactionModal } from '../components/modals/EditTransactionModal';
import { LimitModal } from '../components/modals/LimitModal';
import { StickyAddBar } from '../components/StickyAddBar';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import {
  CategoryChartIcon,
  CategoryChartItem,
  CategoryItem,
  HistoryTransaction,
} from '../types';

function toIsoDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    category: 'Food',
    type: 'expense',
    limit: 1500,
    icon: CategoryChartIcon.Restaurant,
  },
  {
    id: '2',
    category: 'Transport',
    type: 'expense',
    limit: null,
    icon: CategoryChartIcon.Car,
  },
  {
    id: '3',
    category: 'Shopping',
    type: 'expense',
    limit: 4000,
    icon: CategoryChartIcon.BagHandle,
  },
  {
    id: '4',
    category: 'Health',
    type: 'expense',
    limit: null,
    icon: CategoryChartIcon.Medkit,
  },
  {
    id: '5',
    category: 'Bills',
    type: 'expense',
    limit: 3000,
    icon: CategoryChartIcon.Receipt,
  },
  {
    id: '6',
    category: 'Other',
    type: 'expense',
    limit: null,
    icon: CategoryChartIcon.EllipsisHorizontal,
  },
  {
    id: '7',
    category: 'Salary',
    type: 'income',
    limit: null,
    icon: CategoryChartIcon.Receipt,
  },
];

const HISTORY_ITEMS: HistoryTransaction[] = [
  {
    id: '1',
    amount: 620,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(1),
  },
  {
    id: '2',
    amount: 900,
    type: 'expense',
    categoryId: '2',
    date: toIsoDaysAgo(1),
  },
  {
    id: '33',
    amount: 2500,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(3),
  },
  {
    id: '353',
    amount: 2500,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(3),
  },
  {
    id: '3',
    amount: 2500,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(10),
  },
  {
    id: '4',
    amount: 1200,
    type: 'expense',
    categoryId: '3',
    date: toIsoDaysAgo(12),
  },
  {
    id: '5',
    amount: 4000,
    type: 'income',
    categoryId: '7',
    date: toIsoDaysAgo(20),
  },
  {
    id: '6',
    amount: 750,
    type: 'expense',
    categoryId: '6',
    date: toIsoDaysAgo(24),
  },
  {
    id: '7',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(30),
  },
  {
    id: '8',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(60),
  },
  {
    id: '9',
    amount: 1100,
    type: 'expense',
    categoryId: '5',
    date: toIsoDaysAgo(90),
  },
];

export function HomeScreen() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [historyItems, setHistoryItems] = useState<HistoryTransaction[]>(HISTORY_ITEMS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<HistoryTransaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<HistoryTransaction | null>(null);

  const chartItems = useMemo<CategoryChartItem[]>(
    () =>
      categories.map((category) => {
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
    [categories, historyItems]
  );

  const selectedCategory =
    categories.find((item) => item.id === selectedCategoryId) ?? null;

  function handleSelectionChange(category: CategoryChartItem | null) {
    setSelectedCategoryId(category?.id ?? null);
  }

  function setLimitModalVisibility(isOpen: boolean) {
    setLimitModalOpen(isOpen);
  }

  function saveLimit(limit: number | null) {
    if (!selectedCategory) {
      return;
    }

    setCategories((previous) =>
      previous.map((item) =>
        item.id === selectedCategory.id
          ? { ...item, limit }
          : item
      )
    );
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

  function saveEditedTransaction(updatedTransaction: HistoryTransaction) {
    setHistoryItems((previous) =>
      previous.map((item) =>
        item.id === updatedTransaction.id
          ? updatedTransaction
          : item
      )
    );
    closeEditTransactionModal();
  }

  function confirmDeleteTransaction(transaction: HistoryTransaction) {
    setHistoryItems((previous) =>
      previous.filter((item) => item.id !== transaction.id)
    );
    closeDeleteTransactionModal();
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopBalanceSection />
        <View style={styles.chartSection}>
          <CategoryBarChart
            items={chartItems}
            onSelectionChange={handleSelectionChange}
          />
        </View>
        <HistoryByPeriod
          transactions={historyItems}
          categories={categories}
          title="History"
          transactionTypeFilter="expense"
          categoryIdFilter={selectedCategory?.id ?? null}
          selectedCategory={selectedCategory}
          onActionPress={() => setLimitModalVisibility(true)}
          onTransactionEdit={handleEditTransaction}
          onTransactionDelete={handleDeleteTransaction}
        />
      </ScrollView>
      <LimitModal
        visible={isLimitModalOpen}
        categoryName={selectedCategory?.category}
        currentLimit={selectedCategory?.limit ?? null}
        onClose={() => setLimitModalVisibility(false)}
        onSave={saveLimit}
      />
      {transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          categories={categories}
          onClose={closeEditTransactionModal}
          onSave={saveEditedTransaction}
        />
      )}
      {transactionToDelete && (
        <DeleteTransactionModal
          transaction={transactionToDelete}
          categories={categories}
          onClose={closeDeleteTransactionModal}
          onConfirm={confirmDeleteTransaction}
        />
      )}
      <StickyAddBar
        onAddPress={() => Alert.alert('Add item', 'Open add item form')}
        onMicPress={() => Alert.alert('Voice input', 'Start voice capture')}
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
