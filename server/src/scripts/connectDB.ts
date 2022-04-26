import { MongoClient } from 'mongodb';

export let mongoClient: MongoClient;

async function getDB() {
  try {
    const MONGO_URL = 'mongodb://localhost:1234/thesis';
    if (!MONGO_URL) throw new Error('Not found DB connection string!');
    console.log(MONGO_URL);
    if (!mongoClient) {
      mongoClient = new MongoClient(MONGO_URL);
      await mongoClient.connect();
    }

    return mongoClient.db();
  } catch (error) {
    console.error(error);
  }
}

type CitronCollectionName = 'posts' | 'locs';

async function getCollection(collectionName: CitronCollectionName) {
  try {
    const db = await getDB();
    if (!db) throw new Error('Cannot connect to DB');

    const collection = db.collection(collectionName);

    console.log(`Get collection ${collectionName} success!`);

    return collection;
  } catch (error) {
    console.error(error);
    throw new Error('Can not connect to DB');
  }
}

export default getCollection;
