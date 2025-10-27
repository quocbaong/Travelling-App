# 🔔 Hệ Thống Thông Báo Tour Sắp Khởi Hành

## 📋 Tổng Quan

Hệ thống tự động kiểm tra và gửi thông báo nhắc nhở cho user về các tour sắp khởi hành, đảm bảo họ không bỏ lỡ chuyến đi.

---

## 🏗️ Kiến Trúc

### Backend (Spring Boot)

#### 1. **NotificationSchedulerService**
Service chạy scheduled job để kiểm tra và gửi thông báo:

```java
@Scheduled(fixedRate = 3600000) // Chạy mỗi 1 giờ
public void checkUpcomingTours()
```

**Logic:**
1. Lấy tất cả bookings có status `CONFIRMED` hoặc `PENDING`
2. Với mỗi booking:
   - Tính số ngày còn lại đến ngày khởi hành
   - Kiểm tra xem đã gửi notification tương tự trong 12h qua chưa
   - Gửi notification dựa trên số ngày còn lại

**Notification Timeline:**
- **7 ngày trước**: "Tour sắp đến! 🗓️" - Nhắc chuẩn bị hành lý
- **3 ngày trước**: "Nhắc nhở: Tour sắp khởi hành 📅" - Nhắc nhở chi tiết
- **1 ngày trước**: "Tour sắp khởi hành! 🎒" - Nhắc chuẩn bị
- **Hôm nay**: "Tour khởi hành hôm nay! 🚀" - Chúc mừng chuyến đi

**Chống Spam:**
- Kiểm tra notification tương tự trong 12h qua
- Không gửi duplicate notifications
- Match dựa trên `bookingId`, `title` keywords, và `createdAt`

#### 2. **NotificationSchedulerController**
API endpoint để trigger manually (testing):

```
POST /api/notifications/scheduler/check-upcoming
```

#### 3. **Spring Boot Configuration**
Enable scheduling trong `TravellingAppBeApplication.java`:

```java
@EnableScheduling
```

---

### Frontend (React Native)

#### Auto-Refresh Notifications

**AuthContext.tsx:**
```typescript
// Auto-refresh notifications every 5 minutes
useEffect(() => {
  if (!user) return;

  const intervalId = setInterval(() => {
    console.log('🔄 Auto-refreshing notifications...');
    loadNotifications();
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(intervalId);
}, [user]);
```

**Khi nào refresh:**
- Mỗi 5 phút tự động (background)
- Khi user mở notification modal
- Sau khi user đặt tour mới
- Sau khi user login

---

## 🔄 Luồng Hoạt Động

### 1. Scheduled Job (Backend)

```
Every 1 hour:
1. NotificationSchedulerService.checkUpcomingTours()
2. Lấy all bookings (CONFIRMED/PENDING)
3. For each booking:
   - Calculate days until departure
   - Check if already notified in last 12h
   - Send notification based on timeline (0/1/3/7 days)
4. Log results
```

### 2. Notification Detection Logic

```java
LocalDate today = LocalDate.now();
LocalDate travelDate = booking.getTravelDate().toLocalDate();
long daysUntil = ChronoUnit.DAYS.between(today, travelDate);

if (daysUntil == 7) -> Send 7-day reminder
if (daysUntil == 3) -> Send 3-day reminder  
if (daysUntil == 1) -> Send 1-day reminder
if (daysUntil == 0) -> Send same-day reminder
```

### 3. Duplicate Prevention

```java
private boolean hasRecentNotification(userId, bookingId, daysUntil) {
  - Get user's notifications
  - Filter by:
    * Same bookingId (relatedId)
    * Created in last 12 hours
    * Title matches notification type
  - Return true if exists (skip sending)
}
```

### 4. Frontend Real-time Updates

```
User logged in:
1. Auto-refresh every 5 minutes
2. Load notifications on modal open
3. Display unread badge on bell icon
4. Show notifications in modal

User interactions:
- Tap notification -> Mark as read
- Badge updates in real-time
- New notifications appear automatically
```

---

## 📊 Notification Types & Content

### 7-Day Reminder
```
Title: "Tour sắp đến! 🗓️"
Message: "Tour đến {destination} của bạn sẽ khởi hành trong 1 tuần nữa. 
          Đừng quên chuẩn bị hành lý nhé!"
Type: booking
```

### 3-Day Reminder
```
Title: "Nhắc nhở: Tour sắp khởi hành 📅"
Message: "Tour đến {destination} của bạn sẽ khởi hành trong 3 ngày nữa 
          (ngày {date})."
Type: booking
```

### 1-Day Reminder (Tomorrow)
```
Title: "Tour sắp khởi hành! 🎒"
Message: "Tour đến {destination} của bạn sẽ khởi hành vào ngày mai. 
          Hãy chuẩn bị sẵn sàng!"
Type: booking
```

### Same-Day Reminder (Today)
```
Title: "Tour khởi hành hôm nay! 🚀"
Message: "Chuyến đi đến {destination} của bạn khởi hành hôm nay. 
          Chúc bạn có một chuyến đi vui vẻ!"
Type: booking
```

