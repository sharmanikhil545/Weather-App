import { Chart } from "react-google-charts";
import { useState } from "react";
export const Charts = (props) => {
    const {cityData} = props;
    const [data, setData] = useState();
    const [humidity, setHumidity] = useState();
    const [windspeed, setWindSpeed] = useState();
    const value = [["Date", "Minimum", "Actual", "Maximum", "Feels Like"]];
    const humidityArray = [["Date", "Humidity"]]
    const windspeedArray = [["Date", "Wind Speed"]]
    cityData.map((item) => { value.push([item.date.slice(0, 10), +item.min - 273.15, +item.temp - 273.15, +item.max - 273.15, +item.feels_like - 273.15]) })
    cityData.map((obj) => { humidityArray.push([obj.date, +obj.humidity]) });
    cityData.map((obj) => { windspeedArray.push([obj.date, +obj.windspeed]) });
    setHumidity(humidity);
    setWindSpeed(windspeed)
    setData(value);

    return (

        <>
            {data &&
                <>
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
                            pointShape: 'triangle'
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
                        className="col-md-4"
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

                </>
            }
        </>)
}