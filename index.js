import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiKey = 'API TOKEN
const baseUrl = 'https://api.rawg.io/api/games'
const delay = 1000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

const fetchGames = async (params, pages) => {
  const games = []
  for (const page of pages) {
    try {
      const url = `${baseUrl}?key=${apiKey}&${params}&page_size=16&page=${page}`
      const response = await axios.get(url)
      games.push(...response.data.results)
      await new Promise(resolve => setTimeout(resolve, delay))
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }
  return games
}

app.get('/', async (req, res) => {
  try {
    const actionGames = await fetchGames('genres=action&ordering=+rating', [1, 2, 3])
    const adventureGames = await fetchGames('genres=adventure&ordering=+rating', [1, 2, 3])
    const racingGames = await fetchGames('genres=racing&ordering=+rating', [1, 2, 3])
    res.render('index', { actionGames, adventureGames, racingGames, error: null })
  } catch (err) {
    console.error('Error:', err)
    res.render('index', { actionGames: [], adventureGames: [], racingGames: [], error: 'Error al obtener datos de los juegos' })
  }
})

app.get('/about', async (req, res) => {
  res.render('about')
})

app.get('/games', async (req, res) => {
  const { genre, platform, releaseYear, tags, name } = req.query
  try {
    let params = 'ordering=-rating'

    if (genre) {
      params += `&genres=${genre}`
    }
    if (platform) {
      params += `&platforms=${platform}`
    }
    if (releaseYear) {
      params += `&dates=${releaseYear}-01-01,${releaseYear}-12-31`
    }
    if (tags) {
      params += `&tags=${tags}`
    }
    if (name) {
      params += `&search=${name}`
    }

    const games = await fetchGames(params, [1, 2, 3, 4])
    res.render('games', { games, genre, platform, releaseYear, tags, name, error: null })
  } catch (err) {
    console.error('Error:', err)
    res.render('games', { games: [], genre, platform, releaseYear, tags, name, error: 'Error al obtener datos de los juegos' })
  }
})

app.get('/games/:id', async (req, res) => {
  const gameId = req.params.id
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
    const gameData = response.data
    res.render('gameDetails', { game: gameData })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching game data')
  }
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
