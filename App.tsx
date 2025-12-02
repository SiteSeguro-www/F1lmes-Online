import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import AIChatAssistant from './components/AIChatAssistant';

enum View {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Initialize cart from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ml_clone_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('ml_clone_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle URL-based routing (MPA simulation)
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.endsWith('cart.html')) {
      setCurrentView(View.CART);
    } else if (path.endsWith('product.html')) {
      const id = params.get('id');
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (product) {
        setSelectedProduct(product);
        setCurrentView(View.PRODUCT_DETAIL);
      } else {
        // Fallback to home if product not found
        window.location.href = 'index.html';
      }
    } else {
      // Default / Home
      setCurrentView(View.HOME);
      
      // Check for search or category params
      const cat = params.get('category');
      if (cat && CATEGORIES.includes(cat)) {
        setSelectedCategory(cat);
      }
      
      const search = params.get('q');
      if (search) {
        setSearchQuery(search);
      }
    }
  }, []);

  // Filter products logic
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert("Produto adicionado ao carrinho!");
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product.html
    window.location.href = `product.html?id=${product.id}`;
  };

  const goHome = () => {
    window.location.href = 'index.html';
  };
  
  const goToCart = () => {
    window.location.href = 'cart.html';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Optional: Update URL without reload for better UX on home, or reload if strict MPA desired
    if (currentView !== View.HOME) {
      window.location.href = `index.html?q=${encodeURIComponent(query)}`;
    }
  };

  const handleCategorySelect = (cat: string) => {
    if (currentView !== View.HOME) {
      window.location.href = `index.html?category=${encodeURIComponent(cat)}`;
    } else {
      setSelectedCategory(cat);
      // Optional: update URL
      const url = new URL(window.location.href);
      url.searchParams.set('category', cat);
      window.history.pushState({}, '', url);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const Navbar = () => (
    <header className="bg-ml-yellow shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <div className="text-ml-dark font-bold text-xl md:text-2xl cursor-pointer tracking-tighter" onClick={goHome}>
            MercadoClone<span className="text-ml-blue">AI</span>
          </div>

          {/* Search */}
          <div className="flex-1 flex max-w-3xl">
            <input 
              type="text" 
              placeholder="Buscar produtos, marcas e muito mais..." 
              className="w-full px-4 py-2 rounded-l-md shadow-sm border-none outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleSearch(searchQuery);
              }}
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="bg-white px-4 py-2 rounded-r-md border-l border-gray-100 shadow-sm text-gray-500 hover:text-ml-blue"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-6 text-sm text-ml-dark/80">
            <span className="cursor-pointer hover:text-ml-dark" onClick={() => handleCategorySelect('Todos')}>Categorias</span>
            <span className="cursor-pointer hover:text-ml-dark">Ofertas</span>
            <span className="cursor-pointer hover:text-ml-dark">Histórico</span>
            <span className="cursor-pointer hover:text-ml-dark">Moda</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 text-ml-dark">
            <div className="relative cursor-pointer" onClick={goToCart}>
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-ml-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="cursor-pointer text-sm">
              Entrar
            </div>
          </div>
        </div>
        
        {/* Categories Bar (Mobile/Desktop secondary) */}
        {currentView === View.HOME && (
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2 scrollbar-hide text-sm text-gray-700/80">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`whitespace-nowrap px-2 py-1 rounded transition-colors ${selectedCategory === cat ? 'bg-black/5 font-bold text-ml-dark' : 'hover:bg-black/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );

  const Hero = () => (
    <div className="bg-gradient-to-b from-ml-yellow to-gray-100 pb-8 pt-4 px-4">
      <div className="container mx-auto rounded-lg overflow-hidden shadow-md max-w-6xl">
        <div className="relative bg-white h-[200px] md:h-[300px] flex items-center justify-center bg-[url('https://picsum.photos/1200/400?grayscale')] bg-cover bg-center">
           <div className="absolute inset-0 bg-black/40"></div>
           <div className="relative text-center text-white p-6">
             <h1 className="text-3xl md:text-5xl font-bold mb-2">Ofertas Imperdíveis</h1>
             <p className="text-lg md:text-xl mb-6">Tudo o que você busca está aqui.</p>
             <button className="bg-ml-blue text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition">
               Ver Ofertas
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  const ProductDetailView = ({ product }: { product: Product }) => (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Gallery */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-lg aspect-square bg-white flex items-center justify-center mb-4">
             <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
          </div>
          <hr className="w-full border-gray-100 my-6" />
          <div className="w-full text-left">
             <h2 className="text-2xl font-normal mb-4 text-gray-800">Descrição</h2>
             <p className="text-gray-600 leading-relaxed text-sm md:text-base">
               {product.description}
             </p>
          </div>
          
          {/* AI Section */}
          <div className="w-full mt-8">
             <AIChatAssistant product={product} />
          </div>
        </div>

        {/* Buy Box */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
             <span className="text-xs text-gray-500 mb-2 block">Novo | {product.sold} vendidos</span>
             <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 leading-snug">
               {product.title}
             </h1>

             <div className="flex items-center gap-2 mb-4">
               <div className="flex text-ml-blue text-sm">
                 {[...Array(5)].map((_, i) => (
                   <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}></i>
                 ))}
               </div>
               <span className="text-gray-500 text-sm">({product.reviews})</span>
             </div>

             <div className="mb-6">
                {product.originalPrice && (
                  <span className="text-gray-400 text-sm line-through block">
                    R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className="text-4xl font-light text-gray-900 block">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-ml-blue font-medium text-sm mt-1 block">
                  em {product.installments}x R$ {(product.price / product.installments).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} sem juros
                </span>
             </div>

             {product.freeShipping && (
               <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-6">
                 <i className="fa-solid fa-truck"></i>
                 <span>Frete grátis para todo o país</span>
               </div>
             )}

             <div className="flex flex-col gap-3">
               <button 
                 onClick={() => addToCart(product)}
                 className="w-full bg-ml-blue hover:bg-blue-600 text-white font-semibold py-3 rounded transition-colors"
               >
                 Comprar agora
               </button>
               <button 
                 onClick={() => addToCart(product)}
                 className="w-full bg-blue-50 hover:bg-blue-100 text-ml-blue font-semibold py-3 rounded transition-colors"
               >
                 Adicionar ao carrinho
               </button>
             </div>

             <div className="mt-6 flex gap-2 items-center text-xs text-gray-500">
               <i className="fa-solid fa-shield-halved"></i>
               <span><span className="text-ml-blue cursor-pointer">Compra Garantida</span>, receba o produto que está esperando ou devolvemos o dinheiro.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CartView = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Carrinho ({cart.length})</h2>
      
      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <i className="fa-solid fa-cart-arrow-down text-6xl text-gray-200 mb-4"></i>
          <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
          <button onClick={goHome} className="text-ml-blue font-semibold">Ver ofertas</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-sm flex gap-4 border border-gray-200">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                  <div className="mt-2 flex justify-between items-end">
                     <span className="text-xs text-gray-500">Quantidade: {item.quantity}</span>
                     <span className="font-semibold text-gray-900">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 sticky top-24">
               <div className="flex justify-between mb-4 text-lg font-semibold text-gray-800">
                 <span>Total</span>
                 <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
               </div>
               <button className="w-full bg-ml-blue text-white py-3 rounded font-bold hover:bg-blue-600 transition">
                 Continuar Compra
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      {currentView === View.HOME && (
        <>
          <Hero />
          <main className="container mx-auto px-4 -mt-8 relative z-10 max-w-6xl">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl text-gray-600 font-light mb-6">
                {selectedCategory === 'Todos' ? 'Baseado na sua última visita' : `Categoria: ${selectedCategory}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={handleProductClick} 
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Nenhum produto encontrado.
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {currentView === View.PRODUCT_DETAIL && selectedProduct && (
        <ProductDetailView product={selectedProduct} />
      )}

      {currentView === View.CART && (
        <CartView />
      )}
    </div>
  );
};

export default App;