import React, { useState, useEffect } from 'react';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css"
import MySelect from "@/components/select/MySelect.jsx";

function App() {   
    
    return (
        <div className="App">
            <MySelect
                value={{ value: selectedCity, label: selectedCityName }}
                onChange={(value, selectedOption) => handleCityChange(value, selectedOption)}
                options={[
                    { value: "1520316", name: "Ust-Kamenogorsk" },
                    { value: "1519422", name: "Semei" },
                    { value: "1526273", name: "Astana" },
                    { value: "1526384", name: "Almaty" },
                ]}>
            </MySelect>
            <WeatherForecastPage />
        </div>
    );
}

export default App;
