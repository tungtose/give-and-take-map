import getCollection from './connectDB';
import { Writable } from 'stream';
const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const jsonStream = StreamArray.withParser();
const file = `${__dirname}/../.data/posts.json`;
import { Types } from 'mongoose';

async function action() {
  const postCollection = await getCollection('posts');

  const fileStream = fs.createReadStream(file);

  const processingStream = new Writable({
    write({ key, value }, encoding, callback) {
      //Save to mongo or do any other async actions
      value._id = new Types.ObjectId(value._id);
      postCollection.insertOne(value);

      setTimeout(() => {
        console.log(value);
        callback();
      }, 10);
    },
    objectMode: true,
  });

  fileStream.pipe(jsonStream);
  jsonStream.pipe(processingStream);
}

async function action1() {
  const locCollection = await getCollection('locs');
  const { data } = require('../.data/loc');

  for (const d of data) {
    await locCollection.insertOne(d);
    console.log('insert success', d);
  }
}

async function getAllPosts() {
  console.time('xxx');
  const locCollection = await getCollection('posts');
  const data = await locCollection.find({}).toArray();
  console.log(data.length);
  console.timeEnd('xxx');
}

action();
// getAllPosts();
