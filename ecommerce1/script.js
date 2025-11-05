 // Product Database
        const products = [
            {
                id: 1,
                name: "Premium Hoodie Collection",
                price: 89.99,
                category: "hoodies",
                image: "c:\Users\Lenovo\Desktop\IMG_3423.JPG",
                description: "Ultra-soft cotton blend hoodies with unique designs. Available in 12 colorways with our signature Mikemon logo embroidery.",
                stock: 50,
                featured: true
            },
            {
                id: 2,
                name: "Limited Edition Sneakers",
                price: 159.99,
                category: "sneakers",
                image: "c:\Users\Lenovo\Desktop\IMG_3422.JPG",
                description: "Exclusive collaboration sneakers with premium materials and cutting-edge design. Only 500 pairs worldwide.",
                stock: 25,
                featured: true
            },
            {
                id: 3,
                name: "Streetwear Accessories",
                price: 34.99,
                category: "accessories",
                image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Complete your look with our range of caps, bags, and jewelry. Crafted for the modern streetwear enthusiast.",
                stock: 100,
                featured: false
            },
            {
                id: 4,
                name: "Designer Jackets",
                price: 199.99,
                category: "jackets",
                image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Premium leather and denim jackets with unique styling. Perfect for layering and making a statement.",
                stock: 30,
                featured: true
            },
            {
                id: 5,
                name: "Graphic Tees",
                price: 49.99,
                category: "tees",
                image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Bold graphic designs on premium cotton tees. Express your personality with our artistic collaborations.",
                stock: 75,
                featured: false
            },
            {
                id: 6,
                name: "Premium Denim",
                price: 129.99,
                category: "denim",
                image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "High-quality denim with perfect fit and unique washes. Sustainable production with modern styling.",
                stock: 40,
                featured: true
            },
            {
                id: 7,
                name: "Urban Hoodie - Black",
                price: 79.99,
                category: "hoodies",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Classic black hoodie with minimalist design. Perfect for everyday wear with premium comfort.",
                stock: 60,
                featured: false
            },
            {
                id: 8,
                name: "Street Runner Sneakers",
                price: 139.99,
                category: "sneakers",
                image: "https://images.unsplash.com/photo-1595950653106-6c9739b1f8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Comfortable and stylish sneakers for the urban explorer. Advanced cushioning technology.",
                stock: 45,
                featured: false
            }
        ];

        // Application State
        let cart = [];
        let currentUser = null;
        let currentFilter = 'all';
        let searchQuery = '';
        let selectedProduct = null;
        let modalQuantity = 1;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            loadProducts();
            loadFeaturedProducts();
            updateCartDisplay();
            checkUserSession();
        });

        // Page Navigation
        function showPage(pageId) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            window.scrollTo(0, 0);

            // Load page-specific content
            if (pageId === 'cart') {
                displayCart();
            } else if (pageId === 'account') {
                updateAccountPage();
            }
        }

        // Product Management
        function loadProducts() {
            const container = document.getElementById('allProducts');
            displayProductGrid(getFilteredProducts(), container);
        }

        function loadFeaturedProducts() {
            const container = document.getElementById('featuredProducts');
            const featuredProducts = products.filter(p => p.featured).slice(0, 4);
            displayProductGrid(featuredProducts, container);
        }

        function getFilteredProducts() {
            let filtered = products;
            
            if (currentFilter !== 'all') {
                filtered = filtered.filter(p => p.category === currentFilter);
            }
            
            if (searchQuery) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            return filtered;
        }

        function displayProductGrid(productList, container) {
            if (productList.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = productList.map(product => `
                <div class="product-card" onclick="openProductModal(${product.id})">
                    <div class="product-image" style="background-image: url('${product.image}')"></div>
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${product.price.toFixed(2)}</div>
                    <div class="product-description">${product.description.substring(0, 100)}...</div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                </div>
            `).join('');
        }

        // Product Modal
        function openProductModal(productId) {
            selectedProduct = products.find(p => p.id === productId);
            if (!selectedProduct) return;

            document.getElementById('modalProductImage').style.backgroundImage = `url('${selectedProduct.image}')`;
            document.getElementById('modalProductTitle').textContent = selectedProduct.name;
            document.getElementById('modalProductPrice').textContent = `${selectedProduct.price.toFixed(2)}`;
            document.getElementById('modalProductDescription').textContent = selectedProduct.description;
            
            modalQuantity = 1;
            document.getElementById('modalQuantity').textContent = modalQuantity;
            
            document.getElementById('productModal').classList.add('active');
        }

        function closeProductModal() {
            document.getElementById('productModal').classList.remove('active');
            selectedProduct = null;
            modalQuantity = 1;
        }

        function changeQuantity(change) {
            modalQuantity = Math.max(1, modalQuantity + change);
            document.getElementById('modalQuantity').textContent = modalQuantity;
        }

        function addToCartFromModal() {
            if (selectedProduct) {
                addToCart(selectedProduct.id, modalQuantity);
                closeProductModal();
            }
        }

        // Cart Management
        function addToCart(productId, quantity = 1) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    ...product,
                    quantity: quantity
                });
            }

            updateCartDisplay();
            showMessage(`${product.name} added to cart!`, 'success');
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
            displayCart();
        }

        function updateCartQuantity(productId, newQuantity) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                if (newQuantity <= 0) {
                    removeFromCart(productId);
                } else {
                    item.quantity = newQuantity;
                    updateCartDisplay();
                    displayCart();
                }
            }
        }

        function updateCartDisplay() {
            const cartBadge = document.getElementById('cartBadge');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            if (totalItems > 0) {
                cartBadge.textContent = totalItems;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }

        function displayCart() {
            const container = document.getElementById('cartContent');
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started</p>
                        <button class="btn btn-primary" onclick="showPage('products')">Shop Now</button>
                    </div>
                `;
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            container.innerHTML = `
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <p>${item.price.toFixed(2)} each</p>
                            </div>
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">Total: ${total.toFixed(2)}</div>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="checkout()" style="margin-right: 1rem;">Checkout</button>
                    <button class="btn btn-secondary" onclick="showPage('products')">Continue Shopping</button>
                </div>
            `;
        }

        function checkout() {
            if (!currentUser) {
                showMessage('Please login to checkout', 'error');
                showPage('account');
                return;
            }

            if (cart.length === 0) {
                showMessage('Your cart is empty', 'error');
                return;
            }

            // Simulate checkout process
            const order = {
                id: Date.now(),
                items: [...cart],
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date().toLocaleDateString(),
                status: 'Processing'
            };

            // Add to user's order history
            if (!currentUser.orders) {
                currentUser.orders = [];
            }
            currentUser.orders.push(order);
            saveUserData();

            // Clear cart
            cart = [];
            updateCartDisplay();

            showMessage('Order placed successfully! Thank you for your purchase.', 'success');
            showPage('account');
        }

        // Search and Filter
        function searchProducts() {
            searchQuery = document.getElementById('searchInput').value;
            loadProducts();
        }

        function filterProducts(category) {
            currentFilter = category;
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            loadProducts();
        }

        // User Authentication
        function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation (in real app, this would be server-side)
            const userData = getUserData(email);
            if (userData && userData.password === password) {
                currentUser = userData;
                updateAccountPage();
                showMessage('Login successful!', 'success');
            } else {
                showMessage('Invalid email or password', 'error');
            }
        }

        function handleRegister(event) {
            event.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            // Check if user already exists
            if (getUserData(email)) {
                showMessage('User already exists with this email', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                name: name,
                email: email,
                password: password,
                orders: []
            };
            
            saveUserData(newUser);
            currentUser = newUser;
            updateAccountPage();
            showMessage('Registration successful!', 'success');
        }

        function logout() {
            currentUser = null;
            updateAccountPage();
            showMessage('Logged out successfully', 'success');
        }

        function showLoginForm() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
        }

        function showRegisterForm() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        }

        function updateAccountPage() {
            const accountLink = document.getElementById('accountLink');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const userDashboard = document.getElementById('userDashboard');
            
            if (currentUser) {
                accountLink.textContent = currentUser.name;
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                userDashboard.style.display = 'block';
                
                document.getElementById('userName').textContent = currentUser.name;
                displayOrderHistory();
            } else {
                accountLink.textContent = 'Login';
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                userDashboard.style.display = 'none';
            }
        }

        function displayOrderHistory() {
            const container = document.getElementById('orderHistory');
            
            if (!currentUser.orders || currentUser.orders.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No orders yet</h3>
                        <p>Start shopping to see your order history</p>
                        <button class="btn btn-primary" onclick="showPage('products')">Shop Now</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = currentUser.orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-status">${order.status}</div>
                        <div>${order.total.toFixed(2)}</div>
                        <div>${order.date}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <p>${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}</p>
                        `).join('')}
                    </div>
                </div>
            `).reverse().join('');
        }

        // Contact Form
        function submitContact(event) {
            event.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            // Reset form
            event.target.reset();
            
            showMessage('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        }

        // Utility Functions
        function showMessage(text, type = 'success') {
            const message = document.createElement('div');
            message.className = `message ${type}`;
            message.textContent = text;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }

        function getUserData(email) {
            const users = JSON.parse(localStorage.getItem('mikemon_users') || '{}');
            return users[email];
        }

        function saveUserData(user = currentUser) {
            if (!user) return;
            
            const users = JSON.parse(localStorage.getItem('mikemon_users') || '{}');
            users[user.email] = user;
            localStorage.setItem('mikemon_users', JSON.stringify(users));
        }

        function checkUserSession() {
            const savedUser = localStorage.getItem('mikemon_current_user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateAccountPage();
            }
        }

        // Particle Animation
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 4 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('productModal');
            if (event.target === modal) {
                closeProductModal();
            }
        });

        // Save user session
        window.addEventListener('beforeunload', function() {
            if (currentUser) {
                localStorage.setItem('mikemon_current_user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('mikemon_current_user');
            }
        });