const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/*
  GET /api/admin/dashboard
*/
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();

    res.status(200).json({ users, orders });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /api/admin/users
*/
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json(users);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /api/admin/orders
  ⚠️ populate OPTIONAL (safe)
*/
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    // safe manual user attach (NO populate crash)
    const userIds = orders
      .map(o => o.user)
      .filter(id => id);

    const users = await User.find({ _id: { $in: userIds } })
      .select("name email phone")
      .lean();

    const userMap = {};
    users.forEach(u => (userMap[u._id] = u));

    const finalOrders = orders.map(o => ({
      ...o,
      user: userMap[o.user] || null
    }));

    res.status(200).json(finalOrders);
  } catch (err) {
    console.error("ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status required" });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


module.exports = router;
