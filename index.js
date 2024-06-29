import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CLIENT_ID = '9zi4dvcfg0asp0eukw4h9prfg0zjfn'
const ACCESS_TOKEN = 'ig5f5ywfoc0nj799b1ompa872q17mk'

app.set('view engine', 'ejs')
app.set('views', path.join(path.resolve(), 'views'))

express.static.mime.define({ 'text/css': ['css'] })
express.static.mime.define({ 'application/javascript': ['js'] })
express.static.mime.define({ 'image/jpeg': ['jpg', 'jpeg'] })
express.static.mime.define({ 'image/png': ['png'] })

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.igdb.com/v4/games',
      {
        headers: {
          Accept: 'application/json',
          'Client-ID': CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`
        },
        params: {
          fields: 'id,name,cover.image_id',
          sort: 'popularity desc'
        }
      }
    )

    // Procesar la respuesta para obtener los hashes de las imágenes y construir las URLs
    const games = response.data.map(game => {
      if (game.cover && game.cover.image_id) {
        const imageHash = game.cover.image_id
        const imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageHash}.jpg`
        return {
          name: game.name,
          imageUrl
        }
      }
      return game
    })

    // Renderizar la plantilla EJS y pasar los datos de los juegos
    res.render('index', { games })
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message)
    res.status(500).send('Error al obtener los datos de los juegos')
  }
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
