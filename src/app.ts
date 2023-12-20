import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AuthRoute } from "./app/modules/auth/auth.route";
import { StartupRoute } from "./app/modules/startup/startup.route";
const app: Application = express();

const corsOptions = {
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/startups", StartupRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",

    errorMessage: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });

  next();
});

export default app;
