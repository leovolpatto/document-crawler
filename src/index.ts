import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import "reflect-metadata";
import {Crawler} from './crawler';

dotenv.config();

const crawler = new Crawler();

const app = express();
app.get('/', function (req: any, res: any) {
  
  const x = {
    djow:"Diego's crawler is up...",
    currentDoc: crawler.currentDoc,
    startedFrom: crawler.startFrom,
    crawlingUntil: crawler.crawlUntil,
    history: crawler.status.sort((a, b) => {
      if(a.doc < b.doc){
        return -1;
      }
      if(a.doc > b.doc){
        return 1;
      }

      return 0;
    })
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
