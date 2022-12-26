import cookie from "cookie";

export default function handler(request, response) {
  if (request.method === "POST") {
    const { username, password } = request.body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      response.setHeader(
        "Set-Cookie",
        cookie.serialize("token", process.env.TOKEN, {
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      response.status(200).json("Login SuccessFul");
    } else {
      response.status(400).json("Wrong credentials");
    }
  }
}
