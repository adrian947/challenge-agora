import bcrypt from 'bcrypt';
import { database } from '../config/configDB';

export const seedService = async () => {
    try {
        const db = await database.connectToDatabase();
        const usersCollection = db.collection('users');
        const postsCollection = db.collection('posts');
        const usersCount = await usersCollection.countDocuments();
        
        if(usersCount !== 0){
            return 'Seeders already insert'
        }
        const usersToInsert = [
            { name: 'user1', email: 'user1@example.com', password: 'password1' },
            { name: 'user2', email: 'user2@example.com', password: 'password2' },
        ];

        for (const user of usersToInsert) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
        }

        const insertedUsers = await usersCollection.insertMany(usersToInsert);

        if (insertedUsers && insertedUsers.insertedCount === usersToInsert.length) {

            const postsToInsert = [];            
            const quotes = [
                "The only way to do great work is to love what you do.",
                "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                "Don't watch the clock; do what it does. Keep going.",
                "The only limit to our realization of tomorrow will be our doubts of today.",
                "Life is what happens when you're busy making other plans.",
                "In the end, it's not the years in your life that count. It's the life in your years.",
                "You only live once, but if you do it right, once is enough.",
                "The greatest glory in living lies not in never falling, but in rising every time we fall.",
                "The way to get started is to quit talking and begin doing.",
                "Your time is limited, don't waste it living someone else's life.s"
            ];

            for (let i = 1; i <= 9; i++) {
                const currentDate = new Date();
                const daysToAdd = Math.floor(Math.random() * 10); 
                currentDate.setDate(currentDate.getDate() + daysToAdd);
                const post = {
                    quote: quotes[i],
                    date: currentDate,
                    user_id: i > 5 ? insertedUsers.insertedIds[0] : insertedUsers.insertedIds[1],
                };
                postsToInsert.push(post);
            }
            
            await postsCollection.insertMany(postsToInsert);

            return 'Insert users and posts success';
        } else {
            throw new Error('Error insert users and posts');
        }
    } catch (error) {
        throw new Error('Error insert seeder user');
    }
}
