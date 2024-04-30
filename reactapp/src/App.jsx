import { Routes, Route } from 'react-router-dom';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css";
import CarAccidentPage from "@/pages/CarAccidentPage.jsx";
import Login from "@/components/forms/Login.jsx";
import PrivateLayout from "@/components/layout/PrivateLayout.jsx";
import RoleListForm from "@/components/forms/roles/RoleListForm.jsx";
import RoleForm from "@/components/forms/roles/RoleForm.jsx";
import UserListForm from "@/components/forms/users/UserListForm.jsx";
import UserForm from "@/components/forms/users/UserForm.jsx";
import MainLayout from "@/components/layout/MainLayout.jsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<WeatherForecastPage />} />
                    <Route path="/yka-car-accident" element={<CarAccidentPage />} />
                    <Route path="/user/edit/:id" element={<UserForm />} />
                </Route>
                <Route element={<PrivateLayout />}>                    
                    <Route path="/role" element={<RoleListForm />} />
                    <Route path="/user" element={<UserListForm />} />
                    <Route path="/role/edit/:id" element={<RoleForm />} />                    
                </Route>
            </Routes>
        </div>
    );
}

export default App;