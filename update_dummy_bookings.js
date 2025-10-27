// MongoDB script to update dummy bookings
// Run this in MongoDB Compass or mongosh if you want to keep old bookings

// Connect to your database first
// use travelling_app

// Find a real user ID (replace with your actual user ID)
const realUserId = "YOUR_USER_ID_HERE"; // Get this from users collection

// Update all bookings with dummy-user-id
db.bookings.updateMany(
  { userId: "dummy-user-id" },
  { $set: { userId: realUserId } }
);

// Check results
print("Updated bookings:");
print(db.bookings.find({ userId: realUserId }).count());



