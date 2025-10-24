// Bộ dữ liệu đầy đủ các điểm đến nổi tiếng trên toàn thế giới
// Chạy với: mongosh world_destinations_data.js

// Tạo database travelling_db
db = db.getSiblingDB('travelling_db');

print('Creating comprehensive world destinations dataset...');

// Xóa data cũ (nếu có)
db.destinations.drop();
db.users.drop();
db.bookings.drop();
db.reviews.drop();
db.favorites.drop();

print('Cleared old data');

// Tạo lại collections và indexes
db.createCollection('destinations');
db.createCollection('users');
db.createCollection('bookings');
db.createCollection('reviews');
db.createCollection('favorites');

// Tạo indexes
db.destinations.createIndex({ "name": 1 });
db.destinations.createIndex({ "category": 1 });
db.destinations.createIndex({ "country": 1 });
db.destinations.createIndex({ "featured": 1 });
db.destinations.createIndex({ "popular": 1 });
db.destinations.createIndex({ "rating": 1 });
db.destinations.createIndex({ "price": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.bookings.createIndex({ "userId": 1 });
db.reviews.createIndex({ "destinationId": 1 });
db.reviews.createIndex({ "userId": 1 });
db.reviews.createIndex({ "userId": 1, "destinationId": 1 }, { unique: true });
db.favorites.createIndex({ "userId": 1 });
db.favorites.createIndex({ "userId": 1, "destinationId": 1 }, { unique: true });

print('Collections and indexes created');

// Bộ dữ liệu destinations đầy đủ
const destinations = [
  // === CHÂU ÂU ===
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
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre Dame Cathedral", "Champs-Élysées", "Montmartre"],
    amenities: ["WiFi", "Breakfast", "Airport Transfer", "Guide", "Hotel Pickup"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Rome, Italy",
    country: "Italy",
    description: "Thành phố vĩnh cửu với lịch sử 2500 năm, nơi tập trung những di tích La Mã cổ đại và nghệ thuật Phục Hưng. Rome là một bảo tàng sống với Colosseum, Vatican và những con phố cổ kính.",
    shortDescription: "Thành phố vĩnh cửu với lịch sử 2500 năm",
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 2156,
    price: 2200000,
    duration: "4 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 41.9028,
      longitude: 12.4964,
      address: "Rome, Italy",
      city: "Rome",
      country: "Italy"
    },
    highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum", "Pantheon"],
    amenities: ["WiFi", "Breakfast", "Museum Pass", "Guide", "Hotel Pickup"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Barcelona, Spain",
    country: "Spain",
    description: "Thành phố của nghệ thuật với kiến trúc Gaudí độc đáo, bãi biển Địa Trung Hải và cuộc sống về đêm sôi động. Barcelona kết hợp hoàn hảo giữa lịch sử và hiện đại.",
    shortDescription: "Thành phố của nghệ thuật với kiến trúc Gaudí độc đáo",
    images: [
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1890,
    price: 2000000,
    duration: "4 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 41.3851,
      longitude: 2.1734,
      address: "Barcelona, Spain",
      city: "Barcelona",
      country: "Spain"
    },
    highlights: ["Sagrada Familia", "Park Güell", "Las Ramblas", "Gothic Quarter", "Barceloneta Beach"],
    amenities: ["WiFi", "Breakfast", "Metro Pass", "Guide", "Hotel Pickup"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Amsterdam, Netherlands",
    country: "Netherlands",
    description: "Thành phố của những kênh đào, xe đạp và nghệ thuật. Amsterdam nổi tiếng với kiến trúc cổ điển, bảo tàng Van Gogh và cuộc sống tự do, cởi mở.",
    shortDescription: "Thành phố của những kênh đào, xe đạp và nghệ thuật",
    images: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1654,
    price: 1800000,
    duration: "3 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 52.3676,
      longitude: 4.9041,
      address: "Amsterdam, Netherlands",
      city: "Amsterdam",
      country: "Netherlands"
    },
    highlights: ["Canal Cruise", "Van Gogh Museum", "Anne Frank House", "Jordaan District", "Vondelpark"],
    amenities: ["WiFi", "Breakfast", "Canal Pass", "Guide", "Bike Rental"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Prague, Czech Republic",
    country: "Czech Republic",
    description: "Thành phố vàng với kiến trúc Gothic và Baroque tuyệt đẹp. Prague được mệnh danh là viên ngọc quý của châu Âu với cầu Charles và lâu đài Prague.",
    shortDescription: "Thành phố vàng với kiến trúc Gothic và Baroque tuyệt đẹp",
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 1432,
    price: 1500000,
    duration: "3 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 50.0755,
      longitude: 14.4378,
      address: "Prague, Czech Republic",
      city: "Prague",
      country: "Czech Republic"
    },
    highlights: ["Charles Bridge", "Prague Castle", "Old Town Square", "Astronomical Clock", "Jewish Quarter"],
    amenities: ["WiFi", "Breakfast", "City Pass", "Guide", "Hotel Pickup"],
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
    highlights: ["Oia Village", "Red Beach", "Santorini Volcano", "Fira Town", "Sunset Views"],
    amenities: ["WiFi", "Breakfast", "Ferry Transfer", "Guide", "Wine Tasting"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mykonos, Greece",
    country: "Greece",
    description: "Hòn đảo của những bữa tiệc và cuộc sống về đêm sôi động. Mykonos nổi tiếng với những bãi biển tuyệt đẹp, kiến trúc Cycladic và cuộc sống luxury.",
    shortDescription: "Hòn đảo của những bữa tiệc và cuộc sống về đêm sôi động",
    images: [
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1876,
    price: 3200000,
    duration: "4 days",
    category: "Beach",
    featured: false,
    popular: true,
    location: {
      latitude: 37.4467,
      longitude: 25.3289,
      address: "Mykonos, Greece",
      city: "Mykonos",
      country: "Greece"
    },
    highlights: ["Paradise Beach", "Mykonos Town", "Little Venice", "Windmills", "Delos Island"],
    amenities: ["WiFi", "Breakfast", "Ferry Transfer", "Party Access", "Beach Club"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === CHÂU Á ===
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
    highlights: ["Tokyo Tower", "Senso-ji Temple", "Shibuya Crossing", "Tsukiji Fish Market", "Meiji Shrine"],
    amenities: ["WiFi", "Breakfast", "JR Pass", "Guide", "Hotel Pickup"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kyoto, Japan",
    country: "Japan",
    description: "Thành phố cổ kính với hơn 2000 ngôi đền và chùa, Kyoto là trái tim văn hóa Nhật Bản. Nơi đây lưu giữ những truyền thống cổ đại và kiến trúc truyền thống.",
    shortDescription: "Thành phố cổ kính với hơn 2000 ngôi đền và chùa",
    images: [
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1654,
    price: 2800000,
    duration: "5 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 35.0116,
      longitude: 135.7681,
      address: "Kyoto, Japan",
      city: "Kyoto",
      country: "Japan"
    },
    highlights: ["Fushimi Inari Shrine", "Kiyomizu-dera", "Arashiyama Bamboo Grove", "Golden Pavilion", "Gion District"],
    amenities: ["WiFi", "Breakfast", "Temple Pass", "Guide", "Traditional Experience"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Seoul, South Korea",
    country: "South Korea",
    description: "Thành phố của K-Pop và công nghệ, Seoul kết hợp hoàn hảo giữa hiện đại và truyền thống. Từ những tòa nhà chọc trời đến những cung điện cổ kính.",
    shortDescription: "Thành phố của K-Pop và công nghệ",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1543,
    price: 2500000,
    duration: "5 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: "Seoul, South Korea",
      city: "Seoul",
      country: "South Korea"
    },
    highlights: ["Gyeongbokgung Palace", "Myeongdong", "Gangnam", "N Seoul Tower", "Insadong"],
    amenities: ["WiFi", "Breakfast", "Subway Pass", "Guide", "K-Pop Experience"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bangkok, Thailand",
    country: "Thailand",
    description: "Thành phố của những ngôi chùa vàng và ẩm thực đường phố tuyệt vời. Bangkok là sự kết hợp hoàn hảo giữa văn hóa truyền thống và cuộc sống hiện đại sôi động.",
    shortDescription: "Thành phố của những ngôi chùa vàng và ẩm thực đường phố",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 2134,
    price: 1200000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 13.7563,
      longitude: 100.5018,
      address: "Bangkok, Thailand",
      city: "Bangkok",
      country: "Thailand"
    },
    highlights: ["Grand Palace", "Wat Pho", "Chatuchak Market", "Khao San Road", "Chinatown"],
    amenities: ["WiFi", "Breakfast", "BTS Pass", "Guide", "Street Food Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Singapore",
    country: "Singapore",
    description: "Quốc đảo hiện đại với kiến trúc tương lai và văn hóa đa dạng. Singapore là nơi giao thoa của các nền văn hóa châu Á và công nghệ tiên tiến.",
    shortDescription: "Quốc đảo hiện đại với kiến trúc tương lai",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1876,
    price: 2800000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 1.3521,
      longitude: 103.8198,
      address: "Singapore",
      city: "Singapore",
      country: "Singapore"
    },
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Chinatown", "Little India"],
    amenities: ["WiFi", "Breakfast", "MRT Pass", "Guide", "City Pass"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hong Kong",
    country: "Hong Kong",
    description: "Thành phố không bao giờ ngủ với những tòa nhà chọc trời và cuộc sống về đêm sôi động. Hong Kong là trung tâm tài chính và văn hóa của châu Á.",
    shortDescription: "Thành phố không bao giờ ngủ với những tòa nhà chọc trời",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 1654,
    price: 3000000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 22.3193,
      longitude: 114.1694,
      address: "Hong Kong",
      city: "Hong Kong",
      country: "Hong Kong"
    },
    highlights: ["Victoria Peak", "Tsim Sha Tsui", "Lan Kwai Fong", "Big Buddha", "Ocean Park"],
    amenities: ["WiFi", "Breakfast", "Octopus Card", "Guide", "City Pass"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === ĐÔNG NAM Á ===
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
    highlights: ["Ubud", "Tanah Lot", "Mount Batur", "Nusa Penida", "Seminyak Beach"],
    amenities: ["WiFi", "Breakfast", "Airport Transfer", "Guide", "Snorkeling Equipment"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Phuket, Thailand",
    country: "Thailand",
    description: "Hòn đảo lớn nhất Thái Lan với những bãi biển tuyệt đẹp, cuộc sống về đêm sôi động và ẩm thực hải sản tươi ngon. Phuket là thiên đường cho du khách yêu thích biển.",
    shortDescription: "Hòn đảo lớn nhất Thái Lan với những bãi biển tuyệt đẹp",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 2876,
    price: 1500000,
    duration: "5 days",
    category: "Beach",
    featured: false,
    popular: true,
    location: {
      latitude: 7.8804,
      longitude: 98.3923,
      address: "Phuket, Thailand",
      city: "Phuket",
      country: "Thailand"
    },
    highlights: ["Patong Beach", "Phi Phi Islands", "Big Buddha", "Old Phuket Town", "Bangla Road"],
    amenities: ["WiFi", "Breakfast", "Airport Transfer", "Guide", "Island Hopping"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ho Chi Minh City, Vietnam",
    country: "Vietnam",
    description: "Thành phố năng động với lịch sử phong phú và ẩm thực đường phố tuyệt vời. Sài Gòn là trung tâm kinh tế và văn hóa của miền Nam Việt Nam.",
    shortDescription: "Thành phố năng động với lịch sử phong phú",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 1876,
    price: 800000,
    duration: "3 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 10.8231,
      longitude: 106.6297,
      address: "Ho Chi Minh City, Vietnam",
      city: "Ho Chi Minh City",
      country: "Vietnam"
    },
    highlights: ["Cu Chi Tunnels", "War Remnants Museum", "Ben Thanh Market", "Notre Dame Cathedral", "Bitexco Tower"],
    amenities: ["WiFi", "Breakfast", "City Tour", "Guide", "Street Food Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hanoi, Vietnam",
    country: "Vietnam",
    description: "Thủ đô cổ kính với hơn 1000 năm lịch sử, nơi giao thoa giữa văn hóa truyền thống và hiện đại. Hà Nội là trái tim văn hóa Việt Nam.",
    shortDescription: "Thủ đô cổ kính với hơn 1000 năm lịch sử",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1654,
    price: 900000,
    duration: "3 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 21.0285,
      longitude: 105.8542,
      address: "Hanoi, Vietnam",
      city: "Hanoi",
      country: "Vietnam"
    },
    highlights: ["Old Quarter", "Hoan Kiem Lake", "Temple of Literature", "Ho Chi Minh Mausoleum", "Water Puppet Show"],
    amenities: ["WiFi", "Breakfast", "City Tour", "Guide", "Cultural Experience"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Halong Bay, Vietnam",
    country: "Vietnam",
    description: "Vịnh Hạ Long với hàng nghìn đảo đá vôi kỳ vĩ, được UNESCO công nhận là Di sản Thế giới. Đây là một trong những kỳ quan thiên nhiên đẹp nhất thế giới.",
    shortDescription: "Vịnh với hàng nghìn đảo đá vôi kỳ vĩ",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 2134,
    price: 1200000,
    duration: "2 days",
    category: "Nature",
    featured: true,
    popular: true,
    location: {
      latitude: 20.9101,
      longitude: 107.1839,
      address: "Halong Bay, Vietnam",
      city: "Halong Bay",
      country: "Vietnam"
    },
    highlights: ["Cruise Tour", "Titop Island", "Sung Sot Cave", "Fishing Village", "Kayaking"],
    amenities: ["WiFi", "Breakfast", "Cruise", "Guide", "Kayaking Equipment"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === CHÂU MỸ ===
  {
    name: "New York City, USA",
    country: "United States",
    description: "Thành phố không bao giờ ngủ với những tòa nhà chọc trời, Broadway và cuộc sống đô thị sôi động. NYC là trung tâm văn hóa và tài chính của thế giới.",
    shortDescription: "Thành phố không bao giờ ngủ với những tòa nhà chọc trời",
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 3456,
    price: 4500000,
    duration: "5 days",
    category: "Cultural",
    featured: true,
    popular: true,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "New York City, USA",
      city: "New York City",
      country: "United States"
    },
    highlights: ["Times Square", "Central Park", "Statue of Liberty", "Empire State Building", "Broadway"],
    amenities: ["WiFi", "Breakfast", "Metro Pass", "Guide", "Broadway Tickets"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Los Angeles, USA",
    country: "United States",
    description: "Thành phố của những ngôi sao và ánh nắng California. LA nổi tiếng với Hollywood, bãi biển Venice và cuộc sống luxury.",
    shortDescription: "Thành phố của những ngôi sao và ánh nắng California",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 2876,
    price: 4000000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: "Los Angeles, USA",
      city: "Los Angeles",
      country: "United States"
    },
    highlights: ["Hollywood", "Santa Monica Pier", "Venice Beach", "Griffith Observatory", "Beverly Hills"],
    amenities: ["WiFi", "Breakfast", "Car Rental", "Guide", "Studio Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Las Vegas, USA",
    country: "United States",
    description: "Thành phố của những ánh đèn neon và giải trí không ngừng nghỉ. Las Vegas là thiên đường cho những ai yêu thích casino, show và cuộc sống về đêm.",
    shortDescription: "Thành phố của những ánh đèn neon và giải trí",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 2134,
    price: 3500000,
    duration: "3 days",
    category: "Entertainment",
    featured: false,
    popular: true,
    location: {
      latitude: 36.1699,
      longitude: -115.1398,
      address: "Las Vegas, USA",
      city: "Las Vegas",
      country: "United States"
    },
    highlights: ["The Strip", "Bellagio Fountains", "Caesars Palace", "Fremont Street", "Grand Canyon"],
    amenities: ["WiFi", "Breakfast", "Casino Credits", "Guide", "Show Tickets"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "San Francisco, USA",
    country: "United States",
    description: "Thành phố đồi với cầu Cổng Vàng huyền thoại và văn hóa tech. San Francisco kết hợp hoàn hảo giữa lịch sử và tương lai.",
    shortDescription: "Thành phố đồi với cầu Cổng Vàng huyền thoại",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 1876,
    price: 4200000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, USA",
      city: "San Francisco",
      country: "United States"
    },
    highlights: ["Golden Gate Bridge", "Alcatraz Island", "Fisherman's Wharf", "Lombard Street", "Chinatown"],
    amenities: ["WiFi", "Breakfast", "Cable Car Pass", "Guide", "Alcatraz Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Miami, USA",
    country: "United States",
    description: "Thành phố nhiệt đới với những bãi biển tuyệt đẹp, cuộc sống về đêm sôi động và văn hóa Latin. Miami là thiên đường cho những ai yêu thích biển và party.",
    shortDescription: "Thành phố nhiệt đới với những bãi biển tuyệt đẹp",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1654,
    price: 3800000,
    duration: "4 days",
    category: "Beach",
    featured: false,
    popular: true,
    location: {
      latitude: 25.7617,
      longitude: -80.1918,
      address: "Miami, USA",
      city: "Miami",
      country: "United States"
    },
    highlights: ["South Beach", "Art Deco District", "Little Havana", "Wynwood Walls", "Everglades"],
    amenities: ["WiFi", "Breakfast", "Beach Access", "Guide", "Boat Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === TRUNG ĐÔNG ===
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
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Burj Al Arab", "Desert Safari"],
    amenities: ["WiFi", "Breakfast", "Luxury Transfer", "Private Guide", "Shopping Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Abu Dhabi, UAE",
    country: "United Arab Emirates",
    description: "Thủ đô của UAE với những công trình kiến trúc hiện đại và văn hóa truyền thống. Abu Dhabi kết hợp hoàn hảo giữa xa hoa và văn hóa.",
    shortDescription: "Thủ đô của UAE với những công trình kiến trúc hiện đại",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 1234,
    price: 4200000,
    duration: "3 days",
    category: "Luxury",
    featured: false,
    popular: false,
    location: {
      latitude: 24.4539,
      longitude: 54.3773,
      address: "Abu Dhabi, UAE",
      city: "Abu Dhabi",
      country: "United Arab Emirates"
    },
    highlights: ["Sheikh Zayed Mosque", "Louvre Abu Dhabi", "Ferrari World", "Yas Island", "Heritage Village"],
    amenities: ["WiFi", "Breakfast", "Luxury Transfer", "Private Guide", "Cultural Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === CHÂU ÚC ===
  {
    name: "Sydney, Australia",
    country: "Australia",
    description: "Thành phố cảng với Nhà hát Opera biểu tượng và cầu Harbour Bridge. Sydney là trung tâm văn hóa và kinh tế của Australia.",
    shortDescription: "Thành phố cảng với Nhà hát Opera biểu tượng",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 2345,
    price: 3800000,
    duration: "5 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: -33.8688,
      longitude: 151.2093,
      address: "Sydney, Australia",
      city: "Sydney",
      country: "Australia"
    },
    highlights: ["Opera House", "Harbour Bridge", "Bondi Beach", "Royal Botanic Gardens", "Taronga Zoo"],
    amenities: ["WiFi", "Breakfast", "Ferry Pass", "Guide", "Opera House Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Melbourne, Australia",
    country: "Australia",
    description: "Thành phố văn hóa với nghệ thuật đường phố, ẩm thực đa dạng và cuộc sống về đêm sôi động. Melbourne được mệnh danh là thành phố đáng sống nhất thế giới.",
    shortDescription: "Thành phố văn hóa với nghệ thuật đường phố",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 1876,
    price: 3500000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: -37.8136,
      longitude: 144.9631,
      address: "Melbourne, Australia",
      city: "Melbourne",
      country: "Australia"
    },
    highlights: ["Federation Square", "Queen Victoria Market", "Brighton Beach", "St Kilda", "Great Ocean Road"],
    amenities: ["WiFi", "Breakfast", "Tram Pass", "Guide", "Food Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // === CHÂU PHI ===
  {
    name: "Cape Town, South Africa",
    country: "South Africa",
    description: "Thành phố cảng với Núi Bàn huyền thoại và những bãi biển tuyệt đẹp. Cape Town kết hợp hoàn hảo giữa thiên nhiên hoang dã và cuộc sống đô thị.",
    shortDescription: "Thành phố cảng với Núi Bàn huyền thoại",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 1654,
    price: 2800000,
    duration: "5 days",
    category: "Nature",
    featured: true,
    popular: true,
    location: {
      latitude: -33.9249,
      longitude: 18.4241,
      address: "Cape Town, South Africa",
      city: "Cape Town",
      country: "South Africa"
    },
    highlights: ["Table Mountain", "Robben Island", "Cape of Good Hope", "V&A Waterfront", "Boulders Beach"],
    amenities: ["WiFi", "Breakfast", "Cable Car", "Guide", "Wildlife Tour"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Marrakech, Morocco",
    country: "Morocco",
    description: "Thành phố đỏ với những khu chợ cổ kính, kiến trúc Hồi giáo tuyệt đẹp và văn hóa Berber độc đáo. Marrakech là cửa ngõ vào thế giới Bắc Phi.",
    shortDescription: "Thành phố đỏ với những khu chợ cổ kính",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 1432,
    price: 1800000,
    duration: "4 days",
    category: "Cultural",
    featured: false,
    popular: true,
    location: {
      latitude: 31.6295,
      longitude: -7.9811,
      address: "Marrakech, Morocco",
      city: "Marrakech",
      country: "Morocco"
    },
    highlights: ["Jemaa el-Fnaa", "Bahia Palace", "Koutoubia Mosque", "Majorelle Garden", "Atlas Mountains"],
    amenities: ["WiFi", "Breakfast", "City Tour", "Guide", "Cooking Class"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert tất cả destinations
db.destinations.insertMany(destinations);

print(`Inserted ${destinations.length} destinations successfully`);

// Tạo sample users
const users = [
  {
    email: "admin@travelling.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // admin123
    fullName: "Admin Travelling",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    phone: "0123456789",
    dateOfBirth: new Date("1985-01-01"),
    gender: "Nam",
    address: "123 Admin Street, Admin City",
    role: "ADMIN",
    preferences: {
      language: "vi",
      currency: "VND",
      notifications: true,
      darkMode: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "user1@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // user123
    fullName: "Nguyễn Văn A",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    phone: "0987654321",
    dateOfBirth: new Date("1990-05-15"),
    gender: "Nam",
    address: "456 User Street, Ho Chi Minh City",
    role: "USER",
    preferences: {
      language: "vi",
      currency: "VND",
      notifications: true,
      darkMode: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "user2@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // user123
    fullName: "Trần Thị B",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    phone: "0912345678",
    dateOfBirth: new Date("1992-08-20"),
    gender: "Nữ",
    address: "789 User Avenue, Hanoi",
    role: "USER",
    preferences: {
      language: "vi",
      currency: "VND",
      notifications: false,
      darkMode: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.users.insertMany(users);

print(`Inserted ${users.length} users successfully`);

// Lấy users và destinations sau khi insert để có _id
const userList = db.users.find().toArray();
const destinationList = db.destinations.find().toArray();

// Tạo sample bookings (sau khi insert users và destinations)
if (userList.length >= 3 && destinationList.length >= 8) {
const bookings = [
  {
    userId: userList[1]._id,
    destinationId: destinationList[0]._id, // Paris
    status: "CONFIRMED",
    bookingDate: new Date("2024-10-01"),
    travelDate: new Date("2024-12-25"),
    numberOfTravelers: 2,
    totalPrice: 2500000,
    paymentMethod: "credit_card",
    paymentStatus: "PAID",
    contactInfo: {
      fullName: "Nguyễn Văn A",
      email: "user1@example.com",
      phone: "0987654321",
      address: "456 User Street, Ho Chi Minh City"
    },
    specialRequests: ["Vegetarian meals", "Window seat"],
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01")
  },
  {
    userId: userList[2]._id,
    destinationId: destinationList[7]._id, // Tokyo
    status: "PENDING",
    bookingDate: new Date("2024-10-15"),
    travelDate: new Date("2025-01-15"),
    numberOfTravelers: 1,
    totalPrice: 3200000,
    paymentMethod: "bank_transfer",
    paymentStatus: "PENDING",
    contactInfo: {
      fullName: "Trần Thị B",
      email: "user2@example.com",
      phone: "0912345678",
      address: "789 User Avenue, Hanoi"
    },
    specialRequests: ["Single room"],
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15")
  }
];

db.bookings.insertMany(bookings);

print(`Inserted ${bookings.length} bookings successfully`);
}

// Tạo sample reviews (sau khi insert users để có _id)
if (userList && userList.length >= 3 && destinationList && destinationList.length >= 15) {
const reviews = [
  {
    userId: userList[1]._id,
    destinationId: destinationList[0]._id, // Paris
    userName: "Nguyễn Văn A",
    userAvatar: userList[1].avatar,
    rating: 5,
    comment: "Chuyến đi tuyệt vời! Paris thật sự là thành phố của tình yêu. Tháp Eiffel ban đêm rất đẹp, ẩm thực Pháp ngon tuyệt. Sẽ quay lại lần nữa!",
    images: ["https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop"],
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20")
  },
  {
    userId: userList[1]._id,
    destinationId: destinationList[7]._id, // Tokyo
    userName: "Nguyễn Văn A",
    userAvatar: userList[1].avatar,
    rating: 4,
    comment: "Tokyo rất hiện đại và sạch sẽ. Ẩm thực Nhật tuyệt vời, người dân thân thiện. Chỉ có điều hơi đắt so với Việt Nam.",
    images: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop"],
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15")
  },
  {
    userId: userList[2]._id,
    destinationId: destinationList[14]._id, // Bali
    userName: "Trần Thị B",
    userAvatar: userList[2].avatar,
    rating: 5,
    comment: "Bali là thiên đường! Những bãi biển tuyệt đẹp, văn hóa Hindu độc đáo. Ubud rất yên bình, phù hợp để thư giãn.",
    images: ["https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop"],
    createdAt: new Date("2024-08-10"),
    updatedAt: new Date("2024-08-10")
  }
];

db.reviews.insertMany(reviews);

print(`Inserted ${reviews.length} reviews successfully`);
}

// Tạo sample favorites
if (userList && userList.length >= 3 && destinationList && destinationList.length >= 15) {
const favorites = [
  {
    userId: userList[1]._id,
    destinationId: destinationList[0]._id, // Paris
    createdAt: new Date("2024-09-01")
  },
  {
    userId: userList[1]._id,
    destinationId: destinationList[7]._id, // Tokyo
    createdAt: new Date("2024-09-15")
  },
  {
    userId: userList[1]._id,
    destinationId: destinationList[14]._id, // Bali
    createdAt: new Date("2024-08-10")
  },
  {
    userId: userList[2]._id,
    destinationId: destinationList[1]._id, // Rome
    createdAt: new Date("2024-10-01")
  },
  {
    userId: userList[2]._id,
    destinationId: destinationList[14]._id, // Bali
    createdAt: new Date("2024-08-15")
  }
];

db.favorites.insertMany(favorites);

print(`Inserted ${favorites.length} favorites successfully`);
}

print('=== DATABASE SETUP COMPLETED ===');
print(`Total Destinations: ${destinations.length}`);
print(`Total Users: ${users.length}`);
print(`Total Bookings: 2`);
print(`Total Reviews: 3`);
print(`Total Favorites: 5`);

print('\n=== SAMPLE DATA SUMMARY ===');
print('Destinations by Category:');
print(`- Cultural: ${destinations.filter(d => d.category === 'Cultural').length}`);
print(`- Beach: ${destinations.filter(d => d.category === 'Beach').length}`);
print(`- Luxury: ${destinations.filter(d => d.category === 'Luxury').length}`);
print(`- Nature: ${destinations.filter(d => d.category === 'Nature').length}`);
print(`- Entertainment: ${destinations.filter(d => d.category === 'Entertainment').length}`);

print('\nDestinations by Region:');
print(`- Europe: ${destinations.filter(d => ['France', 'Italy', 'Spain', 'Netherlands', 'Czech Republic', 'Greece'].includes(d.country)).length}`);
print(`- Asia: ${destinations.filter(d => ['Japan', 'South Korea', 'Thailand', 'Singapore', 'Hong Kong'].includes(d.country)).length}`);
print(`- Southeast Asia: ${destinations.filter(d => ['Indonesia', 'Vietnam'].includes(d.country)).length}`);
print(`- Americas: ${destinations.filter(d => ['United States'].includes(d.country)).length}`);
print(`- Middle East: ${destinations.filter(d => ['United Arab Emirates'].includes(d.country)).length}`);
print(`- Oceania: ${destinations.filter(d => ['Australia'].includes(d.country)).length}`);
print(`- Africa: ${destinations.filter(d => ['South Africa', 'Morocco'].includes(d.country)).length}`);

print('\nYou can now test the APIs with this comprehensive dataset!');
print('Access Swagger UI: http://localhost:8080/api/swagger-ui.html');
print('Test endpoints:');
print('- GET /api/destinations');
print('- GET /api/destinations/featured');
print('- GET /api/destinations/popular');
print('- GET /api/destinations/search?query=Paris');
print('- POST /api/auth/login');
