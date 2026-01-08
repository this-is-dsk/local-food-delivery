// ===============================
// CHECKOUT.JS – STABLE WORKING VERSION
// ===============================

const cartItemsDiv = document.getElementById("cartItems");
const itemTotalEl = document.getElementById("itemTotal");
const grandTotalEl = document.getElementById("grandTotal");
const bottomTotalEl = document.getElementById("bottomTotal");
const placeOrderBtn = document.getElementById("placeOrder");
const addressInput = document.getElementById("address");

const DELIVERY_FEE = 50;
const API_URL = "https://local-food-delivery-pxqv.onrender.com";

// ---------------- CART HELPERS ----------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------------- RENDER CART ----------------
function renderCart() {
  const cart = getCart();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
    itemTotalEl.textContent = "₹0";
    grandTotalEl.textContent = "₹0";
    bottomTotalEl.textContent = "₹0";
    placeOrderBtn.disabled = true;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
      </div>
      <div class="qty-box">
        <button data-i="${index}" data-action="minus">−</button>
        <span>${item.qty}</span>
        <button data-i="${index}" data-action="plus">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  itemTotalEl.textContent = `₹${total}`;
  grandTotalEl.textContent = `₹${total + DELIVERY_FEE}`;
  bottomTotalEl.textContent = `₹${total + DELIVERY_FEE}`;
  placeOrderBtn.disabled = false;
}

// ---------------- QTY CHANGE ----------------
cartItemsDiv.onclick = e => {
  if (e.target.tagName !== "BUTTON") return;

  const index = +e.target.dataset.i;
  const action = e.target.dataset.action;
  const cart = getCart();

  if (action === "plus") cart[index].qty++;
  if (action === "minus") cart[index].qty--;

  if (cart[index].qty <= 0) cart.splice(index, 1);

  saveCart(cart);
  renderCart();
};

// ---------------- LOCATION ----------------
// ---------------- LOCATION (REVERSE GEOCODING) ----------------
const detectBtn = document.getElementById("detectLocation");

if (detectBtn) {
  detectBtn.onclick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    detectBtn.textContent = "Detecting...";
    detectBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data = await res.json();

          if (data && data.display_name) {
            addressInput.value = data.display_name;
          } else {
            addressInput.value = `Lat ${lat.toFixed(4)}, Lng ${lon.toFixed(4)}`;
          }

        } catch (err) {
          addressInput.value = `Lat ${lat.toFixed(4)}, Lng ${lon.toFixed(4)}`;
        } finally {
          detectBtn.textContent = "Use current location";
          detectBtn.disabled = false;
        }
      },
      () => {
        alert("Location permission denied");
        detectBtn.textContent = "Use current location";
        detectBtn.disabled = false;
      }
    );
  };
}


// ---------------- PLACE ORDER ----------------
placeOrderBtn.onclick = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    location.href = "login.html";
    return;
  }

  if (!addressInput.value.trim()) {
    alert("Please enter delivery address");
    return;
  }

  const paymentMethod =
    document.querySelector('input[name="payment"]:checked')?.value || "COD";

  const orderData = {
    items: getCart(),
    address: addressInput.value,
    paymentMethod
  };

  try {
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order...";

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    console.log("ORDER RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Order failed");
    }

    // ✅ SUCCESS (OLD WORKING FLOW)
    localStorage.removeItem("cart");

    const orderId =
      data.orderId ||
      data._id ||
      data.order?._id ||
      "ORD-" + Date.now();

    document.getElementById("orderIdText").textContent =
      `Order ID: ${orderId}`;

    document
      .getElementById("successOverlay")
      .classList.remove("hidden");

    setTimeout(() => {
      location.href = "index.html";
    }, 3000);

  } catch (err) {
    console.error(err);
    alert("Server error, try again");
  } finally {
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = "Place Order";
  }
};

// ---------------- INIT ----------------
renderCart();
