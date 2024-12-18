import postModel from '../models/post.js';

// Create a New Post
export const createPost = async (req, res) => {
    try {
        const { caption,owner, tags } = req.body;  
        const newPost = new postModel({
            caption,
            owner,  
            tags: Array.isArray(tags) ? tags.join(", ") : tags,
        });

        await newPost.save();

        res.status(200).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const deletePost = async (req, res) => {
    try {
        console.log("Delete post route hit");

        // Find the post by ID
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if the logged-in user is the owner of the post
        if (post.owner.toString() !== req.body.owner.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Delete the post
        await post.deleteOne();

        // Find the user and remove the post ID from their posts array
        const user = await userModel.findById(req.body.owner);
        if (user) {
            const index = user.posts.indexOf(req.params.id);
            if (index !== -1) {
                user.posts.splice(index, 1);
                await user.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const { exam } = req.query;

        let filter = {};

        if (exam) {
            filter.tags = { $in: [exam] };
        }

        const posts = await postModel.find(filter)
            .populate("owner", "userName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



export const likeAndUnlikePost = async(req, res)=>{
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        if(post.likes.includes(req.body.owner)){
            const index = post.likes.indexOf(req.body.owner);
            post.likes.splice(index, 1);
            await post.save();
            
            return res.status(200).json({
                success: true,
                message: "Post Unliked",
            });

        }

        else{
            post.likes.push(req.body.owner);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Liked",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getPostOfFollowing = async (req,res) => {
    try{

        const user= await userModel.findById(req.body.owner);
        const posts = await postModel.find({
            owner: {
                $in: user.following,
            },
        });

        res.status(200).json({
            success: true,
            posts,
            message: "found data",
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const commentOnPost = async(req,res) => {
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        let commentIndex = -1;
        post.comments.forEach((item, index) => {
            console.log(item);
            if(item.user.toString() === req.body.owner.toString()) {
                commentIndex = index;
            }
        });

        if(commentIndex !== -1){
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment updated",
            });
        }
        else{
            post.comments.push({
                user: req.body.owner,
                Comment: req.body.comment,
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment added",
            });
        }
    }catch(error){
        console.log("Error in commentOnPost:", error); 
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const deleteComment = async(req,res) => {
    try{
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        if(post.owner.toString()===req.body.owner.toString()){
            if (req.body.commentId==undefined){
                return res.status(404).json({
                    success: false,
                    message: "comment ID required",
                });
            }
            post.comments.forEach((item, index) => {
                if (item._id.toString()=== req.body.commentId.toString()){
                    return post.comments.splice(index,1);
                }
            });
            await post.save();

            res.status(200).json({
                success: true,
                message: "you deleted the comment"
            });
        }
        else{
            post.comments.forEach((item, index) => {
                console.log(item);
                if((item.user.toString()) === req.body.owner.toString()){
                    return post.comments.splice(index,1);
                }
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "your comment has been deleted"
            });
        }
    }catch(error){
        console.log("Error in commentOnPost:", error); 
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}