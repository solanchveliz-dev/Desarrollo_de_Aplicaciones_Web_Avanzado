import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

class PostService {
    async createPost(userId, postData) {
        const user = await userRepository.findById(userId);

        if (!user) throw new Error("Usuario no encontrado");

        return await postRepository.create({ ...postData, user: user._id });
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    async getUsers() {
        return await userRepository.findAll();
    }

    async getPost(postId) {
        return await postRepository.findById(postId);
    }

    async updatePost(postId, userId, postData) {
        const user = await userRepository.findById(userId);

        if (!user) throw new Error("Usuario no encontrado");

        const post = await postRepository.update(postId, {
            ...postData,
            user: user._id
        });

        if (!post) throw new Error("Post no encontrado");

        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.delete(postId);

        if (!post) throw new Error("Post no encontrado");

        return post;
    }
}

export default new PostService();
