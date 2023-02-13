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
        if (error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}

export async function createBooking (req: AuthenticatedRequest, res: Response) {

    const {roomId} = req.body
    const {userId} = req

    try {

        const booking = await bookingService.createBooking(Number(userId), Number(roomId))

        return res.status(httpStatus.OK).send({bookingId: booking.id})

    } catch (error) {
        if (error.name === "ForbiddenError"){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        if (error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        return res.sendStatus(403)
    }
}

export async function changeRoom (req: AuthenticatedRequest, res: Response) {

    const {userId} = req
    const {roomId} = req.body

    try {

        const booking = await bookingService.changeBooking(Number(userId), Number(roomId))

        return res.status(200).send({bookingId: booking.id})

    } catch (error) {

        if (error.name === "ForbiddenError"){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        if (error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        res.sendStatus(httpStatus.FORBIDDEN)
    }
}