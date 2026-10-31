import postService from "../services/postService.js";

class PostController {
    async create(req, res) {
        try {
            const { userId, hashtags, ...postData } = req.body;
            postData.hashtags = parseHashtags(hashtags);
            const post = await postService.createPost(userId, postData);
            res.redirect("/posts");
        } catch (error) {
            const users = await postService.getUsers();
            res.status(400).render("post-form", {
                post: req.body,
                users,
                action: "/posts",
                selectedUserId: req.body.userId,
                error: getValidationMessage(error)
            });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            console.log(posts);
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showNew(req, res) {
        try {
            const users = await postService.getUsers();
            res.render("post-form", { post: null, users, action: "/posts" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showEdit(req, res) {
        try {
            const post = await postService.getPost(req.params.id);
            const users = await postService.getUsers();

            if (!post) return res.status(404).send("Post no encontrado");

            res.render("post-form", {
                post,
                users,
                action: `/posts/${post._id}/edit`,
                selectedUserId: post.user?._id?.toString()
            });
        } catch (error) {
            res.status(400).send(getValidationMessage(error));
        }
    }

    async update(req, res) {
        try {
            const { userId, hashtags, ...postData } = req.body;
            postData.hashtags = parseHashtags(hashtags);
            const post = await postService.updatePost(req.params.id, userId, postData);
            res.redirect("/posts");
        } catch (error) {
            const [post, users] = await Promise.all([
                postService.getPost(req.params.id),
                postService.getUsers()
            ]);
            res.status(400).render("post-form", {
                post: { ...post?.toObject(), ...req.body },
                users,
                action: `/posts/${req.params.id}/edit`,
                selectedUserId: req.body.userId,
                error: getValidationMessage(error)
            });
        }
    }

    async delete(req, res) {
        try {
            await postService.deletePost(req.params.id);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

function parseHashtags(hashtags) {
    return hashtags
        ? hashtags.split(",").map((hashtag) => hashtag.trim()).filter(Boolean)
        : [];
}

function getValidationMessage(error) {
    if (error.name === "ValidationError") {
        return Object.values(error.errors).map((item) => item.message).join(" ");
    }

    return error.message || "No se pudo completar la operación.";
}

export default new PostController();
