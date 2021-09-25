import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length > 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decodedData?.id;
      next();
    } else if (token && !isCustomAuth) {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
      next();
    } else {
      res.status(404).json("You need to signin");
    }

    // ini kalo gak punya authorization malah bisa masuk
    // malah kalo yang google yang gak bisa masuk
  } catch (error) {
    console.log(error);
  }
};

export default auth;
