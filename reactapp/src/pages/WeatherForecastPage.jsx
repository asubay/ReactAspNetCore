import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForecastTable from "@/components/table/ForecastTable.jsx";
import TopCarousel from "@/components/carousel/TopCarousel.jsx";
import LeafletMap from "@/components/map/LeafletMap.jsx";
import TemperatureChart from "@/components/chart/TemperatureChart.jsx";
import HumidityChart from "@/components/chart/HumidityChart.jsx";
import WeatherIcon from "@/components/icon/WeatherIcon.jsx";
import { Spin } from 'antd';
import SearchSection from "@/components/section/SearchSection.jsx";

const  WeatherForecastPage= () => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState({
        selectedCity: '',
        selectedCityName: ''
    });

    useEffect(() => {
        const fetchForecasts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`weatherforecast?cityId=${weatherData.selectedCity}`);
                const data = await response.json();
                setForecasts(data);
            } catch (error) {
                console.error('Error fetching forecasts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchForecasts();
    }, [weatherData.selectedCity]);

    const handleCityChange = (value, selectedOption) => {
        setWeatherData(prevState => ({
            ...prevState,
            selectedCity: value,
            selectedCityName: selectedOption ? selectedOption.label : ''
        }));
    };

    if (loading && forecasts.length === 0) {
        return (
            <Spin tip="Loading" size="large" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                <div />
            </Spin>
        );
    }

    const selectedTemperatureData = forecasts.params.slice(0, 6).map(item => ({
        time: item.time,
        temperature: item.temperature
    }));

    const selectedHumidityData = forecasts.params.slice(0, 6).map(item => ({
        time: item.time,
        temperature: item.humidity
    }));

    return (
        <>
            <Spin spinning={loading}> 
                <TopCarousel />
                <SearchSection
                    handleCityChange={handleCityChange}
                    selectedCityName={weatherData.selectedCityName}
                    selectedCity={ weatherData.selectedCity }
                />
                <div className="container-fluid">
                    <div className="row mt-3">
                        <div className="col-sm-6">
                            <h3>Прогноз погоды на ближайшие 5 дней</h3>
                            <ForecastTable forecasts={forecasts.params}></ForecastTable>
                        </div>
                        <div className="col-sm-6">
                            <div>
                                <h3>{forecasts.name}, {forecasts.country}</h3><br/>
                                <WeatherIcon temperature={forecasts.params[0].temperature} />
                                <p><strong>Восход солнца:</strong> {forecasts.sunrise}</p>
                                <p><strong>Закат солнца:</strong> {forecasts.sunset}</p>
                                <p><strong>Часовой пояс:</strong> {forecasts.timezone}</p>
                            </div>
                            <div className="leaflet-container">
                                <LeafletMap center={[forecasts.lat, forecasts.lon]} zoom={13} />
                            </div>
                            <div className="row mt-3">
                                <strong><h3>Почасовой прогноз</h3></strong>
                                <div className="col-sm-6">
                                    <TemperatureChart data={ selectedTemperatureData }/>
                                </div>
                                <div className="col-sm-6">
                                    <HumidityChart data={ selectedHumidityData }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </>
    );
}

export default WeatherForecastPage;
