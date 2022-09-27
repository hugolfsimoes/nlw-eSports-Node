import express from 'express';

const app = express();

app.get('/ads', (req, res) => {
  return res.json([
    {
      id: 1,
      nome: 'anuncio1'
    },
    {
      id: 2,
      nome: 'anuncio2'
    },
    {
      id: 3,
      nome: 'anuncio3'
    },
    {
      id: 4,
      nome: 'anuncio4'
    },
    {
      id: 5,
      nome: 'anuncio5'
    }
  ]);
});

app.listen(3333);