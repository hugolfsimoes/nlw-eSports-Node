import express, { response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import convertHourStringToMinutes from './utils/convert-hour-string-to-minutes';
import convertMinutesToHoursString from './utils/convert-minutes-to-hour-string';

const app = express();
app.use(express.json());
app.use(cors());
const prisma = new PrismaClient({
  log: [ 'query' ]
});

app.get('/games', async (_req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          Ads: true
        }
      }
    }
  });
  return res.json(games);
});


app.post('/games/:id/ads', async (req, res) => {
  const gameId: string = req.params.id;
  const body = req.body;
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hoursStart: convertHourStringToMinutes(body.hoursStart),
      hoursEnd: convertHourStringToMinutes(body.hoursEnd),
      useVoiceChannel: body.useVoiceChannel
    }
  });
  return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      yearsPlaying: true,
      useVoiceChannel: true,
      hoursStart: true,
      hoursEnd: true
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return res.json(ads.map((ad) => {
    return {
      ...ads,
      weekDays: ad.weekDays.split(','),
      hoursStart: convertMinutesToHoursString(ad.hoursStart),
      hoursEnd: convertMinutesToHoursString(ad.hoursEnd)
    };
  }));
});

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: { id: adId },
  });
  return res.json({ discord: ad.discord });
});

app.listen(3333);