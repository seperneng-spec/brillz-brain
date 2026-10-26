type Tone = 'green' | 'blue' | 'amber' | 'violet';

export type StatusCardProps = {
  title: string;
  value: string;
  tone?: Tone;
};

export default function StatusCard({ title, value, tone = 'blue' }: StatusCardProps) {
  return (
    <div className="status-card" data-tone={tone}>
      <div className="label">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
}
