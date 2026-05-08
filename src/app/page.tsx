"use client";

import { FormEvent, useState } from "react";

const navItems = [
  ["overview", "Tổng quan", "Vận hành HRM"],
  ["catalog", "Danh mục", "Cấu hình nền"],
  ["employees", "Hồ sơ NV", "Vòng đời nhân sự"],
  ["contracts", "Hợp đồng", "TV, HV, HĐLĐ"],
  ["attendance", "Chấm công", "Ca, nghỉ, OT"],
  ["payroll", "Tiền lương", "BH, PIT, bank list"],
  ["security", "Phân quyền", "SSO, RBAC, audit"],
  ["feedback", "Ý kiến NLĐ", "Tiếp nhận, phản hồi"],
  ["quality", "NFR", "Hiệu năng, bảo mật"],
];

const metrics = [
  ["Nhân sự", "1.000", "Mục tiêu tải hệ thống"],
  ["Module", "07", "Theo phạm vi SRS v2.1"],
  ["Ca LSEV", "07", "Có ca vắt qua đêm +1"],
  ["Ký hiệu công", "30+", "Song ngữ VI-EN"],
  ["Tính lương", "< 5 phút", "Cho toàn công ty"],
  ["Xuất Excel", "< 15 giây", "Cho 1.000 dòng"],
];

const modules = [
  {
    code: "M01",
    title: "Danh mục & Cấu hình",
    owner: "HR Admin",
    scope: "Cây tổ chức, ca làm việc, ký hiệu nghỉ, chức danh, bậc lương, phụ cấp, định mức pháp luật, RBAC.",
  },
  {
    code: "M02",
    title: "Hồ sơ nhân viên",
    owner: "HR Admin, TBP",
    scope: "Thông tin cá nhân, 5 loại quá trình, người liên hệ, NPT, ngân hàng, đào tạo, thôi việc.",
  },
  {
    code: "M03",
    title: "Hợp đồng lao động",
    owner: "HR Admin",
    scope: "4 loại hợp đồng, quy trình tự động, 7 template VI-EN, đánh giá, cảnh báo hết hạn, in PDF/Word.",
  },
  {
    code: "M04",
    title: "Chấm công",
    owner: "HR Admin, Tổ trưởng, NLĐ",
    scope: "Máy Ronald Jack, xếp ca, đăng ký nghỉ 3 cấp, OT tự động, tổng hợp công, báo cáo.",
  },
  {
    code: "M05",
    title: "Tiền lương",
    owner: "HR Admin, Kế toán",
    scope: "Engine lương, 8 loại OT, bảo hiểm, PIT 2 phương thức, phiếu lương, bank list Vietinbank.",
  },
  {
    code: "M06",
    title: "Phân quyền & Đăng nhập",
    owner: "HR Admin, System Admin",
    scope: "Username/password, SSO AD/LDAP, RBAC linh hoạt, quản lý tài khoản, audit log.",
  },
  {
    code: "M07",
    title: "Ý kiến nhân viên",
    owner: "NLĐ, HR Admin",
    scope: "NLĐ gửi thắc mắc, HR tiếp nhận và phản hồi, lịch sử theo nhân viên, thông báo.",
  },
];

const setupSteps = [
  "Thiết lập cây tổ chức 6 cấp",
  "Tạo chức danh và phân loại NV/CN",
  "Cấu hình bậc lương theo năm",
  "Tạo phụ cấp Housing, Productivity, Position",
  "Cài đặt 7 ca làm việc LSEV",
  "Cài đặt 30+ ký hiệu công song ngữ",
  "Cấu hình định mức LTT, BH, PIT, OT",
  "Tạo role, gán quyền, gán user",
];

const shifts = [
  ["CA1", "Ca sáng", "06:00", "14:00", "8h", "Ca sản xuất"],
  ["CA2", "Ca chiều", "14:00", "22:00", "8h", "Ca sản xuất"],
  ["CA3", "Ca đêm", "22:00", "06:00+1", "8h", "Ca vắt qua ngày sau"],
  ["HC", "Hành chính", "08:00", "17:00", "8h", "Nghỉ giữa ca 60 phút"],
];

