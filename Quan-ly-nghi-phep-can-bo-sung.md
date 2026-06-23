# QUẢN LÝ NGHỈ PHÉP — TỔNG HỢP YÊU CẦU & THIẾT KẾ (gửi dev)

> **Nguồn:** file *"2026.06.09. Bổ sung phần chấm công — Quản lý phép"* (2 sheet: *Quy định về phép năm* + *Mẫu duyệt xin nghỉ*) + các điểm khách dặn thêm.
> **Đối chiếu:** dữ liệu thật app-dev (workspace **LSEV HR Test**, kỳ 6/2026).
> **Kết luận nhanh:** hệ thống đã có khung nghỉ phép (đơn + duyệt + trừ phép), cần **bổ sung 6 hạng mục** — **KHÔNG cần module mới**, chỉ gắn vào màn sẵn có.

---

## A. QUY TẮC NGHIỆP VỤ

### A.1 — Quỹ phép & phép tồn (Sheet 1)
1. **Quỹ phép năm = F1 (theo tháng) + F2 (HR nhập thêm)**. F1 theo **ngày vào công ty**:
   - Vào **trước 1/1** năm nay → **12 ngày**.
   - Vào ngày **1–15** tháng X → = số tháng từ X → 12 (được tính tháng vào).
   - Vào ngày **≥16** tháng X → = số tháng từ X → 12 **− 1**.
2. **Tích lũy:** mỗi tháng +1 — *số phép được nghỉ trong tháng = phép tồn tháng trước + 1*.
3. **Phép tồn (số được dùng tại 1 thời điểm):**
   ```
   Phép tồn = Quỹ phép − Đã nghỉ (T1→nay) − Số tháng còn lại (tháng sau→T12)
   ```
   ⇒ **Không cho ứng phép của tháng chưa tới.** VD: quỹ 12, tháng 6, chưa nghỉ → chỉ được dùng **6 ngày**.

### A.2 — Mẫu đơn xin nghỉ + duyệt (Sheet 2)
Đơn gồm **2 phần**: ① **NV nộp** (khoảng ngày, loại Cả/Nửa ngày, lý do); ② **Nhân sự duyệt** → được **TÁCH khoảng nghỉ thành nhiều đoạn, mỗi đoạn 1 ký hiệu**.

**Ví dụ trong file (NV 2309 — Lò Thị Xuyến):** NV xin nghỉ **08/06 → 11/06** (cả ngày), Nhân sự duyệt tách:

| Từ ngày | Đến ngày | Ký hiệu |
|---|---|---|
| 08/06 | 09/06 | **F** (phép năm) |
| 10/06 | 10/06 | **MP** (chế độ nữ) |
| 11/06 | 11/06 | **O** (hết phép) |

→ Hết phép F thì **tự chuyển sang O**; 1 đơn có thể có **nhiều ký hiệu**.

---

## A.3 — AUDIT TOÀN BỘ MÀN NGHỈ PHÉP (đã quét live 23/6/2026)

| Màn | Đường dẫn | Trạng thái |
|---|---|---|
| Quản lý nghỉ phép (danh sách đơn) | `/hr/leave` | ✅ OK |
| Tạo đơn nghỉ | form | ⚠️ chỉ **1 ký hiệu/đơn** (cần tách) |
| Cấu hình Ký hiệu nghỉ | `/hr/settings/master-data/leave-symbols` | ✅ đủ 30+ ký hiệu + tỷ lệ lương |
| **Chính sách nghỉ phép** | `/hr/leave-policy` | ⚠️ **TRỐNG** — Tối đa/năm="Không giới hạn", Tích lũy="—" |
| **Chuyển phép tồn** (carry cuối năm) | `/hr/leave-carry` | ✅ có — ⚠️ cần kiểm rule (SRS: KHÔNG chuyển phép năm trước sang năm sau) |
| Bulk import đơn nghỉ (Excel) | nút | ✅ có |
| BC "Phép tồn cuối năm" | `/hr/reports?r=leave-balance` | ❌ **LỖI tải trang** |
| BC "Phép theo phòng ban" | `/hr/reports?r=leave-usage-dept` | ❌ **LỖI tải trang** |
| BC "Xu hướng dùng phép" | `/hr/reports` | chưa kiểm |
| Hồ sơ NV › tab Nghỉ phép | `/hr/staff/{id}` | ✅ có |
| Trang cá nhân (phép còn) | `/hr/me` | ⚠️ chỉ hiện "0/12 năm" |

