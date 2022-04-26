import { data } from '../.data/loc';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as R from 'ramda';

const rq = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

console.time('xxx');
const listPostId = data.map((d: any) => d._id);
const firstTenIds = listPostId.slice(0, 10);
console.timeEnd('xxx');

const chunkedListId = R.splitEvery(1500, listPostId);

(async function crawl(): Promise<void> {
  console.time('yyyy');
  let buffer = [];
  const crawlByChunk = async (
    chunkIds: Array<string>,
  ): Promise<Array<any[]>> => {
    return await Promise.all(
      chunkIds.map(async (id: string) => {
        const post = await rq.get(`https://sosmap.net/api/posts/${id}`);
        return post.data;
      }),
    );
  };

  let count = 0;
  console.log(`Crawling ${chunkedListId.length} number of chunks`);
  for (const chunks of chunkedListId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`crawl chunk ${count}: `);
    const res = await crawlByChunk(chunks);
    buffer = [...buffer, ...res];
    console.log(`crawl chunk ${count} done, sleeping...`);
    count = count + 1;
  }

  console.log('Crawl done, parsing data to file...');
  fs.writeFileSync(`${__dirname}/../.data/posts1.json`, JSON.stringify(buffer));
  console.log('Done !!!');
  console.timeEnd('yyyy');
})();
