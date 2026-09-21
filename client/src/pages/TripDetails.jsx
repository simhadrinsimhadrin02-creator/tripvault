import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
                            Authorization: `Bearer ${token}`
                        }
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

    if (loading) {
        return <p>Loading trip...</p>;
    }

    if (!trip) {
        return (
            <div>
                <h2>Trip not found</h2>
                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>

            <h1>{trip.title}</h1>

            {message && <p>{message}</p>}

            <p>
                <strong>Destination:</strong>{" "}
                {trip.destination}
            </p>

            <p>
                <strong>Start Date:</strong>{" "}
                {trip.startDate
                    ? new Date(
                        trip.startDate
                    ).toLocaleDateString()
                    : "N/A"}
            </p>

            <p>
                <strong>End Date:</strong>{" "}
                {trip.endDate
                    ? new Date(
                        trip.endDate
                    ).toLocaleDateString()
                    : "N/A"}
            </p>

            <p>
                <strong>Rating:</strong>{" "}
                ⭐ {trip.rating}/5
            </p>

            <p>
                <strong>Description:</strong>{" "}
                {trip.description || "No description"}
            </p>

            <hr />

            <h2>Trip Photos</h2>

            {trip.photos && trip.photos.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: "15px"
                    }}
                >
                    {trip.photos.map((photo, index) => (
                        <div key={index}>
                            <img
                                src={photo}
                                alt={`${trip.title} ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No photos uploaded for this trip.</p>
            )}

            <br />

            <button
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default TripDetails;