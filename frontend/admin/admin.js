const API_URL = "https://local-food-delivery-pxqv.onrender.com";

const token = localStorage.getItem("token");
if (!token) location.href = "/login.html";

const usersCount = document.getElementById("usersCount");
const ordersCount = document.getElementById("ordersCount");
const usersTable = document.getElementById("usersTable");
const ordersTable = document.getElementById("ordersTable");

const tabs = document.querySelectorAll(".tabs button");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(btn => {
  btn.onclick = () => {
    tabs.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  location.href = "/login.html";
};

async function fetchAdmin() {
  const headers = { Authorization: `Bearer ${token}` };

  // DASHBOARD
  const dash = await fetch(
    `${API_URL}/api/admin/dashboard`,
    { headers }
  ).then(r => r.json());

  usersCount.textContent = dash.users || 0;
  ordersCount.textContent = dash.orders || 0;

  // USERS
  const users = await fetch(
    `${API_URL}/api/admin/users`,
    { headers }
  ).then(r => r.json());

  usersTable.innerHTML = users.map(u => `
    <tr>
      <td>${u.name || "-"}</td>
      <td>${u.email || "-"}</td>
      <td>${u.phone || "-"}</td>
      <td>${new Date(u.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join("");

  // ORDERS
  const orders = await fetch(
    `${API_URL}/api/admin/orders`,
    { headers }
  ).then(r => r.json());

  ordersTable.innerHTML = orders.map(o => `
    <tr>
      <td>#${o._id.slice(-6)}</td>
      <td>${o.user?.name || "-"}</td>
      <td>${o.user?.phone || "-"}</td>
      <td>${o.address || "-"}</td>
      <td>${Array.isArray(o.items)
        ? o.items.map(i => `${i.qty}×${i.name}`).join(", ")
        : "-"}</td>
      <td>${o.paymentMethod || "-"}</td>
      <td>${o.status || "Placed"}</td>
    </tr>
  `).join("");
}

fetchAdmin();
