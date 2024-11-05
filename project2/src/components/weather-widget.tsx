"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setISLoading] = useState<boolean>(false); 
    //  when the data is loading from api is true until we get the data or error it will become false
    // we have to get the dats from api so it takes time so thats why we have to use async function

    const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if(trimmedLocation === "") { // if user uses only space instead of writing a location then this if works
            setError("Please Enter a Valid Location");
            setWeather(null);
            return;
        }
        setISLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
                // bse domain name    version of api 
                // current.json its a end point whi return the data in the form of the json
                // ?key= query parameter for sendinf extra information in the url 
                // we are sending api key that telling we are verified users
                // process.env its a nodejs onject who access the environmental variables
                // its also a query parameter who tell the location and in that variable user give the city name 
            );
            if(!response.ok) {
                throw new Error("city not found")
            }
            const data = await response.json();
            const weatherData:WeatherData = {
                temperature: data.current.temp_C,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            }
            setWeather(weatherData);

        } catch (error) {
            setError("City not found. Please try again!");
            setWeather(null);
            
        } finally {
            setISLoading(false);
        }
    };
    function getTemperatureMessage(temperature: number, unit: string):string {
        if (unit === "C") {
    if (temperature < 0) {
        return `It's freezing at ${temperature}°C!`;
    } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C.`;
    } else if (temperature < 20) {
        return `It's a bit chilly at ${temperature}°C.`;
    } else if (temperature < 30) {
        return `It's a pleasant temperature at ${temperature}°C.`;
    } else {
        return `It's warm at ${temperature}°C.`;
    }
} else {
    // placeholder for other temperature unit means if instead of Fahrenheit unit then its output return like this
    return `${temperature}°${unit}`;
}
    }

    function getWeatherData (description: string):string {
        switch (description.toLocaleLowerCase()) {
            case "sunny":
                return "It's a beautiful sunny day!";
            case "partly cloudy":
                return "It's a lovely day with some clouds!";
            case "overcast":
                return "It's a bit gloomy with overcast skies.";
            case "rain":
                return "Don't forget your umbrella; it's raining!";
            case "snow":
                return "It's a winter wonderland out there with snow!";
            case "fog":
                return "Be careful; it's quite foggy today.";
            default:
                return description; // default Weather conditions are unclear
        }
    }

    function getLocationMessage (location: string):string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        const isAM = currentHour >= 18 || currentHour <6;
        return `${currentHour} ${isAM ? "p.m" : "a.m"} ${location} ${isNight ? "at night" : "during the day"}`
    }

    return (
        <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col justify items-center h-[auto] border-2 border-gray-500 shadow-md shadow-gray-500 w-[80%] lg:w-[50vw] rounded-lg bg-bgcolor">
            <CardHeader>
                <CardTitle className="text-3xl md:text-4xl lg:5xl">Weather Widget</CardTitle>
                <CardDescription className="text-lg sm:text-xl md:text-2xl">Get current weather information</CardDescription>
                
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex items-center mt-2 gap-2">
                    <Input
                    className="bg-yellow-100 text-black"
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Search"}
                    </Button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {weather && (
                    <ul className="flex flex-col mt-6 justify-center items-start">
                
                        <li className="flex text-lg md:text-2xl gap-3">
                        <ThermometerIcon/>
                         <p className="text-white">{getTemperatureMessage(weather.temperature, weather.unit)}</p>
                         </li>

                         <li className="flex text-lg md:text-2xl gap-3">
                        <MapPinIcon/>
                        <p className="text-white">{getLocationMessage(weather.location)}</p>
                        </li>

                        <li className="flex text-lg md:text-2xl gap-3">
                        <CloudIcon/>
                        <p className="text-white">{getWeatherData(weather.description)}</p>
                        </li>
                        </ul>

                )}
            </CardContent>
        </div>
        </div>
        )

}