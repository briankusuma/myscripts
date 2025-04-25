
// function openCartDrawer() {
//   document.querySelector('.cart-drawer').classList.add('open');
// }

// function closeCartDrawer() {
//   document.querySelector('.cart-drawer').classList.remove('open');
// }

// async function updateCartDrawer() {
//   const res = await fetch('/?section_id=cart-drawer')
//   const text = await res.text()

//   const html = document.createElement('div')
//   html.innerHTML = text;

//   const newBox = html.querySelector('.cart-drawer').innerHTML;
//   document.querySelector('.cart-drawer').innerHTML = newBox;

//   console.log(html)

//   addCartDrawerListeners();
// }

// function addCartDrawerListeners() {
//   // Update quantity with button click
//   document.querySelectorAll('.drawer-cart-product-quantity button').forEach((button) => {

//     button.addEventListener('click', async () => {
//       // Get line item key
//       const rootItem = button.parentElement.parentElement.parentElement;
//       console.log(rootItem)
//       const key = rootItem.getAttribute('data-line-item-key');

//       // Get new quantity
//       const currentQuantity = Number(button.parentElement.querySelector('input').value);
//       const isUp = button.classList.contains('increase-quantity');

//       const newQuantity = isUp? currentQuantity + 1 : currentQuantity - 1;

//       // Ajax update
//       const res = await fetch('/cart/update.js', {
//         method: 'post',
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           updates: {[key]: newQuantity}
//         }),
//       });

//       // Update cart
//       updateCartDrawer();
//     })

    
//   })

//   // Update quantity with manual input 
//   document.querySelectorAll('.drawer-cart-product-quantity input').forEach((input) => {
//     input.addEventListener('input', async () => {

//       // Get line item key
//       const rootItem = input.parentElement.parentElement.parentElement;
//       console.log(rootItem);
//       const key = rootItem.getAttribute('data-line-item-key');

//       // Get new quantity
//       const newQuantity = input.value;

//       // Ajax update
//       const res = await fetch('/cart/update.js', {
//         method: 'post',
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           updates: {[key]: newQuantity}
//         }),
//       });

//       // Update cart
//       updateCartDrawer();

//     })

//   })

//   document.querySelectorAll('.close-drawer, .cart-drawer').forEach((x) => {
//     x.addEventListener('click', () => {
//       closeCartDrawer();
//     })
//   });
//   document.querySelector('.drawer').addEventListener('click', (e) => {
//     e.stopPropagation();
//   })
// }


// // Add to cart button
// document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // Submit form with ajax
//     await fetch("/cart/add.js", {
//       method: "POST",
//       body: new FormData(form),
//     });

//     // Update cart
//     await updateCartDrawer();

//     // Open cart Drawer
//     openCartDrawer();
//   })
// })


// // Select all variant buttons
// document.querySelectorAll(".variant-button").forEach((button) => {
//   button.addEventListener("click", function (e) {
//     const variantId = this.getAttribute("data-variant-id");
//     e.preventDefault();

//     // Add variant to cart using Shopify AJAX API
//     fetch("/cart/add.js", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         id: variantId,
//         quantity: 1,
//       }),
//     })
//       .then((response) => {
//         if (response.ok) {
//           // Redirect to the cart page
//           // Update cart
//           updateCartDrawer();

//           // Open cart Drawer
//           openCartDrawer();
//         } else {
//           alert("Error adding to cart. Please try again.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
// });



// // Open cart drawer from nav icon
// document.querySelectorAll('a[href="/cart"]').forEach((a) => {
//   a.addEventListener('click', (e) => {
//     e.preventDefault();
//     openCartDrawer();
//   })
// })

// document.querySelectorAll('.go-to-cart').forEach((a) => {
//   a.addEventListener('click', (e) => {
//     e.preventDefault();
//     window.location.href = "/cart"
//   })
// })

// addCartDrawerListeners(); 

