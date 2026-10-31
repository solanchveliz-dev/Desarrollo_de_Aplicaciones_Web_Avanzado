import User from "../models/User.js";

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findAll() {
        return await User.find();
    }

    async findById(userId) {
        return await User.findById(userId);
    }

    async createTestUser() {
        const email = "naomi@tecsup.edu.pe";
        const existingUser = await User.findOne({ email });

        if (existingUser) return existingUser;

        return await this.create({
            name: "Naomi",
            lastName: "Veliz",
            email,
            age: 18,
            phoneNumber: "999999999",
            password: "12345678"
        });
    }
}

export default new UserRepository();
