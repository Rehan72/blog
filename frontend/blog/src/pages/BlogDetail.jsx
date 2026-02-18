import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Tag,
  Edit3,
  Trash2,
  AlertCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setReadingProgress((scrollTop / docHeight) * 100);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const fetchBlog = async () => {
    try {
      const data = await api.getBlogById(id);
      if (data.error) {
        setError(data.error);
      } else {
        setBlog(data);
      }
    } catch {
      setError("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteBlog(id);
      navigate("/");
    } catch {
      setError("Failed to delete blog");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getReadingTime = (content) => {
    if (!content) return "1 min";
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-8 animate-pulse">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-12 w-full bg-slate-800 rounded" />
          <div className="h-6 w-1/2 bg-slate-800 rounded" />
          <div className="aspect-video w-full bg-slate-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-3/4 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="glass-card p-12 space-y-6">
          <AlertCircle size={48} className="mx-auto text-rose-500" />
          <h2 className="text-2xl font-bold">{error || "Blog not found"}</h2>
          <Link to="/" className="glass-btn inline-flex">
            <ArrowLeft size={16} />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && user._id === blog.author?._id;

  return (
    <>
      {/* Reading progress */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Navigation / Header Area */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Stories
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Bookmark size={20} />
            </button>
            <button onClick={handleShare} className="text-slate-500 hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <article className="animate-fade-in-up">
          <div className="max-w-[70ch] mx-auto">
            {/* Article Header */}
            <header className="mb-12 space-y-6 text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-white mb-8">
                {blog.title}
              </h1>

              <div className="flex items-center justify-center flex-wrap gap-8 py-8 border-y border-slate-900">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
                    {blog.author?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{blog.author?.username || "Unknown"}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-900 hidden sm:block" />

                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {getReadingTime(blog.content)}
                  </span>
                </div>
              </div>
            </header>
          </div>

          {/* Featured Image - Purposefully Wider for visual impact */}
          {blog.image && (
            <div className="mb-12 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full object-cover max-h-[600px]"
              />
            </div>
          )}

          <div className="max-w-[70ch] mx-auto">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12 justify-center">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="glass-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg md:text-xl font-light editorial-content">
                {blog.content}
              </div>
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <div className="mt-20 p-8 rounded-3xl bg-slate-950 border border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Author Controls</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">This is your story. Use the controls to refine or remove it from the collection.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Link
                    to={`/edit/${blog._id}`}
                    className="glass-btn glass-btn-primary h-12 px-6 flex-1 md:flex-none justify-center"
                  >
                    <Edit3 size={18} />
                    Edit
                  </Link>

                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2 animate-fade-in flex-1 md:flex-none">
                      <button
                        onClick={handleDelete}
                        className="glass-btn h-12 px-6 bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700 text-white flex-1 justify-center"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="glass-btn h-12 px-6 flex-1 justify-center"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="glass-btn h-12 px-6 text-rose-400 border-rose-500/20 hover:bg-rose-500/10 flex-1 md:flex-none justify-center"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-content {
          line-height: 1.8;
        }
      `}} />
    </>
  );
};

export default BlogDetail;
