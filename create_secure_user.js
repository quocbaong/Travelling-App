// Create user with properly hashed password
db = db.getSiblingDB('travelling_db');

// Clear existing users
db.users.drop();

// Create user with hashed password (BCrypt hash of "test123")
// This is what the backend will create when user registers
db.users.insertOne({
  email: 'test@test.com',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // BCrypt hash of "test123"
  fullName: 'Test User',
  phone: '0123456789',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  address: 'Test Address',
  avatar: null,
  favorites: [],
  bookings: [],
  createdAt: new Date()
});

print('Secure user created with hashed password');
print('Email: test@test.com');
print('Password: test123 (will be hashed by backend)');
print('Database password: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

