import { useEffect, useState, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

// Lazy load icon
const WarningCircle = lazy(() => import('phosphor-react').then(m => ({ default: m.WarningCircle })));

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: data.likes, numberOfLikes: data.likes.length }
              : c
          )
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === comment._id ? { ...c, content: editedContent } : c))
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-gray-600 dark:text-gray-400 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={`${currentUser.username}'s profile`}
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-cyan-600 hover:underline text-xs"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/signin">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="Add a comment"
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-1 px-3 rounded-md hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>
          {commentError && (
            <div
              className="bg-red-100 text-red-700 p-2 mt-3 rounded-md text-sm"
              role="alert"
            >
              {commentError}
            </div>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5 text-gray-600 dark:text-gray-400">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p>Comments</p>
            <span className="border border-gray-400 py-1 px-2 rounded-sm">
              {comments.length}
            </span>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80">
            <div className="text-center">
              <Suspense fallback={<div className="h-14 w-14 mx-auto mb-4" />}>
                <WarningCircle size={56} className="text-gray-400 dark:text-gray-200 mx-auto mb-4" />
              </Suspense>
              <h2
                id="delete-modal-title"
                className="text-lg mb-4 text-gray-600 dark:text-gray-300"
              >
                Are you sure you want to delete this comment?
              </h2>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleDelete(commentToDelete)}
                  className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
