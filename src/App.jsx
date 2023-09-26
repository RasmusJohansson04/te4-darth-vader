import { useEffect, useState } from 'react'
import Spinner from './components/Spinner'
import './App.css'

function App() {
  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    console.log(`Before call: ${typeof (weatherData)}`)
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      console.log(lat, long)

      if (lat.length === 0 || long.length === 0) {
        return
      }

      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result)
        }).catch(err => {
          console.log(err)
        })
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>DARTH VÄDER</h1>
      <h2>Skurarna Slår Tillbaka</h2>
      {weatherData.main ? (
        <>
          <h2>City: {weatherData.name}</h2>
          <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed()}°C</h2>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default App
