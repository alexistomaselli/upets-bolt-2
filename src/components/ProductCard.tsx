import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Star } from 'lucide-react';
import { Product } from '../types/product';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const mainImage = product.images?.[0]?.src || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <Link to={`/producto/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Destacado
              </span>
            )}
            {isOnSale && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Oferta
              </span>
            )}
            {product.categories?.some(cat => cat.slug === 'packs') && (
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <Package className="h-3 w-3 mr-1" />
                Pack
              </span>
            )}
          </div>

          {/* Quick add to cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transform hover:scale-110 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.short_description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isOnSale ? (
                <>
                  <span className="text-xl font-bold text-green-600">
                    ${product.sale_price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.regular_price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Stock status */}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock_status === 'instock' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock_status === 'instock' ? 'Disponible' : 'Sin stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};