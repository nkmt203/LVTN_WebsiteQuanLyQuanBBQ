const pool = require("../config/db");

// d. Xem + tiềm kiềm
const getAllIngredients = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const maDonViTinh = req.query.ma_don_vi_tinh || "";
    const trangThai = req.query.trang_thai || "";
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push(`(nl.ten_nguyen_lieu LIKE ? OR nl.ma_nguyen_lieu=? )`);
      params.push(`%${keyword}%`, Number(keyword) || 0);
    }
    if (maDonViTinh) {
      conditions.push(`nl.ma_don_vi_tinh= ?`);
      params.push(maDonViTinh);
    }
    if (trangThai) {
      conditions.push(`nl.trang_thai= ?`);
      params.push(trangThai);
    }

    const dieuKien = conditions.length
      ? `WHERE ` + conditions.join(` AND `)
      : "";
    const [countRows] = await pool.query(
      `
        SELECT COUNT(*) AS total FROM NGUYEN_LIEU nl ${dieuKien}
        `,
      params,
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `
        SELECT nl.ma_nguyen_lieu,nl.ten_nguyen_lieu, nl.ma_don_vi_tinh, dvt.ten_don_vi_tinh, nl.trang_thai
        FROM NGUYEN_LIEU nl JOIN DON_VI_TINH dvt ON nl.ma_don_vi_tinh= dvt.ma_don_vi_tinh
        ${dieuKien}
        ORDER BY nl.ma_nguyen_lieu DESC
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
    console.error("Lỗi getAllIngredients:", err.message);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách nguyên liệu" });
  }
};

// a. POST /api/ingredients
const createIngredient = async (req, res) => {
  try {
    const { ten_nguyen_lieu, ma_don_vi_tinh } = req.body;
    if (!ten_nguyen_lieu || !ten_nguyen_lieu.trim() || !ma_don_vi_tinh) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ tên nguyên liệu và đơn vị tính",
      });
    }

    const [dvt] = await pool.query(
      `
      SELECT trang_thai FROM DON_VI_TINH WHERE ma_don_vi_tinh=?
      `,
      [ma_don_vi_tinh],
    );
    if (dvt.length === 0) {
      return res.status(400).json({ message: "Đơn vị tính không tồn tại" });
    }
    if (dvt[0].trang_thai === "Ngung_su_dung") {
      return res.status(400).json({
        message:
          "Đơn vị tính đang ngừng sử dụng, không thể chọn cho nguyên liệu",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO NGUYEN_LIEU (ten_nguyen_lieu, ma_don_vi_tinh) 
      VALUES (?,?)
      `,
      [ten_nguyen_lieu.trim(), ma_don_vi_tinh],
    );
    res.status(201).json({
      ma_nguyen_lieu: result.insertId,
      message: "Thêm mới nguyên liệu thành công",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Nguyên liệu đã tồn tại" });
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return res.status(400).json({ message: "Đơn vị tính không tồn tại" });
    console.error("Lỗi createIngredient:", err.message);
    res.status(500).json({ message: "Lỗi server khi thêm nguyên liệu" });
  }
};

// b. PUT /api/ingredients/:id
const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_nguyen_lieu, ma_don_vi_tinh } = req.body;

    if (!ten_nguyen_lieu || !ten_nguyen_lieu.trim() || !ma_don_vi_tinh) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ tên nguyên liệu và đơn vị tính",
      });
    }

    const [dvt] = await pool.query(
      `
      SELECT trang_thai FROM DON_VI_TINH WHERE ma_don_vi_tinh=?
      `,
      [ma_don_vi_tinh],
    );
    if (dvt.length === 0) {
      return res.status(400).json({ message: "Đơn vị tính không tồn tại" });
    }
    if (dvt[0].trang_thai === "Ngung_su_dung") {
      return res.status(400).json({
        message:
          "Đơn vị tính đang ngừng sử dụng, không thể chọn cho nguyên liệu",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE NGUYEN_LIEU SET ten_nguyen_lieu=?, ma_don_vi_tinh=? 
      WHERE ma_nguyen_lieu= ?
      `,
      [ten_nguyen_lieu.trim(), ma_don_vi_tinh, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy nguyên liệu cần sửa" });
    }
    res.json({ message: "Cập nhật nguyên liệu thành công" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Nguyên liệu đã tồn tại" });
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return res.status(400).json({ message: "Đơn vị tính không tồn tại" });
    console.error("Lỗi updateIngredient:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật nguyên liệu" });
  }
};

//c. PATCH /api/ingredients/:id/status
const updateIngredientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!["Hoat_dong", "Ngung_su_dung"].includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const [rows] = await pool.query(
      `
      SELECT ma_nguyen_lieu FROM NGUYEN_LIEU WHERE ma_nguyen_lieu=?
      `,
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nguyên liệu không còn tồn tại trên hệ thống" });
    }

    //Kiểm ra nl có trong định mức món ăn không

    if (trang_thai === "Ngung_su_dung") {
      const [dmRows] = await pool.query(
        `
      SELECT COUNT(*) AS soMon FROM DINH_MUC_NGUYEN_LIEU
      WHERE ma_nguyen_lieu=? AND trang_thai='Hoat_dong'
      `,
        [id],
      );
      if (dmRows[0].soMon > 0) {
        return res.status(409).json({
          message: `Nguyên liệu đang được dùng trong ${dmRows[0].soMon} định mức hoạt động, không thể thay đổi trạng thái.`,
        });
      }
    }

    await pool.query(
      `
      UPDATE NGUYEN_LIEU SET trang_thai=? WHERE ma_nguyen_lieu=?
      `,
      [trang_thai, id],
    );
    res.json({ message: "Thay đổi trạng thái nguyên liệu thành công" });
  } catch (err) {
    console.error("Lỗi updateIngredientStatus:", err.message);
    res
      .status(500)
      .json({ message: "Lỗi server khi đổi trạng thái nguyên liệu" });
  }
};

//d. DELETE /api/ingredients/:id
const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `
      SELECT ma_nguyen_lieu FROM NGUYEN_LIEU WHERE ma_nguyen_lieu=?
      `,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    }

    //KIểm tra kho-nhập-định mức
    const [refs] = await pool.query(
      `
      SELECT
      (SELECT COUNT(*) FROM KHO_NGUYEN_LIEU WHERE ma_nguyen_lieu=?)+
       (SELECT COUNT(*) FROM DINH_MUC_NGUYEN_LIEU WHERE ma_nguyen_lieu=?)+
        (SELECT COUNT(*) FROM CHI_TIET_NHAP_KHO WHERE ma_nguyen_lieu=?)+
         (SELECT COUNT(*) FROM CHI_TIET_XUAT_KHO WHERE ma_nguyen_lieu=?) +
          (SELECT COUNT(*) FROM NHAT_KY_HAO_HUT WHERE ma_nguyen_lieu=?) AS tongRef
      `,
      [id, id, id, id, id],
    );
    if (refs[0].tongRef > 0) {
      return res.status(409).json({
        message:
          "Không thể xóa nguyên liệu đang được sử dụng. Vui lòng chuyển sang trạng thái Ngừng sử dụng.",
      });
    }

    await pool.query(`DELETE FROM NGUYEN_LIEU WHERE ma_nguyen_lieu =?`, [id]);
    res.json({ message: "Xóa nguyên liệu thành công" });
  } catch (err) {
    console.error("Lỗi deleteIngredient:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa nguyên liệu" });
  }
};

module.exports = {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  updateIngredientStatus,
  deleteIngredient,
};
