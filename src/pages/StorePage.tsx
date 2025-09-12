import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export const StorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: products, isLoading } = useProducts({
    category: currentCategory,
    page: currentPage,
    per_page: 12,
    search: searchTerm
  });

  const { data: categories } = useCategories();

  const themes = ['playa', 'montaña', 'ciudad', 'clásico'];
  const sizes = ['S', 'M', 'L'];

  const handleCategoryFilter = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug) {
      newParams.set('category', categorySlug);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Productos placeholder si no hay conexión
  const placeholderProducts = [
    {
      id: 1,
      name: 'Colgante QR Básico',
      slug: 'colgante-qr-basico',
      price: '2500',
      regular_price: '2500',
      images: [{ id: 1, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'QR Básico' }],
      short_description: 'Base QR resistente al agua',
      categories: [{ id: 1, name: 'QR', slug: 'qr' }],
      featured: true,
      stock_status: 'instock' as const
    },
    {
      id: 2,
      name: 'Cover Pez - Playa',
      slug: 'cover-pez-playa',
      price: '800',
      regular_price: '800',
      images: [{ id: 2, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Cover Pez' }],
      short_description: 'Cover decorativo temática playa',
      categories: [{ id: 2, name: 'Covers', slug: 'covers' }],
      featured: false,
      stock_status: 'instock' as const
    },
    {
      id: 3,
      name: 'Cover Oso - Montaña',
      slug: 'cover-oso-montana',
      price: '800',
      regular_price: '800',
      images: [{ id: 3, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Cover Oso' }],
      short_description: 'Cover decorativo temática montaña',
      categories: [{ id: 2, name: 'Covers', slug: 'covers' }],
      featured: false,
      stock_status: 'instock' as const
    },
    {
      id: 4,
      name: 'Pack 3 Covers',
      slug: 'pack-3-covers',
      price: '2000',
      regular_price: '2400',
      sale_price: '2000',
      images: [{ id: 4, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Pack Covers' }],
      short_description: '3 covers temáticos con descuento',
      categories: [{ id: 3, name: 'Packs', slug: 'packs' }],
      featured: true,
      stock_status: 'instock' as const,
      on_sale: true
    },
    {
      id: 5,
      name: 'Starter Kit',
      slug: 'starter-kit',
      price: '3500',
      regular_price: '4100',
      sale_price: '3500',
      images: [{ id: 5, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Starter Kit' }],
      short_description: 'QR + 2 Covers a elección',
      categories: [{ id: 3, name: 'Packs', slug: 'packs' }],
      featured: true,
      stock_status: 'instock' as const,
      on_sale: true
    },
    {
      id: 6,
      name: 'Cover Hueso - Ciudad',
      slug: 'cover-hueso-ciudad',
      price: '800',
      regular_price: '800',
      images: [{ id: 6, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Cover Hueso' }],
      short_description: 'Cover decorativo temática urbana',
      categories: [{ id: 2, name: 'Covers', slug: 'covers' }],
      featured: false,
      stock_status: 'instock' as const
    }
  ];

  const displayProducts = products || placeholderProducts;
  const displayCategories = categories || [
    { id: 1, name: 'QR Básicos', slug: 'qr', count: 1 },
    { id: 2, name: 'Covers', slug: 'covers', count: 3 },
    { id: 3, name: 'Packs', slug: 'packs', count: 2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tienda AFPets</h1>
          <p className="text-lg text-gray-600">
            Encontrá el colgante QR perfecto y personalizalo con covers únicos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600 hover:text-green-600"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categorías */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !currentCategory ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Todos los productos
                    </button>
                    {displayCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryFilter(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between ${
                          currentCategory === category.slug 
                            ? 'bg-green-100 text-green-800' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temas */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Temas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors capitalize"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tamaños */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tamaños</h4>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and View Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {displayProducts.length} productos
                  </span>
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-4'
              }`}>
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  Anterior
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};