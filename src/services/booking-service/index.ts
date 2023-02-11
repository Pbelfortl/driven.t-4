import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { FORBIDDEN } from "http-status";


export async function getBooking (userId: number){

    const booking = bookingRepository.getBooking(userId)

    if(!booking) {
        throw notFoundError()
    }

    return booking
}

export async function createBooking (userId: number, roomId: number) {
    
    const room = await hotelRepository.getRoom(roomId)
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    const checkBooking = await bookingRepository.getBookingsByRoomId(roomId)

    if (!room) {
        throw notFoundError()
    }

    if (ticket.status !== "PAID") {
        throw forbiddenError("Ticket not paid")
    }

    if (ticket.TicketType.includesHotel !== true || ticket.TicketType.isRemote === true){
        throw forbiddenError("Ticket does not includes hotel")
    }

    if (checkBooking.length >= room.capacity) {
        throw forbiddenError("Room capacity full. Please, pick another room")
    }

    return await bookingRepository.createBooking(userId, roomId)
}

async function changeBooking (userId: number, roomId: number) {

    const room = await hotelRepository.getRoom(roomId)
    const booking = await bookingRepository.getBooking(userId)
    const checkBooking = await bookingRepository.getBookingsByRoomId(roomId)


    if (!room || !booking) {
        throw notFoundError()
    }

    if (checkBooking.length >= room.capacity) {
        throw forbiddenError("Room capacity full. Please, pick another room")
    }

    return await bookingRepository.changeBooking(userId, roomId)
}

const bookingService = {
    getBooking,
    createBooking,
    changeBooking
}

export default bookingService