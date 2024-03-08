import React from 'react';
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler, Chart
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
)

const LineChart = ({ data, label }) => {
    
    const labels = data.map(([category]) => category);
    const dataset = data.map(([_, items]) => items.length);

    const chartOptions = {
        animation: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: 'white'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: '30px'
                    }
                }]
            },
        },

    };
    Chart.defaults.font.size = 15;

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: dataset,
                fill: false,
                tension: 0.2,
                pointBorderColor: 'orange',
                backgroundColor: "rgba(249,203,156)",
                borderColor: "rgba(230,145,56)"
            }
        ]
    };
    return (
        <div className="container d-flex justify-content-center align-items-center" 
             style={{
            padding: '20px',
            width: '90%'
        }}>            
            <Line
                data={chartData}
                options={chartOptions}/>
        </div>
    );
};

export default LineChart;