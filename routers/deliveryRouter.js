import { Router } from "express";
import { delivery, getDelivery } from "../controllers/deliveryController.js";


export const deliveryRouter = Router();

deliveryRouter.post('/delivery',delivery)
deliveryRouter.get('/delivery-all',getDelivery)