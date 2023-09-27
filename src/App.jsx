import { useEffect, useState } from 'react'
import Spinner from './components/Spinner'
import './App.css'

function App() {
  const [lat, setLat] = useState(() => {
    return JSON.parse(localStorage.getItem('lat')) || []
  })
  const [long, setLong] = useState(() => {
    return JSON.parse(localStorage.getItem('long')) || []
  })
  const [weatherData, setWeatherData] = useState([])

  const [weatherDataSaved, setWeatherDataSaved] = useState(() => {
    return JSON.parse(localStorage.getItem('weatherDataSaved')) || []
  })
  const [dataAge, setDataAge] = useState(() => {
    return JSON.parse(localStorage.getItem('dataAge')) || []
  })

  // 1. Get location from browser
  // 2. Check if location is the same as last time
  // 3. If location is the same as last time, use data from localstorage
  // 4. IF data is older than 10 minutes, fetch new data
  // 5. If location is not the same as last time, fetch new data
  // 6. Save data to localstorage
  useEffect(() => {
    console.log(`Before call: ${typeof (weatherData)}`)

    async function fetchWeather() {
      let sameCoords = false
      navigator.geolocation.getCurrentPosition((position) => {
        if (lat === position.coords.latitude && long === position.coords.longitude) {
          sameCoords = true
        }
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      if (new Date().getTime() - dataAge < 600000 && sameCoords) {
        setWeatherData(weatherDataSaved)
        console.log('Not old')
        return
      }

      console.log('Fetching')
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeatherData(result)
          localStorage.setItem('lat', JSON.stringify(lat))
          localStorage.setItem('long', JSON.stringify(long))
          localStorage.setItem('weatherDataSaved', JSON.stringify(result))
          localStorage.setItem('dataAge', JSON.stringify(new Date().getTime()))
          console.log(result)
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
