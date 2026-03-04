import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Filter, Download } from "lucide-react"

const Analytics = () => {

  const satisfactionData = [
  { label: "Overall Experience", value: 87 },
  { label: "Wait Times", value: 72 },
  { label: "Staff Friendliness", value: 94 },
  { label: "Treatment Effectiveness", value: 89 },
];

  const demographicsData = [
    { age: "0-17", male: 120, female: 140 },
    { age: "18-24", male: 150, female: 160 },
    { age: "25-34", male: 210, female: 280 },
    { age: "35-44", male: 180, female: 220 },
    { age: "45-54", male: 140, female: 150 },
    { age: "55-64", male: 130, female: 140 },
    { age: "65+", male: 110, female: 130 },
  ];

  const appointmentTypes = [
    { name: "Check-up", value: 35 },
    { name: "Follow-up", value: 20 },
    { name: "Procedure", value: 10 },
    { name: "Emergency", value: 7 },
    { name: "Other", value: 5 },
  ];

  const revenueData = [
    { name: "Orthopedics", value: 14000 },
    { name: "Neurology", value: 10000 },
    { name: "Cardiology", value: 9000 },
    { name: "Oncology", value: 7000 },
  ];

  // -------------------- 2️⃣ CUSTOM COLORS ------------------------
  const COLORS = ["#1E40AF", "#10B981", "#F59E0B", "#EF4444", "#A855F7"];

  return (
    <div className="space-y-6 p-4">

      {/* ============ HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Detailed Analytics</h1>
          <p className="text-gray-600">Insights and trends from your clinic data</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2">
            <Filter size={18} /> Filter
          </Button>

          <Button className="flex gap-2">
            <Download size={18} /> Export
          </Button>
        </div>
      </div>

      {/* ============ GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ------------ Patient Demographics Card ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>Age and gender distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demographicsData}>
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* COLORS CHANGE HERE */}
                <Bar dataKey="male" fill="#3b82f6" />
                <Bar dataKey="female" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ------------ Appointment Types Pie Chart ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
            <CardDescription>Distribution by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {appointmentTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ------------ Revenue Sources Bar Chart ------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={revenueData}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                {/* CHANGE COLOR */}
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
       <Card className="p-6 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Patient Satisfaction</CardTitle>
        <CardDescription>Based on feedback surveys</CardDescription>
      </CardHeader>

      <CardContent className="mt-4 space-y-6">
        {satisfactionData.map((item, index) => (
          <div key={index}>
            {/* Title & Percentage */}
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
    </div>
  );
};

export default Analytics;
