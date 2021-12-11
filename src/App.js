import "./App.css";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import io from "socket.io-client";

function App() {
  const instance = useRef(null);
  // const [data,setData] = useState([])
  // function dataParse(data){
  //   return {
  //     type: "line",
  //     color: "yellow",
  //     Y: data.map(e => e.value),
  //     X: data.map(e => e.timestamp),
  //     xAxis: "bottom",
  //     yAxis: "left"
  //   }
  // }
  const [data, setData] = useState({
    activePower: [],
    GHI: [],
    label: [],
  });
  const series = [
    {
      name: "Active Power",
      type: "line",
      data: data.activePower,
    },
    {
      name: "Irradiance",
      type: "line",
      data: data.GHI,
    },
  ];
  const series2 = [
    {
      name: "Production",
      type: "column",
      data: data.production,
    },
    {
      name: "Irradiation",
      type: "line",
      data: data.irradiation,
    },
  ];
  const options = {
    chart: {
      //height: 350,
      type: "line",
      animations: {
        enabled: false,
      },
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    colors: ["#00f9fc", "#d0ff00"],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    title: {
      //text: 'Traffic Sources',
    },
    legend: {
      show: true,
      labels: {
        colors: "#f1f1f1",
      },
    },
    tooltip: {
      enabled: true,
    },
    dataLabels: {
      enabled: false,
    },
    labels: data.label,
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#90A4AE",
        },
        rotate: 0,
      },
      axisBorder: {
        show: true,
        color: "#78909C",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
      tickAmount: 10,
    },
    yaxis: [
      {
        showAlways: true,
        title: {
          text: "kW",
          offsetX: 20,
          offsetY: -100,
          rotate: 0,
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
        },
      },
      {
        opposite: true,
        showAlways: true,
        title: {
          text: "W/㎡",
          offsetX: -20,
          offsetY: -100,
          rotate: 0,
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
        },
      },
    ],
  };
  useEffect(() => {
    if (instance.current === null) {
      instance.current = io.connect("http://3.0.102.91:4001");
    }
    const client = instance.current;
    client.on("connect", () => {
      console.log("connected to server");
    });
    client.on("data", (data) => {
      setData({
        activePower: data.map((e) => e.value),
        GHI: data.map((e) => e.value / 1000),
        label: data.map((e) => Date.parse(e.timestamp)),
        production: data.map((e) => Math.floor(e.value* (1+Math.random()))),
        irradiation: data.map((e) => Math.floor(e.value* (1+Math.random()))),
      });
    });
    return () => {
      client.removeAllListeners();
    };
  }, []);
  return (
    <div>
      <div className="App">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={250}
        />
      </div>
      <div className = "App">
      <ReactApexChart
          options={options}
          series={series2}
          type="line"
          height={250}
        />
      </div>
    </div>
  );
}

export default App;
