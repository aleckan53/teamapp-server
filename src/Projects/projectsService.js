const projectsService = {
  getUserProjects(knex, user_id) {
    return knex('user_projects as up')
      .where('up.user_id', user_id)
      .join('projects as p', 'p.id', '=', 'up.project_id')
      .select('*')
      .orderBy('p.id') // add sort by rating
      .then(data=> data.map(p=> {
        return {
          id: p.id,
          title: p.title,
          img: p.img,
          description: p.description,
          role: p.role
        }  
      })
    )
  },
  getProjectsList(knex, term, limit, offset){
    return knex('projects')
      .select('*')
      .where('title', 'ilike', `%${term}%`)
      .limit(limit)
      .offset(offset)
      .orderBy('id')
      .then(projects=> knex('projects')
        .where('title', 'ilike', `%${term}%`)
        .count('id')
        .then(count=> {
          return {
            projects,
            ...count[0]
          }
        })
      )
  },
  getProjectById(knex, id){
    return knex('projects')
      .where('id', id)
      .select('*')
      .first()
  },
  addProject(knex, project, userId){
    return knex
      .into('projects')
      .insert(project)
      .returning('*')
      .then(proj=> knex
        .into('user_projects')
        .insert({
          user_id: userId,
          role: "1",
          project_id: proj[0].id
        })
        .returning('*')
        .then(u_p=> {
          return {
            ...proj[0],
            ownerRole: u_p[0].role,
            created_at: new Date()
          }
        })
      )
  },
  updateProject(knex, project, id){
    return knex('projects')
      .where({id})
      .update(project, ['id', 'title', 'description', 'img'])
  },
  deleteProject(knex, id){
    return knex('user_projects')
      .where('project_id', id)
      .delete()
      .then(()=> knex('projects')
        .where({id})
        .delete()
      )
  }
} 

module.exports = projectsService