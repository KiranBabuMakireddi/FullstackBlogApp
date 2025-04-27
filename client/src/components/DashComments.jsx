import { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

// Lazy load icons
const WarningCircle = lazy(() => import('phosphor-react').then(m => ({ default: m.WarningCircle })));
const Trash = lazy(() => import('phosphor-react').then(m => ({ default: m.Trash })));

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (currentUser?.isAdmin) fetchComments();
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="w-full overflow-x-auto p-4 max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200 border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3">Date Updated</th>
                <th className="p-3">Content</th>
                <th className="p-3">Likes</th>
                <th className="p-3">Post ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b dark:border-gray-700">
                  <td className="p-3">{new Date(comment.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3">{comment.content}</td>
                  <td className="p-3 text-center">{comment.numberOfLikes}</td>
                  <td className="p-3">{comment.postId}</td>
                  <td className="p-3">{comment.userId}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="flex items-center gap-1 text-red-500 hover:underline"
                      aria-label="Delete comment"
                    >
                      <Suspense fallback={<div>...</div>}>
                        <Trash size={18} weight="bold" />
                      </Suspense>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                aria-label="Load more comments"
              >
                Show more
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">You have no comments yet!</p>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <div className="flex flex-col items-center">
              <Suspense fallback={<div>...</div>}>
                <WarningCircle size={64} weight="bold" className="text-gray-400 dark:text-gray-200 mb-4" />
              </Suspense>
              <h2 id="modal-title" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Are you sure you want to delete this comment?
              </h2>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleDeleteComment}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
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
