import React, {Component} from 'react'

export default class Toast extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: '',
      text: ''
    }
  }
  show (type, text) {
    this.setState({
      type,
      text
    })
  }
  render () {
    return (
      <div className="toast">
        <i className={`toast-icon toast-icon-${this.state.type}`}></i>
        <p className="toast-text">{this.state.text}</p>
      </div>
    )
  }
}