**🔴 Lỗi số liệu (audit):**
- **MP (chế độ nữ) SAI:** hệ thống cho **MP còn = 29–30 ngày** (133 NV=30, 6 NV=29) — theo SRS chỉ **2.5 ngày/năm** → sai ~12 lần. (161 NV=0 là nam, đúng.)
- **Phép F:** có trừ khi nghỉ (8–12), nhưng **quỹ gốc 12 sai** (người vào giữa năm vẫn 12) → "còn lại" sai vì gốc sai.
- **2 báo cáo phép lỗi** không tải được.

## A.4 — THIẾU TRONG CẤU HÌNH "CHÍNH SÁCH NGHỈ PHÉP" (`/hr/leave-policy`)

**Form "Tạo chính sách" HIỆN CÓ 7 trường:** ID ký hiệu nghỉ · Ngày hiệu lực · **Tối đa ngày/năm** · **Tích lũy ngày/tháng** · Giới tính · Loại NV · **Cho phép ứng phép trước**.
→ Đủ làm: quỹ năm + tích lũy/tháng + trần ứng phép + MP theo giới tính.

**❌ Thiếu 3 trường để đúng 100% quy tắc LSEV:**

| # | Thiếu | Vì sao cần |
|---|---|---|
| a | **Mốc ngày tính tháng đầu** (mặc định **15**) | Prorate theo ngày vào: vào **1–15** tính cả tháng vào, **≥16** bỏ tháng vào. Không có mốc → engine không cắt được → ra 12 phẳng |
| b | **Bậc phép theo THÂM NIÊN** (base 12; **5 năm → 13; 10 năm → 14**…) | Form chỉ có 1 ô "Tối đa/năm" cố định → không khai báo được phép tăng theo thâm niên (SRS CC-Q3) |
| c | **Quy tắc chuyển phép cuối năm** (cho phép sang năm sau: Có/Không + tối đa) | SRS: **KHÔNG chuyển phép năm trước sang năm sau**; màn "Chuyển phép tồn" cần rule này |
| d | *(tùy)* **Thanh toán phép chưa nghỉ** (phép còn cuối năm: trả tiền / mất) | Phiếu lương có dòng "Số phép được thanh toán" |

> **Lưu ý:** **F2 (phép cộng thêm từng người)** KHÔNG thuộc policy — đặt ở **Hồ sơ NV › tab Nghỉ phép** (điều chỉnh per-NV). Đúng thiết kế, đừng nhét vào policy.

## B. HIỆN TRẠNG HỆ THỐNG

**✅ Đã có:** tạo đơn nghỉ + **duyệt 3 cấp** (Tổ trưởng → TBP → Nhân sự); **trừ phép F** khi nghỉ; hiển thị "Phép còn lại năm"; đăng ký OT + duyệt.

**❌ Bằng chứng đang thiếu (kỳ 6/2026):**
- **61 NV vào công ty trong năm 2026** vẫn được cấp **12 ngày phép** — kể cả người vào **tháng 6** (đáng ra ~7). → quỹ đang **gán cứng 12**, không prorate.
- Trang cá nhân hiện **"Phép còn lại năm nay 0/12"** = quỹ cả năm, **không có** "phép được nghỉ tháng này".
- Form tạo đơn chỉ chọn **1 ký hiệu / đơn** → không tách được.

---

## C. 6 HẠNG MỤC CẦN BỔ SUNG

| # | Hạng mục | Nguồn |
|---|---|---|
| **1** | Quỹ phép **prorate theo ngày vào** (trước 1/1=12; 1–15 = số tháng còn lại; ≥16 = trừ 1) | Sheet 1 |
| **2** | Ô **F2 — phép cộng thêm (HR nhập)** | Sheet 1 |
| **3** | **Phép tồn theo tháng** — không ứng phép tháng chưa tới (T6 ≈ 6 ngày), tích lũy +1/tháng | Sheet 1 |
| **4** | Đơn duyệt **tách ký hiệu** F→MP→O, tự chuyển O khi hết phép | Sheet 2 |
| **5** | Hiển thị **"Số phép được nghỉ trong tháng"** trên form đơn/duyệt | Sheet 2 |
| **6** | **SỬA / XÓA đơn nghỉ** (nửa ngày hoặc cả ngày) — không chỉ tạo | Khách dặn thêm |
| **7** | **Sửa quỹ MP** = 2.5 ngày/năm cho LĐ nữ (đang để ~30) | Audit (SRS) |
| **8** | **Fix 2 báo cáo phép lỗi** (Phép tồn cuối năm, Phép theo phòng ban) — đảm bảo số "đã dùng / còn lại" đúng | Audit |
| **9** | **Cấu hình + engine áp dụng "Chính sách nghỉ phép"** (màn đã có nhưng đang trống) | Audit |
| **10** | **Kiểm tra "Chuyển phép tồn"**: theo SRS **KHÔNG chuyển phép năm trước sang năm sau** (chỉ để dành trong năm) | Audit (SRS) |

