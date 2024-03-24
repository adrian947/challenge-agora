import { Collection, DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { database } from "../config/configDB";
import { User } from './authService';

interface Post {
    _id?: ObjectId;
    quote: string;    
    user_id: ObjectId;
    date: Date;
    user: User
}

interface PostsService {
    getAll: (page: number, order: string) => Promise<Post[] | []>;
    findPostById: (postId: ObjectId) => Promise<Post | null>;
    createPost: (quote: string, userId: string) => Promise<InsertOneResult | null>;
    updatePost: (postId: ObjectId, updatedQuote: string) => Promise<Post | null>;
    deletePost: (postId: ObjectId) => Promise<DeleteResult | null>;
}

export const postsService = async (): Promise<PostsService> => {
    const db = await database.connectToDatabase();
    const postsCollection: Collection = db.collection('posts');
    
    return {
        getAll: async (page: number, order: string): Promise<Post[] | []> => {
            const pageSize = 3; 
            const skip = (page - 1) * pageSize;             
            const sortOrder = order === 'asc' ? 1 : -1;
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
                    },
                    {
                        $sort: { date: sortOrder }
                    },
                    {
                        $skip: skip 
                    },
                    {
                        $limit: pageSize 
                    }
                ]).toArray();

                return posts as Post[];
            } catch (error) {
                throw new Error('Error fetching all posts.');
            }
        },
        findPostById: async (postId: ObjectId): Promise<Post | null> => {
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
                            'user._id': 1,
                            'user.name': 1,
                            'user.email': 1                            
                        }
                    }
                ]).toArray();

                return post.length > 0 ? post[0] as Post : null;
            } catch (error) {
                throw new Error('Error fetching post by id.');
            }
        },
        createPost: async (quote: string, userId: string): Promise<InsertOneResult | null> => {
            try {
                const newPost = {                    
                    quote,
                    user_id: new ObjectId(userId),                    
                    date: new Date(),
                };

                const result = await postsCollection.insertOne(newPost);
                if(result.acknowledged){
                    return result
                }
                return null
            } catch (error) {
                throw new Error('Error creating post.');
            }
        },
        updatePost: async (postId: ObjectId, updatedQuote: string): Promise<Post | null> => {
            try {                
                const result = await postsCollection.findOneAndUpdate(
                    { _id: postId },
                    { $set: { quote: updatedQuote } },
                    { returnDocument: 'after'}                     
                );

                if (!result) {
                    return null;
                }

                return result as Post;
            } catch (error) {
                throw new Error('Error updating post.');
            }
        },
        deletePost: async (postId: ObjectId): Promise<DeleteResult> => {
            try {                
                const result = await postsCollection.deleteOne({ _id: postId });
                return result;
            } catch (error) {
                throw new Error('Error deleting post.');
            }
        }
    };
};
