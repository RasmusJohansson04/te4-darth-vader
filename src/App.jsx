import { useEffect, useState } from 'react'
import Spinner from './components/Spinner'
import './App.css'

// 1. Get location from browser
// 2. Check if location is the same as last time
// 3. If location is the same as last time, use data from localstorage
// 4. IF data is older than 10 minutes, fetch new data
// 5. If location is not the same as last time, fetch new data
// 6. Save data to localstorage

function App() {
  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const [weatherDataSaved, setWeatherDataSaved] = useState(() => {
    return JSON.parse(localStorage.getItem('weatherDataSaved')) || []
  })
  const [dataAge, setDataAge] = useState(() => {
    return JSON.parse(localStorage.getItem('dataAge')) || []
  })
  const lifespan = 600000

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })

      if (lat.length === 0 || long.length === 0) return

      const userLocation = { lat: lat, long: long }
      const storedLocation = JSON.parse(localStorage.getItem('userLocation'))
      const timestamp = new Date().getTime()
      const oldWeatherData = JSON.parse(localStorage.getItem('weatherDataSaved'))

      if (JSON.stringify(storedLocation) === JSON.stringify(userLocation) && timestamp - dataAge < lifespan) {
        console.log(oldWeatherData)
        setWeatherData(oldWeatherData)
        return
      }

      console.log('Fetching Data')
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeatherData(result)
          localStorage.setItem('weatherDataSaved', JSON.stringify(result))
          localStorage.setItem('dataAge', JSON.stringify(timestamp))
          localStorage.setItem('userLocation', JSON.stringify(userLocation))
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
