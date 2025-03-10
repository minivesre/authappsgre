import { SHA256 } from "crypto-js";  // Pastikan sha256 digunakan atau hapus impor ini
import prisma from "../../../lib/prisma"; // Pastikan path relatifnya benar
// import hashPassword jika kamu memang menggunakannya
//import hashPassword from "./create";

export default async function handle(req, res) {
  if (req.method === "POST") {
    // login user
    await loginUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function loginUserHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        role: true, // Tambahkan ini
      },
    });

    // Debugging: Cek apakah user ditemukan dan apakah ada role
    console.log("User fetched:", user);
    if (user && user.password === SHA256(password).toString()) {
      // exclude password from json response
      return res.status(200).json(exclude(user, ["password"]));
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (e) {
    console.error(e);  // Log error di server
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Function to exclude user password returned from prisma
function exclude(user, keys) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
