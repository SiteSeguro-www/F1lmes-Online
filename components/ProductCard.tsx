import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 flex flex-col h-full"
    >
      <div className="relative pt-[100%] w-full border-b border-gray-50">
        <img 
          src={product.image} 
          alt={product.title} 
          className="absolute top-0 left-0 w-full h-full object-contain p-4"
        />
        {product.fullDelivery && (
          <div className="absolute top-2 right-2 bg-green-50 rounded-full p-1 shadow-sm">
            <i className="fa-solid fa-bolt text-green-600 text-xs"></i>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-gray-900 text-sm font-light line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>
        
        {product.originalPrice && (
          <span className="text-gray-400 text-xs line-through">
            R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        )}
        
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-normal text-gray-900">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {discount > 0 && (
            <span className="text-green-600 text-xs font-medium">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <div className="text-green-600 text-xs font-semibold mb-2">
          em {product.installments}x R$ {(product.price / product.installments).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} sem juros
        </div>

        {product.fullDelivery && (
          <div className="text-green-600 text-xs font-bold italic mb-1">
            <i className="fa-solid fa-bolt mr-1"></i> FULL
          </div>
        )}
        
        {product.freeShipping && (
          <span className="text-green-600 text-xs font-medium">
            Frete grátis
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
