import { useState } from 'react';

const SearchBar = ({setSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto px-4 mb-5 mt-[-20px] py-2 bg-transparent rounded-lg"
    >
      <input
        type="text"
        placeholder="Search by title, category, or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
