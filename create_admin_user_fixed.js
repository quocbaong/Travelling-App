// Create admin user with properly hashed password
db = db.getSiblingDB('travelling_db');

// Clear existing users
db.users.drop();

// Create admin user with plain text password (will be hashed by backend)
db.users.insertOne({
  email: 'admin@travelling.com',
  password: 'admin123', // Plain text - backend will hash this
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

print('Admin user created with plain text password');
print('Email: admin@travelling.com');
print('Password: admin123');
print('Note: Backend will hash the password when user logs in');

