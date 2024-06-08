import request from "supertest";
import app from "../../app";

describe("Validation Tests", () => {
    it("should return 400 for invalid register data", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "us",
            password: "pass",
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    it("should return 400 for invalid login data", async () => {
        const res = await request(app).post("/api/auth/login").send({
            username: "",
            password: "",
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

    it("should return 400 for invalid message data", async () => {
        const uniqueUsername = `testuser_${Date.now()}`;

        await request(app).post("/api/auth/register").send({
            username: uniqueUsername,
            password: "testpassword",
        });

        // Log in to get a valid JWT token
        const login = await request(app).post("/api/auth/login").send({
            username: uniqueUsername,
            password: "testpassword",
        });

        const token = login.body.token;

        const res = await request(app)
            .post("/api/messages/send")
            .set("Authorization", `Bearer ${token}`)
            .send({
                message: "",
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });
});
