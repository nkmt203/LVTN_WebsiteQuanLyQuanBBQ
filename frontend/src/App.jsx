import { useState, useEffect } from "react";

function App() {
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/food")
      .then((res) => res.json()) // đọc body, chuyển JSON -> object JS
      .then((data) => {
        setFoods(data); // lưu vào state -> React vẽ lại
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải món:", err);
        setError("Không tải được danh sách món");
        setLoading(false);
      });
  }, []);

  // 3. RETURN: phần giao diện.
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Thực đơn ({foods.length} món)</h1>
      <ul>
        {foods.map((mon) => (
          // key BẮT BUỘC phải duy nhất -> dùng ma_mon_an
          <li key={mon.ma_mon_an}>
            {mon.ten_mon_an} — {Number(mon.gia_ban).toLocaleString("vi-VN")}đ
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
