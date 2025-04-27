import { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Lazy load phosphor-react icons
const UsersIcon = lazy(() => import('phosphor-react').then(m => ({ default: m.Users })));
const ChatCircleDotsIcon = lazy(() => import('phosphor-react').then(m => ({ default: m.ChatCircleDots })));
const FileTextIcon = lazy(() => import('phosphor-react').then(m => ({ default: m.FileText })));
const ArrowUpIcon = lazy(() => import('phosphor-react').then(m => ({ default: m.ArrowUp })));

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    lastMonthUsers: 0,
    lastMonthPosts: 0,
    lastMonthComments: 0,
  });
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;

    const fetchData = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch('/api/user/getusers?limit=5'),
          fetch('/api/post/getposts?limit=5'),
          fetch('/api/comment/getcomments?limit=5'),
        ]);

        const [usersData, postsData, commentsData] = await Promise.all([
          usersRes.json(),
          postsRes.json(),
          commentsRes.json(),
        ]);

        if (usersRes.ok) {
          setUsers(usersData.users);
          setStats(prev => ({ ...prev, totalUsers: usersData.totalUsers, lastMonthUsers: usersData.lastMonthUsers }));
        }
        if (postsRes.ok) {
          setPosts(postsData.posts);
          setStats(prev => ({ ...prev, totalPosts: postsData.totalPosts, lastMonthPosts: postsData.lastMonthPosts }));
        }
        if (commentsRes.ok) {
          setComments(commentsData.comments);
          setStats(prev => ({ ...prev, totalComments: commentsData.totalComments, lastMonthComments: commentsData.lastMonthComments }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error.message);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto max-w-7xl">
    {/* Stats Cards */}
    <div className="flex flex-wrap gap-6 justify-center">
      {[
        { label: 'Total Users', value: stats.totalUsers, lastMonth: stats.lastMonthUsers, icon: UsersIcon, color: 'bg-teal-600' },
        { label: 'Total Comments', value: stats.totalComments, lastMonth: stats.lastMonthComments, icon: ChatCircleDotsIcon, color: 'bg-indigo-600' },
        { label: 'Total Posts', value: stats.totalPosts, lastMonth: stats.lastMonthPosts, icon: FileTextIcon, color: 'bg-lime-600' },
      ].map(({ label, value, lastMonth, icon: Icon, color }) => (
        <div
          key={label}
          className="flex flex-col p-6 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 gap-4 md:w-[340px] w-full rounded-lg shadow-md transition-colors duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 dark:text-gray-400 text-md uppercase">{label}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <Suspense fallback={<div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />}>
              <Icon className={`${color} text-white rounded-full text-5xl p-3 shadow-lg`} aria-hidden="true" />
            </Suspense>
          </div>
          <div className="flex gap-2 items-center text-sm">
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <ArrowUpIcon size={16} aria-hidden="true" /> {lastMonth}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Last month</span>
          </div>
        </div>
      ))}
    </div>
  
    {/* Recent Users, Comments, Posts */}
    <div className="flex flex-wrap gap-6 py-8 mx-auto justify-center">
      {[
        { title: 'Recent users', data: users, columns: ['User image', 'Username'], link: '/dashboard?tab=users', type: 'users' },
        { title: 'Recent comments', data: comments, columns: ['Comment content', 'Likes'], link: '/dashboard?tab=comments', type: 'comments' },
        { title: 'Recent posts', data: posts, columns: ['Post image', 'Post Title', 'Category'], link: '/dashboard?tab=posts', type: 'posts' },
      ].map(({ title, data, columns, link, type }) => (
        <div
          key={title}
          className="flex flex-col w-full md:w-[500px] shadow-md p-6 rounded-lg bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 transition-colors duration-300"
        >
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <Link to={link} aria-label={`See all ${title.toLowerCase()}`}>
              <button
                className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 dark:hover:border-purple-400 transition-colors"
              >
                See all
              </button>
            </Link>
          </div>
  
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-gray-700 dark:text-gray-300">
                <tr>
                  {columns.map((col) => (
                    <th key={col} scope="col" className="px-4 py-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="border-t border-gray-300 dark:border-gray-600">
                      {type === 'users' && (
                        <>
                          <td className="px-4 py-3">
                            <img
                              src={item.profilePicture}
                              alt={`${item.username}'s profile`}
                              className="w-12 h-12 rounded-full bg-gray-500 object-cover"
                              loading="lazy"
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{item.username}</td>
                        </>
                      )}
                      {type === 'comments' && (
                        <>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="line-clamp-2 text-gray-800 dark:text-gray-200">{item.content}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{item.numberOfLikes}</td>
                        </>
                      )}
                      {type === 'posts' && (
                        <>
                          <td className="px-4 py-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-12 rounded-md bg-gray-500 object-cover"
                              loading="lazy"
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{item.title}</td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{item.category}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </div>
  

  );
}
