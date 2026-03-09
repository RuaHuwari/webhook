import express from "express";
import authRoutes from "./routes/authRoutes.js";
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
