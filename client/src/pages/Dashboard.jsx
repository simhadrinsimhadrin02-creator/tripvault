import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("");
    const [editingTrip, setEditingTrip] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(userResponse.data.user);

                const tripsResponse = await axios.get(
                    "http://localhost:5000/api/trips",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTrips(tripsResponse.data.trips);

            } catch (error) {
                setMessage("Unable to load your trips");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);
    const handleCreateTrip = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            "http://localhost:5000/api/trips",
            {
                title,
                destination,
                startDate,
                endDate,
                description,
                rating: Number(rating)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTrips([response.data.trip, ...trips]);

        setTitle("");
        setDestination("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        setRating("");

        setMessage("Trip created successfully!");

    } catch (error) {
        setMessage(
            error.response?.data?.message || "Failed to create trip"
        );
    }
};
const handleUpdateTrip = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.put(
            `http://localhost:5000/api/trips/${editingTrip._id}`,
            {
                title,
                destination,
                startDate,
                endDate,
                description,
                rating: Number(rating)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTrips(
            trips.map((trip) =>
                trip._id === editingTrip._id
                    ? response.data.trip
                    : trip
            )
        );

        setEditingTrip(null);

        setTitle("");
        setDestination("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        setRating("");

        setMessage("Trip updated successfully!");

    } catch (error) {
        setMessage(
            error.response?.data?.message || "Failed to update trip"
        );
    }
};
const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await axios.delete(
            `http://localhost:5000/api/trips/${tripId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTrips(
            trips.filter((trip) => trip._id !== tripId)
        );

        setMessage("Trip deleted successfully!");

    } catch (error) {
        setMessage(
            error.response?.data?.message || "Failed to delete trip"
        );
    }
};
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>TripVault Dashboard</h1>

            {user && (
                <>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>
                </>
            )}

            <hr />

            <h2>My Trips</h2>
            <h3>Create a New Trip</h3>

<form onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}>
    <div>
        <label>Trip Title</label>
        <br />
        <input
    type="text"
    placeholder="Enter trip title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
/>
    </div>

    <br />

    <div>
        <label>Destination</label>
        <br />
        <input
    type="text"
    placeholder="Enter destination"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
/>
    </div>

    <br />

    <div>
        <label>Start Date</label>
        <br />
        <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
/>
    </div>

    <br />

    <div>
        <label>End Date</label>
        <br />
        <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
/>
    </div>

    <br />

    <div>
        <label>Description</label>
        <br />
       <textarea
    placeholder="Enter trip description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
></textarea>
    </div>

    <br />

    <div>
        <label>Rating</label>
        <br />
        <input
    type="number"
    min="1"
    max="5"
    placeholder="1 to 5"
    value={rating}
    onChange={(e) => setRating(e.target.value)}
/>
    </div>

    <br />

    <button type="submit">
    {editingTrip ? "Update Trip" : "Create Trip"}
</button>
</form>

<hr />

            {message && <p>{message}</p>}

            {trips.length === 0 ? (
                <p>You don't have any trips yet. Create your first trip!</p>
            ) : (
                trips.map((trip) => (
                    <div key={trip._id}>
                        <h3>{trip.title}</h3>

                        <p>
                            <strong>Destination:</strong> {trip.destination}
                        </p>

                        <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(trip.startDate).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(trip.endDate).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>Rating:</strong> ⭐ {trip.rating}/5
                        </p>
                         <button
    onClick={() => {
        setEditingTrip(trip);
        setTitle(trip.title);
        setDestination(trip.destination);
        setStartDate(trip.startDate ? trip.startDate.split("T")[0] : "");
        setEndDate(trip.endDate ? trip.endDate.split("T")[0] : "");
        setDescription(trip.description || "");
        setRating(trip.rating || "");
    }}
>
    Edit
</button>
<button
    onClick={() => handleDeleteTrip(trip._id)}
    style={{ marginLeft: "10px" }}
>
    Delete
</button>
                        <hr />
                    </div>
                ))
            )}

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;