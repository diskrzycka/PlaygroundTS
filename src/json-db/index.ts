import JSONDatabase from "./db";
import IndexedJSONDatabase from "./indexed-db";

interface User {
  id: number;
  name: string;
  email: string;
}

const userDB = new JSONDatabase<User>("users");

(async () => {
  await userDB.create({ id: 1, name: "Jan Kowalski", email: "jan@example.com" });
  await userDB.create({ id: 2, name: "Anna Nowak", email: "anna@example.com" });

  console.log(await userDB.read()); 

  await userDB.update(user => user.id === 1, { email: "jan.kowalski@newmail.com" });

  console.log(await userDB.read(user => user.id === 1)); 

  await userDB.delete(user => user.id === 2);

  console.log(await userDB.read()); 
})();


const indexedUserDB = new IndexedJSONDatabase<User>("users-indexed", "id");

(async () => {
    await indexedUserDB.create({ id: 1, name: "Jan Kowalski", email: "jan@example.com" });
    await indexedUserDB.create({ id: 2, name: "Anna Nowak", email: "anna@example.com" });
  
    console.log(await indexedUserDB.read()); 

    console.log(await indexedUserDB.findById(1)); 
  
    await indexedUserDB.update(1, { email: "jan.kowalski@newmail.com" });
  
    console.log(await indexedUserDB.findById(1)); 
  
    await indexedUserDB.delete(2);
  
    console.log(await indexedUserDB.read()); 
  })();