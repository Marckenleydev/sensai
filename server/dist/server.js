"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_2 = require("@clerk/express");
const user_1 = __importDefault(require("./routes/user"));
const express_3 = require("inngest/express");
const client_1 = require("./inngest/client");
const function_1 = require("./inngest/function");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Clerk middleware (should be after other middleware but before routes)
app.use((0, express_2.clerkMiddleware)({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));
// Middleware setup
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// Routes
app.use("/user", user_1.default);
app.get("/", (req, res) => {
    res.send("Hello welcome to the foodOrder");
});
app.use("/api/inngest", (0, express_3.serve)({
    client: client_1.inngest,
    functions: [function_1.generateIndustryInsights],
}));
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
