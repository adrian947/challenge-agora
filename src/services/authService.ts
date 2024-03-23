import { Collection, ObjectId } from 'mongodb';
import { database } from "../config/configDB";

interface User {
    _id: ObjectId;
    username: string;
    password: string;
}

export const authService = async () => {
    const db = await database.connectToDatabase();
    const usersCollection: Collection<User> = db.collection<User>('users');

    return {
        getUserByUsername: async (email: string): Promise<User | null> => {
            try {
                if (!email) return null;
                const user = await usersCollection.findOne({ email });
                return user;
            } catch (error) {
                throw new Error('Error fetching user by username.');
            }
        },
        getUserById: async (userId: string): Promise<User | null> => {
            try {
                const query = { _id: new ObjectId(userId) };
                const user = await usersCollection.findOne(query);
                return user;
            } catch (error) {
                throw new Error('Error fetching user by id.');
            }
        }
    };
};
