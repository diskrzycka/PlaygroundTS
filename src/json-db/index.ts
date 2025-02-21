import JSONDatabase from "./db";

interface User {
  id: number;
  name: string;
  email: string;
}

const userDB = new JSONDatabase<User>("users");

(async () => {
  await userDB.create({ id: 1, name: "Jan Kowalski", email: "jan@example.com" });
  await userDB.create({ id: 2, name: "Anna Nowak", email: "anna@example.com" });

  console.log(await userDB.read()); // Odczyt wszystkich użytkowników

  await userDB.update(user => user.id === 1, { email: "jan.kowalski@newmail.com" });

  console.log(await userDB.read(user => user.id === 1)); // Odczyt po filtrze

  await userDB.delete(user => user.id === 2);

  console.log(await userDB.read()); // Powinien zostać tylko Jan Kowalski
})();
