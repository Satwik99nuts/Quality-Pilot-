"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../services/api";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useWishlist } from "../../../context/WishlistContext";
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, ArrowLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
};

// Generate a deterministic gradient based on product ID
const getGradient = (id: number) => {
  const gradients = [
    "from-blue-500/20 to-purple-500/20",
    "from-emerald-500/20 to-teal-500/20",
    "from-orange-500/20 to-red-500/20",
    "from-pink-500/20 to-rose-500/20",
    "from-indigo-500/20 to-cyan-500/20"
  ];
  return gradients[id % gradients.length];
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const wishlisted = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (product) {
      setIsAdding(true);
      await addToCart(product.id, quantity);
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-brand-text mb-4">Product Not Found</h2>
        <Link href="/" className="text-brand-accent hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link href="/" className="inline-flex items-center text-sm text-brand-muted hover:text-brand-accent mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Products
      </Link>
      
      <div className="bg-brand-surface rounded-3xl shadow-sm border border-brand-bg/50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Product Image Side */}
          <div className={`aspect-square md:aspect-auto ${product.image_url ? 'bg-brand-bg' : `bg-gradient-to-br ${getGradient(product.id)}`} flex items-center justify-center relative border-r border-brand-bg/50 overflow-hidden`}>
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full max-w-sm aspect-square bg-brand-surface/30 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="text-6xl font-black text-brand-text/30 -rotate-3">{product.name.substring(0,2).toUpperCase()}</div>
              </div>
            )}
            
            <div className="absolute top-6 left-6 px-3 py-1 bg-brand-text text-brand-bg text-xs font-bold uppercase tracking-wider rounded-lg">
              New Arrival
            </div>
          </div>
          
          {/* Product Details Side */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-text leading-tight" data-testid="product-title">{product.name}</h1>
              <div className="flex gap-2">
                <button 
                  onClick={handleWishlistToggle}
                  className="p-3 bg-brand-bg hover:bg-brand-bg/80 text-brand-muted hover:text-red-500 rounded-xl transition-all shadow-sm"
                >
                  <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
                </button>
                <button className="p-3 bg-brand-bg hover:bg-brand-bg/80 text-brand-muted hover:text-brand-accent rounded-xl transition-all shadow-sm">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-3xl font-black text-brand-accent mb-6" data-testid="product-price">${product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <h3 className="text-sm font-bold text-brand-text mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-brand-muted leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-brand-muted bg-brand-bg px-4 py-2 rounded-xl">
                <ShieldCheck size={16} className="text-green-500" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-muted bg-brand-bg px-4 py-2 rounded-xl">
                <Truck size={16} className="text-brand-accent" />
                <span>Free Shipping</span>
              </div>
            </div>

            <div className="border-t border-brand-bg/50 pt-8 mt-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium text-brand-text">
                  Availability: {product.stock_quantity > 0 ? (
                    <span className="text-green-500 ml-2" data-testid="product-stock-status">In Stock ({product.stock_quantity} left)</span>
                  ) : (
                    <span className="text-red-500 ml-2" data-testid="product-stock-status">Out of Stock</span>
                  )}
                </span>
              </div>

              {product.stock_quantity > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Custom Quantity Selector */}
                  <div className="flex items-center bg-brand-bg rounded-xl p-1 border border-brand-surface h-14">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-full flex items-center justify-center text-brand-muted hover:text-brand-text disabled:opacity-30 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="w-12 text-center font-bold text-brand-text" data-testid="product-quantity-display">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="w-12 h-full flex items-center justify-center text-brand-muted hover:text-brand-text disabled:opacity-30 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold h-14 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    data-testid="add-to-cart-btn"
                  >
                    {isAdding ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {product.stock_quantity === 0 && (
                <button
                  disabled
                  className="w-full bg-brand-bg text-brand-muted font-bold h-14 rounded-xl cursor-not-allowed border border-brand-surface"
                  data-testid="add-to-cart-btn"
                >
                  Out of Stock
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
