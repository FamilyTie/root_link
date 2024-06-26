"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRouter = void 0;
const express = require("express");
const likesController_1 = require("../controllers/likesController");
exports.likeRouter = express.Router();
exports.likeRouter.get("/post", likesController_1.getPostLikes);
exports.likeRouter.get("/comment", likesController_1.getCommentLikes);
exports.likeRouter.route;
exports.likeRouter.post("/post", likesController_1.createPostLike);
exports.likeRouter.post("/comment", likesController_1.createCommentLike);
exports.likeRouter.delete("/post", likesController_1.deletePostLike);
exports.likeRouter.delete("/comment", likesController_1.deleteCommentLike);
