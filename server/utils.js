import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "qwertyuiopasdfghjklrtyuio",
    { expiresIn: "1d" }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // bearer 123qwe2e.. starts from 1 to the end of the string
    jwt.verify(
      token,
      process.env.JWT_SECRET || "qwertyuiopasdfghjklrtyuio",
      (err, decode) => {
        if (err) {
          res.status(401).json({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).json({ message: "No token" });
  }
};
