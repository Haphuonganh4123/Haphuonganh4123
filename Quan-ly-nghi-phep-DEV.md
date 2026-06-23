# QUẢN LÝ NGHỈ PHÉP — YÊU CẦU BỔ SUNG (BA + Dev)

Đối chiếu file yêu cầu LSEV 09/06 + dữ liệu app-dev (LSEV HR Test, kỳ 6/2026).
**Không cần module mới** — chủ yếu sửa engine + 3 màn có sẵn (Chính sách phép, Hồ sơ NV, màn duyệt đơn).

---

## NHÓM 1 — QUỸ & TÍNH PHÉP

**1. Quỹ phép tính theo ngày vào công ty**
- Hiện: mọi NV được **12 ngày**, kể cả người vào tháng 6 (đã kiểm: 61 NV vào 2026 vẫn 12).
- Cần: vào **trước 1/1** = 12; vào **ngày 1–15** tháng X = số tháng X→12; vào **≥16** = trừ thêm 1. VD vào 1/6 → ~7 ngày.
- Vị trí: engine + cấu hình `/hr/leave-policy`. **Xong khi:** NV vào 1/6 ra ~7, không phải 12.

**2. Phép tồn theo tháng (không cho ứng phép tương lai)**
- Hiện: hiển thị cả quỹ năm (12), nghỉ bao nhiêu cũng được.
- Cần: phép **tích lũy 1 ngày/tháng**; tại tháng N chỉ được dùng phần đã tích. VD T6 chỉ được nghỉ ≤6 ngày.
- Vị trí: engine + `/hr/leave-policy` (tắt "Cho phép ứng phép trước"). **Xong khi:** T6 chặn nghỉ >6 nếu chưa tích đủ.

**3. Hiển thị "phép được nghỉ trong tháng" + cảnh báo vượt**
- Hiện: chỉ thấy "Phép còn năm 0/12".
- Cần: thêm dòng **"phép được nghỉ tháng này"** + chặn/cảnh báo khi tạo đơn vượt số đó.
- Vị trí: form Tạo đơn nghỉ + Trang cá nhân (`/hr/me`).

**4. F2 — nhập phép cộng thêm cho từng NV**
- Hiện: chưa có chỗ cộng phép thủ công.
- Cần: ô **"Điều chỉnh phép"** (số ngày +/−, ngày hiệu lực, lý do) — làm **giống mẫu "điều chỉnh Bảo hiểm"** đã có.
- Vị trí: **Hồ sơ NV › tab Nghỉ phép**. (F2 là per-NV, **không** đặt ở policy.)

**5. Sửa quỹ MP (chế độ nữ) = 2.5 ngày/năm**
- Hiện: hệ thống cho **MP còn ~30 ngày** (sai ~12 lần).
- Cần: MP = **2.5 ngày/năm**, chỉ NV nữ.
- Vị trí: tạo policy MP ở `/hr/leave-policy` (Tối đa 2.5, Giới tính = Nữ). **Xong khi:** MP còn ≤2.5.

---

## NHÓM 2 — ĐƠN NGHỈ

**6. Tách ký hiệu khi duyệt (1 đơn → nhiều loại nghỉ)**
- Hiện: 1 đơn chỉ chọn **1 ký hiệu** cho cả khoảng ngày.
- Cần: khi Nhân sự duyệt, **tách khoảng nghỉ thành nhiều đoạn, mỗi đoạn 1 ký hiệu**; **hết phép F thì tự chuyển O**. VD xin nghỉ 08–11/6 → duyệt: 08–09 = F, 10 = MP, 11 = O.
- Vị trí: màn **Chi tiết đơn / Hộp duyệt**. **Xong khi:** duyệt được 1 đơn ra nhiều ký hiệu.

**7. Sửa / Xóa đơn nghỉ (nửa ngày & cả ngày)**
- Hiện: tạo được, chưa rõ sửa/xóa.
- Cần: **Sửa** (đổi loại ½/cả ngày, ngày, ký hiệu) và **Xóa** (gỡ đơn → **hoàn lại phép đã trừ** → ngày về trạng thái chấm công gốc). Sau đó **tự "Tính lại công"**. Đã chốt lương → chặn/cảnh báo + ghi audit.
- Vị trí: danh sách Nghỉ phép + Chi tiết đơn.

---

## NHÓM 3 — BÁO CÁO & CUỐI NĂM

**8. Fix 2 báo cáo phép đang lỗi**
- Hiện: "Phép tồn cuối năm" và "Phép theo phòng ban" báo **"Đã xảy ra lỗi"**.
- Cần: tải được + số **đã dùng / còn lại đúng** (phụ thuộc fix #1, #5).
- Vị trí: `/hr/reports?r=leave-balance` và `?r=leave-usage-dept`.

**9. Engine đọc & áp "Chính sách nghỉ phép"**
- Hiện: màn `/hr/leave-policy` có sẵn nhưng **đang trống** (Tối đa/năm="Không giới hạn", Tích lũy="—") → engine cho 12 phẳng.
- Cần: set policy F (12/năm, 1/tháng) + MP (2.5, nữ) và **engine thật sự áp dụng**.

**10. Chuyển phép tồn (carry-over) — đúng rule**
- Hiện: có màn `/hr/leave-carry` nhưng chưa rõ rule.
- Cần: **KHÔNG chuyển phép năm trước sang năm sau** (chỉ để dành trong năm). **Xong khi:** chạy carry không cộng phép sang năm mới.

---

## THIẾU TRƯỜNG TRONG `/hr/leave-policy`
Form "Tạo chính sách" đang có: Tối đa/năm · Tích lũy/tháng · Giới tính · Loại NV · Cho phép ứng phép · Ngày HL. **Cần thêm:**
- **Mốc ngày tháng đầu** (mặc định 15) — để prorate theo ngày vào (#1).
- **Bậc phép theo thâm niên** (12 → 13 ở 5 năm → 14 ở 10 năm).
- **Quy tắc chuyển phép cuối năm** (Có/Không + tối đa) — phục vụ #10.
