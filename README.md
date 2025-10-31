# Travelling App

Ứng dụng du lịch di động được xây dựng bằng React Native và Spring Boot, cho phép người dùng khám phá, đặt chỗ và quản lý các chuyến đi du lịch.

## 📱 Công nghệ sử dụng

### Frontend (React Native)
- **Framework**: React Native với Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: Context API (AuthContext)
- **UI Libraries**: 
  - Expo Linear Gradient
  - React Native Safe Area Context
  - Ionicons
- **Storage**: AsyncStorage
- **Date Picker**: @react-native-community/datetimepicker

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: BCrypt
- **API Documentation**: OpenAPI/Swagger

## 🎯 Tính năng chính

### 1. Xác thực & Quản lý người dùng
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập (Email/Password)
- ✅ Đăng xuất
- ✅ Chế độ Guest (truy cập hạn chế)
- ✅ Xác thực sinh trắc học (Face ID/Fingerprint)
- ✅ Đổi mật khẩu
- ✅ Avatar mặc định cho người dùng mới
- ✅ Cập nhật thông tin cá nhân

### 2. Khám phá điểm đến
- ✅ Trang chủ với điểm đến nổi bật
- ✅ Danh mục điểm đến (Bãi biển, Núi, Thành phố, v.v.)
- ✅ Tìm kiếm điểm đến
- ✅ Lọc nâng cao (giá, đánh giá, khoảng cách)
- ✅ Chi tiết điểm đến với thông tin đầy đủ
- ✅ Đánh giá và nhận xét
- ✅ Xem tất cả đánh giá
- ✅ Hiển thị đánh giá real-time

### 3. Yêu thích
- ✅ Thêm/xóa điểm đến yêu thích
- ✅ Đồng bộ trạng thái yêu thích trên tất cả màn hình
- ✅ Lưu trữ yêu thích trên backend
- ✅ Yêu cầu đăng nhập để sử dụng tính năng

### 4. Đặt chỗ & Thanh toán
- ✅ Chọn dịch vụ tour (Cơ bản, Cao cấp, Luxury)
- ✅ Chọn dịch vụ bổ sung (Chụp ảnh, v.v.)
- ✅ Chọn ngày khởi hành (chỉ sau ngày hiện tại)
- ✅ Tự động tính ngày kết thúc dựa trên thời lượng tour
- ✅ Chọn số lượng khách (1-8 người)
- ✅ Tính tổng giá tự động
- ✅ Nhiều phương thức thanh toán:
  - Thẻ tín dụng
  - Ví điện tử
  - Chuyển khoản ngân hàng
  - Thanh toán khi nhận dịch vụ
- ✅ Trạng thái đơn đặt chỗ:
  - **Confirmed** (Đã xác nhận): Khi thanh toán online
  - **Pending** (Chờ xử lý): Khi thanh toán khi nhận dịch vụ
- ✅ Chi tiết đặt chỗ với đầy đủ thông tin
- ✅ Lưu trữ booking trên backend với userId

### 5. Quản lý đặt chỗ
- ✅ Danh sách các chuyến đi đã đặt
- ✅ Phân loại theo trạng thái (Sắp tới, Đã hoàn thành, Đã hủy)
- ✅ Chi tiết đặt chỗ
- ✅ Đánh giá tour sau khi hoàn thành
- ✅ Kiểm tra trùng lặp đánh giá (1 tour chỉ đánh giá 1 lần)
- ✅ Persist bookings sau khi logout/login

### 6. Đánh giá & Nhận xét
- ✅ Đánh giá tour với số sao (1-5)
- ✅ Viết nhận xét (tối thiểu 10 ký tự)
- ✅ Hiển thị đánh giá của người dùng khác
- ✅ Tính điểm đánh giá trung bình real-time
- ✅ Hiển thị ngày đánh giá
- ✅ Tự động set ngày tạo cho đánh giá (MongoDB Auditing)
- ✅ Hiển thị avatar và tên người đánh giá
- ✅ Xem tất cả đánh giá của điểm đến

### 7. Hồ sơ người dùng
- ✅ Thông tin cá nhân (tên, email, số điện thoại, ngày sinh, giới tính, địa chỉ)
- ✅ Thay đổi avatar (từ thư viện ảnh hoặc camera)
- ✅ Chỉnh sửa thông tin
- ✅ Thống kê chuyến đi và yêu thích
- ✅ **Guest Mode**: Cho phép truy cập giới hạn
  - Hiển thị trang Hồ sơ với UI Guest
  - Yêu cầu đăng nhập khi truy cập tính năng cần auth
  - Nút đăng nhập nổi bật

### 8. Cài đặt & Bảo mật
- ✅ Đổi mật khẩu
- ✅ Tắt modal đổi mật khẩu bằng cách tap bên ngoài
- ✅ Hiển thị/ẩn mật khẩu
- ✅ Xác thực sinh trắc học (Fingerprint/Face ID)
- ✅ Lưu mật khẩu cho đăng nhập sinh trắc học
- ✅ Hỗ trợ đa ngôn ngữ (Tiếng Việt)
- ✅ Thông báo

### 9. Hỗ trợ & Thông tin
- ✅ Trung tâm trợ giúp
- ✅ Điều khoản dịch vụ
- ✅ Chính sách bảo mật
- ✅ Về chúng tôi

