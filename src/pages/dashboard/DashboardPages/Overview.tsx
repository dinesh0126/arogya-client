import { ChartBarMultiple } from "@/components/charts/Barcharts";




const Overview = () => {
    return(
        <>
        <div className="">
            <div className="">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-gray-500">Patient visits and revenue for the current period.</p>

      
        </div>
        <div className="">
            
          
        </div>
        <div className="" >
            <ChartBarMultiple />
          
   </div>
        </div>
        </>
    )
}
export default Overview
