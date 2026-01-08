export const AppState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  save() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
};
