import dayjs from 'dayjs';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

// Lazy-load Phosphor icons
const ThumbsUp = lazy(() => import('phosphor-react').then(m => ({ default: m.ThumbsUp })));

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error.message);
      }
    };
    fetchUser();
  }, [comment.userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.error('Failed to edit comment:', error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
          src={user.profilePicture || '/default-avatar.png'}
          alt={user.username ? `${user.username}'s profile` : 'User avatar'}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1 gap-2">
          <span className="font-bold text-xs truncate">
            {user.username ? `@${user.username}` : 'Anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">{dayjs(comment.createdAt).fromNow()}</span>
        </div>

        {isEditing ? (
          <>
            <textarea
              className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              aria-label="Edit comment"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border text-blue-600 border-blue-600 hover:bg-blue-50 rounded-md text-xs"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 gap-4 text-xs border-t dark:border-gray-700 mt-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                aria-label="Like comment"
                className={`flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors ${
                  currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500'
                }`}
              >
                <Suspense fallback={<div className="w-4 h-4" />}>
                  <ThumbsUp size={16} weight="bold" />
                </Suspense>
                {comment.numberOfLikes > 0 && (
                  <span>
                    {comment.numberOfLikes} {comment.numberOfLikes === 1 ? 'like' : 'likes'}
                  </span>
                )}
              </button>

              {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    aria-label="Edit comment"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    aria-label="Delete comment"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
