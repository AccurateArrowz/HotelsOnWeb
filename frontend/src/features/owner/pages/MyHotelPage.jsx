import { useState } from 'react';
import KPICard from '@features/owner/components/KPICard';
import RevenueChart from '@features/owner/components/RevenueChart';
import RoomTypesManagement from '@features/owner/components/RoomTypesManagement';
import RoomManagement from '@features/owner/components/RoomManagement';
import HotelSwitcher from '@features/owner/components/HotelSwitcher';
import { useActiveHotel } from '@features/owner/useActiveHotel';
import '@features/owner/pages/MyHotelPage.css';

// Revenue data placeholder until backend endpoint is available
const MOCK_REVENUE_DATA = [
  { month: "Aug", revenue: 42000, occupancy: 68 },
  { month: "Sep", revenue: 51000, occupancy: 74 },
  { month: "Oct", revenue: 47000, occupancy: 71 },
  { month: "Nov", revenue: 38000, occupancy: 62 },
  { month: "Dec", revenue: 65000, occupancy: 89 },
  { month: "Jan", revenue: 58000, occupancy: 83 },
  { month: "Feb", revenue: 61000, occupancy: 87 },
];

const navItems = [
  { id: 'overview', icon: '◉', label: 'Overview' },
  { id: 'bookings', icon: '📋', label: 'Bookings' },
  { id: 'rooms', icon: '🛏', label: 'Rooms' },
  { id: 'room-types', icon: '🏷', label: 'Room Types' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
];

// Overview Section Component
const OverviewSection = () => (
  <div className="dashboard-grid">
    <div className="kpi-grid">
      <KPICard
        icon="💰"
        label="Monthly Revenue"
        value="$61,200"
        trend="5.2%"
        trendUp={true}
        subText="vs $58,100 last month"
      />
      <KPICard
        icon="🛏"
        label="Occupancy Rate"
        value="87%"
        trend="3.1%"
        trendUp={true}
        subText="26 of 30 rooms occupied"
      />
      <KPICard
        icon="📅"
        label="New Bookings"
        value="148"
        trend="2.4%"
        trendUp={true}
        subText="12 arriving today"
      />
      <KPICard
        icon="⭐"
        label="Guest Rating"
        value="4.7/5"
        trend="0.2"
        trendUp={true}
        subText="Based on 94 reviews"
      />
    </div>

    <div className="main-charts-row">
      <section className="chart-card" aria-labelledby="revenue-chart-title">
        <div className="card-header">
          <h2 id="revenue-chart-title">Revenue Trends</h2>
          <button className="btn btn-text">View Detailed Report</button>
        </div>
        <RevenueChart data={MOCK_REVENUE_DATA} />
      </section>

      <section className="side-card" aria-labelledby="alerts-title">
        <div className="card-header">
          <h2 id="alerts-title">Alerts</h2>
        </div>
        <div className="alerts-list">
          <div className="alert-item warning">
            <span>⚠️</span>
            <div className="alert-content">
              <p className="alert-text">Room 205 requires maintenance</p>
              <span className="alert-time">2 hours ago</span>
            </div>
          </div>
          <div className="alert-item info">
            <span>ℹ️</span>
            <div className="alert-content">
              <p className="alert-text">New booking from John Smith</p>
              <span className="alert-time">4 hours ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

// Bookings Section Component
const BookingsSection = () => (
  <section className="table-section" aria-labelledby="bookings-title">
    <div className="section-header">
      <h2 id="bookings-title">Recent Bookings</h2>
      <div className="section-actions">
        <button className="btn btn-outline">Filter</button>
        <button className="btn btn-primary">+ New Booking</button>
      </div>
    </div>
    <div className="table-container shadow-sm">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Booking ID</th>
            <th scope="col">Guest</th>
            <th scope="col">Room</th>
            <th scope="col">Check-in</th>
            <th scope="col">Check-out</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-500">
              Bookings integration coming soon...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

// Placeholder Section Component
const PlaceholderSection = ({ title }) => (
  <div className="placeholder-content">
    <div className="empty-icon">�</div>
    <h3>{title} Coming Soon</h3>
    <p>This feature is under development.</p>
  </div>
);

// Content Components Map
const contentComponents = {
  overview: OverviewSection,
  bookings: BookingsSection,
  rooms: RoomManagement,
  'room-types': RoomTypesManagement,
  analytics: () => <PlaceholderSection title="Analytics" />,
};

const MyHotelPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { hotel, hotelId, hotels, isLoading: hotelsLoading, error: hotelsError, switchHotel } = useActiveHotel();

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleHotelChange = (newHotel) => {
    switchHotel(newHotel);
  };

  const renderContent = () => {
    const ContentComponent = contentComponents[activeTab];

    if (!hotelId && activeTab !== 'overview') {
      return (
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h3>Hotel Required</h3>
          <p>You need to set up a hotel before managing {navItems.find(n => n.id === activeTab)?.label.toLowerCase()}.</p>
        </div>
      );
    }

    return <ContentComponent hotelId={hotelId} />;
  };

  // Loading state
  if (hotelsLoading) {
    return (
      <div className="my-hotel-page loading">
        <div className="loading-spinner">Loading your hotel...</div>
      </div>
    );
  }

  // Error state
  if (hotelsError) {
    return (
      <div className="my-hotel-page error">
        <div className="error-message">
          <h2>Failed to load hotel</h2>
          <p>{hotelsError.data?.message || 'An error occurred while fetching your hotel data.'}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No hotel found
  if (!hotel) {
    return (
      <div className="my-hotel-page empty">
        <div className="empty-hotel-state">
          <div className="empty-icon">🏨</div>
          <h2>No Hotel Found</h2>
          <p>You don&apos;t have any hotels registered yet.</p>
          <button className="btn btn-primary">List Your Property</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-hotel-page sidebar-layout">
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={sidebarOpen}
      >
        <span aria-hidden="true">☰</span>
      </button>

      {/* Overlay for mobile drawer */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <HotelSwitcher
            hotels={hotels}
            activeHotel={hotel}
            onHotelChange={handleHotelChange}
            isLoading={hotelsLoading}
          />
        </div>

        <nav className="sidebar-nav" aria-label="Hotel management sections">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" aria-hidden="true">O</div>
            <span className="user-label">Owner</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content-area">
        <header className="content-header">
          <div className="header-content">
            <h1>{navItems.find(n => n.id === activeTab)?.label}</h1>
            <p className="subtitle">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          {activeTab !== 'room-types' && (
            <div className="header-actions">
              <button className="btn btn-outline">Export Report</button>
              <button className="btn btn-primary">Edit Hotel Details</button>
            </div>
          )}
        </header>

        <div className="tab-content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MyHotelPage;
