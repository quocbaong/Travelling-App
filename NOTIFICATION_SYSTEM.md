# 🔔 Hệ Thống Thông Báo Real-time

## 📋 Tổng Quan

Hệ thống thông báo real-time giúp người dùng nhận và quản lý thông báo về các hoạt động trong ứng dụng (đặt tour, thanh toán, đánh giá, v.v.).

---

## 🏗️ Kiến Trúc

### Frontend (React Native)

#### 1. **API Service** (`notificationService.ts`)
Quản lý tất cả API calls liên quan đến notifications:
- `getUserNotifications(userId)`: Lấy danh sách notifications
- `markAsRead(notificationId)`: Đánh dấu đã đọc
- `markAllAsRead(userId)`: Đánh dấu tất cả đã đọc
- `deleteNotification(notificationId)`: Xóa notification
- `getUnreadCount(userId)`: Lấy số lượng chưa đọc

#### 2. **Auth Context** (`AuthContext.tsx`)
Quản lý notification state globally:
```typescript
- userNotifications: Notification[] // Danh sách notifications
- unreadNotificationCount: number   // Số lượng chưa đọc
- loadNotifications(): Promise<void>
- markNotificationAsRead(id): Promise<void>
- markAllNotificationsAsRead(): Promise<void>
- deleteNotification(id): Promise<void>
```

**Tự động load notifications khi:**
- User đăng nhập (trong `loadUserData`)
- User tạo booking mới (trong `addBooking`)
- User mở notification modal

#### 3. **UI Components**

**HomeScreen:**
- Notification bell icon với badge hiển thị số lượng chưa đọc
- Badge chỉ hiện khi có notifications chưa đọc (> 0)
- Format badge: số đếm hoặc "9+" nếu > 9

**NotificationModal:**
- Hiển thị danh sách notifications
- Highlight notifications chưa đọc
- Icon theo loại notification (booking, payment, review, system)
- Thời gian tương đối ("2 giờ trước", "1 ngày trước")
- Actions: Mark as read, Mark all as read

---

### Backend (Spring Boot + MongoDB)

#### 1. **Model** (`Notification.java`)
```java
{
  id: String,
  userId: String,
  title: String,
  message: String,
  type: String,        // "booking", "payment", "review", "system"
  read: boolean,
  createdAt: LocalDateTime,
  relatedId: String    // ID của booking/destination/review
}
```

#### 2. **Repository** (`NotificationRepository.java`)
```java
- findByUserIdOrderByCreatedAtDesc(userId)
- countByUserIdAndRead(userId, read)
```

#### 3. **Service** (`NotificationService.java`)
```java
- createNotification(): Tạo notification mới
- getUserNotifications(): Lấy danh sách
- markAsRead(): Đánh dấu đã đọc
- markAllAsRead(): Đánh dấu tất cả
- deleteNotification(): Xóa notification
- getUnreadCount(): Số lượng chưa đọc
```

#### 4. **Controller** (`NotificationController.java`)
REST API endpoints:
```
GET    /api/notifications/{userId}              - Lấy notifications
PUT    /api/notifications/{notificationId}/read - Mark as read
PUT    /api/notifications/{userId}/read-all     - Mark all as read
DELETE /api/notifications/{notificationId}      - Xóa notification
GET    /api/notifications/{userId}/unread-count - Số chưa đọc
```

#### 5. **Integration với Booking**
`BookingService.java` tự động tạo notification khi:
- User đặt tour thành công
- Format message theo status (confirmed/pending)

---

## 🔄 Luồng Hoạt Động

### 1. User đặt tour thành công

```
1. Frontend: addBooking() -> bookingService.createBooking()
2. Backend: BookingService.createBooking()
   - Lưu booking
   - Tạo notification: "Đặt chỗ thành công! Chuyến đi đến {destination} của bạn {status}."
3. Frontend: addBooking() -> loadNotifications()
4. AuthContext: userNotifications state updated
5. HomeScreen: unreadNotificationCount badge updated
```

### 2. User mở notification modal

```
1. User click bell icon
2. handleNotificationPress() -> loadNotifications()
3. NotificationService.getUserNotifications(userId)
4. Display notifications với thời gian real-time
```

