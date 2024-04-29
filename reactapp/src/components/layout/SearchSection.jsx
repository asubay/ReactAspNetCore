import React from 'react';
import Select from "@/components/common/selects/Select.jsx";

const SearchSection = ({ handleCityChange, selectedCity, selectedCityName }) => {
    return (
        <div className="search-container">
            <div className="search">
                <label>Выберите город:</label>
                <Select
                    value={{ value: selectedCity, label: selectedCityName }}
                    onChange={(value, selectedOption) => handleCityChange(value, selectedOption)}
                    options={[
                        { value: "1520316", name: "Ust-Kamenogorsk" },
                        { value: "1519422", name: "Semei" },
                        { value: "1526273", name: "Astana" },
                        { value: "1526384", name: "Almaty" },
                    ]}>
                </Select>
            </div>
        </div>
    );
};

export default SearchSection;