const employees = [
  ["00003", "Nguyễn Văn An", "Production 3", "Assy 1", "Công nhân", "Đang làm việc"],
  ["00791", "Trần Thị Bình", "HR", "HR", "Nhân viên", "Thử việc"],
  ["01742", "Lê Minh Châu", "Accounting", "Accounting", "Nhân viên", "Đang làm việc"],
  ["02118", "Phạm Quốc Dũng", "Molding", "Molding Engineer", "Công nhân", "Học việc"],
];

const contractFlow = [
  "NV mới: tự sinh thỏa thuận thử việc hoặc học việc theo phân loại",
  "Cảnh báo trước hết hạn 30, 15, 7 ngày",
  "Đánh giá thử việc/học việc với 7 tiêu chí",
  "Ký HĐLĐ xác định thời hạn, mã dạng MãNV/HĐLĐ/Năm",
  "Gia hạn lần 2 hoặc chuyển HĐLĐ không xác định thời hạn",
];

const attendancePhases = [
  ["01", "Cài đặt tháng", "Lịch nghỉ tuần, nghỉ lễ, kiểu công tiêu chuẩn, giờ công tiêu chuẩn."],
  ["02", "Xếp ca", "Import Excel D1-D31 hoặc xếp ca tay; tổ trưởng đăng ký ca công nhân."],
  ["03", "Dữ liệu chấm công", "Máy Ronald Jack gửi real-time hoặc import text/Excel; tự nhận dạng +, In, Out, CS, KP."],
  ["04", "Đăng ký nghỉ", "Luồng phê duyệt theo nhóm: CN, NV, TBP; HR là bước cuối."],
  ["05", "Tổng hợp công", "Tính 30+ chỉ số, xuất Attendance, OT Summary, OT Record, Night Shift và phiếu đối chiếu."],
];

const payrollRows = [
  ["Lương OT", "LCB + PC Công việc + PC Năng suất + PC Nhà ở + KPI cơ sở"],
  ["Lương ngày", "Lương OT / Ngày công tiêu chuẩn"],
  ["Lương giờ", "Lương OT / Giờ công tiêu chuẩn"],
  ["Lương làm đêm", "Lương giờ x 30% x Giờ làm đêm 22h-5h"],
  ["Thưởng KPI", "KPI cơ sở x tỷ lệ S/A/B/C/D x ngày hưởng lương / ngày TC"],
  ["Trừ đi muộn", "(Lương giờ / 4) x ROUND(Tổng phút / 15, 0)"],
  ["Thực lĩnh", "Gross receiving - BH NLĐ - PIT - khấu trừ khác"],
];

const roles = [
  ["HR Admin", "Toàn công ty", "Toàn quyền module, tính lương, xuất báo cáo, quản lý tài khoản"],
  ["TBP / BOD", "Bộ phận", "Xem bảng công, duyệt nghỉ, xem hồ sơ nhân viên thuộc phạm vi"],
  ["Tổ trưởng", "Tổ", "Đăng ký ca công nhân, duyệt nghỉ cấp 1, xem công trong tổ"],
  ["NLĐ", "Bản thân", "Xem hồ sơ, gửi nghỉ, xem công, xem phiếu lương, gửi ý kiến"],
  ["System Admin", "Kỹ thuật", "SMTP, SSO, backup, monitoring; không xem dữ liệu nhân sự"],
];

const feedbackItems = [
  ["Thắc mắc công", "Mở", "Chờ HR kiểm tra bảng công tháng 04/2026"],
  ["Thay đổi thông tin", "Đang xử lý", "Cập nhật số CCCD và địa chỉ thường trú"],
  ["Thắc mắc lương", "Đã phản hồi", "Giải thích công thức OT đêm Chủ nhật"],
];

