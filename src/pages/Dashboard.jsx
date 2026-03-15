import { useEffect, useState } from "react";
import { useUser } from "../context/UserData";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [userProperties, setUserProperties] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const navigate = useNavigate();
  const fetchAll = async () => {
    try {
      const userPropsRes = await axios.get(
        `https://rentopedia-backend.onrender.com/api/property/owner/${user.username}`,
        { withCredentials: true }
      );
      setUserProperties(userPropsRes.data);

      const [sentRes, recvRes] = await Promise.all([
        axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/sent`, { withCredentials: true }),
        axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true }),
      ]);
      setSentRequests(sentRes.data);
      setReceivedRequests(recvRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load dashboard data");
    }
  };

  // ✅ Verify JWT and fetch user data
  useEffect(() => {
    if (user?.username) {
      fetchAll();
    }

  }, [user?.username]);

  // Realtime updates via socket: refresh lists and show toasts
  useEffect(() => {
    const onRentRequest = (payload) => {
      // owner notification when new request arrives
      if (payload?.ownerUsername === user?.username) {
        toast.info(`New rent request from ${payload.requester}`);
        // refresh received list
        axios
          .get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true })
          .then((res) => setReceivedRequests(res.data))
          .catch(() => {});
      }
    };
    const onRentRequestUpdated = (payload) => {
      // requester notification when owner accepts/rejects/cancels
      if (payload?.requester === user?.username) {
        toast.info(`Your request was ${payload.status}`);
        // refresh sent list
        axios
          .get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/sent`, { withCredentials: true })
          .then((res) => setSentRequests(res.data))
          .catch(() => {});
      } else if (user?.username) {
        // owner-side updates as well
        axios
          .get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true })
          .then((res) => setReceivedRequests(res.data))
          .catch(() => {});
      }
    };
    window.socket?.on("rent-request", onRentRequest);
    window.socket?.on("rent-request-updated", onRentRequestUpdated);
    return () => {
      window.socket?.off("rent-request", onRentRequest);
      window.socket?.off("rent-request-updated", onRentRequestUpdated);
    };
  }, [user?.username]);
  if (!user) {
    return (
      <div className="p-8 text-red-500">
        Unauthorized — Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">
        Welcome to your Dashboard
      </h2>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          👤 Your Info
        </h3>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </div>

      {/* Uploaded Properties */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          🏘️ Your Uploaded Properties
        </h3>
        <div className="mb-4">
          <button
            onClick={fetchAll}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Refresh Requests
          </button>
        </div>

        {userProperties.length === 0 ? (
          <p className="text-gray-500">No properties uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105"
              >
                <FaEdit className="m-2 text-gray-500" />

                {/* Image */}
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      property.images[0] ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={property.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Text Content */}
                <div className="p-4 bg-gradient-to-b from-white via-purple-50 to-purple-100">
                  <h3 className="text-lg font-bold text-purple-800 mb-1 truncate">
                    {property.title}
                  </h3>
                  <p className="text-gray-700 font-semibold mb-1">
                    ₹{property.price}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 truncate">
                    {property.location}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/product/${property._id}`)}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📤 Your Sent Requests</h3>
        {sentRequests.length === 0 ? (
          <p className="text-gray-500">No requests sent yet.</p>
        ) : (
          <div className="space-y-3">
            {sentRequests.map((req) => (
              <div key={req.requestId} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">{req.propertyTitle}</p>
                  <p className="text-sm text-gray-600">Owner: {req.ownerUsername}</p>
                  <p className="text-sm">{req.days} days — ₹{req.totalAmount}</p>
                  <p className="text-sm">Status: {req.status}</p>
                </div>
                {req.status === 'pending' && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.post(
                          `https://rentopedia-backend.onrender.com/api/property/${req.propertyId}/rent-request/${req.requestId}/cancel`,
                          {},
                          { withCredentials: true }
                        );
                        // refresh lists
                        const [sentUpdate, recvUpdate] = await Promise.all([
                          axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/sent`, { withCredentials: true }),
                          axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true }),
                        ]);
                        setSentRequests(sentUpdate.data);
                        setReceivedRequests(recvUpdate.data);
                      } catch (e) {
                        toast.error(e?.response?.data?.message || 'Failed to cancel');
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Received Requests */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📥 Requests for Your Properties</h3>
        {receivedRequests.length === 0 ? (
          <p className="text-gray-500">No incoming requests.</p>
        ) : (
          <div className="space-y-3">
            {receivedRequests.map((req) => (
              <div key={req.requestId} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">{req.propertyTitle}</p>
                  <p className="text-sm text-gray-600">Requester: {req.requester}</p>
                  <p className="text-sm">{req.days} days — ₹{req.totalAmount}</p>
                  <p className="text-sm">Status: {req.status}</p>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(
                            `https://rentopedia-backend.onrender.com/api/property/${req.propertyId}/rent-request/${req.requestId}/accept`,
                            {},
                            { withCredentials: true }
                          );
                          const recvUpdate = await axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true });
                          setReceivedRequests(recvUpdate.data);
                        } catch (e) {
                          toast.error(e?.response?.data?.message || 'Failed to accept');
                        }
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(
                            `https://rentopedia-backend.onrender.com/api/property/${req.propertyId}/rent-request/${req.requestId}/reject`,
                            {},
                            { withCredentials: true }
                          );
                          const recvUpdate = await axios.get(`https://rentopedia-backend.onrender.com/api/property/rent-requests/received`, { withCredentials: true });
                          setReceivedRequests(recvUpdate.data);
                        } catch (e) {
                          toast.error(e?.response?.data?.message || 'Failed to reject');
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
