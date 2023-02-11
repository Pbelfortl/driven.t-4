import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import httpStatus, { FORBIDDEN } from "http-status";



export async function getBooking (req: AuthenticatedRequest, res: Response) {

    const {userId} = req

    try {

        const booking =  await bookingService.getBooking(Number(userId))

        res.status(200).send(booking)

    } catch (error) {

        console.log(error)
        return res.sendStatus(500)
    }
}

export async function createBooking (req: AuthenticatedRequest, res: Response) {

    const {roomId} = req.body
    const {userId} = req

    try {

        const booking = await bookingService.createBooking(Number(userId), Number(roomId))

        return res.status(200).send(booking.id)

    } catch (error) {

        if (error.name === "ForbiddenError"){
            return res.send(httpStatus.FORBIDDEN)
        }
        if (error.name === "NotFoundError"){
            return res.send(httpStatus.NOT_FOUND)
        }
        return res.sendStatus(403)
    }
}

export async function changeRoom (req: AuthenticatedRequest, res: Response) {

    const {userId} = req
    const {roomId} = req.body

    try {

        const booking = await bookingService.changeBooking(Number(userId), Number(roomId))

        return res.status(200).send(booking.id)

    } catch (error) {

        if (error.name === "ForbiddenError"){
            return res.send(httpStatus.FORBIDDEN)
        }
        if (error.name === "NotFoundError"){
            return res.send(httpStatus.NOT_FOUND)
        }
        res.sendStatus(403)
    }
}