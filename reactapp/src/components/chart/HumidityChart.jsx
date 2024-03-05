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

const HumidityChart = ({ data }) => {    
    
    const dates = data.map(entry => entry.time);
    
    const humidity = data.map(entry => entry.temperature);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Влажность',
                data: humidity,
                fill: true,                
                tension: 0.2,
                pointBorderColor: 'orange',
                backgroundColor: "rgba(249,203,156)",
                borderColor: "rgba(230,145,56)"
            }
        ]
    };    
    
    return (
        <div className="mt-3">
            <h5>Влажность, %</h5>
            <Line
                data={chartData} 
                options={options}/>
        </div>
    );
};

export default HumidityChart;