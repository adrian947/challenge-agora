import { MongoClient, Db } from 'mongodb';
import { buildLogger } from '../plugins/logger.plugin';

const mongoUrl = process.env.URL_MONGO as string;
const dbName = 'ChallengePost';
const logger = buildLogger('configDB.ts')

class Database {
    private static instance: Database;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        this.client = new MongoClient(mongoUrl);
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connectToDatabase(): Promise<Db> {
        try {
            if (!this.db) {
                await this.client.connect();
                this.db = this.client.db(dbName);
                logger.info('MongoDB connected');
            }
            return this.db;
        } catch (error) {
            logger.error(`Error al conectar a MongoDB: ${error}`);
            throw error;
        }
    }
}

export const database = Database.getInstance();
