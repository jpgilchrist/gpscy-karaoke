const express = require('express')
const app = express()
const plist = require('plist')
const fs = require('fs')
const path = require('path')

const library = plist.parse(fs.readFileSync(path.join(__dirname, '../Library.xml'), 'utf8'))
const playlist = library.Playlists[0]['Playlist Items']

app.use(function (req, res, next) {
  console.log('Request URL!: ', req.originalUrl)
  next()
})

app.use('/karaoke', express.static('dist'))

app.get('/karaoke/api/library', function (req, res) {
  res.json(library)
})

app.get('/karaoke/api/playlist', (req, res) => {
  res.json(playlist)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
