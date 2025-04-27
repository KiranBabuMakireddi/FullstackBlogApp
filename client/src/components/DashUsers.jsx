import { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

// Lazy load Phosphor icons
const WarningCircle = lazy(() => import('phosphor-react').then(module => ({ default: module.WarningCircle })));
const Check = lazy(() => import('phosphor-react').then(module => ({ default: module.Check })));
const X = lazy(() => import('phosphor-react').then(module => ({ default: module.X })));

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full overflow-x-auto p-3 max-w-fu;; mx-auto scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-600">
  {currentUser.isAdmin && users.length > 0 ? (
    <>
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">Date created</th>
            <th scope="col" className="px-6 py-3">User image</th>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Admin</th>
            <th scope="col" className="px-6 py-3">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
              <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 object-cover rounded-full bg-gray-300 dark:bg-gray-700"
                />
              </td>
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <Suspense fallback={<div>...</div>}>
                  {user.isAdmin ? (
                    <Check size={20} className="text-emerald-500" />
                  ) : (
                    <X size={20} className="text-rose-500" />
                  )}
                </Suspense>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}
                  className="text-rose-500 hover:underline font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showMore && (
        <button
          onClick={handleShowMore}
          className="w-full text-teal-600 py-4 hover:underline text-center text-sm"
        >
          Show more
        </button>
      )}
    </>
  ) : (
    <p className="text-center text-gray-600 dark:text-gray-400">You have no users yet!</p>
  )}

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-80 p-6">
        <div className="text-center">
          <Suspense fallback={<div>...</div>}>
            <WarningCircle size={56} className="text-gray-400 dark:text-gray-200 mx-auto mb-4" />
          </Suspense>
          <h3 className="text-lg mb-4 text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this user?
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDeleteUser}
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
