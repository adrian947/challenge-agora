import { findAllPostController, findPostByIdController } from '../controllers/posts/postController'
import express from 'express';
const postsRouter = express.Router();

postsRouter.get('/posts', findAllPostController);
postsRouter.get('/posts/:id', findPostByIdController);

export default postsRouter;