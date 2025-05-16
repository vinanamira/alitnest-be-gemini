import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ status: "FAILED", message: "Nama tidak boleh kosong!" });
        }
        if (!email || typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({ status: "FAILED", message: "Email tidak boleh kosong!" });
        }
        if (!password || typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ status: "FAILED", message: "Password tidak boleh kosong!" });
        }

        name = name.trim();
        email = email.trim();
        password = password.trim();

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return res.json({ status: "FAILED", message: "Nama tidak valid!" });
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.json({ status: "FAILED", message: "Email tidak valid!" });
        }
        if (password.length < 8) {
            return res.json({ status: "FAILED", message: "Password terlalu singkat!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: "FAILED", message: "Email sudah terdaftar!" });
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword });
        const result = await newUser.save();

        res.status(201).json({ status: "SUCCESS", message: "Pendaftaran Berhasil!", data: result });
    } catch (err) {
        res.status(500).json({ status: "FAILED", message: "Error saat pendaftaran!", error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({ status: "FAILED", message: "Email tidak boleh kosong!" });
        }
        if (!password || typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ status: "FAILED", message: "Password tidak boleh kosong!" });
        }

        email = email.trim();
        password = password.trim();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "Email tidak terdaftar" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "FAILED", message: "Password Salah!" });
        }
        
        res.json({ status: "SUCCESS", message: "Login Berhasil", data: user });
    } catch (err) {
        res.status(500).json({ status: "FAILED", message: "Error saat login", error: err.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                status: "FAILED", 
                message: "Pengguna tidak ditemukan" 
            });
        }
        
        res.status(200).json({
            status: "SUCCESS",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: "FAILED", 
            message: "Gagal mengambil data profil",
            error: error.message 
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Nama tidak boleh kosong!" 
            });
        }

        if (!email || typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Email tidak boleh kosong!" 
            });
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Email tidak valid!" 
            });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(409).json({ 
                status: "FAILED", 
                message: "Email sudah digunakan oleh pengguna lain!" 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                email: email.trim(),
                phone: phone || '',
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                status: "FAILED", 
                message: "Pengguna tidak ditemukan" 
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Profil berhasil diperbarui",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone
            }
        });

    } catch (error) {
        res.status(500).json({ 
            status: "FAILED", 
            message: "Gagal memperbarui profil",
            error: error.message 
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || typeof currentPassword !== "string" || currentPassword.trim() === "") {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Password saat ini wajib diisi!" 
            });
        }

        if (!newPassword || typeof newPassword !== "string" || newPassword.trim() === "") {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Password baru wajib diisi!" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                status: "FAILED", 
                message: "Password baru minimal 8 karakter!" 
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                status: "FAILED", 
                message: "Pengguna tidak ditemukan" 
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                status: "FAILED", 
                message: "Password saat ini salah!" 
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({
            status: "SUCCESS",
            message: "Password berhasil diperbarui"
        });

    } catch (error) {
        res.status(500).json({ 
            status: "FAILED", 
            message: "Gagal memperbarui password",
            error: error.message 
        });
    }
};

export default {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    updatePassword    
};