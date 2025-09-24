import { Router } from "express";
import { multipleImages } from "../utils/uplodFiles.js";
import { getVistors, visitorCheckIn, visitorCheckOut } from "../controllers/visitorsController.js";

export const visitorsRouter = Router();

visitorsRouter.post('/visitor-checkIn',multipleImages,visitorCheckIn)
visitorsRouter.post('/visitor-checkOut',visitorCheckOut)
visitorsRouter.get('/visitors',getVistors)