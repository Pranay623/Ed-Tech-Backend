import express from 'express'
import { createPost, getAllPosts, deletePost, likeAndUnlikePost, getPostOfFollowing, commentOnPost, deleteComment } from '../controllers/post.js'
import {jwtAuthMiddleware} from "../middlewares/jwt.js"
const postRoutes = express.Router()

postRoutes.get('/posts', getAllPosts);
postRoutes.post('/posts/create', createPost);
postRoutes.delete('/posts/:id', deletePost);
postRoutes.post('/post/:id', likeAndUnlikePost);
postRoutes.get('/post/following', getPostOfFollowing);
postRoutes.put('/post/comment/:id', commentOnPost); 
postRoutes.delete('/post/comment/:id', deleteComment);

export default postRoutes