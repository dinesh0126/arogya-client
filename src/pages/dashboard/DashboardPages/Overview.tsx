import { ChartBarMultiple } from "@/components/charts/Barcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";




const Overview = () => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-slate-300">
          Patient visits and revenue for the current period.
        </p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-lg">Visits and Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartBarMultiple />
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
