const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        qty: Number
      }
    ],
    address: String,
    paymentMethod: String,
    status: {
      type: String,
      default: "Placed"
    }
  },
  { timestamps: true }
);
const date = new Date(order.createdAt).toLocaleString();
module.exports = mongoose.model("Order", orderSchema);
