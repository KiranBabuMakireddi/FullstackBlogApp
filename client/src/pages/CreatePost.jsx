import React, { useState, useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();
  const quillRef = useRef(null);  // Not needed for TinyMCE

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
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
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
      <h1 className="text-center text-3xl font-bold my-7">Create a Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title and Category */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            id="title"
            placeholder="Title"
            required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            required
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
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {imageUploadProgress ? (
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="w-full h-full border-4 border-dashed rounded-full animate-spin border-white"></div>
                <span className="absolute text-xs font-semibold">{imageUploadProgress}%</span>
              </div>
            ) : (
              'Upload Image'
            )}
          </button>
        </div>

        {/* Error message */}
        {imageUploadError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {imageUploadError}
          </div>
        )}

        {/* Preview Image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover rounded-md"
          />
        )}

        {/* Content */}
        <Editor
          apiKey="bfjf14ypv4kzz6hxuqqtzhpykqo40ovd4fdl3q67hpk5c0c0"  // Add your TinyMCE API key here
          initialValue="<p>Write something...</p>"
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'
          }}
          onEditorChange={(content) => setFormData({ ...formData, content })}
          required
        />

        {/* Publish Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          Publish
        </button>

        {/* Publish error */}
        {publishError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {publishError}
          </div>
        )}
      </form>
    </div>
  );
}
