import supertest from "supertest";
import app, { init } from "@/app";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import jwt from "jsonwebtoken"
import {
    createUser, createEnrollmentWithAddress, createTicketTypeWithHotel, createTicket,
    createPayment, createHotel, createBooking, createRoomWithHotelId, createRoomWithoutCapacity
} from "../factories";
import httpStatus from "http-status"
import { TicketStatus } from "@prisma/client";


beforeAll(async () => {
    await init()
})

beforeEach(async () => {
    cleanDb
})

const server = supertest(app)

describe("GET /booking", () => {

    it("Should return 401 when no token is given", async () => {

        const response = await server.get("/booking")
        expect(response.status).toBe(401)
    })

    it("Should return 401 when given token is not valid", async () => {
        const token = faker.lorem.word();
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When token is valid", () => {

        it("Should respond with status 404 when user does not have a booking", async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);

        })

        it("Should respond with status 200 and user booking", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const room = await createRoomWithHotelId(createdHotel.id)
            const booking = await createBooking(user.id, room.id)

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(expect.objectContaining({
                id: booking.id,
                roomId: booking.roomId
            }))
        })
    })
})


describe("POST /bookings", () => {

    it("Should return 401 when no token is given", async () => {

        const response = await server.get("/booking")
        expect(response.status).toBe(401)
    })

    it("Should return 401 when given token is not valid", async () => {
        const token = faker.lorem.word();
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe ("When token is valid", () => {

        it("Should respond with 404 when roomId does not exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({roomId:0})

            expect(response.status).toBe(404)
        })
        
        it("Should respond with 403 when there is no vacancy", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithoutCapacity(createdHotel.id)

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({roomId:createdRoom.id})

            expect(response.status).toBe(403)
        })
    })
})

describe ("PUT /booking", () => {

    it("Should return 401 when no token is given", async () => {

        const response = await server.put("/booking/:0")
        expect(response.status).toBe(401)
    })

    it("Should return 401 when given token is not valid", async () => {
        const token = faker.lorem.word();
        const response = await server.put("/booking/:0").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put("/booking/:0").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe ("When token is valid", () => {

        it("Should respond with 404 when roomId does not exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id)
            const booking = await createBooking(user.id, createdRoom.id)

            const response = await server.put(`/booking/:${booking.id}`).set("Authorization", `Bearer ${token}`).send({roomId:0})

            expect(response.status).toBe(404)
        })
        
        it("Should respond with 403 when there is no vacancy", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithoutCapacity(createdHotel.id)
            const booking = await createBooking(user.id, createdRoom.id)

            const response = await server.put(`/booking/:${booking.id}`).set("Authorization", `Bearer ${token}`).send({roomId:createdRoom.id})

            expect(response.status).toBe(403)
        })
    })
})