import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout'; // Import Layout
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/signup" element={<Layout><SignUp /></Layout>} />
        <Route path="/signin" element={<Layout><SignIn /></Layout>} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<Layout>
            <CreatePost />
          </Layout>} />
          <Route path='/update-post/:postId' element={<Layout>
            <UpdatePost />
            </Layout>} />
        </Route>
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path='/post/:postSlug' element={<Layout><PostPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
