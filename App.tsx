import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import AIChatAssistant from './components/AIChatAssistant';

enum View {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  TERMS = 'TERMS'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ml_clone_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    localStorage.setItem('ml_clone_cart', JSON.stringify(cart));
  }, [cart]);

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
        window.location.href = 'index.html';
      }
    } else if (path.endsWith('about.html')) {
      setCurrentView(View.ABOUT);
    } else if (path.endsWith('contact.html')) {
      setCurrentView(View.CONTACT);
    } else {
      setCurrentView(View.HOME);
      const cat = params.get('category');
      if (cat && CATEGORIES.includes(cat)) setSelectedCategory(cat);
      const search = params.get('q');
      if (search) setSearchQuery(search);
    }
  }, []);

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
  };

  const handleProductClick = (product: Product) => {
    window.location.href = `product.html?id=${product.id}`;
  };

  const navigateTo = (page: string) => {
    window.location.href = page;
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const Navbar = () => (
    <header className="bg-ml-yellow shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="text-ml-dark font-bold text-xl md:text-2xl cursor-pointer tracking-tighter" onClick={() => navigateTo('index.html')}>
            MercadoClone<span className="text-ml-blue">AI</span>
          </div>

          <div className="flex-1 flex max-w-3xl">
            <input 
              type="text" 
              placeholder="Buscar produtos, marcas e muito mais..." 
              className="w-full px-4 py-2 rounded-l-md shadow-sm border-none outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigateTo(`index.html?q=${encodeURIComponent(searchQuery)}`)}
            />
            <button className="bg-white px-4 py-2 rounded-r-md border-l border-gray-100 shadow-sm text-gray-500 hover:text-ml-blue">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="flex items-center gap-4 text-ml-dark">
            <div className="relative cursor-pointer" onClick={() => navigateTo('cart.html')}>
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-ml-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="cursor-pointer text-sm hidden sm:block">Entrar</div>
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-12 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Sobre</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('about.html')}>Quem somos</li>
              <li className="hover:text-ml-blue cursor-pointer">Trabalhe conosco</li>
              <li className="hover:text-ml-blue cursor-pointer">Investidores</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Ajuda</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('contact.html')}>Contato</li>
              <li className="hover:text-ml-blue cursor-pointer">Como comprar</li>
              <li className="hover:text-ml-blue cursor-pointer">Devoluções</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Redes Sociais</h4>
            <div className="flex gap-4 text-gray-400">
              <i className="fa-brands fa-facebook hover:text-ml-blue cursor-pointer text-xl"></i>
              <i className="fa-brands fa-instagram hover:text-ml-blue cursor-pointer text-xl"></i>
              <i className="fa-brands fa-twitter hover:text-ml-blue cursor-pointer text-xl"></i>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Pagamento</h4>
            <div className="flex flex-wrap gap-2 opacity-60">
              <i className="fa-brands fa-cc-visa text-2xl"></i>
              <i className="fa-brands fa-cc-mastercard text-2xl"></i>
              <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
          <p>Copyright © 1999-2024 MercadoClone AI S.A. CNPJ n.º 00.000.000/0001-00</p>
          <p className="mt-2">Av. das Nações Unidas, nº 3.003, Bonfim, Osasco/SP - CEP 06233-903 - empresa do grupo Mercado Clone.</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {currentView === View.HOME && (
          <>
            <div className="bg-ml-yellow h-40 w-full"></div>
            <main className="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8 min-h-[500px]">
                <div className="flex gap-4 overflow-x-auto pb-4 mb-6 border-b border-gray-50">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => navigateTo(`index.html?category=${cat}`)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${selectedCategory === cat ? 'bg-ml-blue text-white font-bold' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {currentView === View.PRODUCT_DETAIL && selectedProduct && (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
             <div className="bg-white p-6 rounded-lg shadow-sm grid md:grid-cols-2 gap-8">
                <img src={selectedProduct.image} className="w-full object-contain max-h-96" />
                <div>
                   <h1 className="text-2xl font-bold mb-4">{selectedProduct.title}</h1>
                   <div className="text-3xl font-light mb-4">R$ {selectedProduct.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                   <button onClick={() => { addToCart(selectedProduct); alert('Adicionado!'); }} className="w-full bg-ml-blue text-white py-3 rounded font-bold mb-4">Comprar Agora</button>
                   <AIChatAssistant product={selectedProduct} />
                </div>
             </div>
          </div>
        )}

        {currentView === View.CART && (
          <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[400px]">
             <h2 className="text-2xl font-bold mb-6">Meu Carrinho</h2>
             {cart.length === 0 ? <p className="text-gray-500">Vazio.</p> : (
               <div className="space-y-4">
                 {cart.map(item => (
                   <div key={item.id} className="bg-white p-4 rounded shadow-sm flex gap-4">
                     <img src={item.image} className="w-16 h-16 object-contain" />
                     <div className="flex-1">
                       <p className="font-medium">{item.title}</p>
                       <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                     </div>
                     <p className="font-bold">R$ {item.price.toLocaleString('pt-BR')}</p>
                   </div>
                 ))}
                 <div className="text-right text-xl font-bold mt-4">Total: R$ {cartTotal.toLocaleString('pt-BR')}</div>
               </div>
             )}
          </div>
        )}

        {currentView === View.ABOUT && (
          <div className="container mx-auto px-4 py-12 max-w-3xl bg-white mt-8 rounded shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6">Sobre o MercadoClone AI</h1>
            <p className="text-gray-600 leading-relaxed mb-4">O MercadoClone AI é uma plataforma experimental que une a experiência clássica de e-commerce com o poder da Inteligência Artificial.</p>
            <p className="text-gray-600 leading-relaxed">Nossa missão é facilitar a decisão de compra através de assistentes inteligentes integrados.</p>
          </div>
        )}

        {currentView === View.CONTACT && (
          <div className="container mx-auto px-4 py-12 max-w-lg bg-white mt-8 rounded shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6">Contato</h1>
            <form className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nome</label><input type="text" className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" className="w-full border p-2 rounded" /></div>
              <div><label className="block text-sm font-medium mb-1">Mensagem</label><textarea className="w-full border p-2 rounded h-32"></textarea></div>
              <button type="button" className="bg-ml-blue text-white px-6 py-2 rounded font-bold">Enviar</button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;