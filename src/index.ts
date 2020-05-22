import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import "reflect-metadata";
import {Crawler} from './crawler';

dotenv.config();

const crawler = new Crawler();

const app = express();
app.use('/cv', express.static(__dirname + '/cvs'));
app.use('/cv', express.static(__dirname + '/dist/cvs'));
app.use('/cv', express.static('cvs'));
app.use('/cv', express.static('dist/cvs'));
app.get('/', function (req: any, res: any) {
  
  const hs = [...crawler.status].reverse();

  const x = {
    djow:"Diego's crawler is up...",
    currentDoc: crawler.currentDoc,
    startedFrom: crawler.startFrom,
    crawlingUntil: crawler.crawlUntil,
    history: hs
  }

  res.json(x);
});

const PORT = 4441;
const httpServer = createServer(app);
httpServer.listen({
  port: PORT
}, (): void => {

  crawler.start();
  console.log(`Running at http://127.0.0.1:${PORT}/`);
});
