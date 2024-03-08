import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css";
import CarAccidentPage from "@/pages/CarAccidentPage.jsx";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WeatherForecastPage />} />
                    <Route path="/yka-car-accident" element={<CarAccidentPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;