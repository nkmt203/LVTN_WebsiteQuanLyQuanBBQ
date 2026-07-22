import { useState, useEffect } from "react";
import {
  getInventory,
  updateMinStock,
  getImportReceipts,
  getImportReceiptDetail,
  createImportReceipt,
  getExportReceipts,
  getExportReceiptDetail,
  createExportReceipt,
} from "../../api/warehouseApi";
import { getActiveSuppliers } from "../../api/supplierApi";
import InventoryFilterBar from "../../components/warehouse/InventoryFilterBar";
import InventoryTable from "../../components/warehouse/InventoryTable";
import MinStockForm from "../../components/warehouse/MinStockForm";
import ImportReceiptTable from "../../components/warehouse/ImportReceiptTable";
import ImportReceiptForm from "../../components/warehouse/ImportReceiptForm";
import ImportReceiptDetail from "../../components/warehouse/ImportReceiptDetail";
import ExportReceiptTable from "../../components/warehouse/ExportReceiptTable";
import ExportReceiptForm from "../../components/warehouse/ExportReceiptForm";
import ExportReceiptDetail from "../../components/warehouse/ExportReceiptDetail";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/errorHandler";

const PER_PAGE = 10;
const TABS = [
  { key: "inventory", label: "Tồn kho" },
  { key: "imports", label: "Phiếu nhập" },
  { key: "exports", label: "Phiếu xuất" },
];

