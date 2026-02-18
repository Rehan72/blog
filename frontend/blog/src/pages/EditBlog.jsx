import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  Save,
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
  History,
} from "lucide-react";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const data = await api.getBlogById(id);
      if (data.error) {
        setError(data.error);
      } else {
        setFormData({
          title: data.title,
          content: data.content,
          image: data.image || "",
          tags: data.tags || [],
        });
      }
    } catch {
      setError("Failed to fetch blog details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
        setIsDirty(true);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
    setIsDirty(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }
    
    if (!formData.content || formData.content.trim().length === 0) {
      newErrors.content = "Content is required";
    } else if (formData.content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }
    
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image.trim());
      } catch {
        newErrors.image = "Please enter a valid URL";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await api.updateBlog(id, formData);
      if (response._id) {
        setIsDirty(false);
        navigate(`/blog/${id}`);
      } else {
        setError(response.error || "Failed to update blog");
      }
    } catch {
      setError("An error occurred during update");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-8 animate-pulse text-center">
          <div className="h-4 w-24 bg-slate-800 rounded mx-auto" />
          <div className="h-12 w-3/4 bg-slate-800 rounded mx-auto" />
          <div className="divider opacity-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-slate-800 rounded-2xl" />
              <div className="h-96 bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-96 bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Link
            to={`/blog/${id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Story
          </Link>
          <h1 className="text-4xl font-display font-bold text-white">Edit Story</h1>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <History size={14} />
            Updated {new Date().toLocaleDateString()}
            {isDirty && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
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
              disabled={saving || !isDirty}
              className="glass-btn glass-btn-primary px-8 disabled:opacity-30"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Changes
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

      {(errors.title || errors.content || errors.image) && (
        <div className="mb-6 space-y-2">
          {errors.title && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-sm">
              <AlertCircle size={16} />
              {errors.title}
            </div>
          )}
          {errors.content && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-sm">
              <AlertCircle size={16} />
              {errors.content}
            </div>
          )}
          {errors.image && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-sm">
              <AlertCircle size={16} />
              {errors.image}
            </div>
          )}
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
                {formData.content}
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
              <h4 className="text-sm font-bold text-indigo-400">Editorial Guide</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consistency is key. Use tags to help readers find your stories across different topics.
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

export default EditBlog;
