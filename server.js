"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!data) {
            console.error('data.json is empty or does not exist');
            return res.status(404).json({ error: 'Data not found' });
        }
        const tableData = JSON.parse(data);
        res.json(tableData);
    });
});
app.put('/api/data/user', (req, res) => {
    const { name, language, month, accept } = req.body;
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!data) {
            console.error('data.json is empty or does not exist');
            return res.status(404).json({ error: 'Data not found' });
        }
        const tableData = JSON.parse(data);
        const userIndex = tableData.users.findIndex((user) => user.name === name);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        tableData.users[userIndex] = Object.assign(Object.assign({}, tableData.users[userIndex]), { language,
            month,
            accept });
        fs.writeFile('data.json', JSON.stringify(tableData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing data to data.json:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'Data updated successfully' });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
