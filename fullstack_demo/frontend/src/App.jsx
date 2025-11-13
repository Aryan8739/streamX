import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [cars, setCars] = useState([])   // cars list
  const [loading, setLoading] = useState(true)  // loading state
  const [error, setError] = useState(null)      // error state

  useEffect(() => {
    axios.get('/api/cars')
      .then((response) => {
        console.log("API Response:", response.data) // 👀 check shape
        // if response is { cars: [...] }, use response.data.cars
        if (Array.isArray(response.data)) {
          setCars(response.data)
        } else if (Array.isArray(response.data.cars)) {
          setCars(response.data.cars)
        } else {
          setCars([]) // fallback if data is unexpected
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching cars:', error)
        setError('Failed to fetch cars')
        setLoading(false)
      })  
  }, [])

  return (
    <>
      <h1>Hello Aryan Rastogi</h1>

      {loading && <p>Loading cars...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>Total cars: {cars.length}</p>
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id || car.model}> 
                <h2>{car.make}</h2>
                <h2>{car.model}</h2>
                <h2>{car.year}</h2>
              </div>
            ))
          ) : (
            <p>No cars available</p>
          )}
        </>
      )}
    </>
  )
}

export default App
