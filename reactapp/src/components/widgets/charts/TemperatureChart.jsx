import React from 'react';
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement, 
    Filler
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
)

const options = {
    plugins: {
        legend: true
    }
}

const TemperatureChart = ({ data }) => {    
    
    const dates = data.map(entry => entry.time);
    
    const temperatures = data.map(entry => entry.temperature);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Температура',
                data: temperatures,
                fill: true,                
                tension: 0.2,
                pointBorderColor: 'orange',
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }
        ]
    };    
    
    return (
        <div className="mt-3">
            <h5>Температура, C</h5>
            <Line
                data={chartData} 
                options={options}/>
        </div>
    );
};

export default TemperatureChart;