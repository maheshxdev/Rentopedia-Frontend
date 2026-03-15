// src/layout/MainLayout.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] px-4 py-6 mt-10">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
