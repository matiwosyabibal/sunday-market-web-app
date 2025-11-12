import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

// Sample product data - replace with your actual data
const products = [
  {
    id: 1,
    name: 'iPhone 14 Pro Max',
    category: 'Smartphones',
    price: 1299,
    image: '/images/products/iphone.jpg',
    description: 'The latest iPhone with Pro camera system and A16 Bionic chip.',
    inStock: true
  },
  {
    id: 2,
    name: 'MacBook Pro M2',
    category: 'Laptops',
    price: 1999,
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Supercharged by M2 Pro or M2 Max, MacBook Pro takes its power and efficiency further than ever.',
    inStock: true
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 399,
    image: 'https://images.pexels.com/photos/3945661/pexels-photo-3945661.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Industry-leading noise cancellation and superior sound quality.',
    inStock: true
  },
  {
    id: 4,
    name: 'Samsung QN90B 65"',
    category: 'TVs',
    price: 1799,
    image: 'https://i.imgur.com/Ys9Xg2P.jpg',
    description: 'Neo QLED 4K Smart TV with Quantum Matrix Technology.',
    inStock: true
  },
  {
    id: 5,
    name: 'PlayStation 5',
    category: 'Gaming',
    price: 499,
    image: 'https://i.imgur.com/0rVeh4A.jpg',
    description: 'Next-gen gaming console with ultra-high speed SSD and 3D Audio.',
    inStock: false
  },
  {
    id: 6,
    name: 'Apple Watch Series 8',
    category: 'Wearables',
    price: 429,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'A healthy leap ahead. With temperature sensing, Crash Detection, and more.',
    inStock: true
  },
  {
    id: 7,
    name: 'Dell XPS 15',
    category: 'Laptops',
    price: 1899,
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Powerhouse performance with stunning 4K display and latest Intel processors.',
    inStock: true
  },
  {
    id: 8,
    name: 'Bose QuietComfort 45',
    category: 'Audio',
    price: 329,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Premium noise cancelling headphones with exceptional sound quality.',
    inStock: true
  },
];

const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'TVs', 'Gaming', 'Wearables'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Handle add to cart - redirects to login if not authenticated
  const handleAddToCart = (product) => {
    // In a real app, you would check if user is authenticated here
    // For now, we'll always redirect to login
    navigate('/login', { state: { from: 'products' } });
  };

  // Filter products based on search term, category and price range
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'newest':
          return b.id - a.id; // Assuming higher IDs are newer
        default:
          return 0; // Default sorting (featured)
      }
    });

  // Handle product click to show details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Format price with ETB currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Find the perfect electronics to match your lifestyle and budget
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, categories..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Mobile Toggle */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <FiFilter />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing <span className="font-medium">{filteredProducts.length}</span> products
              </p>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown />
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
                  >
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image+Not+Available';
                        }}
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white font-medium text-sm">View Details</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.inStock}
                        className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FiShoppingCart />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceRange([0, 2000]);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="max-h-80 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x500?text=Product+Image+Not+Available';
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{selectedProduct.category}</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(selectedProduct)}
                      disabled={!selectedProduct.inStock}
                      className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                        selectedProduct.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart />
                      {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
