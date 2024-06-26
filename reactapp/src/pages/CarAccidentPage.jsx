import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Layout } from 'antd';
import AccidentTable from "@/components/widgets/tables/AccidentTable.jsx";
import "@/pages/styles/Style.css"
import Sidebar from "@/components/layout/Sidebar.jsx";
import CustomMultiSelect from "@/components/common/selects/MultiSelect.jsx";
import FooterSection from "@/components/layout/Footer.jsx";
import MenuSection from "@/components/layout/Menu.jsx";
import OffenceBar from "@/components/widgets/charts/OffenceBar.jsx";
import KindPieChart from "@/components/widgets/charts/KindPieChart.jsx";
import HeatingMap from "@/components/widgets/maps/HeatingMap.jsx";
import LineChart from "@/components/widgets/charts/LineChart.jsx";
import { fetchAccident } from "@/services/api.js"
import HeaderSection from "@/components/layout/Header.jsx";

const { Content } = Layout;

function groupBy(jsonData, key) {
    return jsonData.reduce((acc, obj) => {
        const keyValue = obj[key];
        if (!acc[keyValue]) {
            acc[keyValue] = [];
        }
        acc[keyValue].push(obj);
        return acc;
    }, {});
}

const CarAccidentPage = () => {
    const [accident, setAccident] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYears, setSelectedYeas] = useState([]);    
    
    const handleChange = (value) => {
        setSelectedYeas(value)
    };

    useEffect(() => { 
        const fetchAccidentData = async () => {
            
            setLoading(true);
            try {
                const data = await fetchAccident();                
                
                if (selectedYears.length>0){
                    let yearsParam = selectedYears.join(',');
                    const filtered = data.filter(acc => acc.year && yearsParam.includes(acc.year.toString()));                    
                    setAccident(filtered);
                } else {
                    setAccident(data);
                }  
            } catch (error) {
                console.error('Error fetching accidents:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchAccidentData();
    }, [selectedYears]);

    useEffect(() => {
        const fetchAccidentYears = async () => {            
            try {
                const response = await fetch(`/accident/GenerateYears`);
                const data = await response.json();
                setYears(data);
            } catch (error) {
                console.error('Error fetching accident years:', error);
            }
            finally {
                console.log('Success');
            }
        };

        fetchAccidentYears();
    }, []);

    if (loading && accident.length === 0) {
        return (
            <Spin tip="Loading" size="large" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                <div />
            </Spin>
        );
    }
    
    const groupedOffence = groupBy(accident, "offence");
    const groupedImpairment = groupBy(accident, "impairment");
    const groupedLight = groupBy(accident, "light");
    const groupedYear = groupBy(accident, "year");
    const groupedVehicle = groupBy(accident, "vehicles");
    const mapData = accident.slice(0, 20).map(item => ({ latitude: item.latitude, longitude: item.longitude,
        popupText: 'Дата: ' + item.date + '. Вид ДТП: ' + item.offence}));    
    
    const sortedCategories = Object.entries(groupedOffence)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 10)
    const sortedImpairments = Object.entries(groupedImpairment)
        .sort((a, b) => b[1].length - a[1].length)
    const sortedLights = Object.entries(groupedLight)
        .sort((a, b) => b[1].length - a[1].length)
    const sortedYears = Object.entries(groupedYear)
        .sort((a, b) => b[0].length - a[0].length)
    const sortedVehicles = Object.entries(groupedVehicle)
        .sort((a, b) => b[1].length - a[1].length)

    return (
        <>   
           <Sidebar 
               content={                   
               <div>
                  <MenuSection theme={"dark"}/>
                   <hr style={{color:"white"}}/>
                   <div className="sidebarContent">
                       <div className="form-group" >
                           <h5 style={{color:"white", paddingLeft: '10px'}}>Выберите года:</h5>
                           <CustomMultiSelect
                               options={years}
                               placeholder="Выберите"
                               handleChange={handleChange}
                           />
                       </div>
                   </div>                        
               </div>
           }
           />                
            <Layout> 
                <Content className="accident">
                <h1>Анализ ДТП по городу Усть-Каменогорск</h1>
                <div className="mt-3">
                    <AccidentTable accidents={accident}></AccidentTable>
                </div>                    
                <div className="row">
                    <hr/>
                    <h3>Количество ДТП по категориям</h3>
                    <div className='col-sm-11'>
                        <OffenceBar
                            data={sortedCategories}
                            label={'Количество ДТП по проишествиям'}
                        />
                    </div>                        
                    <hr/>
                    <div className="col-sm-6 mt-5">
                        <h3>Количество ДТП по состоянию водителей</h3>
                        <div className="container d-flex justify-content-center align-items-center">                                
                            <KindPieChart
                                data={sortedImpairments}
                                label={"Количество ДТП"}/>
                        </div>
                    </div>
                    <div className="col-sm-6 mt-5">
                        <h3>Количество ДТП по времени суток</h3>
                        <div className="container d-flex justify-content-center align-items-center">                               
                            <KindPieChart
                                data={sortedLights}
                                label={"Количество ДТП: "}/>
                        </div>                            
                    </div>
                    <hr/>
                    <div className='col-sm-6 mt-5'>
                        <h3>Кол-во ДТП по виду транспорта</h3>
                        <OffenceBar
                            data={sortedVehicles}
                            label={"Количество ДТП"}
                        />
                    </div>
                    <div className='col-sm-6 mt-5'>
                        <h3>Кол-во ДТП ежегодно (2015-2024)</h3>
                        <LineChart
                            data={sortedYears}
                            label={"Количество ДТП"}
                        />
                    </div>
                </div> 
                <hr/>
                <h3>Расположение случаев ДТП на карте</h3>
                <HeatingMap
                    center={[49.954527,82.518867]}
                    zoom={11}
                    coordinates={mapData}
                />
            </Content>       
            </Layout>
        </>        
    );
};

export default CarAccidentPage;