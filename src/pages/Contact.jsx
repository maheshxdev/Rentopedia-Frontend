// src/pages/Contact.jsx

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white shadow mt-6 rounded">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">📩 Contact Us</h2>
      <p className="text-gray-600 mb-6">Have a question or feedback? Let us know below.</p>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          placeholder="Your Message"
          rows="4"
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
