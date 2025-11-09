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
  userId: string;
  title: string;
  message: string;
  type: string; // 'booking', 'payment', 'review', 'system'
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onNotificationRead?: (notificationId: string) => void;
  onDeleteNotification?: (notificationId: string) => void;
}

const { height } = Dimensions.get('window');

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationRead,
  onDeleteNotification,
}) => {
  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleNotificationPress = (notificationId: string) => {
    onNotificationRead?.(notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    onDeleteNotification?.(notificationId);
  };

  const getTimeAgo = (createdAt: string) => {
    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 30) return `${diffDays} ngày trước`;
      return created.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Vừa xong';
    }
  };
  const getIconName = (type: string) => {
    switch (type) {
      case 'booking':
        return 'calendar';
      case 'payment':
        return 'card';
      case 'review':
        return 'star';
      case 'system':
        return 'notifications';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    return '#0077B6';
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

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name="notifications-outline"
                    size={80}
                    color={COLORS.gray}
                  />
                </View>
                <Text style={styles.emptyTitle}>Không có thông báo nào</Text>
                <Text style={styles.emptyText}>
                  Bạn sẽ nhận được thông báo mới ở đây
                </Text>
              </View>
            ) : (
              <View style={styles.notificationsList}>
                {notifications.map((notification, index) => {
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationCard,
                        !notification.read && styles.unreadCard,
                        index === notifications.length - 1 && styles.lastCard,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleNotificationPress(notification.id)}
                    >
                      <View style={styles.cardContent}>
                        <View style={[
                          styles.notificationIconContainer,
                          !notification.read && styles.unreadIconContainer
                        ]}>
                          <Ionicons
                            name={getIconName(notification.type)}
                            size={24}
                            color={getIconColor(notification.type)}
                          />
                          {!notification.read && (
                            <View style={styles.unreadIndicator} />
                          )}
                        </View>
                        <View style={styles.notificationContent}>
                          <View style={styles.notificationHeader}>
                            <Text 
                              style={[
                                styles.notificationTitle,
                                !notification.read && styles.unreadTitle
                              ]}
                              numberOfLines={2}
                            >
                              {notification.title}
                            </Text>
                            <Text style={styles.notificationTime}>
                              {getTimeAgo(notification.createdAt)}
                            </Text>
                          </View>
                          <Text 
                            style={styles.notificationMessage}
                            numberOfLines={2}
                          >
                            {notification.message}
                          </Text>
                        </View>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {notifications.length > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={handleMarkAllAsRead}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-done" size={16} color={COLORS.text} style={{ marginRight: SIZES.xs }} />
                <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingTop: SIZES.md,
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
    fontSize: SIZES.h5,
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
  },
  contentContainer: {
    padding: SIZES.md,
    paddingBottom: SIZES.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl * 2,
    minHeight: height * 0.5,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: SIZES.xl,
    lineHeight: 22,
  },
  notificationsList: {
    paddingBottom: SIZES.xs,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  unreadCard: {
    backgroundColor: '#F0F8FF',
    borderColor: '#0077B6',
    borderWidth: 1.5,
    ...SHADOWS.medium,
  },
  lastCard: {
    marginBottom: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
    position: 'relative',
  },
  unreadIconContainer: {
    backgroundColor: '#B3E5FC',
  },
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationContent: {
    flex: 1,
    paddingRight: SIZES.sm,
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
    lineHeight: 20,
  },
  unreadTitle: {
    ...FONTS.bold,
    color: '#0077B6',
  },
  notificationTime: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.text,
    marginTop: 2,
  },
  notificationMessage: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: SIZES.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0077B6',
    marginTop: SIZES.sm,
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    paddingBottom: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SIZES.radius,
  },
  markAllText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
});

