const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

/*
  POST /api/orders
  Create order for logged-in user
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    const order = new Order({
      user: new mongoose.Types.ObjectId(req.user.id),
      items,
      address,
      paymentMethod,
      status: "Placed"
    });

    await order.save();
    res.status(201).json(order);

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /api/orders/my
  Fetch orders of logged-in user ONLY
*/
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (err) {
    console.error("FETCH MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
