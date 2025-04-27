import React, { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setFormData(data.posts[0]);
        setPublishError(null);
      } catch (error) {
        console.log(error.message);
        setPublishError('Failed to fetch post data');
      }
    };

    fetchPost();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log(error);
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
            setImageUploadProgress(null);
            setImageUploadError(null);
          });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-bold my-7">Update Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Title and Category */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            id="title"
            placeholder="Title"
            required
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            required
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-3 border-2 border-dashed border-teal-500 p-4 rounded-md items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            type="button"
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {imageUploadProgress ? `Uploading: ${imageUploadProgress}%` : 'Upload Image'}
          </button>
        </div>

        {/* Image Upload Error */}
        {imageUploadError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {imageUploadError}
          </div>
        )}

        {/* Preview Uploaded Image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover rounded-md"
          />
        )}

        {/* Content (TinyMCE Editor) */}
        <Editor
          apiKey={apiKey}
          value={formData.content || ''}
          init={{
            height: 400,
            menubar: false,
            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print'],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | outdent indent | link image',
            images_upload_handler: async (blobInfo, success, failure) => {
              const file = blobInfo.blob();
              try {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + '-' + file.name;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                  },
                  (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                    failure('Image upload failed');
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      success(downloadURL);
                      setImageUploadProgress(null);
                    });
                  }
                );
              } catch (error) {
                setImageUploadError('Image upload failed');
                setImageUploadProgress(null);
                failure('Image upload failed');
              }
            }
          }}
          onEditorChange={(content) => setFormData({ ...formData, content })}
        />

        {/* Update Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          Update Post
        </button>

        {/* Publish Error */}
        {publishError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {publishError}
          </div>
        )}
      </form>
    </div>
  );
}
