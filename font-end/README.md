# 🌍 Travelling App

Ứng dụng du lịch hiện đại được xây dựng bằng React Native, TypeScript và Expo.

## ✨ Tính năng

### 🏠 Màn hình chính (Home)
- Hiển thị các điểm đến nổi bật và phổ biến
- Danh mục du lịch (Beach, Mountain, City, Adventure, Cultural, Nature, Luxury)
- Tìm kiếm nhanh
- Pull-to-refresh để cập nhật dữ liệu
- Animations mượt mà với react-native-animatable

### 🔍 Khám phá (Explore)
- Tìm kiếm và lọc điểm đến
- Hiển thị dạng lưới với hình ảnh đẹp
- Lọc theo danh mục
- Empty states khi không có kết quả

### 📍 Chi tiết điểm đến (Destination Detail)
- Parallax scrolling header với hiệu ứng zoom
- Thư viện ảnh với preview
- Thông tin chi tiết: mô tả, điểm nổi bật, tiện ích
- Đánh giá và reviews
- Nút đặt tour ngay
- Animated transitions

### 📅 Đặt chỗ (Bookings)
- Quản lý các chuyến đi sắp tới và đã qua
- Tabs để phân loại bookings
- Chi tiết booking với thông tin đầy đủ
- Trạng thái booking (confirmed, pending, cancelled, completed)

### ❤️ Yêu thích (Favorites)
- Lưu các điểm đến yêu thích
- Thêm/xóa favorites dễ dàng
- Hiển thị dạng lưới

### 👤 Hồ sơ (Profile)
- Thông tin người dùng
- Thống kê: chuyến đi, yêu thích, đánh giá
- Cài đặt: thông báo, dark mode, ngôn ngữ
- Bảo mật và thanh toán
- Trung tâm trợ giúp

## 🎨 Thiết kế

- **UI/UX hiện đại**: Giao diện sạch sẽ, trực quan
- **Animations**: Sử dụng react-native-animatable và Animated API
- **Gradients**: LinearGradient cho hiệu ứng đẹp mắt
- **Icons**: Ionicons từ @expo/vector-icons
- **Responsive**: Tự động điều chỉnh theo kích thước màn hình
- **Typography**: Font system với các weight khác nhau

## 🛠️ Công nghệ

- **React Native 0.81.4**
- **TypeScript 5.9.2**
- **Expo ~54.0.13**
- **React Navigation 7.x**
  - Stack Navigator
  - Bottom Tabs Navigator
- **React Native Reanimated 4.0.4**
- **React Native Animatable 1.4.0**
- **Expo Linear Gradient**
- **React Native Gesture Handler**

## 📁 Cấu trúc thư mục

```
font-end/
├── src/
│   ├── api/              # API services và mock data
│   │   ├── index.ts
│   │   ├── mockData.ts
│   │   ├── destinationService.ts
│   │   ├── bookingService.ts
│   │   └── userService.ts
│   ├── components/       # Components tái sử dụng
│   │   ├── Button.tsx
│   │   ├── DestinationCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Header.tsx
│   │   ├── Loading.tsx
│   │   └── index.ts
│   ├── constants/        # Theme, colors, images
│   │   ├── theme.ts
│   │   ├── images.ts
│   │   └── index.ts
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/          # Các màn hình
│   │   ├── HomeScreen.tsx
│   │   ├── ExploreScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── DestinationDetailScreen.tsx
│   │   ├── BookingsScreen.tsx
│   │   ├── BookingDetailScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ReviewsScreen.tsx
│   └── types/            # TypeScript types
│       └── index.ts
├── App.tsx
├── package.json
└── tsconfig.json
```

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 16+
- npm hoặc yarn
- Expo CLI

### Cài đặt dependencies
```bash
cd font-end
npm install
```

### Chạy ứng dụng

```bash
# Khởi động Expo
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên Web
npm run web
```

## 🎯 Tính năng nổi bật

### 1. Animations & Transitions
- Fade in/out animations cho các elements
- Parallax scrolling header
- Zoom effect khi scroll
- Stagger animations cho danh sách
- Smooth page transitions

### 2. Mock Data & Services
- 10+ điểm đến mẫu với hình ảnh thực từ Unsplash
- Service layer hoàn chỉnh
- Simulated API delays để test loading states
- User favorites management
- Booking system

### 3. Responsive Design
- Adaptive layouts
- Grid system linh hoạt
- Safe area handling
- Keyboard avoiding views

### 4. User Experience
- Pull to refresh
- Loading states
- Empty states
- Error handling
- Smooth scrolling
- Touch feedback

## 🎨 Theme System

App sử dụng theme system tập trung với:
- **Colors**: Primary, secondary, accent, neutrals
- **Typography**: Font sizes, weights
- **Spacing**: Consistent margins/paddings
- **Shadows**: Light, medium, heavy
- **Border Radius**: Consistent rounded corners

## 📱 Screens Overview

1. **HomeScreen**: Featured destinations, categories, popular places
2. **ExploreScreen**: Search và filter destinations
3. **SearchScreen**: Dedicated search với recent searches
4. **DestinationDetailScreen**: Chi tiết đầy đủ với parallax header
5. **BookingsScreen**: Quản lý bookings
6. **BookingDetailScreen**: Chi tiết booking
7. **FavoritesScreen**: Danh sách yêu thích
8. **ProfileScreen**: User profile và settings
9. **ReviewsScreen**: Đánh giá và reviews

## 🔮 Tính năng có thể mở rộng

- [ ] Tích hợp API thực tế
- [ ] Authentication (đăng nhập/đăng ký)
- [ ] Payment integration
- [ ] Maps integration
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Dark mode implementation
- [ ] Offline support
- [ ] Social sharing
- [ ] Chat support

## 📄 License

MIT License

## 👨‍💻 Tác giả

Travelling App - React Native & TypeScript

---

**Lưu ý**: App này sử dụng mock data để demo. Để production, cần tích hợp với backend API thực tế.


