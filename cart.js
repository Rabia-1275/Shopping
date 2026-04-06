function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((c) => c.id === productId);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Remove product from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Change quantity
function changeQty(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((c) => c.id === productId);

  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((c) => c.id !== productId);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Render cart.html content
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-body");
  const totalBox = document.getElementById("cart-total");
  container.innerHTML = "";

  let total = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    const subtotal = product.price * item.qty;
    total += subtotal;

    container.innerHTML += `
      <tr>
        <td><img src="${product.image}" alt="${product.name}" /></td>
        <td>${product.name}</td>
        <td>$${product.price}</td>
        <td>
          <button onclick="changeQty(${item.id}, -1)">-</button>
          ${item.qty}
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </td>
        <td>$${subtotal}</td>
        <td><button onclick="removeFromCart(${item.id})">Delete</button></td>
      </tr>
    `;
  });

  totalBox.innerHTML = `Total: $${total}`;
  updateCartCount();
}

// Update cart icon counter
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartIcon = document.querySelector("#lg-bag i");
  if (cartIcon) cartIcon.setAttribute("data-count", count);
}

// On product page: load single product dynamically
function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find((p) => p.id === id);

  if (product) {
    document.getElementById("product-img").src = product.image;
    document.getElementById("product-title").textContent = product.name;
    document.getElementById("product-price").textContent = "$" + product.price;
    document.getElementById("product-desc").textContent = product.desc;
    document.getElementById("add-btn").onclick = () => addToCart(product.id);
  }
}
