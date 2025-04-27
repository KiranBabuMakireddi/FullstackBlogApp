import { useState,lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
const WarningCircle = lazy(() => import('phosphor-react').then(module => ({ default: module.WarningCircle })));
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="text-3xl font-semibold text-center my-6">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="p-3 border rounded-md"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="p-3 border rounded-md"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-3 border rounded-md"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        {currentUser.isAdmin && (
          <Link to="/create-post" className="block">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md mt-2"
            >
              Create a post
            </button>
          </Link>
        )}
      </form>

      <div className="flex justify-between text-red-500 mt-5 text-sm">
        <span onClick={() => setShowModal(true)} className="cursor-pointer hover:underline">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer hover:underline">
          Sign Out
        </span>
      </div>

      {updateUserSuccess && (
        <div className="bg-green-100 text-green-700 p-2 mt-5 rounded text-center text-sm">
          {updateUserSuccess}
        </div>
      )}
      {updateUserError && (
        <div className="bg-red-100 text-red-700 p-2 mt-5 rounded text-center text-sm">
          {updateUserError}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mt-5 rounded text-center text-sm">
          {error}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md">
            <div className="text-center">
            <WarningCircle className="mx-auto text-4xl text-gray-500 mb-4" />

              <h3 className="text-lg mb-4 text-gray-700">Are you sure you want to delete your account?</h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
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
