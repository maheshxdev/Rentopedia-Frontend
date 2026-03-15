import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useUser } from "../context/UserData";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";
import {
  Car,
  Bike,
  Sofa,
  Camera,
  Home as HomeIcon,
  Briefcase,
} from "lucide-react";


const Home = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [load,setLoading]=useState(false);
  

  // Fetch initial data
  useEffect(() => {
    console.log();
    setLoading(true);
    fetch("http://localhost:5000/api/property/all")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        setProducts(data)})
      .catch((err) =>{ console.error("Failed to load products", err)
        setLoading(false)
      });
  }, []);
  
  const filteredProducts =
    search.trim() === ""
      ? products
      : products.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        );

  if(load) { 
    return <svg className="loader" viewBox="25 25 50 50">
  <circle r="20" cy="50" cx="50"></circle>
</svg>
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-center py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold drop-shadow-lg"
        >
          Rent Anything, Anytime, Anywhere 🚀
        </motion.h1>
        <p className="mt-4 text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
          From homes, offices, cars & bikes to furniture, electronics & more —
          all available for rent at your fingertips.
        </p>

        <div className="mt-8 flex justify-center">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Popular Categories */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            Browse by Categories 📂
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { icon: <HomeIcon className="h-8 w-8 text-indigo-600" />, label: "Homes" },
              { icon: <Briefcase className="h-8 w-8 text-purple-600" />, label: "Offices" },
              { icon: <Car className="h-8 w-8 text-pink-500" />, label: "Cars" },
              { icon: <Bike className="h-8 w-8 text-teal-500" />, label: "Bikes" },
              { icon: <Sofa className="h-8 w-8 text-yellow-500" />, label: "Furniture" },
              { icon: <Camera className="h-8 w-8 text-red-500" />, label: "Electronics" },
            ].map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
              >
                {c.icon}
                <p className="mt-2 font-medium text-gray-700">{c.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Rentals */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            Featured Rentals ✨
          </h2>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">
              No rentals available right now
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <ProductCard
                    product={{
                      id: p._id,
                      title: p.title,
                      category: p.category,
                      price: p.price,
                      location: p.location,
                      thumbnail:
                        p.images?.[0],
                      ownerUserID: p.ownerUserID,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            Why Choose Rentopedia?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✅", title: "Verified Listings" },
              { icon: "💰", title: "Affordable Prices" },
              { icon: "🔒", title: "Secure Deals" },
              { icon: "📞", title: "24/7 Support" },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3 font-semibold text-gray-700">{f.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
