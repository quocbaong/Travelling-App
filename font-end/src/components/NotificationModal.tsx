import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'promotion';
  isRead: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onNotificationRead?: (notificationId: string) => void;
}

const { height } = Dimensions.get('window');

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationRead,
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    const updatedNotifications = localNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setLocalNotifications(updatedNotifications);
    onMarkAllAsRead?.();
  };

  const handleNotificationPress = (notificationId: string) => {
    const updatedNotifications = localNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    );
    setLocalNotifications(updatedNotifications);
    onNotificationRead?.(notificationId);
  };
  const getIconName = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'promotion':
        return 'gift';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'warning':
        return COLORS.warning;
      case 'promotion':
        return COLORS.primary;
      default:
        return COLORS.info;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Ionicons name="notifications" size={24} color={COLORS.white} />
                <Text style={styles.headerTitle}>Thông báo</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {localNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="notifications-outline"
                  size={64}
                  color={COLORS.gray}
                />
                <Text style={styles.emptyTitle}>Không có thông báo nào</Text>
                <Text style={styles.emptyText}>
                  Bạn sẽ nhận được thông báo mới ở đây
                </Text>
              </View>
            ) : (
              localNotifications.map((notification, index) => {
                return (
                  <View
                    key={notification.id}
                  >
                    <TouchableOpacity
                      style={[
                        styles.notificationItem,
                        !notification.isRead && styles.unreadItem,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleNotificationPress(notification.id)}
                    >
                      <View style={[
                        styles.notificationIcon,
                        !notification.isRead && styles.unreadIcon
                      ]}>
                        <Ionicons
                          name={getIconName(notification.type)}
                          size={20}
                          color={getIconColor(notification.type)}
                        />
                        {!notification.isRead && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                          </View>
                        )}
                      </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text style={[
                          styles.notificationTitle,
                          !notification.isRead && styles.unreadTitle
                        ]}>
                          {notification.title}
                        </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                  </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              activeOpacity={0.7}
            >
              <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.8,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    ...SHADOWS.heavy,
  },
  header: {
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.white,
    marginLeft: SIZES.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    position: 'relative',
  },
  unreadItem: {
    // Bỏ background và border để chỉ làm nổi bật tiêu đề
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
    position: 'relative',
  },
  unreadIcon: {
    // Bỏ styling đặc biệt cho icon
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  newBadgeText: {
    ...FONTS.bold,
    fontSize: 8,
    color: COLORS.white,
    textAlign: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.xs,
  },
  notificationTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.sm,
  },
  unreadTitle: {
    ...FONTS.bold,
    color: COLORS.primary,
  },
  notificationTime: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textLight,
  },
  notificationMessage: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: SIZES.md + 8,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  markAllButton: {
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  markAllText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.primary,
  },
});

