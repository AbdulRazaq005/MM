import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./backend/config/dbConfig.js";
import cookieParser from "cookie-parser";
import {
  notFound,
  errorHandler,
} from "./backend/middleware/errorMiddleware.js";
import userRoutes from "./backend/routes/userRoutes.js";
import projectRoutes from "./backend/routes/projectRoutes.js";
import contactRoutes from "./backend/routes/contactRoutes.js";
import transactionRoutes from "./backend/routes/transactionRoutes.js";
import fs from "fs";

dotenv.config();
connectDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/transactions", transactionRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  // app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    // needed to send static files to handle reloads on paths other than root path
    if (req.url.includes("/static/")) {
      // this block is for sending react-build js and css files
      var filePath = path.resolve(
        __dirname,
        "frontend",
        "dist",
        "static",
        req.url.split("/static/").pop()
      );
      var exist = fs.existsSync(filePath);
      res.sendFile(filePath);
    } else {
      // this block is for sending any other static asstes like favicon, images,... if they exist
      var filePath = path.resolve(
        __dirname,
        "frontend",
        "dist",
        req.url.split("/").pop()
      );
      if (req.url !== "/" && fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    }
    // res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
