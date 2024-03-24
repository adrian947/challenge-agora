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

        const postId = req.params.id;
        const cacheKey = `post_${postId}`;

        const cachedPosts = cache.get('cacheKey');
        if (cachedPosts) {
            return res.status(200).json(cachedPosts);
        }

        const service = await postsService();
        const postIdObject = new ObjectId(postId);
        const post = await service.findPostById(postIdObject);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        cache.set(cacheKey, post, 60);
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

        const postIdObject = new ObjectId(id);
        const service = await postsService();
        const postFind = await service.findPostById(postIdObject);

        if (!postFind) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (req.user._id.toString() !== postFind.user._id.toString()) {
            return res.status(400).json({ error: "You are not the author of this post" });
        }

        const result = await service.updatePost(postIdObject, quote);

        res.status(200).json({ ...result, user: req.user });
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
      
        const postIdObject = new ObjectId(id);
        const service = await postsService();

        const postFind = await service.findPostById(postIdObject);

        if (!postFind) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (req.user._id.toString() !== postFind.user._id.toString()) {
            return res.status(400).json({ error: "You are not the author of this post" });
        }
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