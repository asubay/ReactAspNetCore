import React from 'react';
import {Pie} from "react-chartjs-2";
import {
    Chart as ChartJS,   
    Legend,
    Tooltip, Filler, ArcElement, Chart
} from "chart.js";

ChartJS.register(   
    Filler,
    Legend,
    Tooltip,ArcElement
)


const KindPieChart = ({data, label}) => {   
    const labels = data.map(([category]) => category);
    const dataset = data.map(([_, items]) => items.length);

    const generateRandomColor = () => {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        return "#" + randomColor;
    };

    Chart.defaults.font.size = 15;

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: label,                
                data: dataset,
                hoverOffset: 4,
                backgroundColor: data.map(() => generateRandomColor()),
            }
        ]
    };
    const options = {
        plugins: {
            legend: {
                position: 'bottom',
            },
        },        
    }; 

    return (
        <div style={{
            padding: '20px',
            width: '50%'
        }}>
            <Pie 
                data={chartData}
                options={options}/>
        </div>
    );
};

export default KindPieChart;