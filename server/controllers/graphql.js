import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'

import graphqlSchema from '../graphql/schema'

function initGraphQL (router) {
  router.get('/graphql', graphqlKoa({
    schema: graphqlSchema
  })).post('/graphql', graphqlKoa({
    schema: graphqlSchema
  })).get('/graphiql', graphiqlKoa({
    endpointURL: '/graphql'
  }))
}

export {
  initGraphQL
}
