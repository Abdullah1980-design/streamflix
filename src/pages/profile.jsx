import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile({ watchlist }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem(
          "streamflix-token"
        );

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(res.data.user);

      } catch (error) {
        console.log(
          "PROFILE ERROR:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("streamflix-token");
          navigate("/login");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page">
        <h1>Loading Profile...</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page">

      <h1 className="page-title">
        👤 My Profile
      </h1>

      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h2>
          {user.name}
        </h2>

        <p>
          📧 {user.email}
        </p>

        <hr />

        <h3>
           Watchlist Items: {watchlist.length}
        </h3>

        <h3>
           Membership: Free
        </h3>

        <Link to="/watchlist">
          <button className="watch-btn">
            View Watchlist
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Profile;