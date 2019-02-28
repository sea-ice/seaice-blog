import React, {Component} from 'react'

export default class Loading extends Component {
  render () {
    return (
      <p
        className="loading"
        style={this.props.align && {textAlign: this.props.align.toLowerCase()}}
      >
        <span className="loading-text">正在加载中...</span>
      </p>
    )
  }
}
