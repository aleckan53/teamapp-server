const SearchService = {
  getFeatured(knex, offset){
    return knex
      .select('*')
      .from('projects as p')
      .limit(5)
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
  }
} 

module.exports = SearchService