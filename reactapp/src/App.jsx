import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css";
import CarAccidentPage from "@/pages/CarAccidentPage.jsx";
import {AuthProvider} from "@/components/contexts/AuthContext.jsx";
import Login from "@/components/forms/Login.jsx";
import PrivateRoute from "@/components/contexts/PrivateRoute.jsx";
import RoleListForm from "@/components/forms/roles/RoleListForm.jsx";
import RoleForm from "@/components/forms/roles/RoleForm.jsx";
import UserListForm from "@/components/forms/users/UserListForm.jsx";
import UserForm from "@/components/forms/users/UserForm.jsx";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<WeatherForecastPage />} />                        
                        <Route path="/role" element={<RoleListForm />} />                        
                        <Route path="/user" element={<UserListForm />} />                        
                        <Route path="/role/edit/:id" element={<RoleForm />} />                        
                        <Route path="/user/edit/:id" element={<UserForm />} />                        
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