import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  Send,
  Image as ImageIcon,
  Tag as TagIcon,
  X,
  Type,
  AlignLeft,
  ArrowLeft,
  Eye,
  PenSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.createBlog(formData);
      if (response._id) {
        navigate("/");
      } else {
        setError(response.error || "Failed to create blog");
      }
    } catch {
      setError("An error occurred during blog creation");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Cancel
          </Link>
          <h1 className="text-4xl font-display font-bold text-white">Create a New Story</h1>
          <p className="text-slate-500 font-medium">Capture your thoughts and share them with the world.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`glass-btn ${previewMode ? 'bg-white text-black border-white' : 'text-slate-400'}`}
          >
            {previewMode ? <PenSquare size={16} /> : <Eye size={16} />}
            {previewMode ? "Edit" : "Preview"}
          </button>
          {!previewMode && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="glass-btn glass-btn-primary px-8"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Publish
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm animate-shake">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {previewMode ? (
        <div className="animate-fade-in-up">
          <div className="space-y-8 mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
              {formData.title || "Your Title"}
            </h1>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span key={idx} className="glass-tag">{tag}</span>
                ))}
              </div>
            )}

            {formData.image && (
              <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video max-h-[500px]">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed editorial-content text-xl font-light">
                {formData.content || "Start writing to see your story here..."}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in-up">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Type size={12} />
                Title
              </label>
              <textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="The beginning of something great..."
                className="w-full bg-transparent border-none text-4xl md:text-5xl font-display font-bold text-white placeholder:text-slate-800 focus:ring-0 resize-none overflow-hidden min-h-[120px]"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <label className="flex items-center gap-2">
                  <AlignLeft size={12} />
                  Story
                </label>
                <span>{wordCount} words</span>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Once upon a time..."
                className="w-full bg-transparent border-none text-xl font-light leading-relaxed text-slate-300 placeholder:text-slate-800 focus:ring-0 resize-none min-h-[400px]"
              />
            </div>
          </div>

          {/* Sidebar / Options */}
          <div className="space-y-8">
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <ImageIcon size={12} />
                  Cover Image
                </label>
                <div className="relative group">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://image-url.com"
                    className="glass-input h-12 text-xs"
                  />
                  {formData.image && (
                    <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <TagIcon size={12} />
                  Tags
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Press Enter to add"
                    className="glass-input h-12 text-xs"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="glass-tag pr-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-600/5 border border-indigo-600/10 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-indigo-400">Writing Tip</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Great stories start with a strong hook. Catch your readers' attention in the first paragraph!
              </p>
            </div>
          </div>
        </form>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-content {
          max-width: 65ch;
          margin: 0 auto;
        }
      `}} />
    </div>
  );
};

export default CreateBlog;
