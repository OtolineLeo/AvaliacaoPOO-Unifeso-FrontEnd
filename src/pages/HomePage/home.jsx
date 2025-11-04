import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';

export function HomePage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [wishlist, setWishlist] = useState([]);
    const [toast, setToast] = useState(null);
    const [sortBy, setSortBy] = useState('name');

    const products = [
        {
            id: 1,
            name: "Mouse Gamer RGB",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&crop=center",
            description: "Mouse gamer com iluminação RGB, 12000 DPI, 7 botões programáveis",
            category: "mouse",
            rating: 4.5,
            reviews: 128
        },
        {
            id: 2,
            name: "Teclado Mecânico",
            price: 299.99,
            image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&crop=center",
            description: "Teclado mecânico com switches blue, RGB por tecla, layout ABNT2",
            category: "teclado",
            rating: 4.7,
            reviews: 203
        },
        {
            id: 3,
            name: "Fone Headset Gamer",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop&crop=center",
            description: "Headset gamer 7.1 surround, microfone removível, almofadas confortáveis",
            category: "fone",
            rating: 4.4,
            reviews: 97
        },
        {
            id: 4,
            name: "Monitor 24\" 144Hz",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop&crop=center",
            description: "Monitor gamer 24 polegadas, 144Hz, 1ms, Full HD, painel IPS",
            category: "monitor",
            rating: 4.8,
            reviews: 167
        },
        {
            id: 5,
            name: "Mousepad Gamer XXL",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&h=300&fit=crop&crop=center",
            description: "Mousepad gamer extra grande, base antiderrapante, bordas costuradas",
            category: "mouse",
            rating: 4.8,
            reviews: 156
        },
        {
            id: 6,
            name: "Webcam 4K Ultra HD",
            price: 399.99,
            image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&crop=center",
            description: "Webcam 4K com foco automático, microfone integrado, ideal para streaming",
            category: "webcam",
            rating: 4.6,
            reviews: 89
        },
        {
            id: 7,
            name: "Cadeira Gamer Pro",
            price: 1299.99,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
            description: "Cadeira gamer ergonômica, apoio lombar, braços ajustáveis, couro sintético",
            category: "cadeira",
            rating: 4.9,
            reviews: 234
        },
        {
            id: 8,
            name: "SSD NVMe 1TB",
            price: 599.99,
            image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop&crop=center",
            description: "SSD NVMe M.2, velocidade de leitura 3500MB/s, ideal para games",
            category: "storage",
            rating: 4.7,
            reviews: 312
        }
    ];

    useEffect(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Ordenação
        filtered.sort((a, b) => {
            switch(sortBy) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                default: return a.name.localeCompare(b.name);
            }
        });

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, sortBy]);

    useEffect(() => {
        setFilteredProducts(products);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        showToast(`${product.name} adicionado ao carrinho!`);
    };

    const toggleWishlist = (product) => {
        const isInWishlist = wishlist.find(item => item.id === product.id);
        if (isInWishlist) {
            setWishlist(wishlist.filter(item => item.id !== product.id));
            showToast(`${product.name} removido da lista de desejos`, 'info');
        } else {
            setWishlist([...wishlist, product]);
            showToast(`${product.name} adicionado à lista de desejos!`);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`${styles.star} ${i < Math.floor(rating) ? styles.starFilled : ''}`}>
                ⭐
            </span>
        ));
    };

    const categories = ['all', 'mouse', 'teclado', 'fone', 'monitor', 'webcam', 'cadeira', 'storage'];
    const categoryNames = {
        all: 'Todos',
        mouse: 'Mouse',
        teclado: 'Teclado',
        fone: 'Fone',
        monitor: 'Monitor',
        webcam: 'Webcam',
        cadeira: 'Cadeira',
        storage: 'Armazenamento'
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.floatingShapes}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>

            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoCircle}>
                            <span className={styles.logoIcon}>🛒</span>
                        </div>
                        <h1>Mercadinho Virtual</h1>
                    </div>

                    <div className={styles.searchSection}>
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.userSection}>
                        <button 
                            className={styles.cartButton}
                            onClick={() => setShowCart(!showCart)}
                        >
                            <span className={styles.cartIcon}>🛒</span>
                            <span className={styles.cartCount}>{cart.length}</span>
                        </button>
                        <button 
                            className={styles.logoutButton}
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.welcomeSection}>
                    <h2>Bem-vindo à nossa loja!</h2>
                    <p>Encontre os melhores produtos gamer com os melhores preços</p>
                </div>

                <div className={styles.filtersSection}>
                    <div className={styles.categoryFilters}>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {categoryNames[category]}
                            </button>
                        ))}
                    </div>
                    
                    <div className={styles.sortSection}>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="name">Nome A-Z</option>
                            <option value="price-low">Menor Preço</option>
                            <option value="price-high">Maior Preço</option>
                            <option value="rating">Melhor Avaliado</option>
                        </select>
                    </div>
                </div>

                <div className={styles.productsGrid}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.productImage}>
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className={styles.productImg}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <span className={styles.productEmoji} style={{display: 'none'}}>🖱️</span>
                                <div className={styles.productBadge}>Novo</div>
                            </div>
                            <div className={styles.productInfo}>
                                <div className={styles.productHeader}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <button 
                                        className={`${styles.wishlistButton} ${wishlist.find(item => item.id === product.id) ? styles.inWishlist : ''}`}
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        ❤️
                                    </button>
                                </div>
                                
                                <div className={styles.productRating}>
                                    <div className={styles.stars}>
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className={styles.ratingText}>
                                        {product.rating} ({product.reviews} avaliações)
                                    </span>
                                </div>
                                
                                <p className={styles.productDescription}>{product.description}</p>
                                
                                <div className={styles.productPrice}>
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                </div>
                                
                                <div className={styles.productActions}>
                                    <button 
                                        className={styles.addToCartButton}
                                        onClick={() => addToCart(product)}
                                    >
                                        <span className={styles.buttonText}>Adicionar ao Carrinho</span>
                                        <span className={styles.buttonIcon}>🛒</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className={styles.noProducts}>
                        <span className={styles.noProductsIcon}>😔</span>
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente buscar por outro termo</p>
                    </div>
                )}
            </main>

            {toast && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>
                    <span className={styles.toastIcon}>
                        {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span className={styles.toastMessage}>{toast.message}</span>
                </div>
            )}

            {showCart && (
                <div className={styles.cartOverlay} onClick={() => setShowCart(false)}>
                    <div className={styles.cartModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.cartHeader}>
                            <h3>Carrinho de Compras</h3>
                            <button 
                                className={styles.closeCart}
                                onClick={() => setShowCart(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.cartContent}>
                            {cart.length === 0 ? (
                                <div className={styles.emptyCart}>
                                    <span className={styles.emptyCartIcon}>🛒</span>
                                    <p>Seu carrinho está vazio</p>
                                </div>
                            ) : (
                                <>
                                    {cart.map(item => (
                                        <div key={item.id} className={styles.cartItem}>
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className={styles.cartItemImage}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'inline';
                                                }}
                                            />
                                            <span className={styles.cartItemEmoji} style={{display: 'none'}}>🖱️</span>
                                            <div className={styles.cartItemInfo}>
                                                <h4>{item.name}</h4>
                                                <p>Qtd: {item.quantity}</p>
                                                <p className={styles.cartItemPrice}>
                                                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                            <button 
                                                className={styles.removeItem}
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                    <div className={styles.cartTotal}>
                                        <h3>Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}</h3>
                                        <button 
                                            className={styles.checkoutButton}
                                            onClick={() => {
                                                setShowCart(false);
                                                navigate('/checkout', { state: { cartItems: cart } });
                                            }}
                                        >
                                            <span className={styles.buttonText}>Finalizar Compra</span>
                                            <span className={styles.buttonIcon}>💳</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}