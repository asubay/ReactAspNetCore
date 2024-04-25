import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css";
import CarAccidentPage from "@/pages/CarAccidentPage.jsx";
import {AuthProvider} from "@/components/contexts/AuthContext.jsx";
import Login from "@/components/forms/Login.jsx";
import PrivateRoute from "@/components/contexts/PrivateRoute.jsx"; //не забудь потом добавить защищенные страницы

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<WeatherForecastPage />} />                        
                        <Route element={<PrivateRoute />}>
                            <Route path="/yka-car-accident/:id" element={<CarAccidentPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>                
            </BrowserRouter>
        </div>
    );
}

export default App;