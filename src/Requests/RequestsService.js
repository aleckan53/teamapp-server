const RequestsService = {
  createRequest(knex, request){
    return knex
      .into('requests')
      .insert(request)
      .returning('*')
      .then(rows=> rows[0])
  },
  getRequestsByProject(knex, project_id) {
    return knex('requests')
      .where({project_id})
      .select('*')
  },
  updateRequest(knex, data, id) {
    return knex('requests')
      .where({id})
      .update({status: data.status}, ['*'])
      .then(request=> {
        if(data.status === 'Accepted') {
          return knex
            .into('user_projects')
            .insert({
              user_id: data.user_id,
              project_id: data.project_id,
              role: 'contributor',
            })
            .returning('*')
            .then(newProject=> ({
              request: request[0],
              user_project: newProject[0],
            }))
        } else {
          return request[0]
        }
      })
  },
  deleteRequest(knex, id) {
    return knex('requests')
      .where({id})
      .delete()
  },
  getUsersRequests(knex, id){ 
    return knex('requests as r')
      .where('r.sender_id', id)
      .join('projects as p', 'p.id', '=', 'r.project_id')
      .join('users as u', 'u.id', '=', 'r.recipient_id')
      .select(['r.id', 'r.status', 'r.text', 'r.sender_id', 'r.recipient_id', 'r.project_id', 'r.created_at', 'p.title', 'p.leader_id', 'p.img', 'u.first_name', 'u.last_name', 'u.avatar'])
      .orderBy('p.id')
      .then(outgoing=> knex('requests as r')
        .where('recipient_id', id)
        .join('users as u', 'u.id', '=', 'r.sender_id')
        .join('projects as p', 'p.id', '=', 'r.project_id')
        .select(['r.id', 'r.status', 'r.text', 'r.sender_id', 'r.recipient_id', 'r.project_id', 'r.created_at', 'u.first_name', 'u.last_name', 'u.avatar', 'p.title', 'p.leader_id', 'p.img'])
        .then(incoming=> ({
          outgoing,
          incoming
        }))
      )
  },
}

module.exports = RequestsService