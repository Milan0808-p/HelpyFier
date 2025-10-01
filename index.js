require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Listing = require("./model/listingModel");
const Provider = require("./model/ProviderModel");
const User = require("./model/UserModel");
const app = express();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URL;
const Booking = require("./model/BookingModel");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database is Connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });


let  isConnected = false;

async function connectToMongoDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    isConnected = true;
    console.log("Database is Connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

app.use((req, res, next) => {
  if(!isConnected){
    connectToMongoDB();
  }
  next();
});

// app.get("/",async(req,res)=>{
//   let TempListings =[{
//     name: 'Plumber',
//     icon: 'https://img.icons8.com/ios-filled/100/plumber.png',
//     desc: 'Expert plumbing solutions for your home and office.',
//     price:"1000",
//   },
//   {
//     name: 'Electrician',
//     icon: 'https://img.icons8.com/ios-filled/100/electricity.png',
//     desc: 'Certified electricians for all electrical needs.',
//     price:"1500",
//   },
//   {
//     name: 'Home Tutor',
//     icon: 'https://img.icons8.com/ios-filled/100/classroom.png',
//     desc: 'Qualified tutors for all subjects and grades.',
//     price:"1500",
//   },
//   {
//     name: 'Beautician',
//     icon: 'https://img.icons8.com/ios-filled/100/makeup-brush.png',
//     desc: 'Beauty and grooming services at your doorstep.',
//     price:"3000",
//   },
//   {
//     name: 'Car Service',
//     icon: 'https://img.icons8.com/ios-filled/100/car-service.png',
//     desc: 'Professional car maintenance and repair.',
//     price:"5000",
//   },
//   {
//     name: 'Electric Device Repair',
//     icon: 'https://img.icons8.com/ios-filled/100/appliances.png',
//     desc: 'Repair services for all your electronic devices.',
//     price:"800",
//   },
//   {
//     name: 'Online Work',
//     icon: 'https://img.icons8.com/ios-filled/100/online-support.png',
//     desc: 'Banking, online form filling, and digital assistance.',
//     price:"200",
//   },
//   {
//     name: "Boys Hair Saloon",
//     icon: "https://img.icons8.com/ios-filled/100/barber-scissors.png",
//     desc: "Trendy haircuts and grooming for boys at home.",
//     price:"400",
//   },
//   {
//     name: "Home Massage",
//     icon: "https://img.icons8.com/ios-filled/100/spa.png",
//     desc: "Relaxing and professional massage services at your home.",
//     price:"1500",
//   },
//   ];

//   try {
//     // Insert all listings at once
//     await Listing.insertMany(TempListings);
//     res.send("Temporary listings added to the database");
//   } catch (error) {
//     res.status(500).send("Error inserting listings: " + error.message);
//   }
// });

//adding new listing to database

app.post("/add-listing", async (req, res) => {
  const newListing = new Listing(req.body);
  try {
    await newListing.save();
    res.status(201).send("New listing added to the database");
  } catch (error) {
    res.status(500).send("Error inserting listings: " + error.message);
  }
});



//NEW: GET endpoint to fetch a single listing by its ID
app.get("/services/:id", async (req, res) => {
  try {
    // Extract the ID from the URL parameters
    const serviceId = req.params.id;

    const service = await Listing.findById(serviceId);

    // Mongoose findById returns null if no document is found
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Mongoose returns the document directly; no need for .data()
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service: ", error);
    // This handles cases where the ID is malformed
    res.status(500).json({ message: "Failed to retrieve service details." });
  }
});

//fetching all data from database
app.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (error) {
    res.status(500).send("Error fetching listings: " + error.message);
  }
});

// NEW: PATCH endpoint to update a service by ID
app.patch("/services/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const updatedFields = req.body;

    // Use findByIdAndUpdate to find the document by ID and apply the updates
    const service = await Listing.findByIdAndUpdate(serviceId, updatedFields, {
      new: true, // Returns the updated document
      runValidators: true, // Runs schema validators on update
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error updating service: ", error);
    res
      .status(500)
      .json({ message: "Failed to update service.", error: error.message });
  }
});

// DELETE endpoint to delete a listing by its ID
app.delete("/services/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const deletedService = await Listing.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error deleting service: ", error);
    res.status(500).json({ message: "Failed to delete service." });
  }
});