function WarehousePage() {
  const [tab, setTab] = useState("inventory");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Dữ liệu dùng chung cho form (dropdown)
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryAll, setInventoryAll] = useState([]); // full list, dùng cho dropdown NL + tồn hiện tại

  // ===== TAB: TỒN KHO =====
  const [inventory, setInventory] = useState([]);
  const [invKeyword, setInvKeyword] = useState("");
  const [invTrangThaiTon, setInvTrangThaiTon] = useState("");
  const [invPage, setInvPage] = useState(1);
  const [invTotalPages, setInvTotalPages] = useState(1);
  const [invTotal, setInvTotal] = useState(0);
  const [minStockOpen, setMinStockOpen] = useState(false);
  const [minStockTarget, setMinStockTarget] = useState(null);
  const [minStockValue, setMinStockValue] = useState("");

  // ===== TAB: PHIẾU NHẬP =====
  const [imports, setImports] = useState([]);
  const [impPage, setImpPage] = useState(1);
  const [impTotalPages, setImpTotalPages] = useState(1);
  const [impTotal, setImpTotal] = useState(0);
  const [impAddOpen, setImpAddOpen] = useState(false);
  const [impDetailOpen, setImpDetailOpen] = useState(false);
  const [impDetail, setImpDetail] = useState(null);

  // ===== TAB: PHIẾU XUẤT =====
  const [exports, setExports] = useState([]);
  const [expPage, setExpPage] = useState(1);
  const [expTotalPages, setExpTotalPages] = useState(1);
  const [expTotal, setExpTotal] = useState(0);
  const [expAddOpen, setExpAddOpen] = useState(false);
  const [expDetailOpen, setExpDetailOpen] = useState(false);
  const [expDetail, setExpDetail] = useState(null);

  async function loadInventoryAll() {
    try {
      const resp = await getInventory({ limit: 500 });
      setInventoryAll(Array.isArray(resp.data) ? resp.data : []);
    } catch {
      // dùng cho dropdown, lỗi không chặn màn hình chính
    }
  }

  async function loadInventory(opts = {}) {
    const p = opts.p ?? invPage;
    const kw = opts.keyword ?? invKeyword;
    const tt = opts.trangThaiTon ?? invTrangThaiTon;
    try {
      const resp = await getInventory({
        keyword: kw,
        trang_thai_ton: tt,
        page: p,
        limit: PER_PAGE,
      });
      setInventory(Array.isArray(resp.data) ? resp.data : []);
      setInvTotal(resp.total || 0);
      setInvTotalPages(resp.totalPages || 1);
      setInvPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadImports(opts = {}) {
    const p = opts.p ?? impPage;
    try {
      const resp = await getImportReceipts({ page: p, limit: PER_PAGE });
      setImports(Array.isArray(resp.data) ? resp.data : []);
      setImpTotal(resp.total || 0);
      setImpTotalPages(resp.totalPages || 1);
      setImpPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  async function loadExports(opts = {}) {
    const p = opts.p ?? expPage;
    try {
      const resp = await getExportReceipts({ page: p, limit: PER_PAGE });
      setExports(Array.isArray(resp.data) ? resp.data : []);
      setExpTotal(resp.total || 0);
      setExpTotalPages(resp.totalPages || 1);
      setExpPage(resp.page || 1);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const sResp = await getActiveSuppliers();
        setSuppliers(Array.isArray(sResp) ? sResp : []);
      } catch {
        // dropdown NCC rỗng nếu lỗi, không chặn màn hình chính
      }
      await loadInventoryAll();
      await loadInventory({ p: 1 });
      await loadImports({ p: 1 });
      await loadExports({ p: 1 });
      setLoading(false);
    }
    init();
  }, []);

  // ===== TỒN KHO: đặt mức tối thiểu =====
  function openMinStock(nl) {
    setMinStockTarget(nl);
    setMinStockValue(String(nl.muc_ton_toi_thieu));
    setMinStockOpen(true);
  }
  async function handleSaveMinStock() {
    try {
      const r = await updateMinStock(minStockTarget.ma_nguyen_lieu, Number(minStockValue));
      setMessage("✅ " + r.message);
      setMinStockOpen(false);
      await Promise.all([loadInventory(), loadInventoryAll()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // ===== PHIẾU NHẬP =====
  async function handleCreateImport(payload) {
    try {
      const r = await createImportReceipt(payload);
      setMessage("✅ " + r.message);
      setImpAddOpen(false);
      // Bước 7: hiển thị chi tiết phiếu nhập vừa tạo
      const detail = await getImportReceiptDetail(r.ma_phieu_nhap);
      setImpDetail(detail);
      setImpDetailOpen(true);
      await Promise.all([loadImports({ p: 1 }), loadInventory(), loadInventoryAll()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }
  async function handleViewImportDetail(id) {
    try {
      const detail = await getImportReceiptDetail(id);
      setImpDetail(detail);
      setImpDetailOpen(true);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  // ===== PHIẾU XUẤT =====
  async function handleCreateExport(payload) {
    try {
      const r = await createExportReceipt(payload);
      setMessage("✅ " + r.message);
      setExpAddOpen(false);
      // Bước 7: hiển thị chi tiết phiếu xuất vừa tạo
      const detail = await getExportReceiptDetail(r.ma_phieu_xuat);
      setExpDetail(detail);
      setExpDetailOpen(true);
      await Promise.all([loadExports({ p: 1 }), loadInventory(), loadInventoryAll()]);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }
  async function handleViewExportDetail(id) {
    try {
      const detail = await getExportReceiptDetail(id);
      setExpDetail(detail);
      setExpDetailOpen(true);
    } catch (err) {
      setMessage("❌ " + getErrorMessage(err));
    }
  }

  if (loading) return <p className="text-slate-500 p-4">Đang tải...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Kho</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tồn kho được cập nhật đồng bộ với luồng bếp tự động trừ khi hoàn thành món.
          </p>
        </div>
        {tab === "imports" && (
          <button onClick={() => setImpAddOpen(true)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">
            + Lập phiếu nhập
          </button>
        )}
        {tab === "exports" && (
          <button onClick={() => setExpAddOpen(true)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900">
            + Lập phiếu xuất
          </button>
        )}
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-4 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px " +
              (tab === t.key
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-700")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <>
          <InventoryFilterBar
            keyword={invKeyword}
            setKeyword={setInvKeyword}
            trangThaiTon={invTrangThaiTon}
            setTrangThaiTon={setInvTrangThaiTon}
            onSearch={() => loadInventory({ p: 1 })}
            onReset={() => {
              setInvKeyword("");
              setInvTrangThaiTon("");
              loadInventory({ p: 1, keyword: "", trangThaiTon: "" });
            }}
          />
          <InventoryTable items={inventory} onEditMinStock={openMinStock} />
          <Pagination page={invPage} totalPages={invTotalPages} total={invTotal}
                      onPageChange={(p) => loadInventory({ p })} />
        </>
      )}

      {tab === "imports" && (
        <>
          <ImportReceiptTable receipts={imports} onViewDetail={handleViewImportDetail} />
          <Pagination page={impPage} totalPages={impTotalPages} total={impTotal}
                      onPageChange={(p) => loadImports({ p })} />
        </>
      )}

      {tab === "exports" && (
        <>
          <ExportReceiptTable receipts={exports} onViewDetail={handleViewExportDetail} />
          <Pagination page={expPage} totalPages={expTotalPages} total={expTotal}
                      onPageChange={(p) => loadExports({ p })} />
        </>
      )}

      {/* Modal: đặt mức tồn tối thiểu */}
      <Modal open={minStockOpen} onClose={() => setMinStockOpen(false)} title="Đặt mức tồn tối thiểu">
        {minStockTarget && (
          <MinStockForm
            tenNguyenLieu={minStockTarget.ten_nguyen_lieu}
            tonHienTai={Number(minStockTarget.so_luong_ton)}
            mucTonToiThieu={minStockValue}
            setMucTonToiThieu={setMinStockValue}
            onSave={handleSaveMinStock}
            onCancel={() => setMinStockOpen(false)}
          />
        )}
      </Modal>

      {/* Modal: lập phiếu nhập */}
      <Modal open={impAddOpen} onClose={() => setImpAddOpen(false)} title="Lập phiếu nhập kho">
        <ImportReceiptForm
          suppliers={suppliers}
          ingredients={inventoryAll}
          onSave={handleCreateImport}
          onCancel={() => setImpAddOpen(false)}
        />
      </Modal>

      {/* Modal: chi tiết phiếu nhập */}
      <Modal open={impDetailOpen} onClose={() => setImpDetailOpen(false)}
             title={impDetail ? `Phiếu nhập #${impDetail.phieuNhap.ma_phieu_nhap}` : "Chi tiết phiếu nhập"}>
        <ImportReceiptDetail detail={impDetail} />
      </Modal>

      {/* Modal: lập phiếu xuất */}
      <Modal open={expAddOpen} onClose={() => setExpAddOpen(false)} title="Lập phiếu xuất kho">
        <ExportReceiptForm
          ingredients={inventoryAll}
          onSave={handleCreateExport}
          onCancel={() => setExpAddOpen(false)}
        />
      </Modal>

      {/* Modal: chi tiết phiếu xuất */}
      <Modal open={expDetailOpen} onClose={() => setExpDetailOpen(false)}
             title={expDetail ? `Phiếu xuất #${expDetail.phieuXuat.ma_phieu_xuat}` : "Chi tiết phiếu xuất"}>
        <ExportReceiptDetail detail={expDetail} />
      </Modal>
    </div>
  );
}

export default WarehousePage;
