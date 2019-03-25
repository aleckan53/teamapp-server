const UsersService = {
  getAllUsers(knex) {
    return knex('users')
      .select('*')
  },
  getUserByEmail(knex, email) {
    return knex('users')
      .select('*')
      .where({email})
      .first()
  },
  createUser(knex, user) {
    return knex
      .into('users')
      .insert(user)
      .returning('*')
      .then(rows=> rows[0])
  },
  updateUser(knex, email, updates) {
    return knex('users')
      .where({email})
      .update(updates, ['*'])
  },
  deleteUser(knex, email) {
    return knex('users')
      .where({email})
      .delete()
  }
}

module.exports = UsersService