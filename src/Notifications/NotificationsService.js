const NotificationsService = {
  getAllNotifications(knex, userId) {
    return knex
      .select('*')
      .from('notifications')
      .where('user_id', userId)
  }
} 

module.exports = NotificationsService