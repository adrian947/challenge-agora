import { findAllPostController, findPostByIdController } from '../controllers/posts/postController'
import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
const postsRouter = express.Router();

postsRouter.get('/posts', checkAuth ,findAllPostController);
postsRouter.get('/posts/:id', checkAuth, findPostByIdController);

export default postsRouter;