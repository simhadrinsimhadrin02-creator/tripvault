import { useState } from "react";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    username,
                    email,
                    password
                }
            );

            setMessage(response.data.message);

            setName("");
            setUsername("");
            setEmail("");
            setPassword("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div>
            <h1>TripVault</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Name</label>
                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter your name"
                    />
                </div>

                <br />

                <div>
                    <label>Username</label>
                    <br />

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="Enter a username"
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;