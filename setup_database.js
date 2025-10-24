// MongoDB Setup Script
// Chạy với: mongosh setup_database.js

// Tạo database travelling_db
db = db.getSiblingDB('travelling_db');

print('Creating database: travelling_db');

// Tạo collections
db.createCollection('destinations');
db.createCollection('users');
db.createCollection('bookings');
db.createCollection('reviews');
db.createCollection('favorites');

print('Collections created successfully');

// Tạo indexes cho destinations
db.destinations.createIndex({ "name": 1 });
db.destinations.createIndex({ "category": 1 });
db.destinations.createIndex({ "country": 1 });
db.destinations.createIndex({ "featured": 1 });
db.destinations.createIndex({ "popular": 1 });
db.destinations.createIndex({ "rating": 1 });
db.destinations.createIndex({ "price": 1 });

// Tạo indexes cho users
db.users.createIndex({ "email": 1 }, { unique: true });

// Tạo indexes cho bookings
db.bookings.createIndex({ "userId": 1 });
db.bookings.createIndex({ "status": 1 });
db.bookings.createIndex({ "bookingDate": 1 });

// Tạo indexes cho reviews
db.reviews.createIndex({ "destinationId": 1 });
db.reviews.createIndex({ "userId": 1 });
db.reviews.createIndex({ "userId": 1, "destinationId": 1 }, { unique: true });

// Tạo indexes cho favorites
db.favorites.createIndex({ "userId": 1 });
db.favorites.createIndex({ "userId": 1, "destinationId": 1 }, { unique: true });

print('Indexes created successfully');

// Insert sample destinations
db.destinations.insertMany([
  {
    name: "Paris, France",
    country: "France",
    description: "Thành phố ánh sáng với những công trình kiến trúc tuyệt đẹp, từ tháp Eiffel đến bảo tàng Louvre. Paris là thành phố lãng mạn nhất thế giới với những con phố cổ kính và nghệ thuật đường phố.",
    shortDescription: "Thành phố ánh sáng với những công trình kiến trúc tuyệt đẹp",
    images: [
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513639765736-5c6d1f8e1b5c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520637836862-4d197d17c86a?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 2847,
    price: 2500000,
    duration: "5 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: "Paris, France",
      city: "Paris",
      country: "France"
    },
    highlights: [
      "Eiffel Tower",
      "Louvre Museum", 
      "Notre Dame Cathedral",
      "Champs-Élysées",
      "Montmartre"
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "Airport Transfer",
      "Guide",
      "Hotel Pickup"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tokyo, Japan",
    country: "Japan", 
    description: "Thành phố hiện đại kết hợp truyền thống, Tokyo là nơi giao thoa giữa công nghệ tiên tiến và văn hóa cổ đại. Từ những tòa nhà chọc trời đến những ngôi đền cổ kính.",
    shortDescription: "Thành phố hiện đại kết hợp truyền thống",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 1923,
    price: 3200000,
    duration: "7 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 35.6762,
      longitude: 139.6503,
      address: "Tokyo, Japan",
      city: "Tokyo", 
      country: "Japan"
    },
    highlights: [
      "Tokyo Tower",
      "Senso-ji Temple",
      "Shibuya Crossing",
      "Tsukiji Fish Market",
      "Meiji Shrine"
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "JR Pass",
      "Guide",
      "Hotel Pickup"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bali, Indonesia",
    country: "Indonesia",
    description: "Thiên đường nhiệt đới với những bãi biển tuyệt đẹp, văn hóa Hindu độc đáo và thiên nhiên hùng vĩ. Bali là điểm đến lý tưởng cho những ai muốn thư giãn và khám phá.",
    shortDescription: "Thiên đường nhiệt đới với những bãi biển tuyệt đẹp",
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 3456,
    price: 1800000,
    duration: "6 days", 
    category: "Beach",
    featured: true,
    popular: true,
    location: {
      latitude: -8.3405,
      longitude: 115.0920,
      address: "Bali, Indonesia",
      city: "Bali",
      country: "Indonesia"
    },
    highlights: [
      "Ubud",
      "Tanah Lot",
      "Mount Batur",
      "Nusa Penida",
      "Seminyak Beach"
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "Airport Transfer",
      "Guide",
      "Snorkeling Equipment"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dubai, UAE",
    country: "United Arab Emirates",
    description: "Thành phố vàng với những tòa nhà chọc trời, mua sắm sang trọng và giải trí hiện đại. Dubai là biểu tượng của sự xa hoa và phát triển.",
    shortDescription: "Thành phố vàng với những tòa nhà chọc trời",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1678,
    price: 4500000,
    duration: "4 days",
    category: "Luxury",
    featured: false,
    popular: true,
    location: {
      latitude: 25.2048,
      longitude: 55.2708,
      address: "Dubai, UAE",
      city: "Dubai",
      country: "United Arab Emirates"
    },
    highlights: [
      "Burj Khalifa",
      "Palm Jumeirah",
      "Dubai Mall",
      "Burj Al Arab",
      "Desert Safari"
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "Luxury Transfer",
      "Private Guide",
      "Shopping Tour"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Santorini, Greece",
    country: "Greece",
    description: "Hòn đảo xinh đẹp với kiến trúc trắng xanh đặc trưng, hoàng hôn tuyệt đẹp và văn hóa Hy Lạp cổ đại. Santorini là thiên đường cho những người yêu thích kiến trúc và cảnh đẹp.",
    shortDescription: "Hòn đảo xinh đẹp với kiến trúc trắng xanh",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 2134,
    price: 2800000,
    duration: "5 days",
    category: "Beach",
    featured: false,
    popular: true,
    location: {
      latitude: 36.3932,
      longitude: 25.4615,
      address: "Santorini, Greece",
      city: "Santorini",
      country: "Greece"
    },
    highlights: [
      "Oia Village",
      "Red Beach",
      "Santorini Volcano",
      "Fira Town",
      "Sunset Views"
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "Ferry Transfer",
      "Guide",
      "Wine Tasting"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Sample destinations inserted successfully');

// Insert sample user
db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // password123
  fullName: "Nguyễn Văn Test",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  phone: "0123456789",
  dateOfBirth: new Date("1990-01-01"),
  gender: "Nam",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  role: "USER",
  preferences: {
    language: "vi",
    currency: "VND", 
    notifications: true,
    darkMode: false
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Sample user created successfully');

print('Database setup completed!');
print('You can now access:');
print('- Database: travelling_db');
print('- Collections: destinations, users, bookings, reviews, favorites');
print('- Sample data: 5 destinations, 1 user');
