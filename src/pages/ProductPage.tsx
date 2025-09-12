import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { useProductBySlug } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  // Producto placeholder si no hay conexión
  const placeholderProduct = {
    id: 1,
    name: 'Colgante QR Básico',
    slug: 'colgante-qr-basico',
    type: 'simple' as const,
    status: 'publish' as const,
    featured: true,
    catalog_visibility: 'visible',
    price: '2500',
    regular_price: '2500',
    sale_price: undefined,
    on_sale: false,
    purchasable: true,
    stock_quantity: 50,
    shipping_required: true,
    reviews_allowed: true,
    sku: 'QR-BASIC-001',
    upsell_ids: [],
    cross_sell_ids: [],
    tags: [],
    menu_order: 0,
    description: `
      <p>El <strong>Colgante QR Básico</strong> es la solución perfecta para mantener segura a tu mascota. Fabricado con materiales resistentes al agua y uso diario.</p>
      
      <h3>Características principales:</h3>
      <ul>
        <li>✅ Resistente al agua y golpes</li>
        <li>✅ QR de alta resolución que no se borra</li>
        <li>✅ Compatible con todos los covers Serie A</li>
        <li>✅ Cierre de seguridad reforzado</li>
        <li>✅ Garantía de por vida del QR</li>
      </ul>

      <h3>¿Qué incluye?</h3>
      <ul>
        <li>• 1 Base QR con código único</li>
        <li>• 1 Cierre reforzado</li>
        <li>• Instrucciones de activación</li>
        <li>• Garantía de por vida</li>
      </ul>
    `,
    short_description: 'Base QR resistente para cualquier mascota. Compatible con covers Serie A.',
    images: [
      { id: 1, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Vista principal' },
      { id: 2, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Vista lateral' },
      { id: 3, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Detalle QR' }
    ],
    categories: [{ id: 1, name: 'QR Básicos', slug: 'qr', description: undefined, image: undefined, count: 5 }],
    attributes: [
      { id: 1, name: 'Tamaño', options: ['S', 'M', 'L'], variation: true, visible: true },
      { id: 2, name: 'Color Base', options: ['Negro', 'Blanco', 'Gris'], variation: true, visible: true }
    ],
    stock_status: 'instock' as const,
    average_rating: '4.8',
    rating_count: 127
  };

  const displayProduct = product || placeholderProduct;

  const handleAddToCart = () => {
    addToCart(displayProduct, quantity, selectedVariations);
    
    // Mostrar feedback visual
    const button = document.querySelector('[data-add-to-cart]') as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Agregado ✓';
      button.classList.add('bg-green-700');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-700');
      }, 1500);
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'Cover Pez - Playa',
      slug: 'cover-pez-playa',
      price: '800',
      images: [{ id: 2, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Cover Pez' }],
      short_description: 'Cover decorativo temática playa'
    },
    {
      id: 3,
      name: 'Pack 3 Covers',
      slug: 'pack-3-covers',
      price: '2000',
      regular_price: '2400',
      images: [{ id: 3, src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Pack Covers' }],
      short_description: '3 covers con descuento'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-48"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-green-600 transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-gray-900">{displayProduct.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={displayProduct.images[selectedImage]?.src || displayProduct.images[0]?.src}
                alt={displayProduct.images[selectedImage]?.alt || displayProduct.name}
                className="w-full h-96 object-cover"
              />
              
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {displayProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayProduct.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProduct.name}</h1>
              <p className="text-lg text-gray-600">{displayProduct.short_description}</p>
              
              {/* Rating */}
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(parseFloat(displayProduct.average_rating || '0')) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {displayProduct.average_rating} ({displayProduct.rating_count} reseñas)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">${displayProduct.price}</span>
                {displayProduct.sale_price && (
                  <span className="text-lg text-gray-500 line-through">${displayProduct.regular_price}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Precios en pesos argentinos</p>
            </div>

            {/* Variations */}
            {displayProduct.attributes && displayProduct.attributes.length > 0 && (
              <div className="space-y-4">
                {displayProduct.attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <h4 className="font-medium text-gray-900 mb-2">{attribute.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {attribute.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedVariations(prev => ({
                            ...prev,
                            [attribute.name]: option
                          }))}
                          className={`px-4 py-2 border-2 rounded-lg transition-all ${
                            selectedVariations[attribute.name] === option
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-sm text-gray-600">
                  {displayProduct.stock_status === 'instock' ? 'En stock' : 'Sin stock'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  data-add-to-cart
                  onClick={handleAddToCart}
                  disabled={displayProduct.stock_status !== 'instock'}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al carrito
                </button>
                
                <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Garantía de por vida</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Envío gratis +$3000</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">30 días devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Details */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Descripción del producto</h3>
              <div 
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: displayProduct.description }}
              />
            </div>
          </div>

          {/* Related Products */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Te puede interesar</h3>
              <div className="space-y-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/producto/${relatedProduct.slug}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <img
                      src={relatedProduct.images[0].src}
                      alt={relatedProduct.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-sm text-gray-600">${relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};