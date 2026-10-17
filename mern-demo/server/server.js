require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------
// Cấu hình CORS cho Production
// Chỉ cho phép đúng Domain Frontend (CLIENT_URL) và localhost khi chạy thử.
// Nguồn (Origin) lạ sẽ không nhận được header Access-Control-Allow-Origin
// nên trình duyệt sẽ chặn request.
// ---------------------------------------------------------------
const allowedOrigins = [
  // Bỏ dấu "/" ở cuối (nếu có) để so khớp chính xác với header Origin
  process.env.CLIENT_URL && process.env.CLIENT_URL.replace(/\/$/, ""),
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Request không có header Origin (curl, health check của Render...) vẫn được xử lý
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Origin không nằm trong danh sách: không trả header CORS
      return callback(null, false);
    },
  })
);
app.use(express.json());

// ---------------------------------------------------------------
// Ghi log mỗi request HTTP để quan sát trên tab Logs của Render
// Chỉ ghi phương thức, đường dẫn, mã trạng thái và thời gian xử lý
// (không ghi nội dung body để tránh lộ dữ liệu).
// ---------------------------------------------------------------
app.use((req, res, next) => {
  // Render gọi /health liên tục, bỏ qua để log không bị tràn
  if (req.originalUrl === "/health") return next();
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`
    );
  });
  next();
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend đang hoạt động!" });
});

// ---------------------------------------------------------------
// Health Check Endpoint cho Cloud PaaS Monitoring
// /health      : Render dùng làm Health Check Path (Rolling Update)
// /api/health  : truy cập được qua Domain Frontend (Reverse Proxy /api/*)
// ---------------------------------------------------------------
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
};
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }

    res.json({ message: "Xóa sinh viên thành công!", deletedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT} - Auto-Deploy qua Docker Hub Webhook thành công!`);
});