**Chi tiết #6 (Sửa/Xóa đơn nghỉ):**
- **Sửa:** đổi loại (½ ↔ cả ngày), từ–đến ngày, ký hiệu.
- **Xóa:** gỡ đơn → **hoàn lại phép đã trừ** (F/MP) → ngày đó về trạng thái chấm công gốc.
- Sau sửa/xóa → tự **"Tính lại công"** (cập nhật Bảng công + Phiếu đối chiếu).
- **Chặn sửa/xóa nếu kỳ lương đã chốt** (hoặc cho nhưng cảnh báo + **audit log**).

---

## D. THIẾT KẾ & VỊ TRÍ ĐẶT (tận dụng màn ĐÃ CÓ — không tạo menu mới)

Hệ thống sẵn có: Hồ sơ NV → **tab "Nghỉ phép"** (từng NV); tab **Bảo hiểm/Lương** có cơ chế **"điều chỉnh/quá trình"**; menu **Nghỉ phép** (Tạo đơn + Danh sách + click mở Chi tiết); **Hộp duyệt**; **Cài đặt** (Ký hiệu nghỉ · Luồng phê duyệt · Tham số).

| # | Hạng mục | Đặt ở đâu | Mới/Sửa | Cấu hình |
|---|---|---|---|---|
| 1 | Quỹ F1 auto | Backend tính từ **Ngày vào**; hiện ở **Hồ sơ NV › tab Nghỉ phép** | Sửa engine + hiển thị | **Chính sách nghỉ phép** (`/hr/leave-policy`) — màn ĐÃ CÓ, cần cấu hình F: Tối đa **12**/năm, Tích lũy **1**/tháng + **engine áp dụng** |
| 2 | F2 cộng thêm | **Hồ sơ NV › tab Nghỉ phép › "Điều chỉnh phép"** — clone mẫu *điều chỉnh Bảo hiểm* | Sửa (tab có sẵn) | nhập tay / import |
| 3 | Phép tồn theo tháng | Engine + hiện "phép nghỉ tháng này" ở **Trang cá nhân** & **form Tạo đơn** + validation | Sửa engine + form | **Chính sách nghỉ phép** → Tích lũy **1**/tháng + **tắt "Cho phép ứng phép trước"** |
| 4 | Tách ký hiệu | Bước **Nhân sự duyệt** trong **Chi tiết đơn** (xem E) | Sửa màn duyệt | Ký hiệu từ **Cài đặt › Ký hiệu nghỉ** |
| 5 | Hiển thị phép tồn trên đơn | **Form Tạo đơn** + **Chi tiết đơn** | Sửa form | — |
| 6 | Sửa/Xóa đơn | Thao tác ở **Danh sách Nghỉ phép** + nút trong **Chi tiết đơn** | Sửa | — (chặn khi đã chốt lương) |

---

## E. VỊ TRÍ ĐẶT "MẪU ĐƠN" — trong menu **Nghỉ phép**

```
HR ▸ Nghỉ phép  (menu đã có — KHÔNG tạo mới)
 ├─ [Tạo đơn nghỉ]           ← phần NV NỘP (từ–đến, loại ½/cả ngày, lý do)
 ├─ Danh sách đơn nghỉ phép
 │    └─ bấm 1 dòng → ❲ CHI TIẾT ĐƠN ❳ = "MẪU ĐƠN" đầy đủ (NV xin + NS duyệt)
 └─ (Hộp duyệt = lối tắt, bấm vào cũng mở đúng Chi tiết đơn này)
```
*NV self-service: Trang cá nhân → "Đăng ký nghỉ" cũng đẩy vào cùng danh sách này.*

---

## F. MOCKUP CÁC MÀN

### F.1 — Chi tiết đơn nghỉ (tách ký hiệu + Sửa/Xóa)
```
❲ CHI TIẾT ĐƠN NGHỈ ❳                 Phép tồn tháng này: 3 ngày
──────────────────────────────────────────────────────────
① NV xin (read-only)
   NV: Lò Thị Xuyến (2309) · Injection molding
   Từ 08/06 → 11/06 · Cả ngày · Lý do: ...
──────────────────────────────────────────────────────────
② NHÂN SỰ DUYỆT — tách ký hiệu
   Từ ngày | Đến ngày | Ký hiệu
   08/06   | 09/06    | [F  ▾]  (F còn 2)
   10/06   | 10/06    | [MP ▾]
   11/06   | 11/06    | [O  ▾]  (hết F → gợi ý O)
   [+ Thêm dòng]                    [Từ chối] [Duyệt]
──────────────────────────────────────────────────────────
                                       [✏ Sửa] [🗑 Xóa]
```

