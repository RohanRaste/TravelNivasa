🏡 Travel Nivasa – Full Stack Travel Listing & Booking Web Application

 Live Demo: https://travelnivasa.onrender.com


Travel Nivasa is a full-stack web application that allows users to explore travel listings, create their own listings, add reviews, and manage bookings. The application is built using Node.js and Express.js with MongoDB, following MVC architecture for clean and scalable design.

 Features
 User Authentication (Signup/Login)
 Create, Edit, and Delete Listings
 Add and Manage Reviews
 Booking Management System
 Authorization (Only owners can edit/delete)
 Client-side Validation (Bootstrap)
 Server-side Validation (Joi)
 Flash Messages for user feedback
 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: Passport.js
Session Management: express-session, connect-mongo
Frontend: EJS, Bootstrap
Validation: Joi (server-side), Bootstrap (client-side)



#Architecture
Follows MVC (Model-View-Controller) pattern
Modular routing and middleware-based request handling
Centralized error handling


🔁 Request Flow

Client Request → Middleware → Route → Controller → Model (DB) → Response

🚀 Installation & Setup
git clone <your-repo-link>
cd travel-nivasa
npm install
Create a .env file and add:
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_secret_key
Run the project:
npm start
📷 Screenshots (Optional)

Add screenshots here if you want to showcase UI

📌 Future Improvements
Add payment integration
Implement caching for performance
Add advanced search & filters
👨‍💻 Author

Rohan Raste
