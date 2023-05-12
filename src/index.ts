import http from 'http';
import express from 'express';
import {router} from "./routes/routes"
require('dotenv').config();


const exp = express();
exp.use(express.json());
exp.use("/",router);

const httpServer = http.createServer(exp);
const PORT: any = process.env.PORT || 8190;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));