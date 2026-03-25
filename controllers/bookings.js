const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const ExpressError = require("../utils/ExpressError.js");
const { parseDateOnly, getNightCount, hasDateConflict } = require("../utils/bookingUtils.js");

module.exports.createBooking = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("bookings");

    if (!listing) {
        throw new ExpressError(404, "Listing not found.");
    }

    if (listing.owner && listing.owner.equals(req.user._id)) {
        req.flash("error", "You can't book your own HomeNook.");
        return res.redirect(`/listings/${listing._id}`);
    }

    const checkIn = parseDateOnly(req.body.booking.checkIn);
    const checkOut = parseDateOnly(req.body.booking.checkOut);
    const today = parseDateOnly(new Date().toISOString().split("T")[0]);

    if (!checkIn || !checkOut) {
        throw new ExpressError(400, "Please select valid booking dates.");
    }

    if (checkIn < today) {
        req.flash("error", "Check-in date cannot be in the past.");
        return res.redirect(`/listings/${listing._id}`);
    }

    if (hasDateConflict(listing.bookings, checkIn, checkOut)) {
        req.flash("error", "Those dates are already booked. Please choose another slot.");
        return res.redirect(`/listings/${listing._id}`);
    }

    const totalNights = getNightCount(checkIn, checkOut);
    const totalPrice = totalNights * listing.price;

    const newBooking = new Booking({
        listing: listing._id,
        guest: req.user._id,
        checkIn,
        checkOut,
        guests: req.body.booking.guests,
        totalPrice,
    });

    listing.bookings.push(newBooking);

    await newBooking.save();
    await listing.save();

    req.flash("success", "Booking confirmed successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.cancelBooking = async (req, res) => {
    const { id, bookingId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { bookings: bookingId } });
    await Booking.findByIdAndDelete(bookingId);

    req.flash("success", "Booking cancelled successfully!");
    res.redirect(`/listings/${id}`);
};
