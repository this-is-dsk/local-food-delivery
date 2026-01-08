const CART_KEY = "cart";

/* ================= GET CART ================= */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/* ================= SAVE CART ================= */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ================= ADD TO CART ================= */
function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1
    });
  }

  saveCart(cart);
}

/* ================= UPDATE QTY ================= */
function updateQty(itemId, type) {
  const cart = getCart();

  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  if (type === "inc") item.qty += 1;
  if (type === "dec") item.qty -= 1;

  if (item.qty <= 0) {
    const index = cart.findIndex(i => i.id === itemId);
    cart.splice(index, 1);
  }

  saveCart(cart);
}

/* ================= TOTAL ================= */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}
