import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async(req,res) => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        res.render('index', { countries: countries });
      } catch (error) {
        console.error('Error fetching countries:', error);
        res.render('index', { countries: [] }); // Render the template with an empty array if there's an error
      }
    res.render('index');
});

app.post('/', async(req,res) => {
    console.log(req.body);
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${req.body.countryName}`);
        const jsonData = response.data;
        res.render('index', {
            officialName:jsonData[0].name.official,
            flagUrl: jsonData[0].flags.png,
            capital: jsonData[0].capital[0],
            population: jsonData[0].population,
        });

    } catch(error) {
        res.status(500).json({error:error.message})
    }
});


app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })