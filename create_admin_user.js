// Create admin user script
db = db.getSiblingDB('travelling_db');

// Clear existing users
db.users.drop();

// Create admin user with plain text password
db.users.insertOne({
  email: 'admin@travelling.com',
  password: 'admin123',
  fullName: 'Admin User',
  phone: '0123456789',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  address: 'Admin Address',
  avatar: null,
  favorites: [],
  bookings: [],
  createdAt: new Date()
});

print('Admin user created successfully');
print('Email: admin@travelling.com');
print('Password: admin123');

