import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const MagnifyingGlass = lazy(() =>
    import("phosphor-react").then((m) => ({ default: m.MagnifyingGlass }))
  );

const PostCard = lazy(() => import('../components/PostCard'));

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      }));
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    setPosts((prev) => [...prev, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="p-7 border-b md:border-r md:min-h-screen border-gray-300 dark:border-gray-700 w-full md:w-1/3">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="searchTerm" className="font-semibold text-gray-700 dark:text-gray-300">
              Search Term
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
                placeholder="Search..."
                className="w-full p-2.5 pr-10 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <MagnifyingGlass className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </div>

          {/* Sort Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="sort" className="font-semibold text-gray-700 dark:text-gray-300">
              Sort
            </label>
            <select
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="font-semibold text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-md hover:opacity-90 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          >
            Apply Filters
          </button>
        </form>
      </aside>

      {/* Posts Section */}
      <main className="w-full">
        <h1 className="text-3xl font-bold text-center md:text-left text-gray-800 dark:text-white sm:border-b border-gray-300 dark:border-gray-700 p-5">
          Posts Results
        </h1>

        <div className="p-7 flex flex-wrap gap-6 justify-center md:justify-start">
          {!loading && posts.length === 0 && (
            <p className="text-lg text-gray-500 dark:text-gray-400">No posts found.</p>
          )}
          {loading && (
            <p className="text-lg text-gray-500 dark:text-gray-400">Loading...</p>
          )}
          {!loading && posts.map((post) => (
            <Suspense key={post._id} fallback={<p>Loading post...</p>}>
              <PostCard post={post} />
            </Suspense>
          ))}
        </div>

        {showMore && (
          <div className="flex justify-center">
            <button
              onClick={handleShowMore}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline focus:ring-2 focus:ring-teal-500 focus:outline-none py-4"
            >
              Show More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
