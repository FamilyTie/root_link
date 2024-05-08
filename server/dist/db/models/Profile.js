"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("../knex");
class Profile {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.username = data.username;
        this.fullName = data.full_name;
        this.bio = data.bio;
        this.accountType = data.account_type;
        this.data = data.data;
        this.createdAt = data.created_at || new Date();
        this.updatedAt = data.updated_at || new Date();
    }
    static async list() {
        const query = `SELECT * FROM profiles`;
        const { rows } = await knex_1.knex.raw(query);
        return rows.map((profile) => new Profile(profile));
    }
    static async findById(id) {
        const query = `SELECT * FROM profiles WHERE id = ?`;
        const { rows } = await knex_1.knex.raw(query, [id]);
        const profile = rows[0];
        return profile ? new Profile(profile) : null;
    }
    static async create(data) {
        const query = `INSERT INTO profiles (user_id, username, full_name, bio, account_type, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`;
        const values = [
            data.user_id,
            data.username,
            data.full_name,
            data.bio,
            data.account_type,
            data.data,
            new Date(),
            new Date(),
        ];
        const { rows } = await knex_1.knex.raw(query, values);
        const profile = rows[0];
        return profile ? new Profile(profile) : null;
    }
    static async update(id, data) {
        const updateFields = { ...data, updated_at: new Date() };
        const keys = Object.keys(updateFields).filter((key) => updateFields[key] !== undefined);
        const query = `UPDATE profiles SET ${keys
            .map((key) => `${key} = ?`)
            .join(", ")} WHERE id = ? RETURNING *`;
        const values = [...keys.map((key) => updateFields[key]), id];
        const { rows } = await knex_1.knex.raw(query, values);
        const profile = rows[0];
        return profile ? new Profile(profile) : null;
    }
    static async delete(id) {
        try {
            const query = `DELETE FROM profiles WHERE id = ?`;
            const result = await knex_1.knex.raw(query, [id]);
            if (result.rowCount === 0) {
                return null;
            }
            return true;
        }
        catch (error) {
            console.error("Failed to delete profile:", error);
            throw error;
        }
    }
}
exports.default = Profile;