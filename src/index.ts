import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import "reflect-metadata";
import {Crawler} from './crawler';

dotenv.config();

const crawler = new Crawler();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/sync', function (req: any, res: any) {
  //consumer.start();
});

app.get('/', function (req: any, res: any) {
  
  const x = {
    djow:"Diego's crawler is up...",
    currentDoc: crawler.currentDoc,
    startedFrom: crawler.startFrom,
    crawlingUntil: crawler.crawlUntil,
    history: crawler.status.reverse()
  }

  res.json(x);
});

const PORT = process.env.SERVER_LISTENING_PORT || 4446;
const httpServer = createServer(app);
httpServer.listen({
  port: PORT
}, (): void => {

  crawler.start();
  console.log(`Running at http://127.0.0.1:${PORT}/`);
});
