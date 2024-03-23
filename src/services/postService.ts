import { Collection, DeleteResult, Document, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { connectToDatabase } from "../config/configDB";

interface Post {
    _id?: ObjectId;
    quote: string;    
    user_id: ObjectId;
    date: Date;
}

interface PostsService {
    getAll: (page: number, order: string) => Promise<Document[]>;
    findPostById: (postId: ObjectId) => Promise<Document | null>;
    createPost: (quote: string, userId: string) => Promise<InsertOneResult | null>;
    updatePost: (postId: ObjectId, updatedQuote: string) => Promise<UpdateResult | null>;
    deletePost: (postId: ObjectId) => Promise<DeleteResult | null>;
}

export const postsService = async (): Promise<PostsService> => {
    const db = await connectToDatabase();
    const postsCollection: Collection = db.collection('posts');
    
    return {
        getAll: async (page: number, order: string): Promise<Document[]> => {
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

                return posts;
            } catch (error) {
                throw new Error('Error fetching all posts.');
            }
        },
        findPostById: async (postId: ObjectId): Promise<Document | null> => {
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
                        }
                    }
                ]).toArray();

                return post.length > 0 ? post[0] : null;
            } catch (error) {
                throw new Error('Error fetching post by id.');
            }
        },
        createPost: async (quote: string, userId: string): Promise<InsertOneResult | null> => {
            try {
                const newPost: Post = {                    
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
        updatePost: async (postId: ObjectId, updatedQuote: string): Promise<UpdateResult> => {
            try {                
                const result = await postsCollection.updateOne(
                    { _id: postId },
                    { $set: { quote: updatedQuote } }
                );
                return result;
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
