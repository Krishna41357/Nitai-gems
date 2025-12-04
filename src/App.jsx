import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider, WishlistProvider, AuthProvider as HomeAuthProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Events from "./pages/admin/Events";
import Coupons from "./pages/admin/Coupons";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ProductsListingPage from "./pages/ProductsListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <HomeAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Product Routes - Order matters! Most specific routes first */}
                  <Route path="/products" element={<ProductsListingPage />} />
                  <Route path="/products/category/:categorySlug/:subCategorySlug" element={<ProductsListingPage />} />
                  <Route path="/products/category/:categorySlug" element={<ProductsListingPage />} />
                  <Route path="/products/collection/:collectionSlug" element={<ProductsListingPage />} />
                  
                  {/* Product Detail Route - Fixed to match ProductCard link */}
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/products/category/:categorySlug/:subCategorySlug/:slug" element={<ProductDetailPage />} />
                  <Route path="/products/category/:categorySlug/:slug" element={<ProductDetailPage />} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/adminauth" element={<Navigate to="/admin" replace />} />
                  
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="events" element={<Events />} />
                    <Route path="coupons" element={<Coupons />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </HomeAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;