import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-brand-surface rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-brand-bg/50 relative flex flex-col h-full" data-testid={`product-card-${product.id}`}>
      
      {/* Heart Icon / Wishlist */}
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-brand-bg/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-muted hover:text-red-500 hover:bg-brand-bg transition-colors"
      >
        <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
      </button>

      {/* Sale/New Badge */}
      <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-brand-text text-brand-bg text-[10px] font-bold uppercase tracking-wider rounded">
        New
      </div>

      {/* Product Image */}
      <div className={`aspect-[4/3] flex items-center justify-center relative overflow-hidden bg-brand-bg/50`}>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-bg/50">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${product.id * 45}deg, var(--color-accent) 0%, transparent 70%)` }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-brand-text/40">{product.name.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        )}
        
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-brand-bg/60 backdrop-blur-[2px] flex items-center justify-center z-10">
             <span className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wide">
                Out of Stock
             </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-brand-text line-clamp-1 mb-1 group-hover:text-brand-accent transition-colors">{product.name}</h3>
        
        {/* Mock Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < 4 ? "var(--color-accent)" : "none"} stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
          <span className="text-xs text-brand-muted ml-1">(128)</span>
        </div>

        <p className="text-sm text-brand-muted line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black text-brand-text">${product.price.toFixed(2)}</span>
        </div>
        
        <Link 
          href={`/product/${product.id}`}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-text hover:bg-brand-muted text-brand-bg font-bold py-2.5 rounded-xl transition-colors shadow-sm"
          data-testid={`view-product-${product.id}`}
        >
          <ShoppingCart size={16} />
          View Details
        </Link>
      </div>
    </div>
  );
}
