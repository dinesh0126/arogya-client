import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const Reports = () => (
  <Card className="p-6">
    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-2xl font-semibold">Reports</CardTitle>
        <CardDescription>Generate and export your latest performance summaries</CardDescription>
      </div>
      <Button className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </CardHeader>
    <CardContent className="text-sm text-gray-500">
      Detailed reports will appear here once data is available. Use the export button to download existing summaries.
    </CardContent>
  </Card>
)

export default Reports
