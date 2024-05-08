import { knex } from "../knex"

export interface ProfileData {
  id: number
  user_id: number
  username: string
  full_name: string
  bio?: string
  account_type: string
  data?: any
  created_at?: Date
  updated_at?: Date
}

class Profile {
  id: number
  userId: number
  username: string
  fullName: string
  bio?: string
  accountType: string
  data?: any
  createdAt: Date
  updatedAt: Date

  constructor(data: ProfileData) {
    this.id = data.id
    this.userId = data.user_id
    this.username = data.username
    this.fullName = data.full_name
    this.bio = data.bio
    this.accountType = data.account_type
    this.data = data.data
    this.createdAt = data.created_at || new Date()
    this.updatedAt = data.updated_at || new Date()
  }

  static async list() {
    const query = `SELECT * FROM profiles`
    const { rows } = await knex.raw(query)
    return rows.map((profile: ProfileData) => new Profile(profile))
  }

  static async findById(id: number) {
    const query = `SELECT * FROM profiles WHERE id = ?`
    const { rows } = await knex.raw(query, [id])
    const profile = rows[0]
    return profile ? new Profile(profile) : null
  }

  static async create(data: ProfileData) {
    const query = `INSERT INTO profiles (id, user_id, username, full_name, bio, account_type, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    const values = [
      data.id,
      data.user_id,
      data.username,
      data.full_name,
      data.bio,
      data.account_type,
      data.data,
      new Date(),
      new Date(),
    ]
    const { rows } = await knex.raw(query, values)
    const profile = rows[0]
    return profile ? new Profile(profile) : null
  }

  static async update(id: number, data: Partial<ProfileData>) {
    const updateFields = { ...data, updated_at: new Date() }
    const keys = Object.keys(updateFields).filter(
      (key) => updateFields[key] !== undefined
    )
    const query = `UPDATE profiles SET ${keys
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ? RETURNING *`
    const values = [...keys.map((key) => updateFields[key]), id]
    const { rows } = await knex.raw(query, values)
    const profile = rows[0]
    return profile ? new Profile(profile) : null
  }
  static async delete(id: number) {
    try {
      const query = `DELETE FROM profiles WHERE id = ?`
      const result = await knex.raw(query, [id])
      if (result.rowCount === 0) {
        return null
      }
      return true
    } catch (error) {
      console.error("Failed to delete profile:", error)
      throw error
    }
  }
}

export default Profile
