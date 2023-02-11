import { prisma } from "@/config";

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

async function getRoom (roomId: number) {

  return await prisma.room.findFirst({
    where: {
      id: roomId
    }
  })

}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  getRoom
};

export default hotelRepository;
