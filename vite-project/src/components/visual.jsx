import React, { useEffect, useRef } from 'react';
import dygraphs from 'dygraphs';
import '../App.css'

function Visualizer(props) {
  const chartRef = useRef(null);
  const windowSize = 500;

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the previous Dygraph instance, if exists
    }

    const options = {
      animatedZooms: false,
      labels: ['X', 'Heart'],
      fillGraph: false,
      tension: 0.1, 
      axes: {
        y: {    
          valueRange: [0, 1000],
        },
      },
    };

    const data = props.mydata.map((value, index) => [index, value]);

    chartRef.current = new dygraphs(
      document.getElementById('myChart'),
      data.slice(-windowSize),
      options
    );
  }, [props.mydata]);

  return (

    <div id="myChart" ></div>

  );
}

export default Visualizer;
