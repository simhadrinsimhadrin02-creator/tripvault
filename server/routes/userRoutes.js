const express = require("express");
const User = require("../models/User");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET PUBLIC USER PROFILE
router.get("/:username/profile", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        }).select("name username bio");

        if (!user) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        const trips = await Trip.find({
            user: user._id
        }).select(
            "title destination startDate endDate rating coverImage"
        );

        res.status(200).json({
            user: {
                name: user.name,
                username: user.username,
                bio: user.bio
            },
            trips
        });
    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
// UPDATE MY PROFILE
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { bio } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.bio = bio || "";

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                username: user.username,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;