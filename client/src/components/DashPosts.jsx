import { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Lazy load Phosphor icons
const TrashSimple = lazy(() => import('phosphor-react').then(m => ({ default: m.TrashSimple })));
const PencilSimple = lazy(() => import('phosphor-react').then(m => ({ default: m.PencilSimple })));
const WarningCircle = lazy(() => import('phosphor-react').then(m => ({ default: m.WarningCircle })));

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="overflow-x-auto w-full p-4 md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <table className="w-full table-auto rounded-lg overflow-hidden shadow-lg border dark:border-slate-700">
            <thead className="bg-slate-200 dark:bg-blue-600 text-slate-700 dark:text-slate-200">
              <tr>
                {['Date updated', 'Post image', 'Post title', 'Category', 'Delete', 'Edit'].map((head) => (
                  <th key={head} className="p-3 text-left text-sm uppercase tracking-wide">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {userPosts.map((post) => (
                <tr
                  key={post._id}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="p-3 text-sm text-blue-600">{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link to={`/post/${post.slug}`} aria-label={`View ${post.title}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-12 object-cover rounded-md border dark:border-slate-700"
                      />
                    </Link>
                  </td>
                  <td className="p-3">
                    <Link
                      className="font-semibold text-slate-800 dark:text-slate-100 hover:underline"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-3 capitalize text-slate-600 dark:text-slate-400">{post.category}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-400 transition-colors"
                      aria-label="Delete post"
                    >
                      <Suspense fallback={<span>...</span>}>
                        <TrashSimple size={20} weight="bold" />
                      </Suspense>
                      Delete
                    </button>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/update-post/${post._id}`}
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-400 transition-colors"
                      aria-label="Edit post"
                    >
                      <Suspense fallback={<span>...</span>}>
                        <PencilSimple size={20} weight="bold" />
                      </Suspense>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-emerald-600 dark:text-emerald-400 text-sm py-5 hover:underline mt-6"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-slate-600 dark:text-slate-400 mt-10">You have no posts yet!</p>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 w-full max-w-md mx-4 shadow-lg border dark:border-slate-700">
            <div className="text-center">
              <Suspense fallback={<span>Loading icon...</span>}>
                <WarningCircle size={60} className="text-red-500 mb-6 mx-auto" />
              </Suspense>
              <h3 className="mb-6 text-lg font-semibold text-slate-700 dark:text-slate-200">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeletePost}
                  className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-slate-300 text-slate-800 rounded-md hover:bg-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
