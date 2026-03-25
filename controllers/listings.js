const Listing = require("../models/listing.js");

const filterOptions = [
    { id: "all", label: "All", icon: "fa-solid fa-compass" },
    { id: "omg", label: "OMG!", icon: "fa-regular fa-star" },
    { id: "lakefront", label: "Lakefront", icon: "fa-solid fa-water" },
    { id: "tiny", label: "Tiny homes", icon: "fa-solid fa-house-chimney-window" },
    { id: "trending", label: "Trending", icon: "fa-solid fa-arrow-trend-up" },
    { id: "treehouses", label: "Treehouses", icon: "fa-solid fa-tree-city" },
    { id: "countryside", label: "Countryside", icon: "fa-solid fa-mountain-sun" },
    { id: "historical", label: "Historical homes", icon: "fa-regular fa-building" },
    { id: "beachfront", label: "Beachfront", icon: "fa-solid fa-umbrella-beach" },
    { id: "tropical", label: "Tropical", icon: "fa-solid fa-palm-tree" },
];

function getCategory(listing) {
    const text = `${listing.title} ${listing.description} ${listing.location} ${listing.country}`.toLowerCase();

    if (text.includes("treehouse")) return "treehouses";
    if (text.includes("lake")) return "lakefront";
    if (text.includes("historic") || text.includes("castle") || text.includes("brownstone") || text.includes("canal")) return "historical";
    if (text.includes("beachfront") || text.includes("beach")) return "beachfront";
    if (text.includes("tropical") || text.includes("bali") || text.includes("phuket") || text.includes("fiji") || text.includes("maldives")) return "tropical";
    if (text.includes("cottage") || text.includes("cabin") || text.includes("cotswolds") || text.includes("serengeti") || text.includes("montana")) return "countryside";
    if (text.includes("tiny") || text.includes("compact")) return "tiny";
    if (text.includes("private island") || text.includes("luxury") || text.includes("penthouse")) return "omg";
    return "trending";
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    const listingsWithCategory = allListings.map((listing) => {
        const plainListing = listing.toObject();
        plainListing.category = getCategory(plainListing);
        return plainListing;
    });

    res.render("listings/index.ejs", {
        allListings: listingsWithCategory,
        filterOptions,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        select: "rating comment author",
        populate: {
        path: "author",
        select: "username email",
        },
        })
        .populate("owner", "username email");
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    const listingData = { ...req.body.listing };
    if (typeof listingData.image === "string") {
        listingData.image = {
            filename: "listingimage",
            url: listingData.image,
        };
    }
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listingData = { ...req.body.listing };

    if (typeof listingData.image === "string") {
      listingData.image = {
        filename: "listingimage",
        url: listingData.image,
        };
    }

    await Listing.findByIdAndUpdate(id, listingData);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
