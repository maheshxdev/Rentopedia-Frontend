// src/pages/ProductDetail.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../context/UserData";
import { ArrowRight, Eye, Star } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  // Rent request states
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [rentDays, setRentDays] = useState(1);
  const [requestLoading, setRequestLoading] = useState(false);
  const [optimisticPending, setOptimisticPending] = useState(false);

  const isOwner = user?.username === product?.ownerUserID;
  const myRequest = useMemo(() => {
    if (!product?.rentRequests || !user?.username) return null;
    return product.rentRequests.find((r) => r.requester === user.username) || null;
  }, [product?.rentRequests, user?.username]);

  const hasPendingForUser = useMemo(() => {
    if (optimisticPending) return true;
    if (!product?.rentRequests || !user?.username) return false;
    return product.rentRequests.some((r) => r.requester === user.username && r.status === "pending");
  }, [product?.rentRequests, user?.username, optimisticPending]);

  // Fetch product from backend
  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/property/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setProduct(data);
      if (data.images && data.images.length > 0) setMainImage(data.images[0]);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Realtime: owner sees incoming requests on the product page
  useEffect(() => {
    const onRentRequest = (payload) => {
      if (
        payload?.productId === id &&
        payload?.ownerUsername === user?.username
      ) {
        toast.info(`New rent request from ${payload.requester}`);
        fetchProduct();
      }
    };
    window.socket?.on("rent-request", onRentRequest);
    return () => {
      window.socket?.off("rent-request", onRentRequest);
    };
  }, [id, user?.username]);

  // Total rent calculation
  const totalRent = rentDays * product?.price + product?.deposit;

  // Send rent request
  const handleRentRequest = async () => {
    if (!rentDays || rentDays < 1) return toast.error("Enter valid days!");
    try {
      setRequestLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/property/${id}/rent-request`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days: rentDays, totalAmount: totalRent }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      toast.success("Rent request sent!");
      setShowRequestForm(false);
      setOptimisticPending(true);
      fetchProduct();

      // Notify owner via socket
      window.socket?.emit("rent-request-sent", {
        ownerUsername: product.ownerUserID,
        requester: user.username,
        productId: id,
        days: rentDays,
        totalAmount: totalRent,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  // Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return toast.warn("Please write a comment!");
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/property/${id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: user?.username || "Anonymous",
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to submit review");
      setNewReview({ rating: 5, comment: "" });
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  // Owner: Accept/Reject rent request
  const handleRequestUpdate = async (requestId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/property/${id}/rent-request/${requestId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      fetchProduct(); // refresh product requests
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const handleRequestAction = async (reqId, action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/property/${id}/rent-request/${reqId}/${action}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success(`Request ${action}ed successfully`);
      fetchProduct(); // refresh product and requests
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error");
    }
  };

  // realtime: notify requester when their request is updated
  useEffect(() => {
    const onUpdated = (payload) => {
      if (payload?.productId === id && payload?.requester === user?.username) {
        toast.info(`Your request was ${payload.status}`);
        fetchProduct();
      }
    };
    window.socket?.on("rent-request-updated", onUpdated);
    return () => {
      window.socket?.off("rent-request-updated", onUpdated);
    };
  }, [id, user?.username]);

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Images */}
        <div>
          <img
            src={mainImage}
            alt={product.title}
            className="w-full sm:h-84 h-42 object-contain rounded-xl shadow-lg"
          />
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === img ? "border-blue-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-2">
            {product.category}{" "}
            {product.subCategory && `> ${product.subCategory}`}
          </p>
          <p className="text-lg font-semibold text-green-600 mb-4">
            ₹{product.price} / {product.rentType}
          </p>
          <p className="text-lg font-semibold text-green-600 mb-4">
            Deposite ₹{product.deposit}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2">📍 {product.location}</p>
          <p className="text-sm flex items-center gap-1 text-gray-500">
            <Eye size={16} /> {product.viewsCount} views
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            {!isOwner && (
              <>
              {product.status !== "available" ? (
                <button
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition"
                >
                  Not Available
                </button>
              ) : hasPendingForUser ? (
                <button
                  disabled
                  className="px-6 py-2 bg-amber-500/80 text-white rounded-lg shadow cursor-not-allowed"
                >
                  Pending Approval
                </button>
              ) : (
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Send Rent Request
                </button>
              )}
                
                {showRequestForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                      <h3 className="text-xl font-semibold mb-4">
                        Send Rent Request
                      </h3>
                      <label className="block mb-2">
                        Number of {product.rentType}:
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={rentDays}
                        onChange={(e) => setRentDays(Number(e.target.value))}
                        className="w-full border p-2 rounded mb-4"
                      />
                      <p className="mb-4">Total Amount: ₹{totalRent}</p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowRequestForm(false)}
                          className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRentRequest}
                          disabled={requestLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {requestLoading ? "Sending..." : "Send Request"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100 transition"
            >
              Back <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Rent Requests (only for owner) */}
      {user.username === product.ownerUserID && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Rent Requests</h2>
            <button
              onClick={fetchProduct}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            >
              Refresh
            </button>
          </div>
          {product.rentRequests?.length > 0 ? (
            product.rentRequests.map((r) => (
              <div
                key={r._id}
                className="flex justify-between items-center p-4 border rounded mb-2"
              >
                <p>
                  {r.requester} requested {r.days} days — ₹{r.totalAmount}
                </p>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAction(r._id, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(r._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
                <p>Status: {r.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No requests yet.</p>
          )}
        </div>
      )}

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {product.reviews?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {rev.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {rev.username}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-yellow-400"
                          fill="gold"
                          stroke="gold"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        )}

        {/* Add Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-10 bg-gradient-to-br from-white to-gray-50 border rounded-2xl shadow-lg p-6 md:p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            ✨ Share Your Experience
          </h3>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setNewReview({ ...newReview, rating: r })}
                className="focus:outline-none transform transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`${
                    newReview.rating >= r ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={newReview.rating >= r ? "gold" : "none"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            rows="4"
            className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            placeholder="Write your honest review..."
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
