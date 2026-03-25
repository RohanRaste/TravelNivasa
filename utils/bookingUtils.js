function parseDateOnly(dateString) {
    if (!dateString || typeof dateString !== "string") return null;

    const parsedDate = new Date(`${dateString}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate;
}

function formatDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

function getNightCount(checkIn, checkOut) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay);
}

function hasDateConflict(existingBookings, checkIn, checkOut, excludeBookingId = null) {
    return existingBookings.some((booking) => {
        if (excludeBookingId && booking._id.toString() === excludeBookingId.toString()) {
            return false;
        }

        if (booking.status === "cancelled") {
            return false;
        }

        return checkIn < booking.checkOut && checkOut > booking.checkIn;
    });
}

module.exports = {
    parseDateOnly,
    formatDate,
    getNightCount,
    hasDateConflict,
};
