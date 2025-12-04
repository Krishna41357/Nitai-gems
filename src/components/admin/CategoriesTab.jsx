import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, Search, AlertCircle, Layers } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ADMIN || 'http://localhost:8787/admin';


const getAuthToken = () => localStorage.getItem('adminToken');

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

const categoryAPI = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse(response);
  },
};
export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true
  });

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      showToast("Error", error.message, "destructive");
    }
    setLoading(false);
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) return;

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
        showToast("Success", "Category updated successfully");
      } else {
        await categoryAPI.create(formData);
        showToast("Success", "Category created successfully");
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      showToast("Error", error.message, "destructive");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryAPI.delete(id);
      showToast("Success", "Category deleted successfully");
      fetchCategories();
    } catch (error) {
      showToast("Error", error.message, "destructive");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      sortOrder: 0,
      isActive: true
    });
    setEditingCategory(null);
  };

  return (
    <div className="h-full w-auto bg-transparent">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg border ${
            toast.variant === "destructive" 
              ? "bg-red-900/90 border-red-700 text-red-100" 
              : "bg-green-900/90 border-green-700 text-green-100"
          }`}>
            {toast.variant === "destructive" ? (
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            ) : (
              <Check className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <div className="font-semibold text-sm sm:text-base">{toast.title}</div>
              <div className="text-xs sm:text-sm opacity-90">{toast.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 sm:p-3 rounded-lg">
                <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Categories
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">Manage product categories</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg text-sm sm:text-base touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Add Category</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories Grid/Table - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-slate-800 rounded-lg shadow-lg p-8 sm:p-12 text-center border border-slate-700 mx-auto max-w-md">
              <Layers className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300 text-base sm:text-lg font-medium">No categories found</p>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">
                {searchTerm ? "Try a different search term" : "Start by adding your first category"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3 sm:space-y-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-white mb-1 truncate">
                            {category.name}
                          </h3>
                          <span className="font-mono text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 inline-block">
                            {category.slug}
                          </span>
                        </div>
                        <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-slate-600/50 text-slate-400 border border-slate-600'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {category.description && (
                        <p className="text-slate-400 text-xs sm:text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                        <div className="text-xs sm:text-sm text-slate-400">
                          Sort Order: <span className="font-semibold text-slate-300">{category.sortOrder}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-slate-700 p-2 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors border border-slate-600 touch-manipulation"
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-slate-700 p-2 rounded-lg shadow-sm hover:bg-red-600 active:bg-red-700 transition-colors border border-slate-600 touch-manipulation"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-700/50 border-b border-slate-600">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Sort Order</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{category.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            <span className="font-mono text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600">{category.slug}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">{category.sortOrder}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              category.isActive 
                                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                : "bg-slate-600/50 text-slate-400 border-slate-600"
                            }`}>
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-2 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-transparent hover:border-blue-500"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-transparent hover:border-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-slate-800 rounded-t-2xl sm:rounded-lg shadow-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-t sm:border border-slate-700 animate-slide-up sm:animate-none">
              <div className="bg-blue-600 p-4 sm:p-6 text-white flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="hover:bg-blue-700 active:bg-blue-800 p-2 rounded-lg transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-160px)]">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingCategory ? formData.slug : generateSlug(e.target.value)
                    })}
                    required
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                    Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                    placeholder="category-slug"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20 bg-slate-700 border-slate-600"
                  />
                  <label htmlFor="isActive" className="text-xs sm:text-sm font-medium text-slate-300">Active</label>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700">
                  <button
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 border border-slate-600 rounded-lg hover:bg-slate-700 active:bg-slate-600 transition-colors text-slate-300 font-medium text-sm sm:text-base touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.slug}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}