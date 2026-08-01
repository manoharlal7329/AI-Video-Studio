"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files (Generated videos) from temp directory
// __dirname is src/
app.use('/temp', express_1.default.static(path_1.default.join(__dirname, '../temp')));
// Health API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Video APIs
app.use('/api/videos', videoRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: err.toString()
    });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server is running on http://127.0.0.1:${PORT}`);
});
//# sourceMappingURL=index.js.map