const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

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

app.post('/generate-pdf', async (req, res) => {
  const data = req.body;
  try {
    const html = await ejs.renderFile(__dirname + '/views/template.ejs', { data });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();


    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=sale-deed.pdf'
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating PDF:', err);
    res.send('Error generating PDF');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
