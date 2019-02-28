import React from 'react'
import { Switch, Route } from 'react-router'
import Loadable from 'react-loadable'
import Loading from '../common/components/Loading'

import {getIPagePosts} from '../api/posts'
let LoadableHome = Loadable({
  loader: () => import(
    /* webpackChunkName: "Home" */
    './containers/Home'),
  loading: Loading // react-loadable会给Loading组件传入loading，error等props，loading表示异步加载的组件是否正在加载，error表示加载过程中遇到的错误
}) // 返回一个高阶组件，给该高阶组件传入的props最终会传递给异步加载的组件作为其props

// react-loadable 主要还是利用了 webpack 提供的 import 全局函数来动态加载组件。webpack 文档中也提到了在调用 import 的地方会被作为新分离出来的 chunk 的起点。即需要异步加载的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。import() 函数会返回一个 Promise 对象。

let LoadableArchive = Loadable({
  loader: () => import(
    /* webpackChunkName: "Archive" */
    './containers/Archive'
  ),
  loading: Loading
})

let LoadableTags = Loadable({
  loader: () => import(
    /* webpackChunkName: "Tags" */
    './containers/Tags'
  ),
  loading: Loading
})

let LoadablePostDetail = Loadable({
  loader: () => import(
    /* webpackChunkName: "PostDetail" */
    './containers/PostDetail'
  ),
  loading: Loading
})

let LoadableIPageTemplate = Loadable({
  loader: () => import(
    /* webpackChunkName: "IPageTemplate" */
    './containers/IPageTemplate'
  ),
  loading: Loading
})

export default function configureRoutes () {
  return getIPagePosts().then(data => {
    let independentRoutes
    let posts = data.IPagePosts
    if (posts && posts.length) {
      independentRoutes = posts.map(item => <Route exact
        path={item.pageReferUrl}
        key={item._id}
        render={route => (
        <LoadableIPageTemplate postId={item._id} />
      )} />)
    }
    return (
      <Switch>
        <Route
          exact path='/'
          component={LoadableHome} />
        <Route
          exact path='/archive'
          component={LoadableArchive} />
        <Route
          exact path='/tags'
          component={LoadableTags} />
        <Route
          exact path='/post/:id'
          component={LoadablePostDetail} />
        {independentRoutes}
      </Switch>
    )
  })
}
