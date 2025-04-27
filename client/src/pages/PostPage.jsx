import { useEffect, useState, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';


export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Fetch the post details based on slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      const res = await fetch(`/api/post/getposts?limit=3`);
      const data = await res.json();
      if (res.ok) {
        setRecentPosts(data.posts);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">Error loading post.</p>
      </div>
    );

  return (
    <main className="w-full m-5 flex flex-col max-w-6xl mx-auto min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
        aria-label={`View more posts in ${post && post.category}`}
      >
        <button className="bg-gray-300 text-sm px-4 py-2 rounded-full dark:bg-gray-600 dark:text-white">
          {post && post.category}
        </button>
      </Link>
      <img
        src={post && post.image}
        alt={`Image for post titled ${post && post.title}`}
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-lg"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div>
        <CommentSection postId={post._id}/>
      </div>

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => (
              <div key={post._id} className="bg-white p-5 shadow-md rounded-lg dark:bg-gray-700 grid dark:text-gray-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                {/* Wrap the post in a Link for redirection */}
                <Link to={`/post/${post.slug}`} onClick={scrollToTop} className="block">
                  <Suspense fallback={<div>Loading post...</div>}>
                    <div className="text-lg font-semibold">{post.title}</div>
                    <div>{post.content}</div>
                  </Suspense>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
