import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, Package, Tag } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ADMIN || 'http://localhost:8787/admin';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

const getAuthToken = () => localStorage.getItem('adminToken');

const productAPI = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse(response);
  },
  create: async (data) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products`, {
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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse(response);
  },
};

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
};

const subcategoryAPI = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse(response);
  },
};

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categorySlug: "",
    subCategorySlug: "",
    sku: "",
    pricing: {
      basePrice: 0,
      discountedPrice: 0,
      couponApplicable: true,
      couponList: [],
    },
    details: {
      metal: "",
      metalPurity: "",
      stone: "",
      stoneType: "",
      weight: 0,
      stoneWeight: 0,
      metalWeight: 0,
      size: "",
      color: "",
      clarity: "",
      certification: "",
    },
    images: [],
    tags: [],
    inventory: {
      stock: 0,
      inStock: true,
    },
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.categorySlug) {
      const filtered = subcategories.filter(
        (sub) => sub.categorySlug === formData.categorySlug
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categorySlug, subcategories]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, catsData, subcatsData] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
        subcategoryAPI.getAll(),
      ]);
      setProducts(productsData);
      setCategories(catsData);
      setSubcategories(subcatsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.categorySlug || !formData.sku) return;
    
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
      } else {
        await productAPI.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      categorySlug: product.categorySlug,
      subCategorySlug: product.subCategorySlug || "",
      sku: product.sku,
      pricing: product.pricing || {
        basePrice: 0,
        discountedPrice: 0,
        couponApplicable: true,
        couponList: [],
      },
      details: product.details || {
        metal: "",
        metalPurity: "",
        stone: "",
        stoneType: "",
        weight: 0,
        stoneWeight: 0,
        metalWeight: 0,
        size: "",
        color: "",
        clarity: "",
        certification: "",
      },
      images: product.images || [],
      tags: product.tags || [],
      inventory: product.inventory || {
        stock: 0,
        inStock: true,
      },
      isActive: product.isActive ?? true
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      categorySlug: "",
      subCategorySlug: "",
      sku: "",
      pricing: {
        basePrice: 0,
        discountedPrice: 0,
        couponApplicable: true,
        couponList: [],
      },
      details: {
        metal: "",
        metalPurity: "",
        stone: "",
        stoneType: "",
        weight: 0,
        stoneWeight: 0,
        metalWeight: 0,
        size: "",
        color: "",
        clarity: "",
        certification: "",
      },
      images: [],
      tags: [],
      inventory: {
        stock: 0,
        inStock: true,
      },
      isActive: true,
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (slug) => {
    return categories.find(c => c.slug === slug)?.name || slug;
  };

  const getSubcategoryName = (slug) => {
    return subcategories.find(s => s.slug === slug)?.name || slug;
  };

  return (
    <div className="h-full w-auto bg-transparent">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 sm:p-3 rounded-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Products
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">Manage your product inventory</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg text-sm sm:text-base touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Add Product</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Products Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-slate-800 rounded-lg shadow-lg p-8 sm:p-12 text-center border border-slate-700 mx-auto max-w-md">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300 text-base sm:text-lg">No products found</p>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">Start by adding your first product</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-700 overflow-hidden hover:border-slate-600">
                  <div className="bg-slate-700/50 p-4 sm:p-6 relative">
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-slate-800 p-2 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors border border-slate-600 touch-manipulation"
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-slate-800 p-2 rounded-lg shadow-sm hover:bg-red-600 active:bg-red-700 transition-colors border border-slate-600 touch-manipulation"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-auto object-contain" />
                      ) : (
                        <Package className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-blue-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white line-clamp-2 flex-1">{product.name}</h3>
                      <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        product.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-slate-600/50 text-slate-400 border border-slate-600'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="text-slate-400">
                        <span className="font-mono text-xs bg-slate-700 text-slate-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-slate-600 inline-block">SKU: {product.sku}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                        <span className="font-medium truncate">{getCategoryName(product.categorySlug)}</span>
                      </div>

                      {product.subCategorySlug && (
                        <div className="text-slate-500 text-xs pl-6">
                          → {getSubcategoryName(product.subCategorySlug)}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-500">Price</span>
                        <span className="text-xs sm:text-sm font-semibold text-green-400">₹{product.pricing?.basePrice?.toLocaleString() || 0}</span>
                      </div>

                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs text-slate-500">Stock</span>
                        <span className={`text-xs sm:text-sm font-semibold ${product.inventory?.stock > 0 ? 'text-slate-300' : 'text-red-400'}`}>
                          {product.inventory?.stock || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-slate-800 rounded-t-2xl sm:rounded-lg shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-t sm:border border-slate-700 animate-slide-up sm:animate-none">
              <div className="bg-blue-600 p-4 sm:p-6 text-white flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="hover:bg-blue-700 active:bg-blue-800 p-2 rounded-lg transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-160px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: editingProduct ? formData.slug : generateSlug(e.target.value)
                      })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Category *</label>
                    <select
                      required
                      value={formData.categorySlug}
                      onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value, subCategorySlug: "" })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Subcategory</label>
                    <select
                      value={formData.subCategorySlug}
                      onChange={(e) => setFormData({ ...formData, subCategorySlug: e.target.value })}
                      disabled={!formData.categorySlug}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:opacity-50"
                    >
                      <option value="">Select subcategory</option>
                      {filteredSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Base Price</label>
                    <input
                      type="number"
                      value={formData.pricing.basePrice}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, basePrice: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.inventory.stock}
                      onChange={(e) => setFormData({ ...formData, inventory: { ...formData.inventory, stock: parseInt(e.target.value) || 0 } })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Metal</label>
                  <input
                    type="text"
                    value={formData.details.metal}
                    onChange={(e) => setFormData({ ...formData, details: { ...formData.details, metal: e.target.value } })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
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
                    disabled={!formData.categorySlug || !formData.name || !formData.slug || !formData.sku}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    {editingProduct ? 'Update' : 'Create'}
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