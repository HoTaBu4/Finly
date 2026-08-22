import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type AlertModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  buttonText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onClose: () => void;
};

export function AlertModal({
  visible,
  title,
  message,
  buttonText = 'OK',
  icon,
  iconColor = colors.accentPrimary,
  onClose,
}: AlertModalProps) {
  const lastTitle = useRef(title);
  const lastMessage = useRef(message);

  useEffect(() => {
    if (visible) {
      lastTitle.current = title;
      lastMessage.current = message;
    }
  }, [visible, title, message]);

  const displayTitle = visible ? title : lastTitle.current;
  const displayMessage = visible ? message : lastMessage.current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.card}
          onPress={(event) => event.stopPropagation()}
        >
          {icon && (
            <View style={[styles.iconWrap, { backgroundColor: iconColor + '18' }]}>
              <Ionicons name={icon} size={28} color={iconColor} />
            </View>
          )}

          <Text style={styles.title}>{displayTitle}</Text>
          {displayMessage && <Text style={styles.message}>{displayMessage}</Text>}

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    width: '100%',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cardBackground,
  },
});
