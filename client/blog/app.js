import * as React from 'react'
import { Link } from 'react-router-dom'

import {getRootFontSize} from '../resources/blog/js/utils'
import {loadComponentStyle} from '../common/utils'
import styles from '../resources/blog/scss/index.scss'

export default class App extends React.Component {
  componentDidMount () {
    const setRootFontSize = () => {
      let rootFontSize = getRootFontSize();
      // if (appHeaderWidth >= 930) {
      //   rootFontSize = appHeaderWidth * 16 / 920
      // } else if () {

      // }
      document.documentElement.style.fontSize = `${rootFontSize}px`
    }
    setRootFontSize()
    window.addEventListener('resize', setRootFontSize)

    console.log(styles)
    loadComponentStyle(styles)
  }

  render () {
    return (
      <div className="app-wrapper">
        <header className="app-header">
          <div className="site-title-wrapper">
            <h1 className="site-title">
              SeaiCe的日誌
            </h1>
            <h2 className="site-description">
              平生一顾，至此终年
            </h2>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">首&nbsp;页</Link></li>
              <li><Link to="/archive">归&nbsp;档</Link></li>
              <li><Link to="/tags">标&nbsp;签</Link></li>
              <li><Link to="/about">关&nbsp;于</Link></li>
            </ul>
          </nav>
        </header>
        {this.props.children}
        <footer className="app-footer">
          <p className="site-info">
            Copyright&nbsp;&copy;&nbsp;2016-2018&nbsp;<a href="http://www.seaiceblog.com">SeaiCe</a>.&nbsp;All Rights Reserved.
            <i className="split-dot"></i>
            粤ICP备16095658号-1
          </p>
          <p className="site-statistic">
            本站已运行&nbsp; <span className="site-run-time">486</span>&nbsp;天
            <i className="split-dot"></i>
            今日访客数&nbsp;<span className="today-visit-count">1412</span>&nbsp;次
            <i className="split-dot"></i>
            历史访问量&nbsp;<span className="history-visit-count">412334</span>&nbsp;次
          </p>
          <p className="site-support">
            Theme by&nbsp;<a href="https://github.com/sea-ice">sea-ice</a>
          </p>
        </footer>
      </div>
    )
  }
}
