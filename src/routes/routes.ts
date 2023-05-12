import express from 'express';
//#Controllers-line 1
import {createDummy} from "../controller/controller"

const router = express.Router();

//#Routes-line
router.post("/create-dummy", createDummy);

export {router}
































