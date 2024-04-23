import React from 'react';
import {Bar} from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    Legend,
    Tooltip, Filler, CategoryScale, Chart
} from "chart.js";

ChartJS.register(
    BarElement,    
    Filler,
    Legend,
    Tooltip,CategoryScale
)


const OffenceBar = ({ data, label }) => {    
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
                backgroundColor: 'rgb(236,156,163)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                borderRadius: 2,
                pointStyle: 'rectRounded',
                data: dataset,                
            }
        ]
    };   
    
    return (
        <div className="container d-flex justify-content-center align-items-center">
            <Bar
                data={chartData}
                options={chartOptions}
            />
        </div>
        
    );
};

export default OffenceBar;