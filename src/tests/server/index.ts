// create a simple express server to test reqvue
import express from 'express'

export function spinUpTestServer() {
  const app = express()
  const port = 3000

  app.use(express.json())

  app.get('/test', (req, res) => {
    const query = req.query

    if (query.search) {
      return res.json({ message: `GET request successful with search: ${query.search}` })
    }
    res.json({ message: 'GET request successful' })
  })

  app.get('/test/:id', (req, res) => {
    const { id } = req.params
    res.json({ message: `GET request successful for ID: ${id}` })
  })

  app.post('/test', (req, res) => {
    const { user, pass } = req.body
    res.json({ message: `POST request successful for user: ${user} with pass: ${pass}` })
  })

  app.get('/error', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' })
  })

  app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`)
  })
}
