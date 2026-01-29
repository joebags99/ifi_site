// Printify API Integration for Icing for Izaac

// ===== Configuration =====
const PRINTIFY_CONFIG = {
    // TODO: Add your Printify API token from https://printify.com/app/account/api
    apiToken: 'YOUR_PRINTIFY_API_TOKEN_HERE',
    shopId: 'YOUR_SHOP_ID_HERE', // Found in Printify dashboard
    apiBaseUrl: 'https://api.printify.com/v1'
};

// ===== API Helper Functions =====
async function printifyFetch(endpoint, options = {}) {
    const url = `${PRINTIFY_CONFIG.apiBaseUrl}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${PRINTIFY_CONFIG.apiToken}`,
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`Printify API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Printify API Error:', error);
        throw error;
    }
}

// ===== Get Products =====
async function getProducts() {
    try {
        const endpoint = `/shops/${PRINTIFY_CONFIG.shopId}/products.json`;
        const data = await printifyFetch(endpoint);
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// ===== Get Product Details =====
async function getProductDetails(productId) {
    try {
        const endpoint = `/shops/${PRINTIFY_CONFIG.shopId}/products/${productId}.json`;
        return await printifyFetch(endpoint);
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

// ===== Display Products on Page =====
async function displayProducts(containerId = 'printify-products') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error('Product container not found');
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="loading">Loading products...</div>';
    
    // Check if API is configured
    if (PRINTIFY_CONFIG.apiToken === 'YOUR_PRINTIFY_API_TOKEN_HERE') {
        container.innerHTML = `
            <div class="card" style="padding: 2rem; text-align: center;">
                <h3>Printify Setup Required</h3>
                <p style="margin: 1rem 0;">To display products, please configure your Printify API credentials in <code>js/printify.js</code></p>
                <ol style="text-align: left; max-width: 600px; margin: 1rem auto;">
                    <li>Sign up at <a href="https://printify.com" target="_blank">Printify.com</a></li>
                    <li>Create your products in the Printify dashboard</li>
                    <li>Get your API token from Account Settings → API</li>
                    <li>Add your token and shop ID to the configuration</li>
                </ol>
            </div>
        `;
        return;
    }
    
    try {
        const products = await getProducts();
        
        if (products.length === 0) {
            container.innerHTML = '<div class="card"><p>No products available at this time.</p></div>';
            return;
        }
        
        container.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Add event listeners to product cards
        attachProductListeners();
        
    } catch (error) {
        container.innerHTML = '<div class="card"><p>Unable to load products. Please try again later.</p></div>';
    }
}

// ===== Create Product Card HTML =====
function createProductCard(product) {
    const mainImage = product.images?.[0]?.src || 'images/placeholder-product.jpg';
    const price = product.variants?.[0]?.price || 0;
    
    return `
        <div class="card product-card" data-product-id="${product.id}">
            <img src="${mainImage}" alt="${product.title}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-description">${product.description || 'Premium quality apparel'}</p>
                <p class="card-price">From ${formatPrice(price / 100)}</p>
                <button class="btn btn-primary view-product-btn" data-product-id="${product.id}">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// ===== Attach Event Listeners =====
function attachProductListeners() {
    document.querySelectorAll('.view-product-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.productId;
            await showProductModal(productId);
        });
    });
}

// ===== Show Product Modal =====
async function showProductModal(productId) {
    const product = await getProductDetails(productId);
    
    if (!product) {
        window.IcingApp.showNotification('Unable to load product details', 'error');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.product-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="modal-body">
                <div class="modal-images">
                    <img src="${product.images?.[0]?.src}" alt="${product.title}" class="modal-main-image">
                </div>
                
                <div class="modal-info">
                    <h2>${product.title}</h2>
                    <p class="modal-description">${product.description || ''}</p>
                    
                    <div class="variant-selector">
                        <label>Select Size:</label>
                        <select id="variantSelect">
                            ${product.variants?.map(variant => `
                                <option value="${variant.id}" data-price="${variant.price}">
                                    ${variant.title} - ${formatPrice(variant.price / 100)}
                                </option>
                            `).join('') || '<option>No variants available</option>'}
                        </select>
                    </div>
                    
                    <button class="btn btn-primary add-to-cart-btn" data-product='${JSON.stringify({ id: product.id, title: product.title })}'>
                        Add to Cart
                    </button>
                    
                    <div class="product-details">
                        <h4>Product Details</h4>
                        <p>${product.description || 'Premium quality apparel designed with love.'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add to cart functionality
    modal.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        const productData = JSON.parse(e.target.dataset.product);
        const variantSelect = modal.querySelector('#variantSelect');
        const selectedOption = variantSelect.options[variantSelect.selectedIndex];
        
        const cartItem = {
            id: `${productData.id}-${variantSelect.value}`,
            name: `${productData.title} - ${selectedOption.text}`,
            price: selectedOption.dataset.price / 100,
            type: 'apparel'
        };
        
        window.IcingApp.addToCart(cartItem);
        modal.remove();
    });
}

// ===== Format Price Helper =====
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// ===== Add Modal Styles =====
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .product-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        position: relative;
        background: white;
        border-radius: 1rem;
        max-width: 1000px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.25rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }
    
    .modal-close:hover {
        background: #FF69B4;
        color: white;
    }
    
    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .modal-main-image {
        width: 100%;
        border-radius: 0.5rem;
    }
    
    .modal-info h2 {
        margin-bottom: 1rem;
        color: #4A4A4A;
    }
    
    .modal-description {
        color: #8B8B8B;
        margin-bottom: 2rem;
        line-height: 1.8;
    }
    
    .variant-selector {
        margin-bottom: 2rem;
    }
    
    .variant-selector label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .variant-selector select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #FFB6C1;
        border-radius: 0.5rem;
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
    }
    
    .product-details {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #FFE4E1;
    }
    
    .product-details h4 {
        margin-bottom: 1rem;
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(modalStyles);

// ===== Initialize on Page Load =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('printify-products')) {
            displayProducts();
        }
    });
} else {
    if (document.getElementById('printify-products')) {
        displayProducts();
    }
}

// ===== Export Functions =====
window.PrintifyApp = {
    getProducts,
    getProductDetails,
    displayProducts
};

console.log('🛍️ Printify integration loaded');