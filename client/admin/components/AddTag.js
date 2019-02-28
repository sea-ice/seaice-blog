import React, {Component} from 'react'

export default class AddTag extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected
    }
    this.handleAddTagClick = this.handleAddTagClick.bind(this)
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      selected: newProps.selected
    })
  }
  componentDidMount () {
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  handleAddTagClick (e) {
    if (this.$(this.tag).hasClass('selected')) return
    this.props.handleAddTagClick({
      _id: this.props.tagId,
      name: this.props.name
    })
    this.setState({
      selected: !this.state.selected
    })
  }
  render () {
    return (
      <a
        href="javascript:void(0);"
        className={`admin-tag${this.state.selected ? ' selected' : ''}`}
        onClick={this.handleAddTagClick}
        ref={ele => this.tag = ele}
      >
        <span className="admin-tag-name">
          {this.props.name}
        </span>
        <i className="admin-select-icon"></i>
      </a>
    )
  }
}
