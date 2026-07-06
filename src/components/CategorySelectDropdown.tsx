import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../translations';
import { CategoryItem, TransactionType } from '../types';

type CategorySelectDropdownProps = {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  onCategoryChange: (category: CategoryItem) => void;
  visible?: boolean;
};

type CategorySection = {
  type: TransactionType;
  title: string;
  categories: CategoryItem[];
};

const MENU_MAX_HEIGHT = 180;
const MENU_OPEN_DURATION = 240;
const MENU_CLOSE_DURATION = 190;

export function CategorySelectDropdown({
  categories,
  selectedCategoryId,
  onCategoryChange,
  visible = true,
}: CategorySelectDropdownProps) {
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isCategoryMenuMounted, setCategoryMenuMounted] = useState(false);
  const categoryMenuAnimation = useRef(new Animated.Value(0)).current;

  const categoryById = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories]
  );
  const selectedCategory = selectedCategoryId
    ? categoryById.get(selectedCategoryId) ?? null
    : null;

  const categorySections: CategorySection[] = useMemo(
    () => [
      {
        type: TransactionType.Income,
        title: translations.categorySelect.incomeCategories,
        categories: categories.filter((item) => item.type === TransactionType.Income),
      },
      {
        type: TransactionType.Expense,
        title: translations.categorySelect.expenseCategories,
        categories: categories.filter((item) => item.type === TransactionType.Expense),
      },
    ],
    [categories]
  );

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

  useEffect(() => {
    if (!visible) {
      resetCategoryMenu();
    }
  }, [visible]);

  return (
    <View style={styles.dropdownWrap}>
      <Pressable style={styles.dropdownTrigger} onPress={toggleCategoryMenu}>
        <View style={styles.dropdownTriggerLeft}>
          <Ionicons
            name={selectedCategory?.icon ?? 'apps-outline'}
            size={16}
            color={selectedCategory ? colors.textPrimary : colors.textSecondary}
          />
          <Text
            style={[
              styles.dropdownTriggerText,
              !selectedCategory && styles.dropdownPlaceholderText,
            ]}
          >
            {selectedCategory?.category ?? translations.categorySelect.placeholder}
          </Text>
        </View>
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
                  <Text style={styles.dropdownSectionEmptyText}>
                    {translations.categorySelect.empty}
                  </Text>
                ) : (
                  section.categories.map((category) => {
                    const isSelected = selectedCategory?.id === category.id;
                    return (
                      <Pressable
                        key={category.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          onCategoryChange(category);
                          closeCategoryMenu();
                        }}
                      >
                        <View style={styles.dropdownOptionLeft}>
                          <Ionicons
                            name={category.icon}
                            size={16}
                            color={isSelected ? colors.accentPrimary : colors.textPrimary}
                          />
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              isSelected && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {category.category}
                          </Text>
                        </View>
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
  );
}

const styles = StyleSheet.create({
  dropdownWrap: {
    position: 'relative',
    zIndex: 2,
  },
  dropdownTrigger: {
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: 10,
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
  dropdownOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  dropdownOptionTextSelected: {
    color: colors.accentPrimary,
    fontWeight: '600',
  },
});
