import * as CRUD from "./ResumeService";

test("getAll", async () => {
    let res = await CRUD.getAll()
    expect(res.status).toBe(200)
    expect(res.data).toBeDefined()
})

test("getSaurav", async () => {
    let res = await CRUD.get('6186caf3ab475200237ecf8d');
    let jsonResponse = { "__v": 0, "_id": "6186caf3ab475200237ecf8d", "approved": "approved", "createdAt": "2021-11-06T18:35:31.653Z", "link": "n/a", "major": "CS", "name": "Saurav Bahali", "tags": "Computer Science, Economics", "updatedAt": "2021-11-06T18:35:43.239Z" }
    expect(res.status).toBe(200)
    expect(res.data).toEqual(jsonResponse)
})

test("postNew", async () => {
    let result = await CRUD.post("Test Bahali", "www.google.com", "Computer Science", ["Luffy", "Zoro", "Sanji"], "Pending")
    expect(result.status).toBe(200)
    const ID = result.data._id;
    let res = await CRUD.get(ID)
    expect(res.status).toBe(200)
    expect(res.data.approved).toBe("Pending")
    expect(res.data.tags).toContain("Luffy", "Zoro", "Sanji")
})

test("delNewCreation", async ()=> {
    let result = await CRUD.post("Delete This", "www.google.com", "Computer Science", ["Luffy", "Zoro", "Sanji"], "Pending")
    expect(result.status).toBe(200)
    const ID = result.data._id;
    let approved = await CRUD.update(ID)
    expect(approved.status).toBe(200)
    let res = await CRUD.del(ID)
    expect(res.status).toBe(200)
    // TODO: Ensure it is not in Resume DB
    //let getRes = await CRUD.get(ID)
    //expect(getRes.status).toBe(404)
})

test("approve", async ()=> {
    let result = await CRUD.post("Test Bahali", "www.google.com", "Computer Science", ["Luffy", "Zoro", "Sanji"], "Pending")
    expect(result.status).toBe(200)
    const ID = result.data._id;
    let res = await CRUD.update(ID)
    expect(res.status).toBe(200)
    let getRes = await CRUD.get(ID)
    expect(getRes.status).toBe(200)
    expect(getRes.data.approved).toBe("approved")
})