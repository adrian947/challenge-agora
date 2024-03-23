import { Request, Response } from 'express';
import { postsService } from '../../services/postService';
import NodeCache from 'node-cache';
import { buildLogger } from '../../plugins/logger.plugin';
import { ObjectId } from 'mongodb';
const cache = new NodeCache();
const logger = buildLogger('postController.ts')

export const findAllPostController = async (req: Request, res: Response) => {
    try {
        const { page, order } = req.query;

        const cacheKey = `allPosts_${page}_${order}`;

        const cachedPosts = cache.get('cacheKey');
        if (cachedPosts) {
            return res.status(200).json(cachedPosts);
        }
        const service = await postsService();
        const posts = await service.getAll(Number(page), order as string);
        cache.set(cacheKey, posts, 60);
        res.status(200).json(posts);
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error fetching all posts.' });
    }
};

export const findPostByIdController = async (req: Request, res: Response) => {
    try {

        const cachedPost = cache.get('post');
        if (cachedPost) {
            return res.status(200).json(cachedPost);
        }

        const postId = req.params.id;
        const service = await postsService();
        const postIdObject = new ObjectId(postId);
        const post = await service.findPostById(postIdObject);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        cache.set('post', post, 60);
        res.status(200).json(post);
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error fetching post by id.' });
    }
};

export const createPostController = async (req: Request, res: Response) => {
    const { user } = req
    const { quote } = req.body
    try {
        const service = await postsService();
        const post = await service.createPost(quote, user._id);
        if (!post) {
            throw new Error('Error create post')
        }
        const postFind = await service.findPostById(post.insertedId);
        res.status(200).json(postFind);
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error create post.' });
    }
}

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quote } = req.body;

        if (!id || !quote) {
            return res.status(400).json({ error: 'Missing postId or quote in request.' });
        }
        const postIdObject = new ObjectId(id);
        const service = await postsService();
        const result = await service.updatePost(postIdObject, quote);

        if (result && result.modifiedCount === 1) {
            const postFind = await service.findPostById(postIdObject);
            res.status(200).json(postFind);
        } else {
            return res.status(404).json({ error: 'Post not found or not updated.' });
        }
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing postId in request.' });
        }
        const postIdObject = new ObjectId(id);
        const service = await postsService();
        const result = await service.deletePost(postIdObject);
        
        if (result && result.deletedCount === 1) {
            return res.status(200).json({ message: `Post ${id} deleted successfully.` });
        } else {
            return res.status(404).json({ error: 'Post not found or not deleted.' });
        }
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ error: 'Internal server error.' });
    }
};