---

## 🎯 Configuration

### Schedule Frequency
**Current**: Mỗi 1 giờ (3600000 ms)

**Có thể điều chỉnh:**
```java
@Scheduled(fixedRate = 3600000)  // 1 hour
@Scheduled(fixedRate = 1800000)  // 30 minutes (more frequent)
@Scheduled(cron = "0 0 8 * * ?") // Daily at 8 AM
```

### Frontend Auto-Refresh
**Current**: Mỗi 5 phút (300000 ms)

**Có thể điều chỉnh:**
```typescript
setInterval(() => {
  loadNotifications();
}, 5 * 60 * 1000); // 5 minutes
```

### Duplicate Prevention Window
**Current**: 12 giờ

**Có thể điều chỉnh:**
```java
LocalDateTime twelveHoursAgo = LocalDateTime.now().minusHours(12);
// Change to: .minusHours(24) for 24-hour window
```

---

## 🧪 Testing

### Manual Trigger (Development)

```bash
curl -X POST http://localhost:8080/api/notifications/scheduler/check-upcoming
```

Response:
```
"Checked upcoming tours and sent notifications"
```

### Test Scenarios

#### Scenario 1: Tour khởi hành sau 7 ngày
1. Tạo booking với `travelDate = today + 7 days`
2. Trigger scheduler manually hoặc đợi 1 giờ
3. Check notifications -> Should see "Tour sắp đến!"

#### Scenario 2: Tour khởi hành ngày mai
1. Tạo booking với `travelDate = tomorrow`
2. Trigger scheduler
3. Check notifications -> Should see "Tour sắp khởi hành!"

#### Scenario 3: Tour khởi hành hôm nay
1. Tạo booking với `travelDate = today`
2. Trigger scheduler
3. Check notifications -> Should see "Tour khởi hành hôm nay!"

#### Scenario 4: Duplicate Prevention
1. Trigger scheduler 2 lần trong vòng 12h
2. Should only receive 1 notification
3. Check logs -> "Already notified" message

---

## 📈 Monitoring & Logs

### Log Messages

```
🔔 Checking for upcoming tours...
✅ Sent 7-day reminder for booking: {bookingId}
✅ Sent 3-day reminder for booking: {bookingId}
✅ Sent 1-day reminder for booking: {bookingId}
✅ Sent same-day reminder for booking: {bookingId}
❌ Error processing booking {bookingId}: {error}
✅ Finished checking upcoming tours
```

### Frontend Logs

```
🔄 Auto-refreshing notifications...
📥 Loading user data for userId: {userId}
✅ Loaded notifications: X items
```

---

## 🚀 Production Considerations

### Performance
- **Scheduled job**: Chạy mỗi 1 giờ, không ảnh hưởng performance
- **Query**: Filter by status trước, giảm số bookings cần check
- **Async**: Có thể chuyển sang async processing nếu có nhiều bookings

### Scalability
- **Current**: Phù hợp với < 10,000 active bookings
- **For scale**: Consider:
  - Index trên `travelDate`, `status`
  - Batch processing
  - Queue-based notifications (RabbitMQ, Kafka)
  - Separate notification service

### Reliability
- **Error handling**: Try-catch cho mỗi booking
- **Duplicate prevention**: 12-hour window
- **Logging**: Detailed logs cho debugging

---

## 🔧 Future Enhancements

1. **Push Notifications**
   - Firebase Cloud Messaging
   - Notification sounds
   - Lock screen notifications

2. **Customizable Reminders**
   - User settings cho notification preferences
   - Custom reminder times (user chọn khi nào nhận)
   - Timezone support

3. **Smart Notifications**
   - Weather alerts cho ngày khởi hành
   - Traffic updates
   - Check-in reminders
   - Packing list reminders

4. **Analytics**
   - Track notification open rates
   - User engagement metrics
   - A/B testing notification content

5. **Advanced Scheduling**
   - Cron expressions cho flexible timing
   - Priority-based notifications
   - Batch notifications (1 email với multiple tours)

---

## ✅ Summary

### ✅ Đã Implement

- [x] Scheduled job chạy mỗi 1 giờ
- [x] 4 notification timelines (0/1/3/7 days)
- [x] Duplicate prevention (12-hour window)
- [x] Manual trigger API (testing)
- [x] Frontend auto-refresh (5 minutes)
- [x] Real-time badge updates
- [x] Detailed logging
- [x] Error handling

### 🎯 Benefits

1. **User Experience**: User không bỏ lỡ tour
2. **Engagement**: Tăng tương tác với app
3. **Automatic**: Hoàn toàn tự động, không cần manual work
4. **Real-time**: Notifications xuất hiện ngay
5. **Smart**: Chống spam, không gửi duplicate
6. **Scalable**: Design sẵn sàng cho scale

---

## 🔗 Related Documentation

- [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md) - Hệ thống notification cơ bản
- [README.md](./README.md) - Tổng quan ứng dụng

