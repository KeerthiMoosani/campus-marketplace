const express = require("express");

const {
    createListing,
    getListings,
    updateListing,
    deleteListing,
    markAsSold,
    getAllListingsAdmin,
    removeListingAdmin
} = require("../controllers/listingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
    "/admin/all",
    protect,
    authorizeRoles("ADMIN"),
    getAllListingsAdmin
);

router.patch(
    "/admin/:id/remove",
    protect,
    authorizeRoles("ADMIN"),
    removeListingAdmin
);

router.post("/", protect, createListing);
router.get("/", protect, getListings);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);
router.patch("/:id/sold", protect, markAsSold);

module.exports = router;