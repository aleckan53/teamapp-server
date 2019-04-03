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
}

module.exports = RequestsService