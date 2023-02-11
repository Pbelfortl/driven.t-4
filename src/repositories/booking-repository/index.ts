import { prisma } from "@/config";


async function getBooking (userId: number) {

    const booking = await prisma.booking.findFirst({
        where: {
            userId
        }
    })
    return booking
}

async function createBooking (userId: number, roomId:number) {

    const booking = await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
    return booking
}

async function changeBooking (userId: number, roomId: number) {

    const {id} = await prisma.booking.findFirst({
        where: {
            userId
        }
    })

    const booking = await prisma.booking.update({
        data:{
            userId,
            roomId
        },
        where: {
            id
        }
    })

    return booking
}

async function getBookingsByRoomId (roomId: number) {

    return await prisma.booking.findMany({
        where:{
            roomId
        }
    })
}


const bookingRepository = {
    getBooking,
    createBooking,
    changeBooking,
    getBookingsByRoomId
}

export default bookingRepository