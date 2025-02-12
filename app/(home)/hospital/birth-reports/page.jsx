
export default function BirthReportListPage() {
  // Mock data; replace with actual birth reports from backend
  const birthReports = [
    {
      child_name: 'John Doe',
      gender: 'Male',
      mother_name: 'Jane Doe',
      father_name: 'James Doe',
      date: '2024-02-01',
      report: 'Normal',
    },
    {
      child_name: 'Emily Smith',
      gender: 'Female',
      mother_name: 'Anna Smith',
      father_name: 'Robert Smith',
      date: '2024-02-03',
      report: 'C-Section',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Birth Reports</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Child Name</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Mother Name</th>
            <th className="px-4 py-2">Father Name</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Type of Delivery</th>
          </tr>
        </thead>
        <tbody>
          {birthReports.map((report, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{report.child_name}</td>
              <td className="px-4 py-2">{report.gender}</td>
              <td className="px-4 py-2">{report.mother_name}</td>
              <td className="px-4 py-2">{report.father_name}</td>
              <td className="px-4 py-2">{report.date}</td>
              <td className="px-4 py-2">{report.report}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
