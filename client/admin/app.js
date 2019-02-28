import * as React from 'react'

// import {getRootFontSize} from '../../resources/js/utils'
// import Toast from '../common/components/Toast'
import {loadComponentStyle} from '../common/utils'
import styles from '../resources/admin/scss/index.scss'

import CustomLink from './components/CustomLink'
import adminConfig from './config'

export default class App extends React.Component {
  componentDidMount () {
    const setRootFontSize = () => {
      let rootEleWidth = document.documentElement.clientWidth || document.body.clientWidth
      let rootFontSize = rootEleWidth * 16 / 1200
      // let rootFontSize = getRootFontSize();
      // if (appHeaderWidth >= 930) {
      //   rootFontSize = appHeaderWidth * 16 / 920
      // } else if () {

      // }
      document.documentElement.style.fontSize = `${rootFontSize}px`
    }
    setRootFontSize()
    window.addEventListener('resize', setRootFontSize)
    // this.showToast('success', '创建成功！')

    loadComponentStyle(styles)
  }

  render () {
    let links = adminConfig.links.map((route, i) => (
      <CustomLink key={i} to={route.to} iconType={route.iconType} />
    ))
    return (
      <div className="admin-app">
        <aside>
          <div className="admin-nav-wrapper">
            <div className="admin-avatar-wrapper">
              <i className="admin-avatar"></i>
              <p className="admin-username">Jack</p>
            </div>
            <nav>
              <ul className="admin-nav">
                {links}
              </ul>
            </nav>
          </div>
          <a href="javascript:void(0);" className="login-out">
            <i className="admin-icon admin-login-out-icon"></i>
          </a>
        </aside>
        {this.props.children}
      </div>
    )
  }
}
