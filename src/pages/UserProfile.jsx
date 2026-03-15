import { data, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { CgProfile } from "react-icons/cg";

const UserProfile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${username}`,
          {
            withCredentials: true, // ✅ boolean, not string
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const getProfileImage = (profileImage) => {
    if (!profileImage || !profileImage.data) return null;

    const binary = new Uint8Array(profileImage.data.data); // profileImage.data is an object from MongoDB
    let binaryStr = "";
    binary.forEach((b) => (binaryStr += String.fromCharCode(b)));
    return `data:${profileImage.contentType};base64,${btoa(binaryStr)}`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">User not found</p>;

  const { user, products } = profile;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* User Info Card */}
      <div className="flex items-center gap-6 bg-white shadow-lg rounded-xl p-6 mb-8 flex-col sm:flex-row">
        {user[0].profileImage ? (
          <img
            src={getProfileImage(user[0].profileImage)}
            alt={user[0].username}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <CgProfile className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
        )}

        <div>
          <h2 className="text-2xl font-bold">{user[0].username}</h2>
          <p className="text-gray-600">{user[0].name || "No name provided"}</p>
          <p className="text-sm text-gray-500">{user[0].email}</p>
        </div>
      </div>

      {/* User Products */}
      <h3 className="text-xl font-semibold mb-4">
        Products by {user[0].username}
      </h3>
      {/* User Stats */}
      <div className="flex gap-6 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg shadow text-center flex-1">
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow text-center flex-1">
          <p className="text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">
            {products.reduce((acc, p) => acc + (p.viewsCount || 0), 0)}
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              product={{
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                location: product.location,
                thumbnail:
                  product.images?.[0] ||
                  "https://source.unsplash.com/400x300/?rental",
                ownerUserID: product.ownerUserID,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products listed by this user.</p>
      )}
    </div>
  );
};

export default UserProfile;