const nfrs = [
  ["Hiệu năng", "Response time < 2 giây cho 95% request; tính lương 1.000 NV < 5 phút."],
  ["Bảo mật", "HTTPS, mã hóa lương/CCCD/tài khoản NH, row-level security, tuân thủ Nghị định 13/2023/NĐ-CP."],
  ["Độ tin cậy", "Uptime >= 99.5% trong giờ làm việc, backup hằng ngày, RTO < 4 giờ."],
  ["Dữ liệu", "Lương đã chốt không thể xóa; chỉ mở lại và tính lại kèm audit log."],
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen onEnter={() => setIsAuthenticated(true)} />;
  }

  return <DashboardScreen />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>NX</span>
          <div>
            <strong>NextX HRM</strong>
            <small>LSEV SRS v2.1</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Điều hướng module">
          {navItems.map(([href, title, note]) => (
            <a href={`#${href}`} key={href}>
              <strong>{title}</strong>
              <small>{note}</small>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <div>
            <strong>HR Admin</strong>
            <small>Toàn quyền vận hành</small>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search-field">Tìm nhân viên, mã ca, hợp đồng, phiếu lương...</div>
          <div className="topbar-actions">
            <button type="button" aria-label="Thông báo">TB</button>
            <button type="button" aria-label="Xuất dữ liệu">EX</button>
            <button type="button" aria-label="Cài đặt">CFG</button>
            <span className="profile">NV</span>
          </div>
        </header>

        <section className="page-section hero-section" id="overview">
          <div className="section-heading">
            <p>SRS - Software Requirements Specification</p>
            <h1>Hệ thống Quản lý Nhân sự NextX HRM cho nhà máy LSEV</h1>
            <span>
              Prototype giao diện Web PC cho HR Admin, TBP, Tổ trưởng và NLĐ self-service theo tài liệu
              NextX_HRM_SRS_LSEV_v2.pdf.
            </span>
          </div>

          <div className="metric-grid">
            {metrics.map(([label, value, note]) => (
              <article className="metric-card" key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
                <span>{note}</span>
              </article>
            ))}
          </div>

          <div className="module-board">
            {modules.map((item) => (
              <article className="module-card" key={item.code}>
                <span>{item.code}</span>
                <h3>{item.title}</h3>
                <p>{item.scope}</p>
                <small>{item.owner}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section" id="catalog">
          <SectionTitle code="M01" title="Danh mục & Cấu hình hệ thống" note="Nền tảng cấu hình cho toàn bộ hệ thống." />
          <div className="two-column">
            <article className="panel">
              <div className="panel-title">
                <h3>Luồng thiết lập lần đầu</h3>
                <button type="button">Lưu cấu hình</button>
              </div>
              <ol className="step-list">
                {setupSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>

            <article className="panel">
              <div className="panel-title">
                <h3>Cây tổ chức LSEV</h3>
                <button type="button">Thêm node</button>
              </div>
              <div className="org-tree">
                <div>LSEV</div>
                <div>Admin</div>
                <div>Production</div>
                <div>Production 3</div>
                <div>Assembly</div>
                <div>Assy 1 - Cost Center 481003</div>
              </div>
            </article>
          </div>

          <article className="panel">
            <div className="panel-title">
              <h3>Danh mục ca làm việc</h3>
              <div className="segmented">
                <button type="button">Ca</button>
                <button type="button">Ký hiệu công</button>
                <button type="button">Bậc lương</button>
              </div>
            </div>
            <DataTable
              headers={["Mã ca", "Tên ca", "Giờ vào", "Giờ ra", "Công", "Ghi chú"]}
              rows={shifts}
            />
          </article>
        </section>

        <section className="page-section" id="employees">
          <SectionTitle code="M02" title="Hồ sơ nhân viên" note="Quản lý từ gia nhập, quá trình làm việc đến thôi việc." />
          <div className="toolbar">
            <div className="filter-box">Tìm theo Mã NV, tên, CCCD, SĐT, email</div>
            <button type="button">Import Excel</button>
            <button type="button">Export có audit</button>
            <button type="button" className="primary">Thêm nhân viên</button>
          </div>
          <article className="panel">
            <DataTable
              headers={["Mã NV", "Họ tên", "Khối", "Bộ phận", "Phân loại", "Trạng thái"]}
              rows={employees}
            />
          </article>
          <div className="form-grid">
            <FormPanel
              title="Thông tin cá nhân"
              fields={["Mã nhân viên tự sinh", "Họ tên", "CCCD có che theo quyền", "Ngày sinh", "Số điện thoại", "Email"]}
            />
            <FormPanel
              title="Thông tin công việc"
              fields={["Chi nhánh", "Khối/Ban/Phòng/Bộ phận", "Chức danh", "Phân loại NV/CN", "Ngày vào", "Trạng thái"]}
            />
            <FormPanel
              title="5 loại quá trình"
              fields={["Công việc", "Lương cơ bản", "Phụ cấp", "Lương bảo hiểm", "Đánh giá KPI S/A/B/C/D"]}
            />
          </div>
        </section>

        <section className="page-section" id="contracts">
          <SectionTitle code="M03" title="Hợp đồng lao động" note="Tự động hóa thử việc, học việc, ký và gia hạn HĐLĐ." />
          <div className="two-column">
            <article className="panel">
              <div className="panel-title">
                <h3>Quy trình hợp đồng</h3>
                <button type="button">Tạo HĐLĐ</button>
              </div>
              <ol className="timeline">
                {contractFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="panel">
              <div className="panel-title">
                <h3>Cảnh báo hết hạn</h3>
                <button type="button">Xem tất cả</button>
              </div>
              <div className="alert-list">
                <span><strong>30 ngày</strong> - 18 hợp đồng cần đánh giá</span>
                <span><strong>15 ngày</strong> - 7 hợp đồng chờ quyết định</span>
                <span><strong>7 ngày</strong> - 3 hợp đồng ưu tiên xử lý</span>
              </div>
            </article>
          </div>
          <article className="panel">
            <DataTable
              headers={["Loại", "Tên mẫu", "Ngôn ngữ", "Xuất file", "Trạng thái"]}
              rows={[
                ["HĐ-1", "Thỏa thuận thử việc", "VI-EN", "PDF, Word", "Đã nhận"],
                ["HĐ-2", "Thỏa thuận học việc", "VI-EN", "PDF, Word", "Đã nhận"],
                ["HĐ-3", "HĐLĐ xác định thời hạn", "VI-EN", "PDF, Word", "Đã nhận"],
                ["HĐ-4", "HĐLĐ không xác định thời hạn", "VI-EN", "PDF, Word", "Đã nhận"],
                ["PDPA", "Đồng ý xử lý dữ liệu cá nhân", "VI-EN", "PDF, Word", "Đã nhận"],
              ]}
            />
          </article>
        </section>

        <section className="page-section" id="attendance">
          <SectionTitle code="M04" title="Chấm công" note="Xếp ca, máy chấm công, nghỉ phép, OT tự động và báo cáo cuối tháng." />
          <div className="phase-grid">
            {attendancePhases.map(([number, title, desc]) => (
              <article className="phase-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <div className="two-column">
            <article className="panel">
              <div className="panel-title">
                <h3>Bảng xếp ca tháng</h3>
                <button type="button">Import D1-D31</button>
              </div>
              <div className="schedule-grid">
                {["00003", "00791", "01742", "02118"].map((emp, index) => (
                  <div className="schedule-row" key={emp}>
                    <strong>{emp}</strong>
                    {["CA1", "CA1", "F", "CA2", "CA3+1", "HC", "OFF"].map((shift, day) => (
                      <span key={`${emp}-${day}`} className={shift === "F" || shift === "OFF" ? "leave" : ""}>
                        {shift}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </article>
            <article className="panel">
              <div className="panel-title">
                <h3>Quy tắc OT tự động</h3>
                <button type="button">Mô phỏng</button>
              </div>
              <div className="formula-box">
                <strong>OT/ngày</strong>
                <span>(Giờ bắt đầu ca - Giờ đến thực tế) + (Giờ về thực tế - Giờ kết thúc ca)</span>
                <small>Làm tròn xuống theo block 15 phút; tối thiểu mỗi lần OT là 0.5 giờ.</small>
              </div>
              <div className="rule-list">
                <span>In: chấm công đầu tiên sau giờ đầu ca từ 4h trở lên</span>
                <span>Out: chấm công cuối cùng trước giờ cuối ca từ 4h trở lên</span>
                <span>CS: có dữ liệu công nhưng không xác định được +, In, Out và không có ký hiệu nghỉ</span>
                <span>KP: không có dữ liệu công mặc dù có xếp ca</span>
              </div>
            </article>
          </div>
        </section>

        <section className="page-section" id="payroll">
          <SectionTitle code="M05" title="Tiền lương" note="Engine lương đầy đủ cho gross, bảo hiểm, PIT, thực lĩnh và xuất file." />
          <div className="payroll-layout">
            <article className="panel">
              <div className="panel-title">
                <h3>Công thức cốt lõi</h3>
                <button type="button">Tính lương</button>
              </div>
              <DataTable headers={["Khoản mục", "Công thức"]} rows={payrollRows} />
            </article>
            <aside className="panel">
              <div className="panel-title">
                <h3>Chốt & xuất</h3>
              </div>
              <div className="export-list">
                <button type="button">Phiếu lương PDF từng NV</button>
                <button type="button">Bảng tổng hợp lương 50+ cột</button>
                <button type="button">Bảng tính OT</button>
                <button type="button">Bảng tính PIT</button>
                <button type="button">Bank list Vietinbank</button>
              </div>
            </aside>
          </div>
        </section>

        <section className="page-section" id="security">
          <SectionTitle code="M06" title="Phân quyền & Đăng nhập" note="SSO, RBAC, row-level security và audit log không thể xóa." />
          <article className="panel">
            <DataTable headers={["Vai trò", "Phạm vi dữ liệu", "Quyền mặc định"]} rows={roles} />
          </article>
          <div className="two-column">
            <FormPanel title="Cấu hình đăng nhập" fields={["Username/password", "SSO qua AD/LDAP", "Tự đăng xuất sau X phút", "Khóa tài khoản không hoạt động"]} />
            <FormPanel title="Audit log" fields={["Ai thực hiện", "Thao tác gì", "Thời điểm", "Dữ liệu trước/sau", "Tìm theo module và khoảng thời gian"]} />
          </div>
        </section>

        <section className="page-section" id="feedback">
          <SectionTitle code="M07" title="Ý kiến nhân viên" note="NLĐ gửi thắc mắc về thông tin, công, lương; HR xử lý và phản hồi." />
          <div className="feedback-layout">
            <article className="panel">
              <div className="panel-title">
                <h3>Hàng đợi HR</h3>
                <button type="button">Phản hồi</button>
              </div>
              <DataTable headers={["Loại ý kiến", "Trạng thái", "Nội dung"]} rows={feedbackItems} />
            </article>
            <article className="panel">
              <div className="panel-title">
                <h3>Form NLĐ gửi ý kiến</h3>
              </div>
              <form className="mock-form">
                <label>Mã NV<input value="00003" readOnly /></label>
                <label>Loại ý kiến<select defaultValue="attendance"><option value="profile">Thay đổi thông tin</option><option value="attendance">Thắc mắc công</option><option value="salary">Thắc mắc lương</option><option value="other">Khác</option></select></label>
                <label>Nội dung<textarea defaultValue="Cần kiểm tra lại công ca đêm ngày 14/03." /></label>
              </form>
            </article>
          </div>
        </section>

        <section className="page-section" id="quality">
          <SectionTitle code="NFR" title="Yêu cầu phi chức năng" note="Các ràng buộc vận hành cần thể hiện trong thiết kế sản phẩm." />
          <div className="nfr-grid">
            {nfrs.map(([title, desc]) => (
              <article className="nfr-card" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function DashboardScreen() {
  const sidebarItems = [
    { icon: "⌘", label: "Tổng quan", active: true },
    { icon: "👥", label: "Hồ sơ nhân viên", active: false },
    { icon: "✈", label: "Nghỉ phép", active: false },
    { icon: "▣", label: "Chấm công", active: false },
    { icon: "$", label: "Tiền lương", active: false },
    { icon: "◇", label: "Đào tạo", active: false },
    { icon: "♡", label: "Phúc lợi", active: false },
    { icon: "▥", label: "Báo cáo", active: false },
    { icon: "⚙", label: "Cài đặt", active: false },
  ];

  const kpis = [
    ["▦", "07", "Module nghiệp vụ", "Danh mục → Ý kiến NLĐ", "SRS v2.1", "green"],
    ["⌁", "Web + App", "Kênh sử dụng", "PC + iOS/Android self-service", "GMT+7", "blue"],
    ["◷", "07 ca", "Ca làm việc LSEV", "Có ca vắt qua ngày +1", "30+ ký hiệu", "cyan"],
    ["◎", "Ronald Jack", "Máy chấm công", "ACE 302/800 vân tay + khuôn mặt", "Real-time", "violet"],
    ["$", "08 loại OT", "Engine tiền lương", "BH, PIT, phiếu lương, bank list", "Vietinbank", "amber"],
    ["▣", "SSO/RBAC", "Bảo mật & phân quyền", "Role linh hoạt + audit toàn hệ thống", "PDPA", "red"],
  ];

  const overviewModules = [
    ["M01", "Danh mục & Cấu hình", "Cây tổ chức, ca làm việc, ký hiệu nghỉ, chức danh, bậc lương, phụ cấp, định mức, RBAC.", "HR Admin"],
    ["M02", "Hồ sơ Nhân viên", "Thông tin cá nhân, 5 loại quá trình, NPT, ngân hàng, đào tạo, thôi việc.", "HR Admin · TBP"],
    ["M03", "Hợp đồng Lao động", "4 loại HĐ, quy trình tự động, template song ngữ VI-EN, cảnh báo hết hạn, in PDF/Word.", "HR Admin"],
    ["M04", "Chấm công", "Tích hợp máy CC, 7 ca, 30+ ký hiệu, xếp ca, nghỉ 3 cấp, OT tự động, báo cáo.", "HR Admin · Tổ trưởng · NLĐ"],
    ["M05", "Tiền lương", "Engine lương, 8 loại OT, BH, PIT 2 phương thức, phiếu lương, bank list Vietinbank.", "HR Admin"],
    ["M06", "Phân quyền & Đăng nhập", "SSO, RBAC linh hoạt, quản lý tài khoản, audit log toàn hệ thống.", "HR Admin · System Admin"],
    ["M07", "Ý kiến NLĐ", "NLĐ gửi thắc mắc, HR tiếp nhận và phản hồi, lịch sử theo nhân viên, thông báo.", "NLĐ · HR Admin"],
  ];

  const scopeItems = [
    "Quản lý vòng đời nhân sự: gia nhập → hợp đồng → chấm công → tính lương → thôi việc",
    "Hỗ trợ đặc thù nhà máy: ca kíp 3 ca, OT tự động, lương đêm, 30+ ký hiệu CC song ngữ",
    "Tích hợp máy chấm công Ronald Jack ACE 302/800",
    "Web PC và Mobile App cho NLĐ self-service",
    "Báo cáo, phiếu lương, template HĐ song ngữ Việt-Anh theo mẫu LSEV",
  ];

  const roleItems = [
    ["HR Admin", "Toàn quyền tất cả module"],
    ["TBP / BOD", "Quản lý phạm vi bộ phận"],
    ["Tổ trưởng", "Đăng ký ca, duyệt nghỉ cấp 1"],
    ["NLĐ", "Self-service qua Web/App"],
    ["System Admin", "SSO, backup, monitoring"],
  ];

  return (
    <main className="home-shell">
      <aside className="home-sidebar">
        <div className="home-logo">nextX</div>

        <nav className="home-nav" aria-label="Dashboard navigation">
          {sidebarItems.slice(0, 1).map(({ icon, label, active }) => (
            <a className={active ? "active" : ""} href="#dashboard" key={label}>
              <span>{icon}</span>
              <strong>{label}</strong>
              <em>›</em>
            </a>
          ))}
          <div className="home-subnav">
            <span />
            <strong>Dashboard</strong>
          </div>
          <div className="home-subnav muted">
            <span />
            <strong>Lịch sự kiện</strong>
          </div>
          {sidebarItems.slice(1).map(({ icon, label, active }) => (
            <a className={active ? "active" : ""} href="#dashboard" key={label}>
              <span>{icon}</span>
              <strong>{label}</strong>
              <em>›</em>
            </a>
          ))}
        </nav>

        <div className="home-user-card">
          <span>NV</span>
          <div>
            <strong>Nguyễn Văn A</strong>
            <small>HR Admin</small>
          </div>
          <em>↗</em>
        </div>

        <div className="home-version">
          <span>NX</span>
          nextX · v2.2.0
        </div>
      </aside>

      <section className="home-main">
        <header className="home-topbar">
          <label className="home-search">
            <span>⌕</span>
            <input placeholder="Tìm kiếm nhân viên, ca làm việc..." />
          </label>

          <div className="home-actions">
            <button type="button" className="company-pill">
              <span>TGV</span>
              Thế Giới Việt
            </button>
            <button type="button">☾</button>
            <button type="button">☷</button>
            <button type="button">?</button>
            <button type="button" className="bell">♧</button>
            <div className="top-profile">
              <span>NV</span>
              <div>
                <strong>Nguyễn Văn A</strong>
                <small>HR Admin</small>
              </div>
              <em>⌄</em>
            </div>
          </div>
        </header>

        <div className="home-content" id="dashboard">
          <section className="home-hero-row">
            <div>
              <h1>Tổng quan hệ thống NextX HRM</h1>
              <p>SRS v2.1 · LSEV · Cập nhật phản hồi HR TEAM 17/04/2026</p>
            </div>
            <div className="home-alerts">
              <span className="warning">⚑ Bản chính thức · Chờ ký xác nhận LSEV</span>
              <span className="info">▤ 7 module trong phạm vi triển khai</span>
            </div>
          </section>

          <section className="kpi-row">
            {kpis.map(([icon, value, label, note, badge, tone]) => (
              <article className={`kpi-card ${tone}`} key={label}>
                <div className="kpi-top">
                  <span className="kpi-icon">{icon}</span>
                  {badge ? <em>{badge}</em> : null}
                </div>
                <strong>{value}</strong>
                <p>{label}</p>
                <small>{note}</small>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-panel chart-panel">
              <div className="panel-heading">
                <h2>Danh mục 7 module theo tài liệu SRS</h2>
                <p>Phạm vi chức năng chính và nhóm người dùng tương ứng.</p>
              </div>
              <div className="srs-module-list">
                {overviewModules.map(([code, title, desc, owner]) => (
                  <article key={code}>
                    <span>{code}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                    <small>{owner}</small>
                  </article>
                ))}
              </div>
            </article>

            <aside className="side-panels">
              <article className="dashboard-panel scope-panel">
                <h2>In Scope</h2>
                <div className="scope-list">
                  {scopeItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>

              <article className="dashboard-panel role-panel">
                <h2>Đối tượng sử dụng</h2>
                <div className="role-list">
                  {roleItems.map(([role, note]) => (
                    <span key={role}>
                      <strong>{role}</strong>
                      <small>{note}</small>
                    </span>
                  ))}
                </div>
              </article>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthScreen({ onEnter }: { onEnter: () => void }) {
  const [loginProvider, setLoginProvider] = useState<"google" | "facebook" | "password" | null>(null);
  const isLoggingIn = loginProvider !== null;

  function completeLogin(provider: "google" | "facebook" | "password") {
    setLoginProvider(provider);
    window.setTimeout(onEnter, 650);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeLogin("password");
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <span>NX</span>
            <strong>next X</strong>
          </div>

          <div className="auth-copy">
            <h1>
              Nền tảng quản lý kinh doanh đa lĩnh vực <span>All-in-One</span>
            </h1>
            <span>
              Tích hợp 8 phân hệ trong một hệ thống: CRM, Bán hàng, DMS, Call Center, HR, Loyalty &
              Marketing. Tối ưu vận hành, tăng trưởng doanh thu và nâng cao trải nghiệm khách hàng.
            </span>
          </div>

          <div className="auth-stats-grid">
            <article className="auth-stat-card">
              <span aria-hidden="true">👥</span>
              <div>
                <strong>10,000+</strong>
                <small>Doanh nghiệp</small>
              </div>
            </article>
            <article className="auth-stat-card">
              <span aria-hidden="true">⚡</span>
              <div>
                <strong>99.9%</strong>
                <small>Uptime SLA</small>
              </div>
            </article>
            <article className="auth-stat-card">
              <span aria-hidden="true">🔄</span>
              <div>
                <strong>Real-time</strong>
                <small>Đồng bộ dữ liệu</small>
              </div>
            </article>
            <article className="auth-stat-card">
              <span aria-hidden="true">🛡️</span>
              <div>
                <strong>ISO 27001</strong>
                <small>Bảo mật</small>
              </div>
            </article>
          </div>

          <div className="auth-online-status">
            <span />
            NextX Team • Online 24/7
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-title">
            <h2>Đăng nhập</h2>
            <p>Đăng nhập vào tài khoản để quản lý doanh nghiệp của bạn.</p>
            <p>Bạn có thể nhập bất kỳ email và mật khẩu nào để tiếp tục</p>
          </div>

          <button
            className="auth-social"
            type="button"
            disabled={isLoggingIn}
            onClick={() => completeLogin("google")}
          >
            <GoogleIcon />
            {loginProvider === "google" ? "Đang đăng nhập với Google..." : "Đăng nhập với Google"}
          </button>
          <button
            className="auth-social"
            type="button"
            disabled={isLoggingIn}
            onClick={() => completeLogin("facebook")}
          >
            <FacebookIcon />
            {loginProvider === "facebook" ? "Đang đăng nhập với Facebook..." : "Đăng nhập với Facebook"}
          </button>

          <div className="auth-divider">
            <span>Hoặc</span>
          </div>

          <label className="auth-field">
            Email
            <input type="email" placeholder="user@mail.com" />
          </label>

          <label className="auth-field">
            Mật khẩu
            <div className="password-field">
              <input type="password" placeholder="••••••••" />
              <span aria-hidden="true">◎</span>
            </div>
          </label>

          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Nhớ tôi
            </label>
          </div>

          <button className="auth-submit" type="submit" disabled={isLoggingIn}>
            {loginProvider === "password" ? "Đang vào trang chủ..." : "Tiếp tục"}
          </button>

          <p className="auth-legal">
            Bằng việc tiếp tục bạn đồng ý với <a href="#terms">Terms of Service</a> và xác nhận bạn đã đọc{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>

          <p className="auth-register">
            Bạn chưa có tài khoản? <a href="#register">Đăng ký ngay</a>
          </p>
        </form>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        fill="#FFFFFF"
        d="M13.64 18.5v-5.96h2l.3-2.32h-2.3V8.74c0-.67.18-1.13 1.15-1.13h1.23V5.54c-.21-.03-.94-.09-1.79-.09-1.77 0-2.98 1.08-2.98 3.06v1.71H9.24v2.32h2.01v5.96h2.39z"
      />
    </svg>
  );
}

function SectionTitle({ code, title, note }: { code: string; title: string; note: string }) {
  return (
    <div className="section-title">
      <span>{code}</span>
      <div>
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormPanel({ title, fields }: { title: string; fields: string[] }) {
  return (
    <article className="panel form-panel">
      <div className="panel-title">
        <h3>{title}</h3>
      </div>
      <div className="field-list">
        {fields.map((field) => (
          <label key={field}>
            <span>{field}</span>
            <input placeholder="Nhập dữ liệu" />
          </label>
        ))}
      </div>
    </article>
  );
}
