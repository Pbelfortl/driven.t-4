import { changeRoom, createBooking, getBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";



const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", createBooking)
    .put("/:bookingId", changeRoom)

export {bookingRouter}