// NEW: User registration endpoint
app.post("/api/register", async (req, res) => {
  const { email, Name, address, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      name: Name, // <- Mongoose receives the correct value from the 'Name' variable
      address,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({ message: "Failed to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    // First, check the regular user collection
    user = await User.findOne({ email });

    // If no user is found, check the provider collection
    if (!user) {
      user = await Provider.findOne({ email });
    }

    // If no user or provider is found, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Login successful - send back user data including the role
    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Send the role back to the frontend
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// NEW: POST endpoint for provider registration
app.post("/api/provider/register", async (req, res) => {
  try {
    const { name, email, address, password, servicesOffered, availability } =
      req.body;

    // Check if a provider with this email already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res
        .status(409)
        .json({ message: "A provider with this email already exists." });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new provider
    const newProvider = new Provider({
      name,
      email,
      address,
      password: hashedPassword,
      servicesOffered,
      availability,
      role: "provider", // Automatically set the role
    });

    await newProvider.save();

    res.status(201).json({ message: "Provider registered successfully!" });
  } catch (error) {
    console.error("Provider registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// NEW: Get all services from a specific provider
app.get("/api/provider/services/:id", async (req, res) => {
  try {
    const providerId = req.params.id;
    // Find all listings where the providerId matches the one from the URL
    const services = await Listing.find({ providerId: providerId });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this provider" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching provider services:", error);
    res.status(500).json({ message: "Failed to fetch provider services" });
  }
});

//user booking route
app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, serviceId, providerId, userName, userEmail, serviceDate, serviceTime, address, notes } = req.body;

        if (!userId || !serviceId || !providerId || !userName || !userEmail || !serviceDate || !serviceTime || !address) {
            return res.status(400).json({ message: 'All required booking fields must be provided.' });
        }

        const newBooking = new Booking({
            userId,
            serviceId,
            providerId,
            userName,
            userEmail,
            serviceDate,
            serviceTime,
            address,
            notes,
            status: 'pending'
        });

        await newBooking.save();

        // FIX: Find the provider and add the new booking's ID to their bookings array
        await Provider.findByIdAndUpdate(
            providerId,
            { $push: { bookings: newBooking._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json({ message: 'Booking request sent successfully!', bookingId: newBooking._id });

    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ message: 'Booking failed. Please try again.' });
    }
});

//featch data from booking 
app.get('/api/user/bookings/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const bookings = await Booking.find({ userId: userId });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: 'Failed to retrieve user bookings.' });
    }
});

// Provider dashboard data
app.get("/api/provider/dashboard/:id", async (req, res) => {
  try {
    const providerId = req.params.id;
    console.log("GET /api/provider/dashboard id =", providerId);

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid provider id" });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // ✅ Populate user and service info in bookings
    const bookings = await Booking.find({ providerId })
      .populate({ path: "userId", model: "User", select: "name email" })
      .populate({ path: "serviceId", model: "Listing", select: "name price desc" });

    res.json({
      providerName: provider.name,
      totalRevenue: provider.totalRevenue || 0,
      bookings: bookings || []
    });
  } catch (error) {
    console.error("Error fetching provider dashboard:", error);
    res.status(500).json({ message: "Error fetching dashboard", error: error.message });
  }
});

// // booking acceptance route for provider
// Example Express route
app.put("/api/bookings/:id/accept", async (req, res) => {
  const bookingId = req.params.id;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: "confirmed" },
    { new: true }
  );
  res.json(booking);
});

// booking rejection route for provider
app.put("/api/bookings/:id/reject", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Complete booking route for provider
app.put("/api/bookings/:id/complete", async (req, res) => {
  console.log("--- Starting /api/bookings/:id/complete ---");
  const bookingId = req.params.id;
  console.log(`[1] Received request for bookingId: ${bookingId}`);

  try {
    // 1. Find booking and populate its service data
    const booking = await Booking.findById(bookingId).populate("serviceId");

    if (!booking) {
      console.log(`[FAIL] Booking not found for ID: ${bookingId}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log("[2] Successfully found booking.");

    // ✨ FIX ADDED HERE: Check for data integrity after population
    if (!booking.serviceId) {
      console.log(`[FAIL] Data integrity error: Booking ${bookingId} references a non-existent service.`);
      // Do NOT complete the booking. Return a server error.
      return res.status(500).json({ message: "Booking cannot be completed: associated service not found." });
    }

    // 2. Check for providerId
    if (!booking.providerId) {
      console.log(`[FAIL] Booking ${bookingId} is missing a providerId.`);
      return res.status(500).json({ message: "Data integrity error: Booking has no provider." });
    }
    console.log(`[3] Booking has providerId: ${booking.providerId}`);

    // 3. Update booking status
    booking.status = "completed";
    await booking.save();
    console.log("[4] Booking status updated to 'completed' and saved.");

    // 4. Find the provider
    const provider = await Provider.findById(booking.providerId);
    if (!provider) {
      console.log(`[FAIL] Provider not found for ID: ${booking.providerId}`);
      // This case is tricky. The booking is complete, but we can't update revenue.
      // This indicates another data integrity issue.
      return res.status(404).json({ message: "Booking completed, but associated provider not found." });
    }
    console.log(`[5] Successfully found provider: ${provider.name}`);

    // 5. Calculate price and update revenue (now guaranteed to have serviceId)
    const priceToAdd = booking.serviceId.price; // No need for ternary now
    console.log(`[6] Price to add is: ${priceToAdd}. Current revenue: ${provider.totalRevenue}`);

    provider.totalRevenue = (provider.totalRevenue || 0) + priceToAdd;
    await provider.save();
    console.log(`[7] Provider revenue updated. New total: ${provider.totalRevenue}`);

    // 6. Send successful response
    console.log("--- Request successful ---");
    res.status(200).json({
      message: "Booking completed and revenue updated successfully",
      booking: booking,
      totalRevenue: provider.totalRevenue,
    });

  } catch (err) {
    console.error("--- 🚨 An error occurred! ---");
    console.error(`[CRASH] The process failed after the last successful log number.`);
    console.error("Error completing booking:", err.message);
    console.error("Stack Trace:", err.stack);
    res.status(500).json({ message: "Server error occurred while completing booking." });
  }
});

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
module.exports = app;