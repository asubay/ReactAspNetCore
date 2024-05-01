import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForecastTable from "@/components/widgets/tables/ForecastTable.jsx";
import TopCarousel from "@/components/widgets/sliders/TopCarousel.jsx";
import LeafletMap from "@/components/widgets/maps/LeafletMap.jsx";
import TemperatureChart from "@/components/widgets/charts/TemperatureChart.jsx";
import HumidityChart from "@/components/widgets/charts/HumidityChart.jsx";
import WeatherIcon from "@/components/icon/WeatherIcon.jsx";
import { Spin, Layout } from 'antd';
import SearchSection from "@/components/layout/SearchSection.jsx";
import {Link} from "react-router-dom";
import FooterSection from "@/components/layout/Footer.jsx";
import {fetchForecasts} from "@/services/api.js"

const { Content } = Layout;

const  WeatherForecastPage = () => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState({
        selectedCity: '',
        selectedCityName: ''
    });
        
    useEffect(() => {        
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchForecasts(weatherData.selectedCity);
                setForecasts(data);
            } catch (error) {
                console.error('Error fetching forecasts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        <Spin spinning={loading}>      
            <Content>
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
                                <Link to={`/yka-car-accident`}>
                                    Перейти к статистике ДТП
                                </Link>
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
            </Content>
            <FooterSection/>    
        </Spin>  
    );
}

export default WeatherForecastPage;