### 3. User đọc notification

```
1. User click notification item
2. handleNotificationRead(id) -> markNotificationAsRead(id)
3. Backend: NotificationService.markAsRead(id)
4. Frontend: Update state -> notification.read = true
5. unreadNotificationCount giảm đi 1
```

### 4. Persistence sau logout/login

```
1. User logout -> notifications cleared from state
2. User login -> loadUserData() -> loadNotifications()
3. All notifications loaded from database
4. unreadNotificationCount recalculated
```

---

## 🎨 UI/UX Features

### Notification Badge
- **Vị trí**: Top-right của bell icon
- **Hiển thị**: Chỉ khi có notifications chưa đọc
- **Format**: 
  - 1-9: Hiển thị số chính xác
  - >9: Hiển thị "9+"
- **Style**: Badge đỏ với text trắng

### Notification Items
- **Unread**: Background sáng hơn, title bold, có badge "NEW"
- **Read**: Background normal, title regular
- **Time**: Relative time ("2 giờ trước", "1 ngày trước")
- **Icons**: Theo type (calendar, card, star, notification)
- **Colors**: Theo type (success, primary, warning, info)

### Actions
- **Tap notification**: Mark as read
- **Mark all as read**: Đánh dấu tất cả
- **Swipe to delete**: (có thể thêm trong tương lai)

---

## 📊 Notification Types

| Type     | Icon     | Color   | Usage                          |
|----------|----------|---------|--------------------------------|
| booking  | calendar | success | Khi user đặt tour              |
| payment  | card     | primary | Khi thanh toán thành công      |
| review   | star     | warning | Khi có đánh giá mới            |
| system   | bell     | info    | Thông báo hệ thống             |

---

## 🚀 Tính Năng Nổi Bật

1. **Real-time Data**: Không sử dụng mock data, toàn bộ từ database
2. **Persistence**: Notifications lưu trữ vĩnh viễn trong MongoDB
3. **Auto-refresh**: Tự động load khi login, booking, hoặc mở modal
4. **Unread Count**: Badge real-time theo số notifications chưa đọc
5. **Relative Time**: Hiển thị thời gian tương đối dễ đọc
6. **Type-based Styling**: Icon và màu sắc theo loại notification
7. **Mark Read on Click**: Tự động đánh dấu đã đọc khi user xem
8. **MongoDB Auditing**: Tự động set `createdAt` timestamp

---

## 🔧 Configuration

### Frontend
```typescript
// API_CONFIG in config.ts
ENDPOINTS: {
  NOTIFICATIONS: '/notifications',
}
```

### Backend
```java
// MongoDB Auditing enabled in MongoConfig.java
@Configuration
@EnableMongoAuditing
```

---

## 📝 Future Enhancements

1. **Push Notifications**: Thêm Firebase Cloud Messaging
2. **In-app Sound**: Âm thanh khi có notification mới
3. **Notification Categories**: Filter theo type
4. **Deep Linking**: Navigate to related screen khi click
5. **Batch Operations**: Xóa nhiều notifications cùng lúc
6. **Notification Settings**: User có thể tùy chỉnh loại notifications nhận
7. **Rich Notifications**: Thêm hình ảnh, actions buttons
8. **Real-time Updates**: WebSocket hoặc Server-Sent Events

---

## ✅ Testing Checklist

- [ ] User đặt tour -> Nhận notification ngay lập tức
- [ ] Badge hiển thị đúng số lượng chưa đọc
- [ ] Logout/Login -> Notifications vẫn còn
- [ ] Click notification -> Mark as read
- [ ] Mark all as read -> All badges cleared
- [ ] Thời gian hiển thị đúng format
- [ ] Icons và colors đúng theo type
- [ ] Empty state hiển thị khi không có notifications
- [ ] Modal mở/đóng mượt mà

---

## 🎯 Kết Luận

Hệ thống notification đã được tích hợp hoàn chỉnh với:
- ✅ Real-time data từ database
- ✅ Persistence sau logout/login
- ✅ Auto-refresh khi có booking mới
- ✅ UI/UX đẹp và trực quan
- ✅ Type-safe với TypeScript
- ✅ Clean code architecture

