const createError = require("http-errors");
const createSucess = require("../helpers/createSuccess");
const authService = require("../services/authService");
const axios = require("axios");
const setRefreshToken = async (res, refreshToken, rememberMe) => {
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    // maxAge: 30 * 60 * 1000, // 30m
    path: "/",
    // secure: true,
    // sameSite: "Lax",
  });
  res.cookie("rememberMe", rememberMe, {
    httpOnly: true,
    // maxAge: 30 * 60 * 1000, // 30m
    path: "/",
    // secure: true,
    // sameSite: "Lax",
  });
};


const authController = {
  login: async (req, res, next) => {
    const { remember } = req.body;
    try {
      const { data } = await axios.post(
        `${process.env.SSO_ORIGIN}/api/v1/auth/loginFromService`, req.body
      );
      if (data.status == 201) {
        res.status(400).json(
          createSucess(400, data?.message, {}))
        return
      }
      const { user, accessToken, refreshToken } = data.elements

      await setRefreshToken(res, refreshToken, remember);
      //return the tokens
      res.status(200).json(
        createSucess(200, "Login successfully !",
          { user, access_token: accessToken }
        )
      );
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: `/` });
      res.clearCookie("rememberMe", { path: `/` });
      return res.status(200).json(createSucess(200, "Logged out!"));
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      // const userId = req.userId;
      // const rememberMe = req.cookies.rememberMe;
      // // let storedRefreshToken = refreshTokenStore.find(x => x.userId == userId)

      // // if (storedRefreshToken == undefined) throw createError.BadRequest("Please login now!")
      // const user = await userService.getUser(userId);
      // if (!user) throw createError.BadRequest("This user does not exist.");
      // const access_token = generateAccessToken({ id: user.id });
      // let refresh_token;
      // if (rememberMe == "true") {
      //   refresh_token = generateRefreshToken({ id: user.id });
      // } else {
      //   refresh_token = generateRefreshTokenShortExpiration({ id: user.id });
      // }
      // await setRefreshToken(res, refresh_token, rememberMe);
      // user.USER_PW = undefined;

      // res.status(200).json(
      //   createSucess(200, "Get new access_token successfully !", {
      //     access_token,
      //     user,
      //   })
      // );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
