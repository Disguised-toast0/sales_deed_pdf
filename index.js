const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const pdf = require('html-pdf');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', (req, res) => {
  const data = req.body;
  res.render('result', { data });
});

app.post('/generate-pdf', (req, res) => {
  const data = req.body;
  ejs.renderFile(__dirname + '/views/template.ejs', { data }, (err, html) => {
    if (err) return res.send('Error generating PDF template');

    pdf.create(html).toBuffer((err, buffer) => {
      if (err) return res.send('Error generating PDF');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=sale-deed.pdf');
      res.send(buffer);
    });
  });
});

app.listen(3000, () => console.log('Server starts on http://localhost:3000'));
