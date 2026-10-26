import { ChatPanel } from '@/components/ChatPanel';
import { Sidebar } from '@/components/Sidebar';
import { StatusCard } from '@/components/StatusCard';

const statusCards = [
  { title: 'AI Runtime', value: 'Online', tone: 'green' as const },
  { title: 'Memory Index', value: '92.4%', tone: 'blue' as const },
  { title: 'Security', value: 'Protected', tone: 'amber' as const },
  { title: 'Systems', value: '12 Active', tone: 'violet' as const },
];

export default function Page() {
  return (
    <main className="dashboard-shell">
      <Sidebar />

      <section className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Brillz Command Center</p>
            <h1>Dashboard</h1>
          </div>
          <button className="primary-button">Create workflow</button>
        </header>

        <div className="status-grid">
          {statusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} value={card.value} tone={card.tone} />
          ))}
        </div>

        <ChatPanel />
      </section>
    </main>
  );
}
