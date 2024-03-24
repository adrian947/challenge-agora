import {
    findAllPostController,
    findPostByIdController,
    createPostController,
    deletePostController,
    updatePostController
} from '../controllers/posts/postController'
import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { validateQueryParams } from '../validations/postFindAll.validation';
import { validateCreateUpdatePostData } from '../validations/createUpdatePost.validation';
import { validateMongoId } from '../validations/paramMongoId.validation';
const postsRouter = express.Router();

postsRouter.get('/posts', checkAuth, validateQueryParams, findAllPostController);
postsRouter.get('/posts/:id', checkAuth,validateMongoId, findPostByIdController);
postsRouter.post('/posts', checkAuth, validateCreateUpdatePostData, createPostController);
postsRouter.patch('/posts/:id', checkAuth, validateMongoId, validateCreateUpdatePostData, updatePostController);
postsRouter.delete('/posts/:id', checkAuth, validateMongoId, deletePostController);

export default postsRouter;