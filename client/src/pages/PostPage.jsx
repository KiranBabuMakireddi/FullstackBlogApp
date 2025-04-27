import { useEffect, useState, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">Error loading post.</p>
      </div>
    );
  }

  return (
    <main className="w-full m-5 flex flex-col max-w-6xl mx-auto min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl">
      <h1 className="text-3xl p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      {post?.category && (
        <Link
          to={`/search?category=${post.category}`}
          className="self-center mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          aria-label={`View more posts in ${post.category}`}
        >
          <button className="bg-gray-300 text-sm px-4 py-2 rounded-full dark:bg-gray-600 dark:text-white">
            {post.category}
          </button>
        </Link>
      )}
      {post?.image && (
        <img
          src={post.image}
          alt={`Image for post titled ${post.title}`}
          className="mt-3 p-3 max-h-[600px] w-full object-cover rounded-lg"
        />
      )}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <article
        className="p-3 max-w-2xl mx-auto w-full post-content prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />
      <div className="w-full mt-8">
        <CommentSection postId={post._id} />
      </div>

      {/* Recent Articles Section */}
      <section className="flex flex-col justify-center items-center mb-8 px-4 sm:px-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-5 mb-4">
          Recent Articles
        </h2>
        <div className="flex flex-wrap gap-5 mt-5 justify-center w-full">
          {recentPosts.map((recentPost) => (
            <div
              key={recentPost._id}
              className="bg-white p-5 shadow-md rounded-lg dark:bg-gray-800 dark:text-gray-200 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-gray-200 dark:border-gray-600 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <Link
                to={`/post/${recentPost.slug}`}
                onClick={scrollToTop}
                className="block focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                aria-label={`Read article: ${recentPost.title}`}
              >
                <Suspense fallback={<div>Loading post...</div>}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 line-clamp-2">
                    {recentPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-3">
                    {truncateText(stripHtml(recentPost.content))}
                  </p>
                </Suspense>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
