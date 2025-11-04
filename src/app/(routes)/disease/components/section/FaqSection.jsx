export const FaqSection = ({ title, faqs }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details key={i} className="border rounded p-3 bg-gray-50">
          <summary className="font-medium cursor-pointer">{faq.q}</summary>
          <p className="mt-2">{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
);