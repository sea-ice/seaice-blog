import React, {Component} from 'react'

export default class NoMatch extends Component {
  render () {
    return (
      <div className="no-match-page">
        <main className="no-match-page-main">
          <h2 className="title">没有找到你想要的，请检查输入的路径</h2>
        </main>
      </div>
    )
  }
}
