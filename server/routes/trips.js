const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/upload");
const cloudinary = require("../middleware/upload").cloudinary;

const router = express.Router();


// ==========================================
// CREATE A NEW TRIP
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            destination,
            startDate,
            endDate,
            description,
            rating
        } = req.body;

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


// ==========================================
// GET ALL TRIPS FOR LOGGED-IN USER
// ==========================================
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


// ==========================================
// UPLOAD PHOTO TO A TRIP
// ==========================================
router.post(
    "/:id/upload",

    // Debug 1
    (req, res, next) => {
        console.log("1. Upload request reached");
        next();
    },

    // Authentication
    authMiddleware,

    // Debug 2
    (req, res, next) => {
        console.log("2. Authentication passed");
        next();
    },

    // Multer
    uploadMiddleware.single("image"),

    // Debug 3
    (req, res, next) => {
        console.log("3. Multer finished");
        console.log(
            "File:",
            req.file ? req.file.originalname : "NO FILE"
        );
        next();
    },

    // Main upload function
    async (req, res) => {
        try {

            // Find trip belonging to logged-in user
            const trip = await Trip.findOne({
                _id: req.params.id,
                user: req.user.userId
            });

            if (!trip) {
                return res.status(404).json({
                    message: "Trip not found"
                });
            }

            // Check file
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload an image"
                });
            }

            console.log("4. Starting Cloudinary upload");

            // Upload image to Cloudinary
            const result = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "tripvault"
                    },

                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                stream.end(req.file.buffer);
            });

            console.log("5. Cloudinary upload completed");

            // Save Cloudinary URL in photos array
            trip.photos.push(result.secure_url);

            // First uploaded image becomes cover image
            if (!trip.coverImage) {
                trip.coverImage = result.secure_url;
            }

            // Save trip
            await trip.save();

            console.log("6. Trip saved successfully");

            res.status(200).json({
                message: "Photo uploaded successfully",
                trip
            });

        } catch (error) {

            console.error("Upload error:", error);

            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
);


// ==========================================
// GET SINGLE TRIP
// ==========================================
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


// ==========================================
// UPDATE A TRIP
// ==========================================
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

        const {
            title,
            destination,
            startDate,
            endDate,
            description,
            rating
        } = req.body;

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


// ==========================================
// DELETE A TRIP
// ==========================================
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