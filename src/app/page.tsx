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
  const [activeModule, setActiveModule] = useState<"overview" | "employees">("overview");
  const [overviewTab, setOverviewTab] = useState<"dashboard" | "calendar">("dashboard");
  const [expandedMenu, setExpandedMenu] = useState("Tổng quan");

  const sidebarItems = [
    { icon: "overview", label: "Tổng quan", active: activeModule === "overview" },
    { icon: "employees", label: "Hồ sơ nhân viên", active: activeModule === "employees" },
    { icon: "leave", label: "Nghỉ phép", active: false },
    { icon: "attendance", label: "Chấm công", active: false },
    { icon: "payroll", label: "Tiền lương", active: false },
    { icon: "training", label: "Đào tạo", active: false },
    { icon: "benefits", label: "Phúc lợi", active: false },
    { icon: "reports", label: "Báo cáo", active: false },
    { icon: "settings", label: "Cài đặt", active: false },
  ];

  const menuChildren: Record<string, string[]> = {
    "Hồ sơ nhân viên": ["Danh sách hồ sơ", "Thêm nhân viên", "Quá trình nhân sự"],
    "Nghỉ phép": ["Quản lý nghỉ phép", "Cấu hình phép", "Báo cáo phép", "Chuyển phép tồn"],
    "Chấm công": ["Bảng công tháng", "Xếp ca", "Dữ liệu máy chấm công", "OT tự động"],
    "Tiền lương": ["Tổng hợp lương", "Tính lương tháng", "Đăng ký bổ sung", "Thiết lập tiền lương"],
    "Đào tạo": ["Lịch đào tạo", "Lịch sử đào tạo"],
    "Phúc lợi": ["Phụ cấp", "Bảo hiểm", "Người phụ thuộc"],
    "Báo cáo": ["Báo cáo nhân sự", "Báo cáo chấm công", "Báo cáo tiền lương"],
    "Cài đặt": ["Tài khoản", "Phân quyền", "Audit log"],
  };

  const kpis = [
    ["NV", "300", "Tổng Nhân Viên", "5 phòng ban", "+12 tháng này", "green"],
    ["LV", "292", "Đang Làm Việc", "97% tổng nhân sự", "97.3%", "blue"],
    ["PB", "5", "Phòng Ban", "4 chi nhánh", "", "cyan"],
    ["CC", "92.5%", "Tỷ Lệ Chấm Công", "8.3% đi muộn", "+2.1%", "violet"],
    ["L", "28 triệu", "Lương TB / Người", "VNĐ / tháng", "", "amber"],
    ["NV", "1.3%", "Tỷ Lệ Nghỉ Việc", "4 người đã nghỉ", "1.3%", "red"],
  ];

  const quickActions = [
    ["Hồ sơ nhân viên", "Cập nhật hồ sơ, quá trình lương, phụ cấp, người phụ thuộc và tài khoản ngân hàng.", "Mở hồ sơ"],
    ["Duyệt nghỉ phép", "Xem đơn nghỉ theo luồng công nhân, nhân viên, trưởng bộ phận và HR cuối.", "Xử lý đơn"],
    ["Rà soát chấm công", "Kiểm tra In/Out/CS/KP, ca vắt +1 và dữ liệu Ronald Jack trong ngày.", "Mở bảng công"],
    ["Hợp đồng lao động", "Theo dõi thử việc, học việc, HĐLĐ sắp hết hạn và xuất PDF/Word.", "Xem cảnh báo"],
    ["Tính lương", "Kiểm tra OT, lương đêm, KPI, bảo hiểm, PIT và bank list Vietinbank.", "Vào kỳ lương"],
    ["Ý kiến người lao động", "Tiếp nhận thắc mắc về hồ sơ, công, lương và phản hồi theo từng nhân viên.", "Trả lời"],
  ];

  const pendingTasks = [
    "12 đơn nghỉ của công nhân cần HR duyệt bước cuối",
    "23 bản ghi chấm công thiếu Out sau ca đêm CA3",
    "8 hợp đồng thử việc cần đánh giá trước hạn 7 ngày",
    "120 phiếu lương tháng 05/2026 đang chờ kiểm tra",
    "18 phản hồi NLĐ chưa được gán người xử lý",
  ];

  const healthItems = [
    ["Máy chấm công", "Ronald Jack đồng bộ 3 phút trước"],
    ["SSO / RBAC", "AD-LDAP hoạt động bình thường"],
    ["Lương & PIT", "Định mức 2026 đã áp dụng"],
    ["Mobile App", "Self-service online 24/7"],
    ["Audit log", "Không có cảnh báo bất thường"],
  ];

  const departmentBars = [
    { code: "IT", name: "Công Nghệ Thông Tin", value: 66, color: "#15803d" },
    { code: "HR", name: "Nhân Sự", value: 55, color: "#4b5563" },
    { code: "FIN", name: "Tài Chính", value: 48, color: "#64748b" },
    { code: "MKT", name: "Marketing", value: 73, color: "#0f766e" },
    { code: "SALES", name: "Kinh Doanh", value: 58, color: "#334155" },
  ];

  const branchRows = [
    ["TP.HCM", "76", "25%", "#15803d"],
    ["Hà Nội", "80", "27%", "#4b5563"],
    ["Đà Nẵng", "75", "25%", "#64748b"],
    ["Cần Thơ", "69", "23%", "#0f766e"],
  ];

  const levels = [
    ["Intern", "35", "#94a3b8"],
    ["Fresher", "53", "#64748b"],
    ["Junior", "27", "#475569"],
    ["Middle", "34", "#0f766e"],
    ["Senior", "41", "#15803d"],
    ["Lead", "38", "#334155"],
    ["Manager", "36", "#64748b"],
    ["Director", "36", "#475569"],
  ];

  const notifications = [
    ["warning", "12 đơn nghỉ phép chờ duyệt", "Cần phê duyệt trong 24h"],
    ["info", "120 bảng lương cần xử lý", "Hạn chót cuối tháng"],
    ["success", "0 nhân viên mới tháng này", "Cần hoàn thiện hồ sơ"],
    ["danger", "Tỷ lệ đi muộn 8.3%", "Cao hơn tháng trước 1.2%"],
  ];

  const performanceRows = [
    ["Xuất sắc", "66", "22%", "#15803d"],
    ["Tốt", "123", "41%", "#10b981"],
    ["Trung bình", "84", "28%", "#64748b"],
    ["Dưới TB", "21", "7%", "#94a3b8"],
    ["Kém", "6", "2%", "#cbd5e1"],
  ];

  const orgLeaders = [
    ["TV", "Trần Văn Hùng", "Trưởng Phòng CNTT", "72 người", "#475569"],
    ["VT", "Vũ Thị Mai", "Trưởng Phòng Nhân Sự", "18 người", "#0f766e"],
    ["ĐH", "Đỗ Hồng Quân", "Trưởng Phòng Tài Chính", "25 người", "#64748b"],
    ["HT", "Hồ Thị Vy", "Trưởng Phòng Marketing", "30 người", "#334155"],
    ["NT", "Nguyễn Thanh Cường", "Trưởng Phòng Kinh Doanh", "65 người", "#15803d"],
  ];

  const calendarStats = [
    ["▣", "16", "Sự kiện tháng này", "Ca, nghỉ, hợp đồng, lương", "Tháng 05", "green"],
    ["✈", "07", "Lịch nghỉ tuần này", "3 đơn đã duyệt, 4 đơn chờ", "Nghỉ phép", "blue"],
    ["▤", "08", "HĐ cần đánh giá", "Thử việc/học việc sắp hết hạn", "Hợp đồng", "cyan"],
    ["$", "20/05", "Chốt bảng công", "Khóa dữ liệu tính lương", "Payroll", "violet"],
    ["◇", "03", "Lịch đào tạo", "An toàn, nội quy, kỹ năng", "Training", "amber"],
    ["◷", "05", "Thay đổi ca", "Ca đêm và ca vắt +1", "Xếp ca", "red"],
  ];

  const calendarDays = [
    ["28", "prev", []],
    ["29", "prev", []],
    ["30", "prev", []],
    ["01", "current", ["Nghỉ lễ", "CA3 kiểm tra"]],
    ["02", "current", ["Nghỉ lễ"]],
    ["03", "current", []],
    ["04", "current", []],
    ["05", "current", ["Đào tạo CN mới"]],
    ["06", "current", ["Chốt HĐ thử việc"]],
    ["07", "current", ["Duyệt nghỉ tổ Assy"]],
    ["08", "current today", ["Payroll review", "23 thiếu Out"]],
    ["09", "current", ["Báo cáo công tuần"]],
    ["10", "current", []],
    ["11", "current", []],
    ["12", "current", ["Import ca tháng"]],
    ["13", "current", ["Đánh giá học việc"]],
    ["14", "current", ["CA3 vắt +1"]],
    ["15", "current", ["Nhắc HĐ hết hạn"]],
    ["16", "current", ["Chốt OT tuần"]],
    ["17", "current", []],
    ["18", "current", []],
    ["19", "current", ["Đối chiếu công"]],
    ["20", "current", ["Chốt bảng công", "Khóa kỳ lương"]],
    ["21", "current", ["Tính lương nháp"]],
    ["22", "current", ["Duyệt bank list"]],
    ["23", "current", ["Gửi phiếu lương"]],
    ["24", "current", []],
    ["25", "current", []],
    ["26", "current", ["Review phụ cấp"]],
    ["27", "current", ["Báo cáo BH/PIT"]],
    ["28", "current", ["Đào tạo an toàn"]],
    ["29", "current", ["Audit log tháng"]],
    ["30", "current", ["Khóa payroll"]],
    ["31", "current", []],
    ["01", "next", []],
  ];

  const todayEvents = [
    ["08:30", "Kiểm tra 23 bản ghi thiếu Out sau ca CA3"],
    ["10:00", "Duyệt đơn nghỉ phép bộ phận Production 3"],
    ["14:00", "Review payroll tháng 05/2026 với Kế toán"],
    ["16:30", "Gửi nhắc đánh giá 8 hợp đồng thử việc"],
  ];

  const calendarDeadlines = [
    ["20/05", "Chốt bảng công tháng 05/2026"],
    ["22/05", "Hoàn tất bank list Vietinbank"],
    ["23/05", "Phát hành phiếu lương NLĐ"],
    ["30/05", "Khóa kỳ lương và audit payroll"],
  ];

  return (
    <main className="home-shell">
      <aside className="home-sidebar">
        <div className="home-logo">
          <span>NX</span>
          <strong>nextX</strong>
        </div>

        <nav className="home-nav" aria-label="Dashboard navigation">
          {sidebarItems.slice(0, 1).map(({ icon, label, active }) => (
            <a
              className={active ? "active" : ""}
              href="#dashboard"
              key={label}
              onClick={(event) => {
                event.preventDefault();
                setExpandedMenu(expandedMenu === label ? "" : label);
                setActiveModule("overview");
              }}
            >
              <span className="menu-icon"><MenuIcon name={icon} /></span>
              <strong>{label}</strong>
              <span className="chevron-icon"><ChevronIcon open={expandedMenu === label} /></span>
            </a>
          ))}
          {expandedMenu === "Tổng quan" ? (
            <>
              <button
                className={`home-subnav ${overviewTab === "dashboard" ? "" : "muted"}`}
                type="button"
                onClick={() => setOverviewTab("dashboard")}
              >
                <span />
                <strong>Dashboard</strong>
              </button>
              <button
                className={`home-subnav ${overviewTab === "calendar" ? "" : "muted"}`}
                type="button"
                onClick={() => setOverviewTab("calendar")}
              >
                <span />
                <strong>Lịch sự kiện</strong>
              </button>
            </>
          ) : null}
          {sidebarItems.slice(1).map(({ icon, label, active }) => (
            <div className="menu-group" key={label}>
              <a
                className={active ? "active" : ""}
                href="#dashboard"
                onClick={(event) => {
                  event.preventDefault();
                  setExpandedMenu(expandedMenu === label ? "" : label);
                  if (label === "Hồ sơ nhân viên") {
                  setActiveModule("employees");
                }
              }}
              >
                <span className="menu-icon"><MenuIcon name={icon} /></span>
                <strong>{label}</strong>
                <span className="chevron-icon"><ChevronIcon open={expandedMenu === label} /></span>
              </a>
              {expandedMenu === label
                ? menuChildren[label]?.map((child, index) => (
                    <button
                      className={`home-subnav ${
                        label === "Hồ sơ nhân viên" && index === 0 ? "" : "muted"
                      }`}
                      type="button"
                      key={child}
                      onClick={() => {
                        if (label === "Hồ sơ nhân viên") {
                          setActiveModule("employees");
                        }
                      }}
                    >
                      <span />
                      <strong>{child}</strong>
                    </button>
                  ))
                : null}
            </div>
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
          {activeModule === "employees" ? (
            <EmployeeProfileSection />
          ) : (
            <>
          <section className="home-hero-row">
            <div>
              <h1>{overviewTab === "dashboard" ? "Chào buổi sáng, HR Admin 👋" : "Lịch sự kiện nhân sự"}</h1>
              <p>
                {overviewTab === "dashboard"
                  ? "Thứ Sáu, 8 Tháng 5, 2026 · Bảng điều hành nhân sự LSEV"
                  : "Tháng 05/2026 · Theo dõi ca làm, nghỉ phép, hợp đồng, lương và đào tạo"}
              </p>
            </div>
            <div className="home-alerts">
              {overviewTab === "dashboard" ? (
                <>
                  <span className="warning">✈ 24 đơn nghỉ chờ duyệt</span>
                  <span className="info">▤ 120 phiếu lương chờ kiểm tra</span>
                </>
              ) : (
                <>
                  <span className="warning">◷ 7 sự kiện trong tuần</span>
                  <span className="info">▤ 3 deadline payroll sắp tới</span>
                </>
              )}
            </div>
          </section>

          <section className="kpi-row">
            {(overviewTab === "dashboard" ? kpis : calendarStats).map(([icon, value, label, note, badge, tone]) => (
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

          {overviewTab === "dashboard" ? (
            <>
              <section className="overview-grid">
                <article className="dashboard-panel analytics-card department-card">
                  <div className="panel-heading">
                    <h2>Phân Bổ Nhân Sự Theo Phòng Ban</h2>
                    <p>Số lượng nhân viên tại từng phòng ban</p>
                  </div>
                  <div className="dept-chart">
                    <div className="dept-scale">
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>
                    <div className="dept-bars">
                      {departmentBars.map((item) => (
                        <div className="dept-bar" key={item.code}>
                          <span style={{ height: `${item.value * 2.45}px`, background: item.color }} />
                          <small>{item.code}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="chart-legend">
                    {departmentBars.map((item) => (
                      <span key={item.code}>
                        <i style={{ background: item.color }} />
                        {item.name} <strong>({item.value})</strong>
                      </span>
                    ))}
                  </div>
                </article>

                <aside className="overview-side">
                  <article className="dashboard-panel employee-status">
                    <h2>Trạng Thái Nhân Viên</h2>
                    <div className="status-body">
                      <div className="donut-chart" />
                      <div className="status-list">
                        <span><i className="green-dot" />Đang làm <strong>292</strong></span>
                        <span><i className="orange-dot" />Đang nghỉ phép <strong>4</strong></span>
                        <span><i className="red-dot" />Đã nghỉ việc <strong>4</strong></span>
                      </div>
                    </div>
                  </article>

                  <article className="dashboard-panel contract-panel">
                    <h2>Loại Hợp Đồng</h2>
                    <div className="contract-row"><span>Toàn thời gian</span><strong>271 (90%)</strong></div>
                    <div className="progress"><span style={{ width: "90%" }} /></div>
                    <div className="contract-row"><span>Hợp đồng</span><strong>13 (4%)</strong></div>
                    <div className="progress purple"><span style={{ width: "4%" }} /></div>
                    <div className="contract-row"><span>Thực tập</span><strong>16 (5%)</strong></div>
                    <div className="progress orange"><span style={{ width: "5%" }} /></div>
                  </article>
                </aside>
              </section>

              <section className="overview-grid">
                <article className="dashboard-panel analytics-card trend-card">
                  <div className="panel-heading">
                    <h2>Xu Hướng Chấm Công 7 Ngày Qua</h2>
                    <p>Đúng giờ · Đi muộn · Vắng mặt</p>
                  </div>
                  <div className="line-chart">
                    <svg viewBox="0 0 760 230" role="img" aria-label="Xu hướng chấm công">
                      <path d="M28 36 C120 31 185 26 270 36 S430 42 520 34 S665 42 736 36" fill="none" stroke="#10b981" strokeWidth="4" />
                      <path d="M28 184 C120 180 190 178 270 184 S430 174 520 178 S650 184 736 181" fill="none" stroke="#f59e0b" strokeWidth="4" />
                      <path d="M28 36 C120 31 185 26 270 36 S430 42 520 34 S665 42 736 36 L736 207 L28 207 Z" fill="rgba(16,185,129,0.08)" />
                      {[0, 1, 2, 3, 4].map((line) => (
                        <line key={line} x1="28" x2="736" y1={36 + line * 43} y2={36 + line * 43} stroke="#e2e8f0" strokeDasharray="4 6" />
                      ))}
                      <circle cx="392" cy="34" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
                      <circle cx="392" cy="178" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                    <div className="trend-tooltip">
                      <strong>Th 3, ngày 5</strong>
                      <span>Đúng giờ: 257</span>
                      <small>Đi muộn: 22</small>
                    </div>
                  </div>
                  <div className="mini-legend">
                    <span><i className="green-dot" />Đúng giờ</span>
                    <span><i className="orange-dot" />Đi muộn</span>
                  </div>
                </article>

                <aside className="overview-side">
                  <article className="dashboard-panel branch-panel">
                    <h2>Phân Bổ Theo Chi Nhánh</h2>
                    <p>4 chi nhánh trên toàn quốc</p>
                    {branchRows.map(([name, value, percent, color]) => (
                      <div className="branch-row" key={name}>
                        <div><span>{name}</span><strong>{value} ({percent})</strong></div>
                        <div className="progress"><span style={{ width: percent, background: color }} /></div>
                      </div>
                    ))}
                    <div className="gender-box">
                      <h3>Tỷ Lệ Giới Tính</h3>
                      <div className="progress purple"><span style={{ width: "48%" }} /></div>
                      <div><span>Nam <strong>145 (48%)</strong></span><span>Nữ <strong>155 (52%)</strong></span></div>
                    </div>
                  </article>
                </aside>
              </section>

              <section className="overview-grid">
                <article className="dashboard-panel analytics-card movement-card">
                  <div className="panel-heading">
                    <h2>Biến Động Nhân Sự 6 Tháng Qua</h2>
                    <p>Nhân viên mới và nghỉ việc theo tháng</p>
                  </div>
                  <div className="movement-chart">
                    {["Tháng 12", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"].map((month, index) => (
                      <div className="movement-col" key={month}>
                        <div>
                          {index === 0 ? <span className="join" style={{ height: 84 }} /> : null}
                          {[0, 1, 2].includes(index) ? <span className="leave" style={{ height: [104, 45, 63][index] }} /> : null}
                        </div>
                        <small>{month}</small>
                      </div>
                    ))}
                  </div>
                  <div className="mini-legend">
                    <span><i className="green-dot" />Nhân viên mới</span>
                    <span><i className="red-dot" />Nghỉ việc</span>
                  </div>
                </article>

                <aside className="overview-side">
                  <article className="dashboard-panel level-panel">
                    <h2>Phân Tầng Cấp Bậc</h2>
                    <p>Cơ cấu trình độ nhân sự</p>
                    {levels.map(([level, value, color]) => (
                      <div className="level-row" key={level}>
                        <span>{level}</span>
                        <div><i style={{ width: `${Number(value) * 2}px`, background: color }}>{value}</i></div>
                      </div>
                    ))}
                  </article>
                </aside>
              </section>

              <section className="overview-three">
                <article className="dashboard-panel summary-card">
                  <h2>Tổng Quan Tiền Lương</h2>
                  <p>Tháng 01/2026</p>
                  <div className="summary-list">
                    <span><i>$</i><small>Tổng chi lương</small><strong>8.4 tỷ</strong></span>
                    <span><i>▥</i><small>Lương trung bình</small><strong>28 triệu</strong></span>
                    <span><i>✓</i><small>Đã thanh toán</small><strong>150 / 300</strong></span>
                    <span><i>!</i><small>Chờ xử lý</small><strong>120 bảng lương</strong></span>
                  </div>
                </article>

                <article className="dashboard-panel notice-card">
                  <h2>Thông Báo Quan Trọng</h2>
                  <p>Cần xử lý sớm</p>
                  <div className="notice-list">
                    {notifications.map(([tone, title, note]) => (
                      <span className={tone} key={title}><strong>{title}</strong><small>{note}</small><em>›</em></span>
                    ))}
                  </div>
                </article>

                <article className="dashboard-panel performance-card">
                  <h2>Đánh Giá Hiệu Suất</h2>
                  <p>Kết quả năm 2025</p>
                  {performanceRows.map(([label, value, percent, color]) => (
                    <div className="performance-row" key={label}>
                      <div><span>{label}</span><strong>{value} ({percent})</strong></div>
                      <div className="progress"><span style={{ width: percent, background: color }} /></div>
                    </div>
                  ))}
                  <div className="performance-note">63% nhân viên đạt loại Tốt trở lên</div>
                </article>
              </section>

              <section className="dashboard-panel org-card">
                <div className="panel-heading">
                  <h2>Sơ Đồ Tổ Chức</h2>
                  <p>Cấu trúc phòng ban & lãnh đạo hiện tại</p>
                </div>
                <div className="org-root">
                  <span>NM</span>
                  <strong>Nguyễn Minh Tuấn</strong>
                  <small>Giám Đốc Điều Hành (CEO)</small>
                  <em>300 người</em>
                </div>
                <div className="org-line" />
                <div className="org-branches">
                  {orgLeaders.map(([abbr, name, title, count, color]) => (
                    <article key={abbr} style={{ borderColor: String(color) }}>
                      <span style={{ background: String(color) }}>{abbr}</span>
                      <strong>{name}</strong>
                      <small>{title}</small>
                      <em>{count}</em>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="calendar-layout">
              <article className="dashboard-panel calendar-panel">
                <div className="calendar-heading">
                  <div>
                    <h2>Tháng 05/2026</h2>
                    <p>Lịch vận hành HR theo tuần, ca và deadline nghiệp vụ.</p>
                  </div>
                  <div className="calendar-controls">
                    <button type="button">‹</button>
                    <button type="button">Hôm nay</button>
                    <button type="button">›</button>
                  </div>
                </div>

                <div className="calendar-weekdays">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {calendarDays.map(([day, state, events], index) => (
                    <article className={`calendar-day ${state}`} key={`${day}-${index}`}>
                      <strong>{day}</strong>
                      <div>
                        {(events as string[]).slice(0, 2).map((event) => (
                          <span key={event}>{event}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </article>

              <aside className="side-panels">
                <article className="dashboard-panel today-panel">
                  <h2>Hôm nay · 08/05</h2>
                  <div className="timeline-list">
                    {todayEvents.map(([time, event]) => (
                      <span key={time}>
                        <strong>{time}</strong>
                        <small>{event}</small>
                      </span>
                    ))}
                  </div>
                </article>

                <article className="dashboard-panel deadline-panel">
                  <h2>Deadline sắp tới</h2>
                  <div className="deadline-list">
                    {calendarDeadlines.map(([date, event]) => (
                      <span key={date}>
                        <strong>{date}</strong>
                        <small>{event}</small>
                      </span>
                    ))}
                  </div>
                </article>
              </aside>
            </section>
          )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function MenuIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "overview" ? (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1.5" {...common} />
          <rect x="14" y="4" width="6" height="6" rx="1.5" {...common} />
          <rect x="4" y="14" width="6" height="6" rx="1.5" {...common} />
          <rect x="14" y="14" width="6" height="6" rx="1.5" {...common} />
        </>
      ) : null}
      {name === "employees" ? (
        <>
          <path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4" {...common} />
          <circle cx="10" cy="8" r="3" {...common} />
          <path d="M20 19c0-1.9-1.2-3.4-3-3.9" {...common} />
          <path d="M15.5 5.2a3 3 0 0 1 0 5.6" {...common} />
        </>
      ) : null}
      {name === "leave" ? (
        <>
          <path d="M4 13l15-8-6 15-3-6-6-1z" {...common} />
          <path d="M10 14l4-4" {...common} />
        </>
      ) : null}
      {name === "attendance" ? (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
          <path d="M9 7h6M9 11h6M9 15h3" {...common} />
        </>
      ) : null}
      {name === "payroll" ? (
        <>
          <path d="M12 2v20" {...common} />
          <path d="M17 6.5c-.7-1-2-1.5-4-1.5-2.5 0-4 1.1-4 2.8 0 4.1 8 1.8 8 6.4 0 1.8-1.7 3-4.5 3-2.2 0-3.8-.7-4.8-1.9" {...common} />
        </>
      ) : null}
      {name === "training" ? (
        <>
          <path d="M3 8l9-4 9 4-9 4-9-4z" {...common} />
          <path d="M7 10.5v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4" {...common} />
          <path d="M21 8v6" {...common} />
        </>
      ) : null}
      {name === "benefits" ? (
        <>
          <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z" {...common} />
        </>
      ) : null}
      {name === "reports" ? (
        <>
          <path d="M4 19V5" {...common} />
          <path d="M8 19v-7" {...common} />
          <path d="M12 19V9" {...common} />
          <path d="M16 19v-4" {...common} />
          <path d="M20 19H3" {...common} />
        </>
      ) : null}
      {name === "settings" ? (
        <>
          <circle cx="12" cy="12" r="3" {...common} />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .4l-.2.2a1.7 1.7 0 0 0-.5 1.1H9.1a1.7 1.7 0 0 0-.5-1.1l-.2-.2a1.7 1.7 0 0 0-2-.4l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.4l.2-.2A1.7 1.7 0 0 0 9.1 2h5.8a1.7 1.7 0 0 0 .5 1.1l.2.2a1.7 1.7 0 0 0 2 .4l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z" {...common} />
        </>
      ) : null}
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={open ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function EmployeeProfileSection() {
  const employeeStats = [
    ["300", "Tổng nhân sự", "5 phòng ban", "NV"],
    ["282", "Đang làm việc", "94% tổng nhân sự", "LV"],
    ["0", "Mới 30 ngày", "Chưa phát sinh mới", "M"],
    ["7", "Đã nghỉ việc", "Cần lưu hồ sơ", "N"],
  ];

  const employees = [
    ["EMP0235", "Bùi Anh Cường", "cuong.bui235@company.com", "Marketing", "Data Analyst", "Đà Nẵng", "8/6/2024", "Đang làm"],
    ["EMP0256", "Bùi Anh Cường", "cuong.bui256@company.com", "Kinh Doanh", "Product Manager", "Cần Thơ", "27/12/2021", "Đang làm"],
    ["EMP0271", "Đỗ Thị Hà", "ha.do271@company.com", "Nhân Sự", "HR Executive", "Hà Nội", "14/3/2023", "Đang làm"],
    ["EMP0290", "Lê Minh Châu", "chau.le290@company.com", "Công Nghệ Thông Tin", "System Admin", "TP.HCM", "21/6/2021", "Đang làm"],
    ["EMP0318", "Phạm Quốc Dũng", "dung.pham318@company.com", "Tài Chính", "Accountant", "Đà Nẵng", "16/8/2022", "Đang làm"],
    ["EMP0342", "Trần Thị Bình", "binh.tran342@company.com", "Nhân Sự", "Recruiter", "Hà Nội", "4/5/2026", "Mới"],
  ];

  const departments = [
    ["Tất cả", "293", "all"],
    ["Công Nghệ Thông Tin", "60", "dept"],
    ["Kinh Doanh", "61", "dept"],
    ["Marketing", "62", "dept"],
    ["Nhân Sự", "54", "dept"],
    ["Tài Chính", "56", "dept"],
  ];

  return (
    <>
      <section className="employee-hero employee-directory-hero">
        <div>
          <h1>Hồ sơ nhân viên</h1>
          <p>Quản lý hồ sơ nhân viên, cơ cấu tổ chức, phòng ban và phân quyền.</p>
        </div>
      </section>

      <section className="employee-top-tabs" aria-label="Loại hồ sơ">
        {[
          ["Danh sách nhân viên", "DS"],
          ["Danh sách nghỉ hưu", "NH"],
          ["Người nước ngoài", "NN"],
        ].map(([item, icon], index) => (
          <button type="button" className={index === 0 ? "active" : ""} key={item}>
            <span>{icon}</span>
            {item}
          </button>
        ))}
      </section>

      <section className="employee-status-tabs" aria-label="Trạng thái hồ sơ">
        {[
          ["Đang làm việc", "282"],
          ["Mới (30 ngày)", "0"],
          ["Đã nghỉ việc", "7"],
        ].map(([label, count], index) => (
          <button type="button" className={index === 0 ? "active" : ""} key={label}>
            {label}
            <span>{count}</span>
          </button>
        ))}
      </section>

      <section className="employee-stat-row">
        {employeeStats.map(([value, label, note, tone]) => (
          <article className="employee-stat-card employee-directory-stat" key={label}>
            <span className="employee-stat-icon">{tone}</span>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="employee-workspace employee-directory-workspace">
        <article className="dashboard-panel employee-list-panel">
          <div className="employee-toolbar employee-directory-toolbar">
            <label>
              <span>⌕</span>
              <input placeholder="Tìm theo tên, mã NV, email, phòng ban, chức vụ, số điện thoại..." />
            </label>
            <button type="button" className="employee-filter-button">Bộ lọc</button>
            <div className="employee-view-toggle">
              <button type="button" className="active">List</button>
              <button type="button">Grid</button>
            </div>
            <button type="button" className="employee-action-button">Import</button>
            <button type="button" className="employee-action-button">Xuất</button>
            <button type="button" className="primary-action">+ Thêm nhân viên</button>
          </div>

          <div className="employee-table-shell">
            <aside className="employee-department-filter">
              <div className="employee-table-caption">PHÒNG BAN</div>
              {departments.map(([label, count, kind], index) => (
                <button type="button" className={index === 0 ? "active" : ""} key={label}>
                  <span>{kind === "all" ? "ALL" : "PB"}</span>
                  <strong>{label}</strong>
                  <em>{count}</em>
                </button>
              ))}
            </aside>

            <div className="employee-table-area">
              <div className="employee-table-meta">
                <span>Hiển thị <strong>1-50</strong> trong <strong>293</strong> kết quả</span>
                <label>
                  Hiển thị
                  <select defaultValue="50">
                    <option value="50">50 dòng</option>
                    <option value="100">100 dòng</option>
                  </select>
                </label>
              </div>

              <div className="employee-table">
                <table>
                  <thead>
                    <tr>
                      <th><input type="checkbox" aria-label="Chọn tất cả" /></th>
                      <th>Mã NV</th>
                      <th>Họ và tên</th>
                      <th>Phòng ban</th>
                      <th>Chức vụ</th>
                      <th>Chi nhánh</th>
                      <th>Ngày vào</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((row, index) => (
                      <tr className={index === 1 ? "selected" : ""} key={row[0]}>
                        <td><input type="checkbox" aria-label={`Chọn ${row[1]}`} /></td>
                        <td><strong className="employee-code">{row[0]}</strong></td>
                        <td>
                          <div className="employee-name-cell">
                            <span>{row[1].split(" ").map((word) => word[0]).slice(-2).join("")}</span>
                            <div>
                              <strong>{row[1]}</strong>
                              <small>{row[2]}</small>
                            </div>
                          </div>
                        </td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td><span className="employee-branch-pill">{row[5]}</span></td>
                        <td>{row[6]}</td>
                        <td><span className={`employee-status-pill ${row[7] === "Mới" ? "new" : ""}`}>{row[7]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="employee-pagination">
                <span>Trang 1/6</span>
                <div>
                  {["«", "‹", "1", "2", "3", "4", "5", "›", "»"].map((item) => (
                    <button type="button" className={item === "1" ? "active" : ""} key={item}>{item}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

    </>
  );
}

function EmployeeProfileSectionLegacy() {
  const [profileTab, setProfileTab] = useState("overview");

  const employeeStats = [
    ["300", "Tổng hồ sơ", "292 đang làm việc"],
    ["18", "Hồ sơ cần bổ sung", "CCCD, tài khoản NH, NPT"],
    ["08", "Sắp hết thử việc", "Cần đánh giá trong 7 ngày"],
    ["05", "Thôi việc tháng này", "Đang chờ hoàn tất bàn giao"],
  ];

  const employees = [
    ["00003", "Nguyễn Văn An", "********1234", "12/09/1998", "Production 3 / Assy 1", "Assembly Operator · CN", "12/02/2024", "12/04/2024", "Đang làm việc"],
    ["00791", "Trần Thị Bình", "********4412", "03/11/1997", "HR", "HR Executive · NV", "04/05/2026", "04/07/2026", "Thử việc"],
    ["01742", "Lê Minh Châu", "********0901", "22/01/1994", "Accounting", "Accountant · NV", "16/08/2022", "16/10/2022", "Đang làm việc"],
    ["02118", "Phạm Quốc Dũng", "********8820", "19/07/2001", "Molding", "Molding Operator · CN", "18/04/2026", "18/06/2026", "Học việc"],
    ["02409", "Đỗ Thị Hà", "********3418", "05/03/1996", "Production 1 / Line 2", "Line Worker · CN", "09/01/2023", "09/03/2023", "Nghỉ thai sản"],
    ["03122", "Hoàng Minh Đức", "********7792", "14/12/1992", "IT / System", "System Admin · NV", "21/06/2021", "21/08/2021", "Đang làm việc"],
  ];

  const detailTabs = [
    ["overview", "Tổng quan"],
    ["personal", "Cá nhân"],
    ["work", "Công việc"],
    ["history", "Quá trình"],
    ["contacts", "NPT"],
    ["bank", "Ngân hàng"],
    ["documents", "Tài liệu"],
    ["offboarding", "Thôi việc"],
    ["audit", "Audit"],
  ];

  const profileFieldGroups: Record<string, string[][]> = {
    overview: [
      ["Mã nhân viên", "00003"],
      ["Trạng thái", "Đang làm việc"],
      ["Ngày vào", "12/02/2024"],
      ["Ngày ký HĐLĐ", "13/04/2024"],
      ["Bộ phận", "Production 3 / Assy 1"],
      ["Chức danh", "Assembly Operator"],
      ["Lương hiện tại", "Ẩn theo quyền"],
      ["KPI gần nhất", "A · 110%"],
    ],
    personal: [
      ["CCCD", "********1234"],
      ["Ngày sinh", "12/09/1998"],
      ["SĐT", "********90"],
      ["Email", "an.nv@lsev.vn"],
      ["Địa chỉ thường trú", "Bắc Ninh"],
      ["Tình trạng hôn nhân", "Đã kết hôn"],
      ["Trình độ", "THPT"],
      ["PDPA", "Đã ký phụ lục"],
    ],
    work: [
      ["Chi nhánh", "LSEV"],
      ["Khối/Ban", "Production"],
      ["Phòng", "Production 3"],
      ["Bộ phận/Tổ", "Assy 1"],
      ["Cost Center", "481003"],
      ["Quản lý trực tiếp", "Trần Văn Hùng"],
      ["Phân loại", "Công nhân"],
      ["Tài khoản", "Đang hoạt động"],
    ],
    history: [
      ["Công việc", "2 lần điều chuyển"],
      ["Lương cơ bản", "WK1 · 5.630.000đ"],
      ["Phụ cấp", "Housing, Productivity"],
      ["Lương BH", "5.630.000đ"],
      ["Đánh giá KPI", "A · hiệu lực 01/01/2026"],
      ["Snapshot", "Cập nhật 01/01/2026"],
    ],
    contacts: [
      ["Người liên hệ", "Nguyễn Thị Lan"],
      ["Quan hệ", "Vợ"],
      ["Điện thoại", "********21"],
      ["NPT", "01 người"],
      ["Giảm trừ PIT", "6.200.000đ/tháng"],
      ["Hiệu lực NPT", "01/02/2025"],
    ],
    bank: [
      ["Ngân hàng", "Vietinbank"],
      ["Số tài khoản", "******7890"],
      ["Chi nhánh", "Bắc Ninh"],
      ["Tài khoản chính", "Có"],
      ["Quyền xem", "Payroll Admin"],
      ["Trạng thái", "Đã xác minh"],
    ],
    documents: [
      ["CCCD scan", "2 file · nhạy cảm"],
      ["Hồ sơ ứng viên", "1 file"],
      ["Bằng cấp", "2 file"],
      ["PDPA", "Đã ký"],
      ["HĐLĐ", "Liên kết module Hợp đồng"],
      ["Lần upload cuối", "08/05/2026"],
    ],
    offboarding: [
      ["Trạng thái", "Chưa áp dụng"],
      ["Ngày thôi việc", "-"],
      ["Quyết định", "-"],
      ["Checklist", "0/6 hoàn tất"],
      ["Tài khoản", "Không được tắt khi checklist chưa xong"],
      ["Cảnh báo", "Bắt buộc audit khi đóng hồ sơ"],
    ],
    audit: [
      ["Tạo hồ sơ", "HR Admin · 12/02/2024"],
      ["Cập nhật lương", "Payroll Admin · 01/01/2026"],
      ["Export gần nhất", "HR Admin · 07/05/2026"],
      ["Trường nhạy cảm", "Đã mask khi xem"],
      ["Version", "v18"],
      ["Xung đột", "Optimistic locking bật"],
    ],
  };

  const processItems = [
    ["Thay đổi công việc", "Production 3 / Assy 1", "Hiệu lực 01/03/2025"],
    ["Lương cơ bản", "WK1 · 5.630.000đ", "Hiệu lực 01/01/2026"],
    ["Phụ cấp Housing", "300.000đ", "Không hard-code"],
    ["Lương bảo hiểm", "5.630.000đ", ">= LTT vùng"],
    ["Đánh giá KPI", "Loại A · 110%", "Áp dụng từ T01/2026"],
  ];

  const wizardSteps = [
    ["01", "Thông tin cá nhân", "Mã NV tự sinh, CCCD unique, thông tin liên hệ"],
    ["02", "Thông tin công việc", "Bộ phận, chức danh, cost center, loại NV/CN"],
    ["03", "Lương - phụ cấp - BH", "LCB, KPI cơ sở, phụ cấp, lương bảo hiểm"],
    ["04", "Liên hệ & xác nhận", "NPT, ngân hàng, tài liệu, kiểm tra trước lưu"],
  ];

  const validationRules = [
    "Mã NV tối đa 5 ký tự, unique và không đổi sau khi tạo",
    "CCCD 12 số, lưu mã hóa và chỉ hiển thị dạng mask",
    "Ngày kết thúc thử việc/học việc bắt buộc để sinh HĐ lần 1",
    "Chọn bộ phận tự gán cost center; chọn chức danh tự xác định NV/CN",
    "Export Excel phải ghi audit log và kiểm tra quyền trường nhạy cảm",
  ];

  return (
    <>
      <section className="employee-hero">
        <div>
          <h1>Hồ sơ nhân viên</h1>
          <p>Quản lý vòng đời nhân sự: thông tin cá nhân, công việc, quá trình, hợp đồng và thôi việc.</p>
        </div>
        <div className="employee-actions">
          <button type="button">Cấu hình cột</button>
          <button type="button">Import Excel</button>
          <button type="button">Xuất danh sách</button>
          <button type="button" className="primary-action">Thêm nhân viên</button>
        </div>
      </section>

      <section className="employee-stat-row">
        {employeeStats.map(([value, label, note]) => (
          <article className="employee-stat-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="employee-workspace">
        <article className="dashboard-panel employee-list-panel">
          <div className="employee-toolbar">
            <label>
              <span>⌕</span>
              <input placeholder="Tìm mã NV, họ tên, CCCD, SĐT..." />
            </label>
            <select defaultValue="all">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="probation">Thử việc / học việc</option>
              <option value="leave">Nghỉ dài hạn</option>
            </select>
            <select defaultValue="all">
              <option value="all">Tất cả bộ phận</option>
              <option value="production">Production</option>
              <option value="hr">HR</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>

          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>CCCD</th>
                  <th>Ngày sinh</th>
                  <th>Bộ phận</th>
                  <th>Chức danh</th>
                  <th>Ngày vào</th>
                  <th>KT TV/HV</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((row, index) => (
                  <tr className={index === 0 ? "selected" : ""} key={row[0]}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${row[0]}-${cellIndex}`}>
                        {cellIndex === 8 ? <span className="employee-status-pill">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="dashboard-panel employee-detail-panel">
          <div className="employee-profile-head">
            <span>NA</span>
            <div>
              <h2>Nguyễn Văn An</h2>
              <p>00003 · Production 3 / Assy 1</p>
            </div>
          </div>

          <div className="employee-tabs">
            {detailTabs.map(([key, label]) => (
              <button
                type="button"
                className={profileTab === key ? "active" : ""}
                key={key}
                onClick={() => setProfileTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="profile-field-grid">
            {profileFieldGroups[profileTab].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="process-card-list">
            <h3>Quá trình hiện hành</h3>
            {processItems.map(([label, value, note]) => (
              <article key={label}>
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
                <small>{note}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="employee-deep-grid">
        <article className="dashboard-panel employee-wizard-panel">
          <div className="employee-section-heading">
            <h2>Wizard thêm/sửa hồ sơ</h2>
            <p>Luồng 4 bước giúp HR nhập đúng dữ liệu đầu vào cho Hợp đồng, Chấm công, Lương và Phân quyền.</p>
          </div>
          <div className="wizard-step-list">
            {wizardSteps.map(([step, title, desc]) => (
              <article key={step}>
                <span>{step}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="dashboard-panel employee-rule-panel">
          <div className="employee-section-heading">
            <h2>Validation & bảo mật</h2>
            <p>Các rule bắt buộc trước khi lưu, import/export hoặc xem dữ liệu nhạy cảm.</p>
          </div>
          <div className="employee-rule-list">
            {validationRules.map((rule) => (
              <span key={rule}>{rule}</span>
            ))}
          </div>
        </article>
      </section>
    </>
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
