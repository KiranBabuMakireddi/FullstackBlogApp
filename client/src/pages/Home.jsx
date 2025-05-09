import { Link } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';

// Lazy load components
const PostCard = lazy(() => import('../components/PostCard'));

// Loading spinner
const LoadingIndicator = () => (
  <div
    className="w-8 h-8 border-4 border-t-4 border-gray-300 dark:border-gray-600 rounded-full animate-spin"
    role="status"
    aria-label="Loading"
  ></div>
);

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col gap-6 p-6 sm:p-10 px-3 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold lg:text-6xl pt-10 text-gray-800 dark:text-white text-center">
          Welcome to my Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed text-center">
          Welcome to my blog! Here you'll find a wide range of articles, tutorials, and resources designed
          to help you grow as a developer. Whether you're interested in web development, software engineering,
          programming languages, or best practices in the tech industry, there's something here for everyone.
          Dive in and explore the content to expand your knowledge and skills.
        </p>
        <Link
          to="/search"
          className="text-sm sm:text-base text-teal-600 dark:text-teal-400 font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none w-max mx-auto"
        >
          View all posts
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-10">
        {posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              Recent Posts
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {posts.map((post) => (
                <Suspense key={post._id} fallback={<LoadingIndicator />}>
                  <PostCard post={post} />
                </Suspense>
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-600 dark:text-teal-400 hover:underline text-center font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none w-max mx-auto"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
