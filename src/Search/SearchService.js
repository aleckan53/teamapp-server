const SearchService = {
  getFeatured(knex, offset){
    return knex
      .select('*')
      .from('projects as p')
      .limit(7)
      .offset(offset)
      .then(projects=>knex('projects')
        .count('id')
        .then(count=> {
          return {
            projects,
            ...count[0]
          }
        })
      )
  },
  getProjectsByTerm(knex, searchTerm){
    return knex('projects')
      .select('*')
      .where('title', 'ilike', `%${searchTerm}%`)
  },
  getProjectById(knex, id){
    return knex('projects')
      .where('id', id)
      .select('*')
  }
} 

module.exports = SearchService