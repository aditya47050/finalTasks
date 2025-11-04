export const sections = [
  "Overview", "Key Facts", "Symptoms", "Causes", "Risk factors",
  "Diagnosis", "Celebs affected", "Prevention", "Specialist to visit",
  "Treatment", "Home-care", "Complications", "Alternatives therapies",
  "Living with", "FAQs", "References"
];

export default function DiseaseSidebar() {
  return (
    <aside className="w-[80%] -z-[9999] bg-white border rounded-xl container shadow my-6 p-4 sticky h-fit">
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section}>
            <a
              href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-[#243460] hover:underline font-medium block"
            >
              {section}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
