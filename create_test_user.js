// Create test user with properly hashed password
db = db.getSiblingDB('travelling_db');

// Clear existing users
db.users.drop();

// Create test user with BCrypt hash of "test123"
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

print('Test user created with hashed password');
print('Email: test@test.com');
print('Password: test123');
print('Hashed password: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

