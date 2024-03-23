import { Request, Response } from 'express';
import { postsService } from '../../services/postService';
import NodeCache from 'node-cache';
const cache = new NodeCache();

export const findAllPostController = async (req: Request, res: Response) => {
    try {
        const cachedPosts = cache.get('allPosts');
        if (cachedPosts) {
            return res.status(200).json(cachedPosts);
        }
        const service = await postsService();
        const posts = await service.getAll();
        cache.set('allPosts', posts, 60);
        res.status(200).json(posts);
    } catch (error) {
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
        const post = await service.findPostById(postId);
       
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        cache.set('post', post, 60);
        res.status(200).json(post);
    } catch (error) {        
        res.status(500).json({ error: 'Error fetching post by id.' });
    }
};