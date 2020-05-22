import axios, { AxiosResponse } from 'axios';
import fs, { WriteStream } from 'fs';
import * as path from 'path';
import { IncomingMessage } from 'http';

export class Crawler {

    public status: Array<any>  = [];
    public startFrom = 1;
    public crawlUntil = 60000;    
    public currentDoc = 0;

    private putStatus(doc: number, status: string, details: any = null){
        this.status.push({
            date: Date.now(),
            doc: doc,
            status: status,
            details: details
        });
    }

    public async start() {
        try {
            const baseUrl = process.env.BASE_URL;
            for (let i = this.startFrom; i < this.crawlUntil; i++) {
                this.currentDoc = i;
                try {                    
                    const r = await this.fetch(i.toString(), `${baseUrl}${i}`);
                    if (r != null) {
                        console.info(r);
                        this.putStatus(i, r);
                    }
                }
                catch (e) {
                    console.error(i, e);
                    this.putStatus(i, e.getMessage());
                }
            }
        }
        catch (e) {
            console.error(e);
            this.putStatus(0, "Fatal error. Stopping.", e.getMessage());
        }
    }

    private async createFile(im: IncomingMessage, name: string): Promise<string> {
        try {
            const dst = path.resolve(__dirname, 'cvs', `${name}.pdf`);
            const writer: WriteStream = fs.createWriteStream(dst, {
                autoClose: true
            });
            im.pipe(writer);

            return new Promise<string>((resolve, reject) => {
                writer.on('finish', () => {
                    resolve(`${name}: OK`);
                });
                writer.on('error', (e) => {
                    reject(`${name}: Fail`);
                });
            })
        }
        catch (e) {            
            return `${name}: Fail creating file -> ${e.getMessage()}`;
        }
    }

    private async handleResponse(response: AxiosResponse<any>, url: string, name: string): Promise<string> {
        const im: IncomingMessage = response.data;

        if (!(response.data instanceof IncomingMessage)) {
            im.destroy();
            return `Unknown response: ${url}`;
        }

        if (im.headers["content-type"].startsWith("text/html")) {
            im.destroy();
            return `${name}: Not a file: ${url}`;
        }

        return this.createFile(im, name);
    }

    private async fetch(name: string, url: string): Promise<any> {
        try {
            const response = await axios.get(url, {
                responseType: "stream"
            });
            
            const handleRes = this.handleResponse(response, url, name);
            return handleRes;
        }
        catch (e) {
            //ETIMEDOUT
            return `${name}: ${e.getMessage()}`;
        }
    }

}