import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: Token kontrolü
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token yok, erişim reddedildi" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // token içinden kullanıcıyı al
    next();
  } catch (err) {
    res.status(403).json({ error: "Geçersiz token" });
  }
}

// Örnek korumalı endpoint
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: `Hoşgeldin ${req.user.username}`, user: req.user });
});

export default router;
