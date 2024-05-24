"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = void 0;
const express = require("express");
const locationController_1 = require("../controllers/locationController");
exports.locationRouter = express.Router();
exports.locationRouter.get("/", locationController_1.getLocations);
exports.locationRouter.get("/:locationId", locationController_1.getLocationById);
exports.locationRouter.post("/", locationController_1.createLocation);
exports.locationRouter.get("/:locationId", locationController_1.getLocationById);
