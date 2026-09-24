import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/trips/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTrip(response.data.trip);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                        "Failed to load trip"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id, token]);

    // ==========================================
    // LOADING STATE
    // ==========================================
    if (loading) {
        return (
            <>
                <Navbar />

                <div className="page-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading trip details...</p>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    // ==========================================
    // TRIP NOT FOUND
    // ==========================================
    if (!trip) {
        return (
            <>
                <Navbar />

                <main className="page-container">
                    <div className="empty-state">
                        <div className="empty-icon">🧳</div>

                        <h2>Trip not found</h2>

                        <p>
                            {message ||
                                "The trip you are looking for could not be found."}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <div>
            <Navbar />

            <main className="page-container">

                {/* Page Header */}
                <div className="trip-details-header">
                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>{trip.title}</h1>

                    <p className="trip-destination">
                        📍 {trip.destination}
                    </p>
                </div>

                {/* Error Message */}
                {message && (
                    <div className="error-message">
                        {message}
                    </div>
                )}

                {/* Trip Information */}
                <section className="trip-details-card card">

                    <h2>Trip Information</h2>

                    <div className="trip-info-grid">

                        <div className="trip-info-item">
                            <span>📍 Destination</span>
                            <strong>
                                {trip.destination}
                            </strong>
                        </div>

                        <div className="trip-info-item">
                            <span>📅 Start Date</span>
                            <strong>
                                {trip.startDate
                                    ? new Date(
                                          trip.startDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </strong>
                        </div>

                        <div className="trip-info-item">
                            <span>📅 End Date</span>
                            <strong>
                                {trip.endDate
                                    ? new Date(
                                          trip.endDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </strong>
                        </div>

                        <div className="trip-info-item">
                            <span>⭐ Rating</span>
                            <strong>
                                {trip.rating}/5
                            </strong>
                        </div>

                    </div>

                    <div className="trip-description">
                        <h3>Description</h3>

                        <p>
                            {trip.description ||
                                "No description available for this trip."}
                        </p>
                    </div>

                </section>

                {/* Photos */}
                <section className="trip-photos-section">

                    <div className="section-heading">
                        <h2>Trip Photos</h2>

                        <span>
                            {trip.photos
                                ? trip.photos.length
                                : 0}{" "}
                            {trip.photos?.length === 1
                                ? "Photo"
                                : "Photos"}
                        </span>
                    </div>

                    {trip.photos &&
                    trip.photos.length > 0 ? (
                        <div className="photo-grid">

                            {trip.photos.map(
                                (photo, index) => (
                                    <div
                                        className="photo-card"
                                        key={index}
                                    >
                                        <img
                                            src={photo}
                                            alt={`${trip.title} ${
                                                index + 1
                                            }`}
                                        />
                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                📷
                            </div>

                            <h3>No photos yet</h3>

                            <p>
                                No photos have been uploaded
                                for this trip.
                            </p>
                        </div>
                    )}

                </section>

                {/* Bottom Button */}
                <div className="trip-details-actions">
                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    );
}

export default TripDetails;