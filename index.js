import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiKey = 'fcff05fc4cec4cb1a44a5132c43b9065'
const baseUrl = 'https://api.rawg.io/api/games'
const delay = 1000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

const fetchGamesByCategoryWithDelay = async (category, pages) => {
  const games = []
  for (const page of pages) {
    try {
      const response = await axios.get(`${baseUrl}?key=${apiKey}&genres=${category}&ordering=+rating&page_size=16&page=${page}`)
      games.push(...response.data.results)
      await new Promise(resolve => setTimeout(resolve, delay))
    } catch (error) {
      console.error(`Error fetching ${category} games:`, error)
    }
  }
  return games
}

app.get('/', async (req, res) => {
  try {
    const actionGames = await fetchGamesByCategoryWithDelay('action', [1, 2, 3])
    const adventureGames = await fetchGamesByCategoryWithDelay('adventure', [1, 2, 3])
    const racingGames = await fetchGamesByCategoryWithDelay('racing', [1, 2, 3])

    res.render('index', { actionGames, adventureGames, racingGames, error: null })
  } catch (err) {
    console.error('Error:', err)
    res.render('index', { actionGames: [], adventureGames: [], error: 'Error al obtener datos de los juegos' })
  }
})

app.get('/about', async (req, res) => {
  res.render('about')
})
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
