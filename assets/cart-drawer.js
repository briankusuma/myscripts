function openCartDrawer() {
  document.querySelector('.cart-drawer').classList.add('open');
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer').classList.remove('open');
}

async function updateCartDrawer() {
  const res = await fetch('/?section_id=cart-drawer')
  const text = await res.text()

  const html = document.createElement('div')
  html.innerHTML = text;

  const newBox = html.querySelector('.cart-drawer').innerHTML;
  document.querySelector('.cart-drawer').innerHTML = newBox;

  console.log(html)

  addCartDrawerListeners();
}

// function addCartDrawerListeners() {
  // Update quantity with button click
  // document.querySelectorAll('.drawer-cart-product-quantity button').forEach((button) => {

  //   button.addEventListener('click', async () => {
  //     // Get line item key
  //     const rootItem = button.parentElement.parentElement.parentElement;
  //     console.log(rootItem)
  //     const key = rootItem.getAttribute('data-line-item-key');

  //     // Get new quantity
  //     const currentQuantity = Number(button.parentElement.querySelector('input').value);
  //     const isUp = button.classList.contains('increase-quantity');

  //     const newQuantity = isUp? currentQuantity + 1 : currentQuantity - 1;

  //     // Ajax update
  //     const res = await fetch('/cart/update.js', {
  //       method: 'post',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         updates: {[key]: newQuantity}
  //       }),
  //     });

  //     // Update cart
  //     updateCartDrawer();
  //   })

    
  // })

  // Update quantity with manual input 
  // document.querySelectorAll('.drawer-cart-product-quantity input').forEach((input) => {
  //   input.addEventListener('input', async () => {

  //     // Get line item key
  //     const rootItem = input.parentElement.parentElement.parentElement;
  //     console.log(rootItem);
  //     const key = rootItem.getAttribute('data-line-item-key');

  //     // Get new quantity
  //     const newQuantity = input.value;

  //     // Ajax update
  //     const res = await fetch('/cart/update.js', {
  //       method: 'post',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         updates: {[key]: newQuantity}
  //       }),
  //     });

  //     // Update cart
  //     updateCartDrawer();

  //   })

  // })

  document.querySelectorAll('.close-drawer, .cart-drawer').forEach((x) => {
    x.addEventListener('click', () => {
      closeCartDrawer();
    })
  });
  document.querySelector('.drawer').addEventListener('click', (e) => {
    e.stopPropagation();
  })
}


// Add to cart button
document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Submit form with ajax
    await fetch("/cart/add.js", {
      method: "POST",
      body: new FormData(form),
    });

    // Update cart
    await updateCartDrawer();

    // Open cart Drawer
    openCartDrawer();
  })
})


// Select all variant buttons
document.querySelectorAll(".variant-button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const variantId = this.getAttribute("data-variant-id");
    e.preventDefault();

    // Add variant to cart using Shopify AJAX API
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Redirect to the cart page
          // Update cart
          updateCartDrawer();

          // Open cart Drawer
          openCartDrawer();
        } else {
          alert("Error adding to cart. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});



// Open cart drawer from nav icon
document.querySelectorAll('a[href="/cart"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  })
})

document.querySelectorAll('.go-to-cart').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/cart"
  })
})

addCartDrawerListeners(); 