// Cache DOM selectors
const cartDrawerSelectors = {
  drawer: () => document.querySelector('.cart-drawer'),
  closeButtons: () => document.querySelectorAll('.close-drawer, .cart-drawer'),
  drawerContent: () => document.querySelector('.drawer'),
  cartLinks: () => document.querySelectorAll('a[href="/cart"]'),
  goToCartButtons: () => document.querySelectorAll('.go-to-cart'),
  addToCartForms: () => document.querySelectorAll('form[action="/cart/add"]'),
  variantButtons: () => document.querySelectorAll('.variant-button')
};

// Request management to prevent too many requests
const requestManager = {
  queue: [],
  processing: false,
  cooldownPeriod: 500, // ms between requests
  lastRequestTime: 0,
  
  // Add a request to the queue
  enqueue(ajaxOptions) {
    return new Promise((resolve, reject) => {
      this.queue.push({ ajaxOptions, resolve, reject });
      this.processQueue();
    });
  },
  
  // Process the next request in queue
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    // Ensure minimum time between requests
    const now = Date.now();
    const timeElapsed = now - this.lastRequestTime;
    if (timeElapsed < this.cooldownPeriod) {
      await new Promise(resolve => setTimeout(resolve, this.cooldownPeriod - timeElapsed));
    }
    
    const { ajaxOptions, resolve, reject } = this.queue.shift();
    
    try {
      this.lastRequestTime = Date.now();
      
      // Execute the AJAX request
      $.ajax({
        ...ajaxOptions,
        success: function(data) {
          resolve(data);
        },
        error: function(xhr, status, error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
      this.processing = false;
      this.processQueue(); // Process next request
    }
  }
};

// Cart drawer state management
const cartDrawer = {
  updatePending: false,
  
  // Original open method as requested
  open() {
    cartDrawerSelectors.drawer().classList.add('open');
  },
  
  // Original close method as requested
  close() {
    cartDrawerSelectors.drawer().classList.remove('open');
  },
  
  // Schedule an update to prevent multiple updates in quick succession
  scheduleUpdate() {
    if (this.updatePending) return;
    
    this.updatePending = true;
    setTimeout(() => {
      this.update();
      this.updatePending = false;
    }, 300);
  },
  
  async update() {
    try {
      const drawer = cartDrawerSelectors.drawer();
      drawer.classList.add('loading');
      
      // Use jQuery AJAX to fetch cart drawer content
      const html = await requestManager.enqueue({
        url: '/?section_id=cart-drawer',
        type: 'GET',
        dataType: 'html'
      });
      
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const newContent = tempDiv.querySelector('.cart-drawer').innerHTML;
      drawer.innerHTML = newContent;
      
      this.setupEventListeners();
    } catch (error) {
      console.error('Error updating cart drawer:', error);
    } finally {
      cartDrawerSelectors.drawer().classList.remove('loading');
    }
  }
};

// Improved debounce with longer wait time
function debounce(func, wait = 800) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Cart API operations with request management
const cartAPI = {
  async updateLineItem(key, quantity) {
    return requestManager.enqueue({
      url: '/cart/update.js',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        updates: {[key]: quantity}
      })
    });
  },
  
  async addItem(formData) {
    return requestManager.enqueue({
      url: '/cart/add.js',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json'
    });
  },
  
  async addVariant(variantId, quantity = 1) {
    return requestManager.enqueue({
      url: '/cart/add.js',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });
  }
};

