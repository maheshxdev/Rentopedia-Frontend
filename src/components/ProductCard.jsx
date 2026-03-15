import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="relative group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300">
      {/* Category Badge */}
      {product?.category && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md">
            {product.category}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-[180px] md:h-[220px] w-full overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4 text-center space-y-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
          {product.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-1">{product.location}</p>

        <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          ₹{product.price}
          <span className="text-xs text-gray-500 font-normal"> / day</span>
        </div>

        {product?.ownerUserID && (
          <p className="text-[12px] text-gray-600">
            👤{" "}
            <span className="font-medium text-indigo-700">
              <Link to={`/user/${product.ownerUserID}`}>
                {product.ownerUserID}
              </Link>
            </span>
          </p>
        )}

        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full mt-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span>View Details</span>
          <ArrowRight
            size={16}
            className="transform group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
