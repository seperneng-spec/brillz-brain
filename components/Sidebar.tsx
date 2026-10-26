export function Sidebar() {
  const items = [
    { label: 'Overview', active: true, badge: 'Live' },
    { label: 'Systems', badge: '12' },
    { label: 'Memory', badge: '4' },
    { label: 'Security', badge: 'Safe' },
    { label: 'Builder', badge: 'New' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">B</div>
        <span>Brillz Brain</span>
      </div>

      <nav className="nav-section" aria-label="Sidebar navigation">
        {items.map((item) => (
          <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
            <span>{item.label}</span>
            {item.badge ? <span>{item.badge}</span> : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}
