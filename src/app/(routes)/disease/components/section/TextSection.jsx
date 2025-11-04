export const TextSection = ({ title, content }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-700">{content}</p>
  </div>
);