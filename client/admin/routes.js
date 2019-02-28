import React from 'react'
import { Switch, Route } from 'react-router'
import Loadable from 'react-loadable'
import Loading from '../common/components/Loading'

let AdminPage = Loadable({
  loader: () => import(
    /* webpackChunkName: "AdminPage" */
    './containers/AdminPage'),
  loading: Loading
})
let Posts = Loadable({
  loader: () => import(
    /* webpackChunkName: "Posts" */
    './containers/Posts'
  ),
  loading: Loading
})
let NoMatch = Loadable({
  loader: () => import(
    /* webpackChunkName: "NoMatch" */
    '../common/components/NoMatch'
  ),
  loading: Loading
})

let routes = (
  <Switch>
    <Route exact path='/' component={AdminPage} />
    <Route path="/posts" component={Posts} />
    <Route component={NoMatch} />
  </Switch>
)

export default routes
