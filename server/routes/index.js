module.exports = (app) => {
  app.get('/api', (req, res) => res.json({ data: 'Testing Data' }))
}