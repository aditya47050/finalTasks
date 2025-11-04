export const BulletsSection = ({ title, bullets }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <ul className="list-disc list-inside space-y-1">
      {bullets.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  </div>
);