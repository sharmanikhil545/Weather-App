import { Grid, Typography } from "@mui/material";
import { useState } from "react"
import { useEffect } from 'react';
import { getAll } from './api';
import { Chart } from "react-google-charts";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import sunny from './assets/sunny3.jpg';
import cloudy from './assets/cloudy.jpg';
import rain from './assets/rain.png';


export const WeatherData = (props) => {
    const [totalData, setTotalData] = useState();
    const [data, setData] = useState();
    const [humidity, setHumidity] = useState();
    const [windspeed, setWindSpeed] = useState();
    const [cityName, setCityName] = useState('Waterloo');
    const [cityData, setCityDetails] = useState();

    useEffect(() => {
        getAllData();
    }, [cityData]);

    const getAllData = async () => {

        const res = await getAll();
        setTotalData(res);
        const res_waterloo = res.filter((item) => item.city.name === cityName);
        setCityDetails(res_waterloo)
        console.log(res_waterloo);
        const value = [["Date", "Minimum", "Actual", "Maximum", "Feels Like"]];
        const humidity = [["Date", "Humidity"]]
        const windspeed = [["Date", "Wind Speed"]]
        res_waterloo.map((item) => { value.push([item.date.slice(0, 10), +item.min - 273.15, +item.temp - 273.15, +item.max - 273.15, +item.feels_like - 273.15]) })
        res_waterloo.map((obj) => { humidity.push([obj.date, +obj.humidity]) });
        res_waterloo.map((obj) => { windspeed.push([obj.date, +obj.windspeed]) });
        console.log(value);
        setHumidity(humidity);
        setWindSpeed(windspeed)
        setData(value);
    }

    const handleChange = (e) => {
        setCityName(e.target.value);
        setCityData();
    }

    const setCityData = () => {
        const res_waterloo = totalData.filter((item) => item.city.name === cityName);
        const value = [["Date", "Minimum", "Actual", "Maximum", "Feels Like"]];
        const humidity = [["Date", "Humidity"]]
        const windspeed = [["Date", "Wind Speed"]]
        res_waterloo.map((item) => { value.push([item.date.slice(0, 10), +item.min - 273.15, +item.temp - 273.15, +item.max - 273.15, +item.feels_like - 273.15]) })
        res_waterloo.map((obj) => { humidity.push([obj.date, +obj.humidity]) });
        res_waterloo.map((obj) => { windspeed.push([obj.date, +obj.windspeed]) });
        console.log(value);
        setHumidity(humidity);
        setWindSpeed(windspeed)
        setData(value);
    }



    return (

        <div>
            {cityName &&
                <div>
                    <div className="details">
                        <Typography variant="h3" sx={{ color: "white" }}>Weather Analysis</Typography>

                        <Select
                            id="drp"
                            value={cityName}
                            onChange={handleChange}
                            sx={{
                                alignContent: "right",
                                display: "flex",
                                position: "absolute",
                                background: "white",
                                width: "16rem",
                                top: "5%"
                            }}
                        >
                            <MenuItem value='Waterloo'>Waterloo</MenuItem>
                            <MenuItem value='Kitchener'>Kitchener</MenuItem>
                            <MenuItem value='Toronto'>Toronto</MenuItem>
                            <MenuItem value='Surrey'>Surrey</MenuItem>
                            <MenuItem value='Ottawa'>Ottawa</MenuItem>
                            <MenuItem value='Mississauga'>Mississauga</MenuItem>

                        </Select>
                        {cityData &&
                            <>
                                <img
                                    src={cityData[0]['type'] === "Clouds" ? cloudy : cityData[0]['type'] === "Rain" ? rain : sunny}
                                    style={{ width: "150px" }}/>
                                <Typography variant="h4" sx={{ color: "white" }}>{(+cityData[0]['temp'] - 273.15).toString().slice(0, 4)}&deg;C</Typography>
                                <Typography variant="h5" sx={{ color: "white" }}>{cityName}, {cityData[0]['city']['country']}</Typography>
                            </>
                        }
                    </div>
                    <div className="row displayFlex">
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="400px"
                            data={data}
                            className="col-md-4"
                            options={{
                                title: "Temperature Forecast",
                                curveType: "function",
                                legend: { position: "bottom" },
                                backgroundColor: '#f1f8e9',
                                pointSize: 4,
                                pointShape: 'triangle',
                                hAxis: {
                                    title: 'Date'
                                },
                                vAxis: {
                                    title: 'Temperature'
                                },
                            }}
                        />
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="400px"
                            data={humidity}
                            className="col-md-4"
                            options={{
                                title: "Humidity Data",
                                legend: { position: "bottom" },
                                colors: ["blue"],
                                backgroundColor: '#f1f8e9',
                                hAxis: {
                                    title: 'Date'
                                },
                                vAxis: {
                                    title: 'Humidity'
                                },
                            }}
                        />
                        <Chart
                            chartType="AreaChart"
                            width="100%"
                            height="400px"
                            data={windspeed}
                            options={{
                                title: "WindSpeed Forecast",
                                legend: { position: "bottom" },
                                colors: ["red"],
                                backgroundColor: '#f1f8e9',
                                hAxis: {
                                    title: 'Date'
                                },
                                vAxis: {
                                    title: 'Speed'
                                },
                            }}
                        />
                    </div>
                </div>
            }

        </div >
    )
}
export const options = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
};
