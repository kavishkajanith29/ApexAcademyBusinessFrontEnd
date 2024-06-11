import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"
import Attendent from "./Attendent"

const AreaCharts = () => {
  return (
    <section className="content-area-charts">
      <AreaBarChart />
      <br/>
      <AreaProgressChart />
      <br/>
      <Attendent/>
    </section>
  )
}

export default AreaCharts
