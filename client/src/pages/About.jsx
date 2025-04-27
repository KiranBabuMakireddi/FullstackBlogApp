import { useNavigate } from "react-router-dom";
export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80%] flex items-start justify-center bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div>
          <h1
            className="text-4xl font-bold te
          xt-gray-800 dark:text-white mb-8"
          >
            About Kiran's Blog
          </h1>
          <div className="text-lg text-gray-700 dark:text-gray-300 flex flex-col gap-6">
            <p>
              Welcome to{" "}
              <span
                className="font-semibold text-teal-600 dark:text-teal-400 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Kiran Babu Makireddi
              </span>
              ! This project was built as a full-stack blogging platform where
              users can explore, read, and interact with a variety of posts.
            </p>

            <p>
              Built with modern technologies like React, Tailwind CSS, and a
              Node.js backend, the blog supports features such as user
              authentication, post creation, category-based search, comment
              sections, and responsive dark mode for a smooth reading
              experience.
            </p>

            <p>
              Our goal was to design a simple yet powerful platform that focuses
              on accessibility, fast performance, and clean user experience.
              Feel free to browse articles, leave comments, and enjoy learning
              through shared knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
