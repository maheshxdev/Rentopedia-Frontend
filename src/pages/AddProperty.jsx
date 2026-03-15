import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserData";
import axios from "axios";

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    subCategory: "",
    description: "",
    location: "",
    images: "",
    deposit: "",
    rentType: "monthly",
    condition: "good",
    status: "available",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("deposit", form.deposit);
    formData.append("rentType", form.rentType);
    formData.append("condition", form.condition);

    // Append multiple images
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }

    const res = await axios.post(
      "https://rentopedia-backend.onrender.com/api/property/add",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert("Property added successfully!");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
        "Failed to add property. Please try again."
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🚀 Add Your Item / Property
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="e.g. Honda Activa 2019, 2BHK Flat in Pune"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter price"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="e.g. Vehicles, Furniture, Electronics"
              required
            />
          </div>

          {/* SubCategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub Category
            </label>
            <input
              type="text"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="e.g. Scooter, Chair, Laptop"
            />
          </div>

          {/* Rent Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rent Type
            </label>
            <select
              name="rentType"
              value={form.rentType}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="used">Used</option>
            </select>
          </div>

          {/* Deposit */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deposit (₹)
            </label>
            <input
              type="number"
              name="deposit"
              value={form.deposit}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter security deposit (if any)"
            />
          </div>

          {/* Location */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter item location"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Write about your item/property..."
            />
          </div>

          {/* Images */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              onChange={(e) => setForm({ ...form, images: e.target.files })}
              multiple
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Add Item 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
