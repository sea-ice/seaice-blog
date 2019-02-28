import React, {Component} from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

export default class CustomLink extends Component {
  render () {
    let {to, iconType} = this.props
    // Route组件的children prop的值为一个函数，无论当前访问路径是否匹配path prop，都会调用children prop指定的函数
    // Route组件还具有一个render prop，同样该值也是一个函数，它和children prop唯一的区别在于该函数仅在当前访问路径和path prop匹配时才被调用
    return (
      <Route
        path={to}
        exact={true}
        children={({location, match}) => {
          let toRegExp = new RegExp(to),
              isMatch
          if (to === '/') {
            isMatch = match
          } else {
            isMatch = location.pathname.match(toRegExp)
          }
          return <li className={ isMatch ? 'active' : ''}>
            <Link to={to}>
              <i className={`admin-icon admin-${iconType}-icon`}></i>
            </Link>
          </li>
        }}
      />
    )
  }
}
