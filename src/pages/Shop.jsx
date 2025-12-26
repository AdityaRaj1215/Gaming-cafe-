import { useState, useEffect } from 'react';
import './Shop.css';

function Shop() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Gaming Mouse Pro',
      price: 79.99,
      image: '🖱️',
      description: 'High-precision gaming mouse with RGB lighting',
      category: 'Peripherals'
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 129.99,
      image: '⌨️',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      category: 'Peripherals'
    },
    {
      id: 3,
      name: 'Gaming Headset',
      price: 99.99,
      image: '🎧',
      description: '7.1 Surround sound gaming headset',
      category: 'Audio'
    },
    {
      id: 4,
      name: 'Gaming Chair',
      price: 299.99,
      image: '🪑',
      description: 'Ergonomic gaming chair with lumbar support',
      category: 'Furniture'
    },
    {
      id: 5,
      name: 'Gaming Monitor 27"',
      price: 349.99,
      image: '🖥️',
      description: '144Hz 4K gaming monitor',
      category: 'Displays'
    },
    {
      id: 6,
      name: 'RGB Mousepad',
      price: 39.99,
      image: '🖼️',
      description: 'Large RGB gaming mousepad',
      category: 'Peripherals'
    },
    {
      id: 7,
      name: 'Controller Pro',
      price: 69.99,
      image: '🎮',
      description: 'Wireless gaming controller',
      category: 'Controllers'
    },
    {
      id: 8,
      name: 'Gaming Desk',
      price: 199.99,
      image: '🪵',
      description: 'Large gaming desk with cable management',
      category: 'Furniture'
    }
  ]);

  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateCartAndNotify = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch custom event to update navigation cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    updateCartAndNotify(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCartAndNotify(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCartAndNotify(newCart);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Gaming Shop</h1>
        <p>Find the best gaming gear and accessories</p>
      </div>

      <div className="shop-container">
        <div className="shop-main">
          <div className="filter-bar">
            {categories.map(category => (
              <button
                key={category}
                className={filter === category ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-category">{product.category}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">{item.image}</div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ${total.toFixed(2)}</strong>
                </div>
                <button className="checkout-btn">Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;

