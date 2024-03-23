import { MongoClient, Db } from 'mongodb';

const mongoUrl = 'mongodb://mongodb:27017';
const client = new MongoClient(mongoUrl);
const dbName = 'ChallengePost';

export async function connectToDatabase(): Promise<Db> {
    try {

        await client.connect();
        const db = client.db(dbName);

        
        return db;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
    }
}
