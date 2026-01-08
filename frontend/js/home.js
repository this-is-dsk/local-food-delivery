const list = document.getElementById("restaurant-list");

restaurants.forEach(r => {
  const card = document.createElement("div");
  card.className = "restaurant-card";
  card.innerHTML = `
    <img src="${r.image}" alt="${r.name}">
    <h4>${r.name}</h4>
    <div class="meta">${r.cuisine} • ⭐ ${r.rating}</div>
    <div class="meta">${r.time} • ₹${r.minOrder} min</div>
  `;
  card.onclick = () => {
    localStorage.setItem("activeRestaurant", r.id);
    location.href = "restaurant.html";
  };
  list.appendChild(card);
});
