const pool = require("../config/db");

// GET /api/recipes (XEM +TÌM KIẾM)
const getAllRecipes = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push(
        `(m.ten_mon_an LIKE ? OR nl.ten_nguyen_lieu LIKE ? OR m.ma_mon_an = ?)`,
      );
      params.push(`%${keyword}%`, `%${keyword}%`, Number(keyword) || 0);
    }

    if (trangThai) {
      conditions.push(`dm.trang_thai=?`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(` AND `)
      : "";

    //Đếm tổng dòng món (mỗi dòng= 1 cập món-nl)
    const [countRows] = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM DINH_MUC_NGUYEN_LIEU dm
        JOIN MON_AN m ON dm.ma_mon_an= m.ma_mon_an
        JOIN NGUYEN_LIEU nl ON dm.ma_nguyen_lieu = nl.ma_nguyen_lieu
        ${dieuKien}
        `,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
        SELECT dm.ma_dinh_muc, dm.ma_mon_an, m.ten_mon_an,
                dm.ma_nguyen_lieu, nl.ten_nguyen_lieu,
                dvt.ten_don_vi_tinh, dm.so_luong_su_dung,
                dm.ghi_chu,dm.trang_thai
        FROM DINH_MUC_NGUYEN_LIEU dm
        JOIN MON_AN m ON dm.ma_mon_an= m.ma_mon_an
        JOIN NGUYEN_LIEU nl ON dm.ma_nguyen_lieu = nl.ma_nguyen_lieu
        JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh= dvt.ma_don_vi_tinh
        ${dieuKien}
        ORDER BY m.ten_mon_an DESC , nl.ten_nguyen_lieu DESC
        LIMIT ${limit} OFFSET ${offset}
        `,
      params,
    );

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi getAllRecipes:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy định mức" });
  }
};

// GET /api/recipes/food/:foodId (LẤY ĐM 1 món cụ thể)
const getRecipeByFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const [rows] = await pool.query(
      `
            SELECT dm.ma_dinh_muc, dm.ma_nguyen_lieu,nl.ten_nguyen_lieu,
                    dvt.ten_don_vi_tinh,dm.so_luong_su_dung,dm.ghi_chu,dm.trang_thai
            FROM DINH_MUC_NGUYEN_LIEU dm
            JOIN NGUYEN_LIEU nl ON dm.ma_nguyen_lieu= nl.ma_nguyen_lieu
            JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh= dvt.ma_don_vi_tinh
            WHERE dm.ma_mon_an= ?
            ORDER BY nl.ten_nguyen_lieu ASC
            `,
      [foodId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi getRecipesByFood:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//POST /api/recipes
const createRecipes = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { ma_mon_an, items } = req.body;
    if (!ma_mon_an || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Vui lòng chọn món ăn và thêm ít nhất 1 nguyên liệu",
      });
    }

    //xác thực từng dòng
    for (const item of items) {
      if (
        !item.ma_nguyen_lieu ||
        !item.so_luong_su_dung ||
        Number(item.so_luong_su_dung) <= 0
      ) {
        return res
          .status(400)
          .json({ message: "Mỗi nguyên liệu phải có số lượng >0" });
      }
    }

    //Kiểm tra trùng nl
    const nlDung = items.map((i) => i.ma_nguyen_lieu);
    if (new Set(nlDung).size !== nlDung.length) {
      return res.status(400).json({
        message: "Không được chọn trùng nguyên liệu trong 1 lần thêm",
      });
    }
    await conn.beginTransaction();
    for (const item of items) {
      await conn.query(
        `
            INSERT INTO DINH_MUC_NGUYEN_LIEU
                (ma_mon_an,ma_nguyen_lieu,so_luong_su_dung,ghi_chu)
            VALUES (?,?,?,?)
            `,
        [
          ma_mon_an,
          item.ma_nguyen_lieu,
          item.so_luong_su_dung,
          item.ghi_chu || null,
        ],
      );
    }
    await conn.commit();
    res.status(201).json({
      message: `Thiết lập định mức thành công (${items.length}) nguyên liệu`,
    });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Nguyên liệu đã tồn tại trong định mức của món ăn này. Vui lòng sử dụng chức năng cập nhật",
      });
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "Món ăn hoặc nguyên liệu không tồn tại",
      });
    }
    console.error("Lỗi createRecipes: ", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm định mức" });
  } finally {
    conn.release();
  }
};

//PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_luong_su_dung, ghi_chu } = req.body;
    if (!so_luong_su_dung || Number(so_luong_su_dung) <= 0) {
      return res.status(400).json({ message: "Số lượng sử dụng phải > 0" });
    }

    const [result] = await pool.query(
      `
        UPDATE DINH_MUC_NGUYEN_LIEU SET so_luong_su_dung=?, ghi_chu=?
        WHERE ma_dinh_muc= ?
        `,
      [so_luong_su_dung, ghi_chu || null, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy định mức cần sửa" });
    }
    res.json({ message: "Cập nhật định mức thành công" });
  } catch (err) {
    console.error("Lỗi updateRecipe:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật định mức" });
  }
};

// PATCH /api/recipes/:id/status
const updateRecipeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!["Hoat_dong", "Ngung_su_dung"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const [result] = await pool.query(
      `
        UPDATE DINH_MUC_NGUYEN_LIEU SET trang_thai=? 
        WHERE ma_dinh_muc = ?
        `,
      [trang_thai, id],
    );
    if (result.affectedRows === 0) {
      return res.statusZ(404).json({ message: "Không tìm thấy định mức" });
    }
    res.json({ message: "Thay đổi trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi updateRecipeStatus:", err.message);
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái" });
  }
};

//DELETE /api/recipes/:id
const deletRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `
            DELETE FROM DINH_MUC_NGUYEN_LIEU 
            WHERE ma_dinh_muc= ?
            `,
      [id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy định mức" });
    }
    res.json({ message: "Xóa định mức thành công" });
  } catch (err) {
    console.error("Lỗi deleteRecipe:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa định mức" });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeByFood,
  createRecipes,
  updateRecipe,
  updateRecipeStatus,
  deletRecipe,
};
