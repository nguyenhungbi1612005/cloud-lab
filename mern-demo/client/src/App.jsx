import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://congenial-guacamole-wv9jqrp6q6wjfwv5-5000.app.github.dev/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchStudents = () => {
    axios
      .get(API_URL)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Lỗi lấy danh sách sinh viên:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URL, { studentId, name, email })
      .then(() => {
        setStudentId("");
        setName("");
        setEmail("");
        fetchStudents();
      })
      .catch((err) => console.error("Lỗi thêm sinh viên:", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý sinh viên</h1>

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
        <button type="submit">Thêm sinh viên</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;