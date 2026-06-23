# QUẢN LÝ NGHỈ PHÉP — VIỆC CẦN FIX (dev)

Đối chiếu file yêu cầu LSEV 09/06 + app-dev (LSEV HR Test, kỳ 6/2026). **Không cần module mới**, chủ yếu sửa engine + 3 màn có sẵn.

## Việc cần làm

| # | Việc | Vị trí | Xong khi |
|---|---|---|---|
| 1 | Quỹ phép **prorate theo ngày vào** (≤15 tính tháng, ≥16 bỏ) | engine + `/leave-policy` | NV vào 1/6 → quỹ ~7 (không phải 12) |
| 2 | **Phép tồn theo tháng** + tích lũy 1/tháng, **không ứng phép tương lai** | engine + `/leave-policy` (tắt "ứng phép") | T6 chỉ dùng ≤6 ngày |
| 3 | Hiển thị **"phép được nghỉ tháng này"** + **chặn nghỉ vượt tồn** | form Tạo đơn + `/me` | hiện đúng số tháng, vượt thì cảnh báo |
| 4 | **F2 — phép cộng thêm** từng NV | Hồ sơ NV › tab Nghỉ phép (clone đ/c Bảo hiểm) | nhập +N ngày, ngày HL, lý do |
| 5 | **Tách ký hiệu** 1 đơn → nhiều đoạn (F→MP→O), tự chuyển O khi hết F | màn duyệt đơn (Chi tiết đơn) | duyệt 4 ngày tách được F/F/MP/O |
| 6 | **Sửa / Xóa đơn nghỉ** (½ & cả ngày) → hoàn phép + tính lại công | danh sách + Chi tiết đơn | xóa đơn F → phép hoàn lại, chặn khi đã chốt lương |
| 7 | Sửa **quỹ MP = 2.5 ngày/năm** nữ (đang ~30) | `/leave-policy` (MP, giới tính Nữ) | MP còn ≤2.5 |
| 8 | Fix **2 báo cáo lỗi**: Phép tồn cuối năm, Phép theo phòng ban | `/reports?r=leave-balance`, `?r=leave-usage-dept` | tải được, số đã dùng/còn lại đúng |
| 9 | **Engine đọc & áp Chính sách nghỉ phép** (màn có nhưng đang trống) | `/leave-policy` | set Tối đa/Tích lũy → áp đúng cho NV |
| 10 | **Chuyển phép tồn**: KHÔNG chuyển phép năm trước sang năm sau | `/leave-carry` | chạy carry không cộng phép sang năm mới |

## Thiếu trường trong `/leave-policy` (form Tạo chính sách)
Đang có: Tối đa/năm · Tích lũy/tháng · Giới tính · Loại NV · Cho phép ứng phép · Ngày HL. **Cần thêm:**
- **Mốc ngày tháng đầu** (mặc định 15) — để prorate.
- **Bậc phép theo thâm niên** (12 → 13 ở 5 năm → 14 ở 10 năm).
- **Quy tắc chuyển phép cuối năm** (Có/Không + tối đa).

## Lưu ý
- F2 = điều chỉnh per-NV ở Hồ sơ NV, **không** ở policy.
- Sửa/xóa đơn & tách ký hiệu phải **đồng bộ ngược** quỹ phép + bảng công.
