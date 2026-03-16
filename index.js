const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/tours', (req,res) => {
   res.send("danh sachhh tour")
})
app.get('/cart', (req,res) => {
   console.log("vao trang cart")
   res.send("giooo hang")
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
