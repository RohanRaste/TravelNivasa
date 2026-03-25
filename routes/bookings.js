const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, validateBooking, isBookingGuest } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.post("/", isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

router.delete("/:bookingId", isLoggedIn, isBookingGuest, wrapAsync(bookingController.cancelBooking));

module.exports = router;
