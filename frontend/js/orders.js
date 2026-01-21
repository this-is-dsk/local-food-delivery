const ordersContainer = document.getElementById("ordersList");
const token = localStorage.getItem("token");

const API_URL = "https://local-food-delivery-pxqv.onrender.com";
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

if (!token) {
  location.href = "login.html";
}

async function loadOrders() {
  try {
    const res = await fetch(`${API_URL}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("API failed");

    const orders = await res.json();

    if (!orders.length) {
      ordersContainer.innerHTML = `
        <div class="empty">
          <h3>No orders yet</h3>
          <p>Start ordering your favorite food 🍔</p>
        </div>
      `;
      return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach(order => {
      const orderDate = order.createdAt
  ? formatDate(order.createdAt)
  : "—";
      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const div = document.createElement("div");
      div.className = "order-card";

      div.innerHTML = `
  <div class="order-header">
    <div class="order-id">Order #${order._id.slice(-6)}</div>
    <div class="status">${order.status || "Placed"}</div>
  </div>

  <div class="order-date">Placed on ${orderDate}</div>

  <div class="items">
    ${order.items.map(i => `<span>${i.qty} × ${i.name}</span>`).join("")}
  </div>

  <div class="total">₹${total}</div>
`;

      ordersContainer.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    ordersContainer.innerHTML =
      "<div class='empty'>Failed to load orders</div>";
  }
}

loadOrders();
