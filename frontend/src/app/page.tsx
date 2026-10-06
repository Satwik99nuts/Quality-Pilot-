"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { Filter, Star, ChevronDown, Monitor, Shirt, Home as HomeIcon, LayoutGrid } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  category_id?: number;
};

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await api.get("/products/");
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
      
      try {
        const categoriesRes = await api.get("/categories/");
        if (categoriesRes.data) {
           setCategories(categoriesRes.data);
        }
      } catch (err) {
        console.warn("Failed to load categories, using fallback");
        setCategories([
          { id: 1, name: "Electronics", description: "" },
          { id: 2, name: "Clothing", description: "" },
          { id: 3, name: "Home", description: "" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price <= priceRange);

    // Sort
    if (sortBy === "price_low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, priceRange, sortBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  const getCategoryIcon = (name: string) => {
    switch(name.toLowerCase()) {
      case 'electronics': return <Monitor size={18} />;
      case 'clothing': return <Shirt size={18} />;
      case 'home': return <HomeIcon size={18} />;
      default: return <LayoutGrid size={18} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      
      {/* Sidebar Filters (Amazon/Flipkart style) */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
        
        {/* Categories */}
        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-bg/50 shadow-sm">
          <h3 className="font-bold text-brand-text mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
            <LayoutGrid size={16} className="text-brand-accent" /> Categories
          </h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${selectedCategory === null ? 'bg-brand-accent/10 text-brand-accent font-semibold' : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text'}`}
              >
                <LayoutGrid size={18} />
                All Products
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button 
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-colors ${selectedCategory === cat.id ? 'bg-brand-accent/10 text-brand-accent font-semibold' : 'text-brand-muted hover:bg-brand-bg hover:text-brand-text'}`}
                >
                  {getCategoryIcon(cat.name)}
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter */}
        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-bg/50 shadow-sm">
          <h3 className="font-bold text-brand-text mb-4 uppercase tracking-wider text-sm">Price Range</h3>
          <div className="space-y-4">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50"
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-muted">$0</span>
              <span className="font-bold text-brand-text">${priceRange}</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Filter */}
        <div className="bg-brand-surface p-5 rounded-2xl border border-brand-bg/50 shadow-sm">
          <h3 className="font-bold text-brand-text mb-4 uppercase tracking-wider text-sm">Avg. Customer Review</h3>
          <ul className="space-y-3">
            {[4, 3, 2, 1].map(rating => (
              <li key={rating}>
                <button className="flex items-center gap-2 group">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < rating ? "fill-orange-400 text-orange-400" : "fill-brand-bg text-brand-bg group-hover:text-brand-muted transition-colors"} />
                    ))}
                  </div>
                  <span className="text-sm text-brand-muted group-hover:text-brand-accent transition-colors">& Up</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Amazon-style Hero Banner */}
        <div className="bg-gradient-to-r from-brand-accent to-brand-accent-hover rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg flex items-center justify-between text-white">
           <div className="relative z-10">
             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md font-bold rounded-lg text-xs mb-4 uppercase tracking-widest">
               Big Billion Sale
             </span>
             <h2 className="text-3xl md:text-5xl font-black mb-2">Up to 40% Off</h2>
             <p className="text-white/80 max-w-md text-lg mb-6">On electronics, fashion, and home essentials. Limited time only!</p>
             <button className="bg-white text-brand-accent px-6 py-2.5 rounded-xl font-bold hover:bg-brand-bg transition-colors shadow-sm">
               Claim Offer
             </button>
           </div>
           
           <div className="hidden md:block relative z-10 w-48 h-48 -mr-8">
             {/* Decorative abstract elements */}
             <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl rounded-full blur-xl border border-white/20"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-6xl opacity-20 rotate-12">SALE</div>
           </div>

           {/* Background graphics */}
           <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        </div>

        {/* Sorting and Results count */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-brand-surface p-4 rounded-2xl border border-brand-bg/50 shadow-sm mb-6">
          <p className="text-brand-muted font-medium mb-4 sm:mb-0">
            Showing {filteredProducts.length} results
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-muted font-medium">Sort by:</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-brand-bg border border-brand-surface text-brand-text font-semibold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-brand-surface p-16 rounded-2xl text-center shadow-sm border border-brand-bg/50">
            <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">No matches found</h3>
            <p className="text-brand-muted max-w-md mx-auto">
              Try adjusting your filters or search criteria to find what you're looking for.
            </p>
            <button 
              onClick={() => { setSelectedCategory(null); setPriceRange(2000); }}
              className="mt-6 text-brand-accent hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-list">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
