import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const navigate = useNavigate();

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
    <div className="p-4 max-w-4xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
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
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            required
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        {/* Content Editor */}
        <Editor
          apiKey={apiKey}
          initialValue="<p>Write something...</p>"
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'lists', 'link', 'charmap', 'searchreplace', 'visualblocks',
              'code', 'fullscreen', 'insertdatetime', 'table', 'wordcount'
            ],
            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | ' +
              'bullist numlist outdent indent | link | code fullscreen',
          }}
          onEditorChange={(content) => setFormData({ ...formData, content })}
        />

        {/* Publish Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          Publish
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
