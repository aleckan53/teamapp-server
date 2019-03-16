const MainService = {
  getStartData(knex, ownerId){
    return knex('users as u')
      .join('user_projects as up', 'u.id', '=', 'up.user_id')
      .join('projects as p', 'p.id', '=', 'up.project_id')
      .whereRaw('??=??', ['u.id', ownerId])
      .select('*')
      .then(data=> {
        const user_projects = data.map(proj=>{
          return {
            id: proj.project_id,
            created_at: proj.created_at,
            ownerRole: proj.role,
            title: proj.title,
            description: proj.description,
            img: proj.img
          }
        })

        return {
          owner: {
            id: data[0].id,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            email: data[0].email,
            avatar: data[0].avatar
          },
          user_projects
        }
      })

  }
}

module.exports = MainService