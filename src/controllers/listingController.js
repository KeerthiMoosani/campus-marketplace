const Listing = require("../models/Listing");

// Create a new listing
const createListing = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;

        if (!title || !description || price === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description, price and category are required"
            });
        }

        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid non-negative number"
            });
        }

        const listing = await Listing.create({
            title,
            description,
            price,
            category,
            seller: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create listing",
            error: error.message
        });
    }
};

// Get active listings with search and filters
const getListings = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;

        const filter = {
            status: "active"
        };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const listings = await Listing.find(filter)
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: listings.length,
            listings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch listings",
            error: error.message
        });
    }
};

// Update own listing
const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category } = req.body;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        // Check ownership
        if (listing.seller.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own listing"
            });
        }

        if (title !== undefined) listing.title = title;
        if (description !== undefined) listing.description = description;
        if (price !== undefined) listing.price = price;
        if (category !== undefined) listing.category = category;

        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update listing",
            error: error.message
        });
    }
};

// Delete own listing
const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        // Check ownership
        if (listing.seller.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own listing"
            });
        }

        await Listing.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete listing",
            error: error.message
        });
    }
};

// Mark own listing as sold
const markAsSold = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        // Check ownership
        if (listing.seller.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only mark your own listing as sold"
            });
        }

        if (listing.status === "sold") {
            return res.status(400).json({
                success: false,
                message: "Listing is already sold"
            });
        }

        if (listing.status === "removed") {
            return res.status(400).json({
                success: false,
                message: "Removed listing cannot be marked as sold"
            });
        }

        listing.status = "sold";

        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing marked as sold",
            listing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark listing as sold",
            error: error.message
        });
    }
};

// Get all listings for admin
const getAllListingsAdmin = async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: listings.length,
            listings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch all listings",
            error: error.message
        });
    }
};

// Remove any listing by admin
const removeListingAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        listing.status = "removed";
        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing removed by admin",
            listing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove listing",
            error: error.message
        });
    }
};

module.exports = {
    createListing,
    getListings,
    updateListing,
    deleteListing,
    markAsSold,
    getAllListingsAdmin,
    removeListingAdmin
};