### F.2 — Hồ sơ NV › tab Nghỉ phép (Quỹ + F2 + Phép tồn)
```
HỒ SƠ NV › Nghỉ phép                       NV: Vi Thị Mến (2310)
┌ Quỹ phép 2026 ───────────────────────────┐
│ F1 (auto theo ngày vào 01/06): 7 ngày     │
│ F2 (cộng thêm):                +2  [Sửa]  │ ← Ô NHẬP MỚI (clone đ/c Bảo hiểm)
│ ─────────────────────────────             │
│ Tổng quỹ: 9 · Đã nghỉ: 1 · Còn (năm): 8   │
│ ► Được nghỉ THÁNG NÀY: 4 ngày             │
└───────────────────────────────────────────┘
[+ Điều chỉnh phép]  Ngày HL | Số ngày(+/−) | Lý do | Số QĐ
```

### F.3 — Danh sách Nghỉ phép (Sửa/Xóa) + Trang cá nhân (phép tồn)
```
Nghỉ phép ▸ Danh sách
 NV       | Ký hiệu | Loại    | Từ–Đến  | Trạng thái | Thao tác
 Lò Xuyến | F       | Cả ngày | 08-09/6 | Đã duyệt   | [✏][🗑]
 Hà Trung | ½F      | Nửa ngày| 15/6    | Đã duyệt   | [✏][🗑]

Trang cá nhân
 PHÉP CÒN NĂM: 8/9     ► PHÉP ĐƯỢC NGHỈ THÁNG NÀY: 4   (thêm dòng này)
```

---

## G. TÓM TẮT CHO DEV — 4 việc, KHÔNG màn mới
1. **Engine:** tính lại quỹ phép theo ngày vào (F1) + cộng F2; áp **phép tồn theo tháng** (chặn ứng phép tương lai).
2. **Hồ sơ NV › tab Nghỉ phép:** hiển thị Quỹ/Đã dùng/Tồn + ô **Điều chỉnh F2** (clone mẫu Bảo hiểm).
3. **Chi tiết đơn nghỉ:** cho **tách 1 đơn thành nhiều ký hiệu** (F→MP→O) + nút **Sửa/Xóa** đơn (đồng bộ ngược lại phép & bảng công).
4. **Cài đặt:** thêm mục *"Định mức phép"* + công tắc *"tích lũy theo tháng"*.

---

## H. TIÊU CHÍ NGHIỆM THU
1. NV vào giữa năm → quỹ phép **prorate đúng** (vào 1/6 → ~7, không phải 12); có ô **F2**.
2. Trong tháng, NV **không nghỉ vượt phép tồn** (T6 không cho >6 nếu chưa tích đủ).
3. Form đơn/duyệt **hiển thị số phép được nghỉ trong tháng**.
4. Duyệt 1 đơn nhiều ngày → **tách được** nhiều ký hiệu; hết F → **tự gán O**.
5. Đơn nghỉ (½ hoặc cả ngày) **Sửa/Xóa được**; xóa → **hoàn phép + tính lại công**; đã chốt lương → chặn/cảnh báo + audit.
6. **MP** = đúng **2.5 ngày/năm** cho LĐ nữ (cấu hình policy MP: Tối đa 2.5, Giới tính Nữ) — không còn ~30.
7. **2 báo cáo phép** (Phép tồn cuối năm, Phép theo phòng ban) tải được + số **đã dùng / còn lại khớp** thực tế.
8. **Chuyển phép tồn**: chạy carry chỉ **để dành trong năm**, **KHÔNG** cộng phép năm trước sang năm sau.

---

## I. CẦN KHÁCH XÁC NHẬN
1. Khi tách ký hiệu: hệ thống **tự đề xuất** (F→O) hay Nhân sự **chọn tay** từng đoạn?
2. Thứ tự ưu tiên ký hiệu khi tách (F trước rồi O; MP do NV ghi rõ?).
3. Sửa/Xóa đơn sau khi **kỳ lương đã chốt** — chặn hẳn hay cho + ghi audit?

---
*Lập bởi BA — đối chiếu file Quản lý phép 09/06 với app-dev (LSEV HR Test) kỳ 6/2026.*
