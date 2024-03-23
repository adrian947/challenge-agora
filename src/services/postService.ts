import { Collection, Document, ObjectId } from 'mongodb';
import { connectToDatabase } from "../config/configDB";

interface PostsService {
    getAll: () => Promise<Document[]>;
    findPostById: (postId: string) => Promise<Document | null>;
}

export const postsService = async (): Promise<PostsService> => {
    const db = await connectToDatabase();
    const postsCollection: Collection = db.collection('posts');
    const usersCollection: Collection = db.collection('users');

    return {
        getAll: async () => {
            try {                
                const posts = await postsCollection.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $project: {
                            _id: 1,
                            quote: 1,
                            date: 1,
                            'user._id': 1,
                            'user.name': 1,
                            'user.email': 1
                        }
                    }
                ]).toArray();

                return posts;
            } catch (error) {
                throw new Error('Error fetching all posts.');
            }
        },
        findPostById: async (postId: string) => {
            try {
                const post = await postsCollection.aggregate([
                    {
                        $match: { _id: new ObjectId(postId) }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $project: {
                            _id: 0,
                            quote: 1,
                            date: 1,
                            'user.name': 1,
                            'user.email': 1
                            // Puedes agregar cualquier otro campo del usuario que desees incluir aquí, excluyendo el campo de contraseña
                        }
                    }
                ]).toArray();

                return post.length > 0 ? post[0] : null;
            } catch (error) {
                throw new Error('Error fetching post by id.');
            }
        }
    };
};
