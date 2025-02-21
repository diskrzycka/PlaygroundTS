import request from "supertest";
import app from "../src/json-db/server";

describe("User API", () => {
  let testUser: any;
  let updateResponse: any;

  beforeEach(async () => {
    const res = await request(app).post("/users").send({
      name: "Jan Kowalski",
      email: "jan@example.com"
    });
    updateResponse = res;
    testUser = res.body;
  });

  afterEach(async () => {
    await request(app).delete(`/users/${testUser.id}`);
    testUser = null;
  });

  it("should create a new user", async () => {
    expect(updateResponse.status).toBe(201);
    expect(updateResponse.body).toHaveProperty("id");
    expect(updateResponse.body.name).toBe("Jan Kowalski");
    expect(updateResponse.body.email).toBe("jan@example.com");
  });

  it("should return a list of users", async () => {
    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    const user = res.body.find((u: any) => u.id === testUser.id);

    expect(user.email).toBe("jan@example.com");
  });

  it("should return 400 for invalid user data", async () => {
    const res = await request(app).post("/users").send({
      name: "J",
      email: "invalid-email",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should update a user", async () => {
    const resUpdate = await request(app)
      .put(`/users/${testUser.id}`)
      .send({
        email: "jan-nowy@example.com"
      });


    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.message).toBe("User updated");

    const resGet = await request(app).get("/users");

    expect(resGet.status).toBe(200);
    expect(resGet.body.length).toBeGreaterThan(0);
    const user = resGet.body.find((u: any) => u.id === testUser.id);
    expect(user.email).toBe("jan-nowy@example.com");
  });

});
