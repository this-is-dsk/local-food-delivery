function isLoggedIn() {
  return !!localStorage.getItem("token");
}

const id = localStorage.getItem("activeRestaurant");
const rest = restaurants.find(r => r.id === id);

document.getElementById("rest-name").textContent = rest.name;

const menuList = document.getElementById("menu-list");

rest.menu.forEach(item => {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
  <div class="menu-card">
    <img src="${item.image}" alt="${item.name}" />
    <div class="menu-info">
      <h4>${item.name}</h4>
      <div class="meta">
        <span class="price">₹${item.price}</span>
        <span>${item.veg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
      </div>
      <button class="primary-btn">Add</button>
    </div>
  </div>
`;

  div.querySelector("button").onclick = () => {
  if (!isLoggedIn()) {
    localStorage.setItem("redirectAfterLogin", location.href);
    window.location.href = "login.html";
    return;
  }

  addToCart(item);
  updateCartBar();
};

  menuList.appendChild(div);
});

function showCartPreview() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const preview = document.getElementById("cart-preview");
  preview.innerHTML = `<span>${cart.length} items</span><strong>₹${total}</strong>`;
  preview.classList.remove("hidden");
  preview.onclick = () => location.href="checkout.html";
}

function updateCartBar() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBar = document.getElementById("cartBar");

  if (cart.length === 0) {
    cartBar.classList.add("hidden");
    return;
  }

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById("cartCount").textContent =
    `${totalQty} item${totalQty > 1 ? "s" : ""}`;

  document.getElementById("cartTotal").textContent =
    `₹${totalPrice}`;

  cartBar.classList.remove("hidden");
}
  document.getElementById("viewCartBtn").onclick = () => {
  window.location.href = "checkout.html";
};
updateCartBar();
