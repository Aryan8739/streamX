import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running!');
});
// get list of 5 cars

app.get('/api/cars', (req, res) => {
  const cars = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2021 },
    { id: 3, make: 'Ford    ', model: 'Mustang', year: 2019 },
    { id: 4, make: 'Chevrolet', model: 'Malibu', year: 2022 },
    { id: 5, make: 'Nissan', model: 'Altima', year: 2023 }
  ];
  res.send(cars);
});
 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running  at http://localhost:${PORT}`);
}
);
