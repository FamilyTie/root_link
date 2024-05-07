import { knex } from "../knex"
import { ValidPassword, hashPassword } from "../../utils/auth-utils"

interface UserConstructor {
  id: number
  username: string
  password_hash: string
}

type user = {
  id: number
  username: string
  password_hash: string
}
export default class User {
  #passwordHash = null // a private property
  public id: number // Explicitly defining the public fields
  public username: string
  private passwordHash: string
  // This constructor is NOT how a controller creates a new user in the database.
  // Instead, it is used by each of the User static methods to hide the hashed
  // password of users before sending user data to the client. Since #passwordHash
  // is private, only the isValidPassword instance method can access that value.
  constructor({ id, username, password_hash }: UserConstructor) {
    this.id = id
    this.username = username
    this.passwordHash = password_hash
  }

  // This instance method takes in a plain-text password and returns true if it matches
  // the User instance's hashed password.
  isValidPassword = async (password: string) =>
    ValidPassword(password, this.#passwordHash!)

  static async list() {
    const query = `SELECT * FROM users`
    const { rows } = await knex.raw(query)
    // use the constructor to hide each user's passwordHash
    return rows.map((user: user) => new User(user))
  }

  static async find(id: number) {
    const query = `SELECT * FROM users WHERE id = ?`
    const { rows } = await knex.raw(query, [id])
    const user = rows[0]
    return user ? new User(user) : null
  }

  static async findByUsername(username: string) {
    const query = `SELECT * FROM users WHERE username = ?`
    const { rows } = await knex.raw(query, [username])
    const user = rows[0]
    return user ? new User(user) : null
  }

  static async create(username: string, password: string) {
    // hash the plain-text password using bcrypt before storing it in the database
    const passwordHash = await hashPassword(password)

    const query = `INSERT INTO users (username, password_hash)
      VALUES (?, ?) RETURNING *`
    const { rows } = await knex.raw(query, [username, passwordHash])
    const user = rows[0]
    return new User(user)
  }

  // this is an instance method that we can use to update
  static async update(id: number, username: string) {
    // dynamic queries are easier if you add more properties
    const query = `
      UPDATE users
      SET username=?
      WHERE id=?
      RETURNING *
    `
    const { rows } = await knex.raw(query, [username, id])
    const updatedUser = rows[0]
    return updatedUser ? new User(updatedUser) : null
  }

  static async deleteAll() {
    return knex("users").del()
  }
}
