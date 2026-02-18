import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Search,
  Clock,
  User,
  Calendar,
  ArrowRight,
  PenSquare,
  BookOpen,
  Feather,
  X,
  ChevronRight,
} from "lucide-react";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data);
    } catch {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const getReadingTime = (content) => {
    if (!content) return "1 min";
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(q) ||
      blog.content?.toLowerCase().includes(q) ||
      blog.author?.username?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="glass-loading h-4 w-32 mx-auto" />
            <div className="glass-loading h-16 w-3/4 mx-auto" />
            <div className="glass-loading h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-96 overflow-hidden">
                <div className="glass-loading h-48 w-full" />
                <div className="p-6 space-y-4">
                  <div className="glass-loading h-6 w-3/4" />
                  <div className="glass-loading h-4 w-full" />
                  <div className="glass-loading h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
      {/* Hero Section */}
      <section className="mb-20 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Feather size={12} />
          <span>The New Editorial</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight max-w-4xl mx-auto">
          Write, read, and connect with the <span className="text-indigo-500 italic">curious</span>.
        </h1>
        
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          A beautifully simple space for your stories, thoughts, and big ideas. Join the conversation and share your unique perspective with the world.
        </p>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic or author..."
              className="glass-input pl-12 pr-12 h-14 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Link to="/create" className="glass-btn glass-btn-primary h-14 px-8 text-base w-full md:w-auto">
            Start Writing
          </Link>
        </div>
      </section>

      {/* Content Grid */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-slate-900 pb-6">
          <h2 className="text-2xl font-display font-bold">Latest Stories</h2>
          <div className="text-slate-500 text-sm font-medium">
            {filteredBlogs.length} results
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="glass-card p-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto">
              <BookOpen size={32} className="text-slate-700" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">No stories found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchQuery 
                  ? `We couldn't find anything matching "${searchQuery}". Try another search term.` 
                  : "Our writers are busy crafting their next masterpiece. Check back soon!"}
              </p>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="glass-btn text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog, index) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="group block space-y-6 animate-fade-in-up no-underline"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Wrap */}
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <Feather size={48} />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="glass-btn bg-white text-black font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Read Article
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    <span>{getReadingTime(blog.content)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <h3 className="text-2xl font-display font-bold leading-tight text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                    {blog.content}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-slate-700">
                      {blog.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{blog.author?.username}</span>
                    <ChevronRight size={14} className="ml-auto text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
