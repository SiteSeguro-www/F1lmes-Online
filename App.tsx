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
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY'
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
    } else if (path.endsWith('terms.html')) {
      setCurrentView(View.TERMS);
    } else if (path.endsWith('privacy.html')) {
      setCurrentView(View.PRIVACY);
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
    <header className="bg-ml-yellow shadow-sm sticky top-0 z-50 border-b border-ml-yellow">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-ml-dark font-bold text-xl md:text-2xl cursor-pointer tracking-tighter" onClick={() => navigateTo('index.html')}>
              MercadoClone<span className="text-ml-blue">AI</span>
            </div>
            <div className="md:hidden flex items-center gap-4 text-ml-dark">
               <div className="relative cursor-pointer" onClick={() => navigateTo('cart.html')}>
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-ml-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
              </div>
            </div>
          </div>

          <div className="flex-1 flex shadow-sm">
            <input 
              type="text" 
              placeholder="Buscar produtos, marcas e muito mais..." 
              className="w-full px-4 py-2 rounded-l border-none outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigateTo(`index.html?q=${encodeURIComponent(searchQuery)}`)}
            />
            <button className="bg-white px-4 py-2 rounded-r border-l border-gray-100 text-gray-400 hover:text-ml-blue transition-colors">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6 text-ml-dark font-normal">
            <div className="flex items-center gap-1 cursor-pointer hover:text-ml-blue transition-colors text-sm">
               <i className="fa-solid fa-location-dot"></i>
               Enviar para Brasil
            </div>
            <div className="relative cursor-pointer hover:text-ml-blue transition-colors" onClick={() => navigateTo('cart.html')}>
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-ml-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div>
            <h4 className="font-bold text-gray-800 mb-5">Sobre o MercadoClone</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('about.html')}>Quem somos</li>
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('terms.html')}>Termos e Condições</li>
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('privacy.html')}>Política de Privacidade</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-5">Ajuda</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-ml-blue cursor-pointer" onClick={() => navigateTo('contact.html')}>Fale conosco</li>
              <li className="hover:text-ml-blue cursor-pointer">Central de Ajuda</li>
              <li className="hover:text-ml-blue cursor-pointer">Segurança</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-5">Redes Sociais</h4>
            <div className="flex gap-5 text-gray-400">
              <i className="fa-brands fa-facebook hover:text-ml-blue cursor-pointer text-2xl transition-colors"></i>
              <i className="fa-brands fa-instagram hover:text-ml-blue cursor-pointer text-2xl transition-colors"></i>
              <i className="fa-brands fa-twitter hover:text-ml-blue cursor-pointer text-2xl transition-colors"></i>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-5">Baixe o App</h4>
            <div className="space-y-3">
               <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full hover:bg-gray-50">
                 <i className="fa-brands fa-apple text-xl"></i> App Store
               </button>
               <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 w-full hover:bg-gray-50">
                 <i className="fa-brands fa-google-play text-lg"></i> Google Play
               </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-xs text-gray-400 leading-relaxed">
          <p>Copyright © 1999-2024 MercadoClone AI S.A. CNPJ n.º 00.000.000/0001-00</p>
          <p className="mt-2">Av. das Nações Unidas, nº 3.003, Bonfim, Osasco/SP - CEP 06233-903 - empresa do grupo Mercado Clone.</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="flex-1">
        {currentView === View.HOME && (
          <>
            <div className="bg-ml-yellow h-48 w-full -mb-32"></div>
            <main className="container mx-auto px-4 relative z-10 max-w-6xl pb-20">
              <div className="bg-white p-6 rounded shadow-sm min-h-[600px]">
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => navigateTo(`index.html?category=${cat}`)}
                      className={`whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all ${selectedCategory === cat ? 'bg-ml-blue text-white font-bold' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {currentView === View.PRODUCT_DETAIL && selectedProduct && (
          <div className="container mx-auto px-4 py-12 max-w-6xl">
             <div className="bg-white p-8 rounded shadow-sm grid md:grid-cols-2 gap-12">
                <div className="flex flex-col items-center">
                   <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full max-w-md object-contain h-auto rounded" />
                   <div className="mt-8 border-t border-gray-100 pt-8 w-full">
                      <h3 className="font-bold text-lg mb-4 text-gray-800">Descrição do Produto</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p>
                   </div>
                </div>
                <div>
                   <span className="text-gray-400 text-sm mb-1 block">Novo | {selectedProduct.sold}+ vendidos</span>
                   <h1 className="text-2xl font-bold mb-6 text-gray-900 leading-tight">{selectedProduct.title}</h1>
                   <div className="mb-8">
                      {selectedProduct.originalPrice && (
                        <span className="text-gray-400 text-lg line-through">R$ {selectedProduct.originalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      )}
                      <div className="text-4xl font-normal text-gray-900">R$ {selectedProduct.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                      <div className="text-green-600 font-medium text-sm mt-1">em {selectedProduct.installments}x R$ {(selectedProduct.price / selectedProduct.installments).toLocaleString('pt-BR', {maximumFractionDigits: 2})} sem juros</div>
                   </div>
                   
                   <div className="space-y-3 mb-10">
                      <button onClick={() => { addToCart(selectedProduct); alert('Adicionado ao carrinho!'); }} className="w-full bg-ml-blue text-white py-4 rounded font-bold hover:bg-blue-600 transition-colors shadow-sm">Comprar agora</button>
                      <button onClick={() => addToCart(selectedProduct)} className="w-full bg-blue-50 text-ml-blue py-4 rounded font-bold hover:bg-blue-100 transition-colors">Adicionar ao carrinho</button>
                   </div>
                   
                   <AIChatAssistant product={selectedProduct} />
                </div>
             </div>
          </div>
        )}

        {currentView === View.CART && (
          <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[500px]">
             <h2 className="text-3xl font-bold mb-10 text-gray-800">Carrinho de Compras</h2>
             {cart.length === 0 ? (
               <div className="bg-white p-12 rounded shadow-sm text-center">
                  <i className="fa-solid fa-cart-arrow-down text-6xl text-gray-100 mb-6"></i>
                  <p className="text-gray-500 text-lg mb-6">Seu carrinho está vazio.</p>
                  <button onClick={() => navigateTo('index.html')} className="bg-ml-blue text-white px-10 py-3 rounded font-bold">Ver ofertas do dia</button>
               </div>
             ) : (
               <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded shadow-sm flex gap-6 items-center">
                        <img src={item.image} className="w-20 h-20 object-contain rounded border border-gray-50" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500 mt-1">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg">R$ {(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                           <button className="text-ml-blue text-xs mt-2 hover:underline">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-6 rounded shadow-sm h-fit sticky top-24">
                     <h3 className="font-bold text-gray-800 mb-6 border-b pb-4">Resumo da Compra</h3>
                     <div className="flex justify-between text-gray-600 mb-2"><span>Produtos</span><span>R$ {cartTotal.toLocaleString('pt-BR')}</span></div>
                     <div className="flex justify-between text-green-600 mb-4 font-medium"><span>Frete</span><span>Grátis</span></div>
                     <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4"><span>Total</span><span>R$ {cartTotal.toLocaleString('pt-BR')}</span></div>
                     <button className="w-full bg-ml-blue text-white py-4 rounded font-bold mt-8 shadow-md">Finalizar compra</button>
                  </div>
               </div>
             )}
          </div>
        )}

        {currentView === View.ABOUT && (
          <div className="container mx-auto px-4 py-16 max-w-3xl">
             <div className="bg-white rounded shadow-sm p-10 leading-relaxed">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 border-b pb-6">Sobre o MercadoClone AI</h1>
                <p className="text-gray-600 mb-6 text-lg">O MercadoClone AI nasceu do desejo de transformar a experiência de e-commerce tradicional em algo mais interativo e inteligente.</p>
                <p className="text-gray-600 mb-6">Integrando o poder da Inteligência Artificial do Google Gemini, oferecemos um assistente virtual em cada produto para tirar suas dúvidas em tempo real, como se você estivesse em uma loja física conversando com um especialista.</p>
                <p className="text-gray-600">Nossa plataforma prioriza a agilidade, segurança e a melhor experiência de usuário possível.</p>
             </div>
          </div>
        )}

        {currentView === View.TERMS && (
          <div className="container mx-auto px-4 py-16 max-w-3xl">
             <div className="bg-white rounded shadow-sm p-10 leading-relaxed text-gray-600">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Termos e Condições</h1>
                <p className="mb-4">Ao acessar o MercadoClone AI, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.</p>
                <h3 className="font-bold text-gray-800 mt-6 mb-2">1. Uso de Licença</h3>
                <p className="mb-4">É concedida permissão para baixar temporariamente uma cópia dos materiais no site apenas para visualização transitória pessoal e não comercial.</p>
                <h3 className="font-bold text-gray-800 mt-6 mb-2">2. Isenção de responsabilidade</h3>
                <p>Os materiais no site são fornecidos 'como estão'. Não oferecemos garantias, expressas ou implícitas.</p>
             </div>
          </div>
        )}

        {currentView === View.PRIVACY && (
          <div className="container mx-auto px-4 py-16 max-w-3xl">
             <div className="bg-white rounded shadow-sm p-10 leading-relaxed text-gray-600">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Política de Privacidade</h1>
                <p className="mb-4">A sua privacidade é importante para nós. É política do MercadoClone AI respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar.</p>
                <p className="mb-4">Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
                <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>
             </div>
          </div>
        )}

        {currentView === View.CONTACT && (
          <div className="container mx-auto px-4 py-16 max-w-lg">
             <div className="bg-white rounded shadow-sm p-10">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Fale Conosco</h1>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Nome completo</label>
                    <input type="text" className="w-full border border-gray-300 p-3 rounded focus:border-ml-blue focus:ring-1 focus:ring-ml-blue outline-none transition-all" placeholder="Seu nome..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">E-mail</label>
                    <input type="email" className="w-full border border-gray-300 p-3 rounded focus:border-ml-blue focus:ring-1 focus:ring-ml-blue outline-none transition-all" placeholder="exemplo@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Mensagem</label>
                    <textarea className="w-full border border-gray-300 p-3 rounded h-40 focus:border-ml-blue focus:ring-1 focus:ring-ml-blue outline-none transition-all" placeholder="Como podemos ajudar?"></textarea>
                  </div>
                  <button type="button" className="w-full bg-ml-blue text-white py-4 rounded font-bold shadow-md hover:bg-blue-600 transition-colors">Enviar Mensagem</button>
                </form>
             </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;