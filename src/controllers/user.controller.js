import User from "../models/user.model.js";

const handleMongoError = (error, res) => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(409).json({
            message: `${field} already exists`
        });
    }

    return res.status(400).json({
        message: error.message
    });
};

export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ data: user });
    } catch (error) {
        handleMongoError(error, res);
    }
};

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const total = await User.countDocuments(searchQuery);

        const users = await User.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        res.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json({ data: user });
    } catch {
        res.status(400).json({ message: "Invalid ID" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({ message: "User not found" });

        res.json({ data: updated });
    } catch (error) {
        handleMongoError(error, res);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "User not found" });

        res.json({ data: null });
    } catch {
        res.status(400).json({ message: "Invalid ID" });
    }
};