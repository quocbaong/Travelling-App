// Test user creation and login
db = db.getSiblingDB('travelling_db');

// Clear existing users
db.users.drop();

// Create test user with plain text password
db.users.insertOne({
  email: 'test@test.com',
  password: 'test123',
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

print('Test user created successfully');
print('Email: test@test.com');
print('Password: test123');
print('Total users:', db.users.countDocuments());

