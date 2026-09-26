import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./src/db/database.js";
import homeRoutes from "./src/routes/home.routes.js";
import postRoutes from "./src/routes/post.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/", homeRoutes);
app.use("/posts", postRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("No se pudo conectar a MongoDB:", error.message);
    });
