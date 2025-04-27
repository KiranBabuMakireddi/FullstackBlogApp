import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load Phosphor icon
const ArrowRight = lazy(() => import('phosphor-react/src/icons/ArrowRight'));

// Fallback if needed
const IconFallback = () => null;

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all mx-auto shadow-sm dark:shadow-md">
      <Link to={`/post/${post.slug}`} aria-label={`Read more about ${post.title}`}>
        <img
          src={post.image}
          alt={post.title || 'Post cover image'}
          className="h-[260px] w-auto object-cover group-hover:h-[200px] transition-all duration-300 ease-in-out z-10"
        />
      </Link>

      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2 text-gray-800 dark:text-gray-200">
          {post.title}
        </p>
        <span className="italic text-sm text-gray-600 dark:text-gray-400">{post.category}</span>

        <Link
          to={`/post/${post.slug}`}
          className="absolute bottom-[-200px] left-0 right-0 m-2 py-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white rounded-md rounded-tl-none text-center transition-all duration-300 group-hover:bottom-0 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
          aria-label={`Read the full article: ${post.title}`}
        >
          <div className="flex items-center justify-center gap-1">
            Read Article
            <Suspense fallback={<IconFallback />}>
              <ArrowRight size={20} weight="bold" />
            </Suspense>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
