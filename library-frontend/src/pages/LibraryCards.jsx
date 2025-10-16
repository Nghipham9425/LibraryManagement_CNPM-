import React, { useEffect, useState } from "react";

export default function LibraryCards() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({
    cardNumber: "",
    userId: "",
    expiryDate: "",
    isActive: true,
    isBlocked: false,
    blockReason: "",
  });

  // Lấy danh sách thẻ từ API
  const fetchCards = async () => {
    const res = await fetch("http://localhost:5000/api/Account");
    if (res.ok) {
      const data = await res.json();
      setCards(data);
    }
  };

  // Gửi form tạo thẻ mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/Account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Thêm thẻ thành công!");
      fetchCards();
    } else {
      alert("Lỗi khi thêm thẻ!");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 Quản lý thẻ thư viện</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
          required
        />
        <input
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          required
        />
        <button type="submit">Thêm thẻ</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Card Number</th>
            <th>User ID</th>
            <th>Expiry Date</th>
            <th>Active</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c, i) => (
            <tr key={i}>
              <td>{c.cardNumber}</td>
              <td>{c.userId}</td>
              <td>{c.expiryDate?.split("T")[0]}</td>
              <td>{c.isActive ? "✅" : "❌"}</td>
              <td>{c.isBlocked ? "🚫" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
