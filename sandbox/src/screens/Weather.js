import { useEffect, useState } from 'react';

const URL = "http://api.weatherapi.com/v1/current.json?key=72361dc0de984631970174354230208&q=Annecy";

function Weather(props) {

    const [temperature, setTemperature] = useState(null);

    async function asyncLoadData() {
        const response = await fetch(URL);
        const data = await response.json();
        setTemperature(data);
    }
    useEffect(() => {asyncLoadData()}, [])

    if(temperature){
        return (
            <div>
                Il fait {temperature.current.temp_c}°C à Annecy
            </div>
        );
    } else {
        <div>Chargement...</div>
    }
}

export default Weather;