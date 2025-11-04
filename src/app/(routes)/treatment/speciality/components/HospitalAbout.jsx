export default function HospitalAbout() {
  return (
    <div className="bg-white border rounded-xl shadow-md p-6 my-4">
      <h3 className="text-center text-xl font-bold text-[#173F5F] mb-4">
        Hospital/HSP Profile Information 5000 Words
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill().map((_, i) => (
          <div
            key={i}
            className="border rounded-md p-4 text-center text-gray-600 text-sm bg-gray-50"
          >
            Hospital/HSP Photos upload by Hospital/HSP<br />(Paid Ads)
          </div>
        ))}
      </div>
    </div>
  );
}