import React, { useState, useEffect } from 'react';
import WeatherForecastPage from '@/pages/WeatherForecastPage.jsx';
import "./App.css"
import MySelect from "@/components/select/MySelect.jsx";
import AccidentTable from "@/components/table/AccidentTable.jsx";
import { Spin } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;

function App() {
    const [accident, setAccident] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccident = async () => {
            setLoading(true);
            try {
                const response = await fetch(`accident`);
                const data = await response.json();
                setAccident(data);
            } catch (error) {
                console.error('Error fetching accidents:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchAccident();
    }, []);

    if (loading && accident.length === 0) {
        return (
            <Spin tip="Loading" size="large" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                <div />
            </Spin>
        );
    }    
    
    return (
        <div className="App">
            <Layout>
                <Sider
                    width={300}
                    style={{
                        background: "rgb(25 55 90)",
                    }}>                    
                </Sider>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: "rgb(25 55 90)"
                    }}
                >
                    <h1>Анализ ДТП по городу Усть-Каменогорск</h1>
                    <AccidentTable accidents={accident}></AccidentTable>
                </Content>
            </Layout>
           
        </div>
    );
}

export default App;
