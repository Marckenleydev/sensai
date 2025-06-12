import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";

import { clerkMiddleware} from '@clerk/express';
import userRoute from "./routes/user";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client";
import { generateIndustryInsights } from "./inngest/function";


dotenv.config();
const app = express();
// Clerk middleware (should be after other middleware but before routes)
app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY as string,
  publishableKey:process.env.CLERK_PUBLISHABLE_KEY as string,
}));
// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// Routes
app.use("/user", userRoute);


app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("healthy");
});

app.use("/api/inngest", serve({
  client: inngest,
  functions: [generateIndustryInsights],
}));


const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

