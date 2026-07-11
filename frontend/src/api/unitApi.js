import { BASE_URL } from "./apiConfig";

export async function getAllUnits(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== undefined && v !== null) {
      qs.append(k, v);
    }
  });
  const res = await fetch(`${BASE_URL}/units?${qs.toString()}`);
  if (!res.ok) throw new Error("Không tải được đơn vị tính");
  return res.json();
}

export async function createUnit(data) {
  const res = await fetch(`${BASE_URL}/units`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Thêm thất bại");
  return result;
}

export async function updateUnit(id, data) {
  const res = await fetch(`${BASE_URL}/units/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");
  return result;
}

export async function deleteUnit(id) {
  const res = await fetch(`${BASE_URL}/units/${id}`, {
    method: "DELETE",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Xóa thất bại");
  return result;
}
