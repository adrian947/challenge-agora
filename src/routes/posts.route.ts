import {
    findAllPostController,
    findPostByIdController,
    createPostController,
    deletePostController,
    updatePostController
} from '../controllers/posts/postController'
import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
const postsRouter = express.Router();

postsRouter.get('/posts', checkAuth, findAllPostController);
postsRouter.get('/posts/:id', checkAuth, findPostByIdController);
postsRouter.post('/posts', checkAuth, createPostController);
postsRouter.patch('/posts/:id', checkAuth, updatePostController);
postsRouter.delete('/posts/:id', checkAuth, deletePostController);

export default postsRouter;