// Optimized event handlers to reduce API calls
const eventHandlers = {
  // Track quantity changes to batch updates
  quantityChanges: new Map(),
  
  // Use event delegation with improved throttling
  handleQuantityButtonClick: debounce(async (event) => {
    const button = event.target.closest('.drawer-cart-product-quantity button');
    if (!button) return;
    
    try {
      const rootItem = button.closest('[data-line-item-key]');
      const key = rootItem.getAttribute('data-line-item-key');
      const quantityInput = button.parentElement.querySelector('input');
      const currentQuantity = Number(quantityInput.value);
      const isIncrease = button.classList.contains('increase-quantity');
      const newQuantity = isIncrease ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
      
      // Update UI immediately
      quantityInput.value = newQuantity;
      
      // Store the change but don't update yet
      eventHandlers.quantityChanges.set(key, newQuantity);
      
      // Schedule batch update
      eventHandlers.scheduleCartUpdate();
    } catch (error) {
      console.error('Error handling quantity change:', error);
    }
  }, 300),
  
  // Heavily debounced handler for quantity input
  handleQuantityInputChange: debounce(async (event) => {
    const input = event.target;
    if (!input.matches('.drawer-cart-product-quantity input')) return;
    
    try {
      const rootItem = input.closest('[data-line-item-key]');
      const key = rootItem.getAttribute('data-line-item-key');
      const newQuantity = Math.max(0, parseInt(input.value) || 0);
      
      // Store the change but don't update yet
      eventHandlers.quantityChanges.set(key, newQuantity);
      
      // Schedule batch update
      eventHandlers.scheduleCartUpdate();
    } catch (error) {
      console.error('Error handling quantity input change:', error);
    }
  }, 800),
  
  // Batch update cart with all pending quantity changes
  updateTimeout: null,
  scheduleCartUpdate: function() {
    if (this.updateTimeout) clearTimeout(this.updateTimeout);
    
    this.updateTimeout = setTimeout(async () => {
      if (this.quantityChanges.size === 0) return;
      
      try {
        const updates = {};
        this.quantityChanges.forEach((quantity, key) => {
          updates[key] = quantity;
        });
        
        // Single API call for all quantity updates using jQuery AJAX
        await requestManager.enqueue({
          url: '/cart/update.js',
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({ updates })
        });
        
        // Clear pending changes
        this.quantityChanges.clear();
        
        // Update cart drawer once for all changes
        cartDrawer.update();
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }, 1000); // Wait 1 second after last change before updating
  },
  
  async handleAddToCartSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
      }
      
      // Use jQuery AJAX to add item to cart
      await cartAPI.addItem(new FormData(form));
      cartDrawer.update();
      cartDrawer.open();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
    }
  },
  
  async handleVariantButtonClick(event) {
    event.preventDefault();
    const button = event.target.closest('.variant-button');
    if (!button) return;
    
    try {
      button.disabled = true;
      button.classList.add('loading');
      
      const variantId = button.getAttribute('data-variant-id');
      await cartAPI.addVariant(variantId);
      cartDrawer.update();
      cartDrawer.open();
    } catch (error) {
      console.error('Error adding variant to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      button.disabled = false;
      button.classList.remove('loading');
    }
  }
};

// Initialize cart drawer functionality
function initCartDrawer() {
  // Setup event listeners with delegation to reduce number of listeners
  cartDrawer.setupEventListeners = function() {
    // Use event delegation for quantity changes
    $(document).on('click', '.drawer-cart-product-quantity button', eventHandlers.handleQuantityButtonClick);
    $(document).on('input', '.drawer-cart-product-quantity input', eventHandlers.handleQuantityInputChange);
    
    // Close drawer events
    $(document).on('click', '.close-drawer, .cart-drawer', function() {
      cartDrawer.close();
    });
    
    // Prevent drawer content clicks from closing the drawer
    $(document).on('click', '.drawer', function(e) {
      e.stopPropagation();
    });
    
    // Go to cart page
    $(document).on('click', '.go-to-cart', function(e) {
      e.preventDefault();
      window.location.href = "/cart";
    });
  };
  
  // Setup global event listeners (only need to be set once)
  function setupGlobalEventListeners() {
    // Add to cart forms - use jQuery delegation
    $(document).on('submit', 'form[action="/cart/add"]', eventHandlers.handleAddToCartSubmit);
    
    // Variant buttons - use jQuery delegation
    $(document).on('click', '.variant-button', eventHandlers.handleVariantButtonClick);
    
    // Cart links - use jQuery delegation
    $(document).on('click', 'a[href="/cart"]', function(e) {
      e.preventDefault();
      cartDrawer.open();
    });
  }
  
  // Initialize
  cartDrawer.setupEventListeners();
  setupGlobalEventListeners();
}

// Initialize when DOM is ready
$(document).ready(initCartDrawer);