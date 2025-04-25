
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

// Cache DOM selectors for better performance
const cartDrawerSelectors = {
  drawer: () => document.querySelector('.cart-drawer'),
  closeButtons: () => document.querySelectorAll('.close-drawer, .cart-drawer'),
  drawerContent: () => document.querySelector('.drawer'),
  cartLinks: () => document.querySelectorAll('a[href="/cart"]'),
  goToCartButtons: () => document.querySelectorAll('.go-to-cart'),
  addToCartForms: () => document.querySelectorAll('form[action="/cart/add"]'),
  variantButtons: () => document.querySelectorAll('.variant-button')
};

// Cart drawer state management
const cartDrawer = {
  open() {
    cartDrawerSelectors.drawer().classList.add('open');
  },
  
  close() {
    cartDrawerSelectors.drawer().classList.remove('open');
  },
  
  async update() {
    try {
      const drawer = cartDrawerSelectors.drawer();
      
      // Add loading state
      drawer.classList.add('loading');
      
      const response = await fetch('/?section_id=cart-drawer');
      if (!response.ok) throw new Error('Failed to fetch cart drawer content');
      
      const text = await response.text();
      const html = document.createElement('div');
      html.innerHTML = text;
      
      const newContent = html.querySelector('.cart-drawer').innerHTML;
      drawer.innerHTML = newContent;
      
      // Setup event listeners on the new content
      this.setupEventListeners();
    } catch (error) {
      console.error('Error updating cart drawer:', error);
    } finally {
      // Remove loading state
      cartDrawerSelectors.drawer().classList.remove('loading');
    }
  }
};

// Debounce function to prevent excessive API calls
function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Cart API operations
const cartAPI = {
  async updateLineItem(key, quantity) {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: {[key]: quantity}
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update cart');
      return await response.json();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },
  
  async addItem(formData) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to add item to cart');
      return await response.json();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },
  
  async addVariant(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add variant to cart');
      return await response.json();
    } catch (error) {
      console.error('Error adding variant to cart:', error);
      throw error;
    }
  }
};

// Event handlers
const eventHandlers = {
  // Use event delegation for quantity buttons
  async handleQuantityButtonClick(event) {
    const button = event.target.closest('.drawer-cart-product-quantity button');
    if (!button) return;
    
    try {
      const rootItem = button.closest('[data-line-item-key]');
      const key = rootItem.getAttribute('data-line-item-key');
      const quantityInput = button.parentElement.querySelector('input');
      const currentQuantity = Number(quantityInput.value);
      const isIncrease = button.classList.contains('increase-quantity');
      const newQuantity = isIncrease ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
      
      // Update UI immediately for better UX
      quantityInput.value = newQuantity;
      
      await cartAPI.updateLineItem(key, newQuantity);
      await cartDrawer.update();
    } catch (error) {
      // UI will be reset by the cart update if there's an error
      console.error('Error handling quantity change:', error);
    }
  },
  
  // Debounced handler for quantity input changes
  handleQuantityInputChange: debounce(async (event) => {
    const input = event.target;
    if (!input.matches('.drawer-cart-product-quantity input')) return;
    
    try {
      const rootItem = input.closest('[data-line-item-key]');
      const key = rootItem.getAttribute('data-line-item-key');
      const newQuantity = Math.max(0, parseInt(input.value) || 0);
      
      await cartAPI.updateLineItem(key, newQuantity);
      await cartDrawer.update();
    } catch (error) {
      console.error('Error handling quantity input change:', error);
    }
  }, 500),
  
  async handleAddToCartSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
      // Add loading state to the submit button
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
      }
      
      await cartAPI.addItem(new FormData(form));
      await cartDrawer.update();
      cartDrawer.open();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      // Remove loading state
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
      // Add loading state
      button.disabled = true;
      button.classList.add('loading');
      
      const variantId = button.getAttribute('data-variant-id');
      await cartAPI.addVariant(variantId);
      await cartDrawer.update();
      cartDrawer.open();
    } catch (error) {
      console.error('Error adding variant to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      // Remove loading state
      button.disabled = false;
      button.classList.remove('loading');
    }
  }
};

// Initialize cart drawer functionality
function initCartDrawer() {
  // Setup initial event listeners
  cartDrawer.setupEventListeners = function() {
    // Use event delegation for quantity changes
    document.addEventListener('click', eventHandlers.handleQuantityButtonClick);
    document.addEventListener('input', eventHandlers.handleQuantityInputChange);
    
    // Close drawer events
    cartDrawerSelectors.closeButtons().forEach(button => {
      button.addEventListener('click', cartDrawer.close);
    });
    
    // Prevent drawer content clicks from closing the drawer
    const drawerContent = cartDrawerSelectors.drawerContent();
    if (drawerContent) {
      drawerContent.addEventListener('click', e => e.stopPropagation());
    }
    
    // Go to cart page
    cartDrawerSelectors.goToCartButtons().forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "/cart";
      });
    });
  };
  
  // Setup global event listeners (only need to be set once)
  function setupGlobalEventListeners() {
    // Add to cart forms
    cartDrawerSelectors.addToCartForms().forEach(form => {
      form.addEventListener('submit', eventHandlers.handleAddToCartSubmit);
    });
    
    // Variant buttons
    cartDrawerSelectors.variantButtons().forEach(button => {
      button.addEventListener('click', eventHandlers.handleVariantButtonClick);
    });
    
    // Cart links
    cartDrawerSelectors.cartLinks().forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        cartDrawer.open();
      });
    });
  }
  
  // Initialize
  cartDrawer.setupEventListeners();
  setupGlobalEventListeners();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCartDrawer);