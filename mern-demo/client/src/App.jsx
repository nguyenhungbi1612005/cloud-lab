import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get(API_URL)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Lỗi lấy danh sách sinh viên:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const resetForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Đang ở chế độ SỬA -> gọi API PUT
      axios
        .put(`${API_URL}/${editingId}`, { studentId, name, email })
        .then(() => {
          resetForm();
          fetchStudents();
        })
        .catch((err) => console.error("Lỗi cập nhật sinh viên:", err));
    } else {
      // Chế độ THÊM MỚI -> gọi API POST
      axios
        .post(API_URL, { studentId, name, email })
        .then(() => {
          resetForm();
          fetchStudents();
        })
        .catch((err) => console.error("Lỗi thêm sinh viên:", err));
    }
  };

  const handleEditClick = (sv) => {
    setEditingId(sv._id);
    setStudentId(sv.studentId);
    setName(sv.name);
    setEmail(sv.email);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) return;

    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch((err) => console.error("Lỗi xóa sinh viên:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý sinh viên - v2.0</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "8px" }}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td>
                <button onClick={() => handleEditClick(sv)}>Sửa</button>
                <button onClick={() => handleDelete(sv._id)} style={{ marginLeft: "6px" }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;