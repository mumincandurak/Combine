var express = require('express');
var router = express.Router();
var response = require("../lib/Response")
var CustemError = require("../lib/CustomError")
var _enum = require("../config/enum")
var User = require("../db/models/Users")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken");
var verifyToken = require("../lib/authToken");

router.post("/signup", async (req, res) => {
  try {
    const user = req.body;
    const existUser = await User.findOne({ email: user.email });

    if (existUser) {
      const errorResponse = response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
        message: "Error adding user",
        description: "User already exists"
      });
      return res.status(_enum.HTTP_STATUS.BAD_REQUEST).json(errorResponse);
    } else {

      if (!user.email || !user.passwordHash) {
        return res.status(400).json(response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
          message: "Email or password missing",
          description: "Both fields are required"
        }));
      }

      if (!user.email.includes("@")) {
        return res.status(400).json(response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
          message: "Invalid email",
          description: "Email must contain '@'"
        }));
      }

      const saltrounds = 10;
      const hashedPassword = await bcrypt.hash(user.passwordHash, saltrounds);
      user.passwordHash = hashedPassword;
      const userdata = await User.create(user);
      console.log("yeni kullanıcı", userdata);
      const successResponse = response.successResponse(_enum.HTTP_STATUS.CREATED, {
        message: "user added succesfully",
        description: userdata
      })
      return res.status(_enum.HTTP_STATUS.CREATED).json(successResponse);
    }
  } catch (err) {
    console.error("Error: add new user", err);
    const errorResponse = response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err);
    return res.status(500).json(errorResponse);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res.status(400).json(response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
        message: "Email or password missing",
        description: "Both fields are required"
      }));
    }

    if (!email.includes("@")) {
      console.log("ben buraya girdim")
      return res.status(400).json(response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
        message: "Invalid email",
        description: "Email must contain '@'"
      }));
    }


    const check = await User.findOne({ email });
    if (!check) {
      const errorResponse = response.errorResponse(
        _enum.HTTP_STATUS.NOT_FOUND, {
        message: "user not found",
        description: "email or password wrong"
      }

      );
      return res.status(_enum.HTTP_STATUS.NOT_FOUND).json(errorResponse);
    }

    


    const isCorrectPassword = await bcrypt.compare(passwordHash, check.passwordHash);
    if (!isCorrectPassword) {
      const errorResponse = response.errorResponse(
        _enum.HTTP_STATUS.UNAUTHORIZED, {
        message: "Error: email or password wrong",
        description: "email or password wrong"
      }

      );
      return res.status(_enum.HTTP_STATUS.UNAUTHORIZED).json(errorResponse);
    }


    const token = jwt.sign(
      {
        id: check._id,
        email: check.email,
        userName: check.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const successResponse = response.successResponse(_enum.HTTP_STATUS.OK, {
      message: "Login successful",
      user: {
        id: check._id,
        email: check.email,
        userName: check.userName,
      },
      token,
    });

    return res.status(_enum.HTTP_STATUS.OK).json(successResponse);
  } catch (err) {
    console.log("!catch", err);
    const errorResponse = response.errorResponse(
      _enum.HTTP_STATUS.INTERNAL_SERVER_ERROR,
      err.message || "Internal server error"
    );
    return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(_enum.HTTP_STATUS.NOT_FOUND)
        .json(response.errorResponse(_enum.HTTP_STATUS.NOT_FOUND, {
          message: "Error: delete user",
          description: "User not found"
        }
        ));
    }

    return res
      .status(_enum.HTTP_STATUS.OK)
      .json(response.successResponse(_enum.HTTP_STATUS.OK, "User deleted successfully"));
  } catch (err) {
    console.error("Delete error:", err);
    return res
      .status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message));
  }
});


module.exports = router;
