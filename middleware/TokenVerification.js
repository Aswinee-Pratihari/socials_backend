import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req?.cookies?.access_token;

  // console.log(req.cookiesaccess_token)
  if (!token) {
    res.status(400).send("you are not authorised");
  }

  jwt.verify(token, "Aswinee", (err, decoded) => {
    if (err) {
      res.status(400).send("Token not valid");
    }
    req.user = decoded; //getting the user details from mongodb
    // console.log(first)
    // console.log(req.user)
    next();
  });
};
