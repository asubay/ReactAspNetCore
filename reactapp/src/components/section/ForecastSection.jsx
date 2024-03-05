import React from 'react';

const ForecastSection = ({forecasts }) => {
    const selectedTemperatureData = forecasts.params.slice(0, 6).map(item => ({
        time: item.time,
        temperature: item.temperature
    }));

    const selectedHumidityData = forecasts.params.slice(0, 6).map(item => ({
        time: item.time,
        temperature: item.humidity
    }));

    return (
        <div className="container-fluid">
            <div className="row mt-3">
                <div className="col-sm-6">
                    <h3>Прогноз погоды на ближайшие 5 дней</h3>
                    <ForecastTable forecasts={forecasts.params}></ForecastTable>
                </div>
                <div className="col-sm-6">
                    <WeatherInfoSection forecasts={forecasts} />
                    <MapSection forecasts={forecasts} />
                    <HourlyForecastSection selectedTemperatureData={selectedTemperatureData} selectedHumidityData={selectedHumidityData} />
                </div>
            </div>
        </div>
    );
};

export default ForecastSection;