const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-center py-6 mt-16">
      <h3 className="text-lg font-semibold">Rentopedia — Find Your Perfect Rental</h3>
      <p className="mt-2 text-sm opacity-80">
        Homes • Apartments • PGs • Offices — Rent made simple
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <a href="#" className="hover:underline">About Us</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact</a>
      </div>
      <p className="mt-6 text-xs opacity-60">
        © {new Date().getFullYear()} Rentopedia. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
