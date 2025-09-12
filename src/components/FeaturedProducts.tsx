import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useProducts({ 
    featured: true, 
    per_page: 4 
  });

  // Productos placeholder si no hay conexión con WooCommerce
  const placeholderProducts = [
    {
      id: 1,
      name: 'Colgante QR Básico',
      slug: 'colgante-qr-basico',
      price: '2500',
      regular_price: '2500',
      images: [{ 
        id: 1, 
        src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Colgante QR Básico'
      }],
      short_description: 'Base QR resistente para cualquier mascota',
      categories: [{ id: 1, name: 'QR Básicos', slug: 'qr-basicos' }],
      featured: true,
      stock_status: 'instock' as const
    },
    {
      id: 2,
      name: 'Cover Pez - Playa',
      slug: 'cover-pez-playa',
      price: '800',
      regular_price: '800',
      images: [{ 
        id: 2, 
        src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Cover temático de playa'
      }],
      short_description: 'Cover decorativo con temática de playa',
      categories: [{ id: 2, name: 'Covers', slug: 'covers' }],
      featured: true,
      stock_status: 'instock' as const
    },
    {
      id: 3,
      name: 'Cover Oso - Montaña',
      slug: 'cover-oso-montana',
      price: '800',
      regular_price: '800',
      images: [{ 
        id: 3, 
        src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Cover temático de montaña'
      }],
      short_description: 'Cover decorativo con temática de montaña',
      categories: [{ id: 2, name: 'Covers', slug: 'covers' }],
      featured: true,
      stock_status: 'instock' as const
    },
    {
      id: 4,
      name: 'Starter Kit',
      slug: 'starter-kit',
      price: '3500',
      regular_price: '4100',
      sale_price: '3500',
      images: [{ 
        id: 4, 
        src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Kit completo con QR y covers'
      }],
      short_description: 'QR + 2 Covers a elección',
      categories: [{ id: 3, name: 'Packs', slug: 'packs' }],
      featured: true,
      stock_status: 'instock' as const,
      on_sale: true
    }
  ];

  const displayProducts = products || placeholderProducts;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Desde colgantes QR básicos hasta kits completos y covers temáticos intercambiables
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Ver toda la tienda
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};