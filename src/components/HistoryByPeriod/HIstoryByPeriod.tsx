import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { HistoryTransaction, TransactionType } from '../../types';
import { formatDate, formatMoney } from '../../utils/formatters';

type TransactionRowProps = {
  rowKey: string;
  item: HistoryTransaction;
  categoryLabel: string;
  onEdit?: (transaction: HistoryTransaction) => void;
  onDelete?: (transaction: HistoryTransaction) => void;
  onOpen?: (rowKey: string, closeRow: () => void) => void;
  onClose?: (rowKey: string) => void;
};

const EDIT_ACTION_WIDTH = 56;
const DELETE_ACTION_WIDTH = 62;
const ACTION_GAP = 6;
const ACTIONS_LEFT_PADDING = 8;
const SWIPE_OPEN_THRESHOLD = 0.45;
const SWIPE_GESTURE_THRESHOLD = 6;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getActionsWidth(hasEdit: boolean, hasDelete: boolean) {
  return (
    (hasEdit ? EDIT_ACTION_WIDTH : 0) +
    (hasDelete ? DELETE_ACTION_WIDTH : 0) +
    (hasEdit && hasDelete ? ACTION_GAP : 0) +
    ACTIONS_LEFT_PADDING
  );
}

export function TransactionRow({
  rowKey,
  item,
  categoryLabel,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: TransactionRowProps) {
  const hasActions = Boolean(onEdit || onDelete);
  const actionsWidth = getActionsWidth(Boolean(onEdit), Boolean(onDelete));
  const [containerWidth, setContainerWidth] = useState(0);
  const swipeDistance = useRef(new Animated.Value(0)).current;
  const swipeValueRef = useRef(0);
  const gestureStartRef = useRef(0);
  const isOpenedRef = useRef(false);

  useEffect(() => {
    const listenerId = swipeDistance.addListener(({ value }) => {
      swipeValueRef.current = value;
    });

    return () => {
      swipeDistance.removeListener(listenerId);
    };
  }, [swipeDistance]);

  function animateSwipe(toValue: number, onEnd?: () => void) {
    Animated.timing(swipeDistance, {
      toValue,
      duration: 180,
      useNativeDriver: false,
    }).start(() => onEnd?.());
  }

  function setSwipeOpen(nextOpened: boolean) {
    const nextValue = nextOpened ? actionsWidth : 0;
    animateSwipe(nextValue, () => {
      if (isOpenedRef.current === nextOpened) {
        return;
      }

      isOpenedRef.current = nextOpened;
      if (nextOpened) {
        onOpen?.(rowKey, closeSwipe);
        return;
      }
      onClose?.(rowKey);
    });
  }

  function closeSwipe() {
    setSwipeOpen(false);
  }

  function openSwipe() {
    setSwipeOpen(true);
  }

  function settleSwipe() {
    const shouldOpen = swipeValueRef.current > actionsWidth * SWIPE_OPEN_THRESHOLD;
    shouldOpen ? openSwipe() : closeSwipe();
  }

  const rowWidth =
    containerWidth > 0
      ? swipeDistance.interpolate({
          inputRange: [0, actionsWidth],
          outputRange: [containerWidth, Math.max(containerWidth - actionsWidth, 0)],
          extrapolate: 'clamp',
        })
      : '100%';

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > SWIPE_GESTURE_THRESHOLD &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderGrant: () => {
          gestureStartRef.current = swipeValueRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          if (!hasActions) {
            return;
          }

          const nextValue = clampNumber(
            gestureStartRef.current - gestureState.dx,
            0,
            actionsWidth
          );
          swipeDistance.setValue(nextValue);
        },
        onPanResponderRelease: () => {
          if (!hasActions) {
            return;
          }

          settleSwipe();
        },
        onPanResponderTerminate: () => {
          if (!hasActions) {
            return;
          }

          settleSwipe();
        },
      }),
    [actionsWidth, hasActions]
  );

  function handleEditPress() {
    closeSwipe();
    onEdit?.(item);
  }

  function handleDeletePress() {
    closeSwipe();
    onDelete?.(item);
  }

  const rowContent = (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.categoryText}>{categoryLabel}</Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>
      <Text
        style={[
          styles.amountText,
          item.type === TransactionType.Income ? styles.incomeText : styles.expenseText,
        ]}
      >
        {item.type === TransactionType.Income ? '+' : '-'}
        {formatMoney(Math.abs(item.amount))}
      </Text>
    </View>
  );

  if (!hasActions) {
    return rowContent;
  }

  return (
    <View
      style={styles.rowSwipeContainer}
      onLayout={({ nativeEvent }) => {
        const nextWidth = Math.round(nativeEvent.layout.width);
        setContainerWidth((previous) => (previous === nextWidth ? previous : nextWidth));
      }}
    >
      <View style={[styles.rowActions, { width: actionsWidth }]}>
        {onEdit ? (
          <Pressable style={styles.editAction} onPress={handleEditPress}>
            <Text style={[styles.actionText, styles.editActionText]}>Edit</Text>
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable style={styles.deleteAction} onPress={handleDeletePress}>
            <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
      <Animated.View
        style={[styles.rowAnimatedWrap, { width: rowWidth }]}
        {...panResponder.panHandlers}
      >
        {rowContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 10,
    backgroundColor: colors.appBackground,
  },
  rowSwipeContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.appBackground,
    width: '100%',
  },
  rowAnimatedWrap: {
    alignSelf: 'flex-start',
    width: '100%',
    backgroundColor: colors.appBackground,
  },
  rowActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: ACTION_GAP,
    paddingLeft: ACTIONS_LEFT_PADDING,
    backgroundColor: colors.appBackground,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  editAction: {
    width: EDIT_ACTION_WIDTH,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimarySoft,
  },
  deleteAction: {
    width: DELETE_ACTION_WIDTH,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  editActionText: {
    color: colors.accentPrimary,
  },
  deleteActionText: {
    color: colors.orange,
  },
  rowLeft: {
    gap: 2,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  expenseText: {
    color: colors.orange,
  },
  incomeText: {
    color: colors.green,
  },
});
