const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new trip
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, destination, startDate, endDate, description, rating } = req.body;

        const trip = new Trip({
            title,
            destination,
            startDate,
            endDate,
            description,
            rating,
            user: req.user.userId
        });

        await trip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Get all trips for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const trips = await Trip.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            trips
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Get a single trip
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.status(200).json({
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Update a trip
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const { title, destination, startDate, endDate, description, rating } = req.body;

        trip.title = title;
        trip.destination = destination;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.description = description;
        trip.rating = rating;

        await trip.save();

        res.status(200).json({
            message: "Trip updated successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Delete a trip
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        await Trip.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Trip deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;