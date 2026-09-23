import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group" data-testid={`product-card-${product.id}`}>
      <div className="aspect-video bg-slate-100 flex items-center justify-center p-6 relative">
        {/* Placeholder for real images */}
        <ShoppingBag className="text-slate-300 w-20 h-20 group-hover:scale-110 transition duration-300" />
        {product.stock_quantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <Link 
            href={`/product/${product.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition"
            data-testid={`view-product-${product.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
