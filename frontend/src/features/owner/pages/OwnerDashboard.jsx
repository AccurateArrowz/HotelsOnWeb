//from claude 
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  BarChart3,
  DollarSign,
  Calendar,
  Star,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const revenueData = [
{ month: "Aug", revenue: 42000, occupancy: 68 },
{ month: "Sep", revenue: 51000, occupancy: 74 },
{ month: "Oct", revenue: 47000, occupancy: 71 },
{ month: "Nov", revenue: 38000, occupancy: 62 },
{ month: "Dec", revenue: 65000, occupancy: 89 },
{ month: "Jan", revenue: 58000, occupancy: 83 },
{ month: "Feb", revenue: 61000, occupancy: 87 },
];
const bookings = [
{ id: "BK-4821", guest: "James Harrington", room: "Penthouse Suite", checkIn: "Feb 17", checkOut: "Feb 21", amount: "$2,480", status: "active" },
{ id: "BK-4820", guest: "Sophia Chen", room: "Deluxe Ocean View", checkIn: "Feb 16", checkOut: "Feb 19", amount: "$960", status: "active" },
{ id: "BK-4819", guest: "Marcus Webb", room: "Standard Twin", checkIn: "Feb 18", checkOut: "Feb 20", amount: "$340", status: "upcoming" },
{ id: "BK-4818", guest: "Amelia Torres", room: "Junior Suite", checkIn: "Feb 14", checkOut: "Feb 17", amount: "$1,050", status: "checkout" },
{ id: "BK-4817", guest: "Oliver Park", room: "Deluxe King", checkIn: "Feb 15", checkOut: "Feb 16", amount: "$480", status: "completed" },
{ id: "BK-4816", guest: "Nina Rossi", room: "Standard Double", checkIn: "Feb 19", checkOut: "Feb 23", amount: "$560", status: "upcoming" },
];
const rooms = [
{ number: "101", type: "Standard", floor: 1, status: "occupied", guest: "M. Webb" },
{ number: "102", type: "Standard", floor: 1, status: "available", guest: null },
{ number: "103", type: "Standard", floor: 1, status: "cleaning", guest: null },
{ number: "201", type: "Deluxe", floor: 2, status: "occupied", guest: "S. Chen" },
{ number: "202", type: "Deluxe", floor: 2, status: "occupied", guest: "O. Park" },
{ number: "203", type: "Deluxe", floor: 2, status: "available", guest: null },
{ number: "204", type: "Deluxe", floor: 2, status: "maintenance", guest: null },
{ number: "301", type: "Junior Suite", floor: 3, status: "occupied", guest: "A. Torres" },
{ number: "302", type: "Junior Suite", floor: 3, status: "available", guest: null },
{ number: "401", type: "Suite", floor: 4, status: "occupied", guest: "J. Harrington" },
{ number: "402", type: "Suite", floor: 4, status: "available", guest: null },
{ number: "PH1", type: "Penthouse", floor: 5, status: "occupied", guest: "N. Rossi" },
];
const alerts = [
{ type: "warning", message: "Room 204 maintenance overdue by 2 days", time: "2h ago" },
{ type: "info", message: "Checkout reminder: 3 guests leaving today", time: "4h ago" },
{ type: "success", message: "February revenue target reached (94%)", time: "6h ago" },
{ type: "warning", message: "Low linen stock — reorder needed", time: "1d ago" },
];
const statusConfig = {
occupied:    { label: "Occupied",    bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
available:   { label: "Available",   bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
cleaning:    { label: "Cleaning",    bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
maintenance: { label: "Maintenance", bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};
const bookingStatusStyle = {
active:    { label: "Active",    bg: "#dbeafe", text: "#1d4ed8" },
upcoming:  { label: "Upcoming",  bg: "#ede9fe", text: "#5b21b6" },
checkout:  { label: "Check-out", bg: "#fef3c7", text: "#92400e" },
completed: { label: "Completed", bg: "#f1f5f9", text: "#475569" },
};
const KPICard = ({ Icon, label, value, sub, trend, trendUp }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#64748b" }}>{Icon && <Icon size={22} strokeWidth={1.5} />}</span>
      {trend && (
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: trendUp ? "#d1fae5" : "#fee2e2", color: trendUp ? "#065f46" : "#991b1b", display: "flex", alignItems: "center", gap: 4 }}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
      )}
    </div>
    <div>
      <p style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", margin: 0 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>{label}</p>
    </div>
    {sub && <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, paddingTop: 8, borderTop: "1px solid #f8fafc" }}>{sub}</p>}
  </div>
);
export default function OwnerDashboard() {
const [activeTab, setActiveTab] = useState("overview");
const [bookingFilter, setBookingFilter] = useState("all");
const occupied = rooms.filter(r => r.status === "occupied").length;
const occupancyRate = Math.round((occupied / rooms.length) * 100);
const filteredBookings = bookingFilter === "all" ? bookings : bookings.filter(b => b.status === bookingFilter);
const navItems = [
{ id: "overview", Icon: LayoutDashboard, label: "Overview" },
{ id: "bookings", Icon: CalendarDays, label: "Bookings" },
{ id: "rooms", Icon: BedDouble, label: "Rooms" },
{ id: "analytics", Icon: BarChart3, label: "Analytics" },
];
return (
<div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex" }}>
<div style={{ width: 220, background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
<div style={{ padding: "24px 20px", borderBottom: "1px solid #1e293b" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ width: 32, height: 32, background: "#fbbf24", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>H</div>
<div>
<p style={{ color: "#fff", fontWeight: 600, fontSize: 13, margin: 0 }}>The Harborview</p>
<p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>Owner Portal</p>
</div>
</div>
</div>
<nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
{navItems.map(item => (
<button key={item.id} onClick={() => setActiveTab(item.id)} style={{
display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
fontSize: 13, fontWeight: 500, width: "100%",
background: activeTab === item.id ? "#fbbf24" : "transparent",
color: activeTab === item.id ? "#0f172a" : "#94a3b8",
}}>
<item.Icon size={16} aria-hidden="true" />{item.label}
</button>
))}
</nav>
<div style={{ padding: "12px 12px 20px", borderTop: "1px solid #1e293b" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
<div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0f172a" }}>RH</div>
<div>
<p style={{ color: "#fff", fontSize: 12, fontWeight: 500, margin: 0 }}>Robert Hayes</p>
<p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>Owner</p>
</div>
</div>
</div>
</div>
  <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {activeTab === "overview" ? "Dashboard Overview" : activeTab === "bookings" ? "Bookings" : activeTab === "rooms" ? "Room Status" : "Revenue Analytics"}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0" }}>Tuesday, February 17, 2026</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ fontSize: 13, background: "#fff", border: "1px solid #e2e8f0", color: "#475569", padding: "8px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={14} aria-hidden="true" /> Export Report
        </button>
        <button style={{ fontSize: 13, background: "#fbbf24", border: "none", color: "#0f172a", fontWeight: 600, padding: "8px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={14} aria-hidden="true" /> New Booking
        </button>
      </div>
    </div>

    {activeTab === "overview" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <KPICard Icon={DollarSign} label="Revenue This Month" value="$61,200" trend="5.2%" trendUp={true} sub="vs $58,100 last month" />
          <KPICard Icon={BedDouble} label="Occupancy Rate" value={`${occupancyRate}%`} trend="3.1%" trendUp={true} sub={`${occupied} of ${rooms.length} rooms occupied`} />
          <KPICard Icon={Calendar} label="Bookings This Month" value="148" trend="2.4%" trendUp={true} sub="12 arriving today" />
          <KPICard Icon={Star} label="Avg. Guest Rating" value="4.7 / 5" trend="0.2" trendUp={true} sub="Based on 94 reviews" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: 0 }}>Revenue & Occupancy</h2>
              <span style={{ fontSize: 11, color: "#94a3b8", background: "#f8fafc", padding: "3px 10px", borderRadius: 20 }}>7 months</span>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(val, name) => name === "revenue" ? [`$${val.toLocaleString()}`, "Revenue"] : [`${val}%`, "Occupancy"]} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#rg)" />
                <Area yAxisId="right" type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={2} fill="none" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 14px" }}>Alerts & Notices</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ borderRadius: 12, padding: "10px 12px", display: "flex", gap: 10, background: a.type === "warning" ? "#fffbeb" : a.type === "success" ? "#f0fdf4" : "#eff6ff" }}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {a.type === "warning" ? <AlertTriangle size={16} color="#f59e0b" aria-hidden="true" /> : 
                     a.type === "success" ? <CheckCircle2 size={16} color="#10b981" aria-hidden="true" /> : 
                     <Info size={16} color="#3b82f6" aria-hidden="true" />}
                  </span>
                  <div>
                    <p style={{ fontSize: 12, color: "#334155", fontWeight: 500, margin: 0 }}>{a.message}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: 0 }}>Room Status Snapshot</h2>
            <button onClick={() => setActiveTab("rooms")} style={{ fontSize: 12, color: "#d97706", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View all →</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = rooms.filter(r => r.status === key).length;
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 12, background: cfg.bg }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot }}></div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: cfg.text }}>{count}</span>
                  <span style={{ fontSize: 12, color: cfg.text, opacity: 0.8 }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 8 }}>
            {rooms.map(room => {
              const cfg = statusConfig[room.status];
              return (
                <div key={room.number} title={`${room.number} — ${cfg.label}${room.guest ? ` (${room.guest})` : ""}`}
                  style={{ aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: cfg.bg }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: cfg.text }}>{room.number}</span>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, marginTop: 3 }}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {activeTab === "bookings" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "active", "upcoming", "checkout", "completed"].map(f => (
            <button key={f} onClick={() => setBookingFilter(f)} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
              border: `1px solid ${bookingFilter === f ? "#1e293b" : "#e2e8f0"}`,
              background: bookingFilter === f ? "#1e293b" : "#fff",
              color: bookingFilter === f ? "#fff" : "#64748b",
              textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Booking ID", "Guest", "Room", "Check-in", "Check-out", "Amount", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "13px 18px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => {
                const s = bookingStatusStyle[b.status];
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 !== 0 ? "#fafbfc" : "#fff" }}>
                    <td style={{ padding: "13px 18px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{b.id}</td>
                    <td style={{ padding: "13px 18px", fontWeight: 500, color: "#334155" }}>{b.guest}</td>
                    <td style={{ padding: "13px 18px", color: "#475569" }}>{b.room}</td>
                    <td style={{ padding: "13px 18px", color: "#64748b" }}>{b.checkIn}</td>
                    <td style={{ padding: "13px 18px", color: "#64748b" }}>{b.checkOut}</td>
                    <td style={{ padding: "13px 18px", fontWeight: 600, color: "#334155" }}>{b.amount}</td>
                    <td style={{ padding: "13px 18px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: s.bg, color: s.text }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === "rooms" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = rooms.filter(r => r.status === key).length;
            return (
              <div key={key} style={{ borderRadius: 16, padding: "16px 20px", background: cfg.bg }}>
                <p style={{ fontSize: 30, fontWeight: 700, color: cfg.text, margin: 0 }}>{count}</p>
                <p style={{ fontSize: 13, color: cfg.text, opacity: 0.8, margin: "4px 0 0" }}>{cfg.label}</p>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {["Room", "Type", "Floor", "Status", "Current Guest", "Action"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "13px 18px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, i) => {
                const cfg = statusConfig[room.status];
                return (
                  <tr key={room.number} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 !== 0 ? "#fafbfc" : "#fff" }}>
                    <td style={{ padding: "13px 18px", fontWeight: 700, color: "#1e293b" }}>{room.number}</td>
                    <td style={{ padding: "13px 18px", color: "#475569" }}>{room.type}</td>
                    <td style={{ padding: "13px 18px", color: "#64748b" }}>Floor {room.floor}</td>
                    <td style={{ padding: "13px 18px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: cfg.bg, color: cfg.text }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }}></div>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: "13px 18px", color: "#64748b" }}>{room.guest || "—"}</td>
                    <td style={{ padding: "13px 18px" }}>
                      <button style={{ fontSize: 12, color: "#d97706", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>Manage</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === "analytics" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 4px" }}>Monthly Revenue</h2>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px" }}>Last 7 months</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#fbbf24" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 4px" }}>Occupancy Rate</h2>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px" }}>Last 7 months</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v}%`, "Occupancy"]} />
                <Area type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={2.5} fill="url(#og)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 20px" }}>Revenue by Room Type (Feb 2026)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { type: "Deluxe Rooms", rev: 22300, pct: 36 },
              { type: "Penthouse Suite", rev: 18400, pct: 30 },
              { type: "Junior Suites", rev: 12600, pct: 21 },
              { type: "Standard Rooms", rev: 7900, pct: 13 },
            ].map(item => (
              <div key={item.type} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 140, fontSize: 13, color: "#475569", flexShrink: 0 }}>{item.type}</div>
                <div style={{ flex: 1, height: 18, background: "#f1f5f9", borderRadius: 9, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#fbbf24", borderRadius: 9, width: `${item.pct}%` }}></div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", width: 76, textAlign: "right" }}>${item.rev.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", width: 30, textAlign: "right" }}>{item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
);
}
