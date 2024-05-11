"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = __importDefault(require("./comment"));
const knex_1 = require("../knex");
// run : npx ts-node testComments.ts
// to test
// Must have a post in db for it to work
async function runTests() {
    console.log("Starting Comment Model Tests...");
    // testing create method
    console.log("Testing Create Comment...");
    const commentData = {
        profile_id: 1,
        post_id: 1,
        body: "This is a test comment",
    };
    try {
        const createdComment = await comment_1.default.create(commentData);
        console.log("Created Comment:", createdComment);
        // Testing findById method
        console.log("Testing Find Comment by ID...");
        const foundComment = await comment_1.default.findById(createdComment.id);
        console.log("Found Comment:", foundComment);
        // Testing update method
        console.log("Testing Update Comment...");
        const updatedData = { body: "Updated test comment body" };
        const updatedComment = await comment_1.default.update(createdComment.id, updatedData);
        console.log("Updated Comment:", updatedComment);
    }
    catch (error) {
        console.error("Error during Comment tests:", error);
    }
    finally {
        await knex_1.knex.destroy(); // Ensure that the database connection is closed after tests
        console.log("Tests completed. Database connection closed.");
    }
}
runTests();