## 🔐 Bảo mật

### Mã hóa mật khẩu
- Backend sử dụng BCrypt để hash password
- Không lưu trữ plain text password
- Password được hash trước khi lưu vào database
- So sánh password bằng `passwordEncoder.matches()`

### Xác thực
- JWT tokens cho authentication
- Token được lưu trong AsyncStorage
- Auto-refresh user data sau khi login
- Biometric authentication cho truy cập nhanh

### Phân quyền
- Guest mode: Chỉ xem, không thể đặt chỗ, yêu thích, đánh giá
- Authenticated users: Full access
- Pending navigation: Lưu màn hình người dùng muốn truy cập trước khi login
```


## 🚀 Cài đặt và chạy ứng dụng

### Frontend (React Native)

1. **Clone repository và di chuyển vào thư mục frontend**:
```bash
cd font-end
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Cấu hình API endpoint** (font-end/src/api/config.ts):
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_IP:8080/api',
  // ...
};
```

4. **Chạy ứng dụng**:
```bash
npx expo start
```

### Backend (Spring Boot)

1. **Di chuyển vào thư mục backend**:
```bash
cd Travelling_App_BE
```

2. **Cấu hình MongoDB** (application.properties):
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/travelling_app
```

3. **Build và chạy**:
```bash
./mvnw spring-boot:run
```

Hoặc nếu sử dụng IntelliJ IDEA, chỉ cần Run application.

4. **API Documentation**:
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## 🔄 Luồng hoạt động

### 1. Đăng ký và đăng nhập
1. User đăng ký tài khoản mới
2. Backend hash password và lưu vào database
3. Backend trả về user info và JWT token
4. Frontend lưu token và user info vào AsyncStorage
5. Tự động load favorites và bookings

### 2. Đặt chỗ tour
1. User chọn điểm đến và nhấn "Đặt ngay"
2. Nếu chưa đăng nhập → Lưu pending tour → Yêu cầu login
3. Chọn dịch vụ tour và ngày khởi hành
4. Ngày kết thúc được tự động tính dựa trên duration
5. Chọn số lượng khách và phương thức thanh toán
6. Tổng giá được tính tự động (base price + services) × guests
7. Xác nhận thanh toán
8. Backend lưu booking với status:
   - CONFIRMED + PAID: Nếu thanh toán online
   - PENDING: Nếu thanh toán khi nhận dịch vụ
9. Booking được lưu với userId và persist sau logout/login

### 3. Đánh giá tour
1. User vào màn hình Bookings
2. Chọn tour đã hoàn thành và nhấn "Đánh giá"
3. Kiểm tra xem đã đánh giá chưa (1 tour chỉ đánh giá 1 lần)
4. Chọn số sao và viết nhận xét
5. Submit đánh giá lên backend
6. Backend lưu review với userId, userName, userAvatar
7. Cập nhật rating trung bình của destination
8. Hiển thị đánh giá mới trong danh sách

### 4. Guest Mode
1. User vào app lần đầu → Chế độ Guest
2. Có thể xem Home, Explore, chi tiết điểm đến
3. Khi nhấn vào Bookings/Favorites/Profile features:
   - Lưu pending screen
   - Chuyển đến Login
4. Sau khi đăng nhập thành công:
   - Quay về màn hình pending (nếu có)
   - Hoặc về Home (nếu không có pending)

## 🐛 Các vấn đề đã giải quyết

1. ✅ **Login credentials không khớp**: Sửa logic hash password trong backend
2. ✅ **Favorite không sync**: Cập nhật cả `userFavorites` và `user.favorites`
3. ✅ **Bookings mất sau logout**: Thêm userId vào booking request
4. ✅ **TotalPrice không đúng**: Truyền totalPrice từ frontend xuống backend
5. ✅ **Payment method hiển thị ID**: Map ID sang tên trước khi lưu
6. ✅ **Tour image không load**: Thêm fallback cho imageUrl
7. ✅ **End date selection logic**: Tự động tính end date, không cho chọn
8. ✅ **Rating NaN**: Xử lý trường hợp initial null rating
9. ✅ **Review date không real-time**: Bật MongoDB Auditing
10. ✅ **User name không hiển thị**: Map fullName sang name trong API service
11. ✅ **Guest bị redirect khỏi Profile**: Cho phép Guest xem Profile với UI giới hạn
12. ✅ **Pending screen sau logout**: Clear pending states khi logout

## 📝 TODO / Cải tiến

- [ ] Thêm payment gateway thực tế
- [ ] Push notifications
- [ ] Offline mode
- [ ] Social login (Google, Facebook)
- [ ] Multi-language support (English, Japanese, etc.)
- [ ] Dark mode
- [ ] Chat với support
- [ ] Chia sẻ lên social media
- [ ] Xuất vé PDF
- [ ] Tích hợp maps để xem vị trí điểm đến
- [ ] Lịch sử tìm kiếm
- [ ] Gợi ý điểm đến dựa trên lịch sử

## 👥 Team

- **Frontend Developer**: React Native Development
- **Backend Developer**: Spring Boot & MongoDB
- **UI/UX Designer**: Application Design

## 📄 License

This project is for educational purposes.

---------------------------

**Version**: 1.0.0  
**Last Updated**: October 2025

