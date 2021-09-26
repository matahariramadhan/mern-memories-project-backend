import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length > 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    } else {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decodedData?.id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
