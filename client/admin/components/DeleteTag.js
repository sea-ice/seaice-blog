import React, {Component} from 'react'

import config from '../../config'
import { ajax } from '../../../common/utils'

export default class DeleteTag extends Component {
  constructor (props) {
    super(props)
    this.handleDelTagClick = this.handleDelTagClick.bind(this)
    this.updateInputWidth = this.updateInputWidth.bind(this)
    this.handleInputKeydown = this.handleInputKeydown.bind(this)
    this.testSpan = document.getElementById('text-width')
  }
  componentDidMount () {
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  handleDelTagClick () {
    if (this.props.type === 'createTag') {
      this.hideTag()
    } else {
      this.props.deleteTag(this.props.name)
    }
  }
  updateInputWidth () {
    this.testSpan.innerHTML = this.input.value
    this.input.style.width = `${this.testSpan.clientWidth}px`
  }
  handleInputKeydown (e) {
    let ENTER_KEY_CODE = 13
    if (e.keyCode === ENTER_KEY_CODE) {
      let newTagName = this.input.value.trim()
      if (newTagName) {
        ajax('POST', `${config.SERVER_URL}/tag`, {
          name: newTagName
        }).then(data => {
          this.props.addNewTag({
            name: newTagName,
            _id: data._id
          })
          this.hideTag()
        }).catch(err => console.log(err))
      } else {
        alert('标签名不允许为空！')
      }
    }
  }
  showTagAndFocus () {
    this.$(this.tag).addClass('show')
    this.input.value = '默认标签'
    this.updateInputWidth()
    this.$(this.input).select()
  }
  hideTag () {
    this.$(this.tag).removeClass('show')
  }
  render () {
    return (
      <a
        href="javascript:void(0);"
        className={`admin-tag${this.props.type === 'createTag' ? ' tag-with-input' : ''}`}
        ref={ele => this.tag = ele}
      >
        <span className="admin-tag-name">
          {this.props.name}
        </span>
        {
          this.props.type === 'createTag' &&
          <input
            type='text'
            ref={ele => this.input = ele}
            onChange={this.updateInputWidth}
            onKeyDown={this.handleInputKeydown}
          />
        }
        <i
          className="admin-tag-delete-icon"
          onClick={this.handleDelTagClick}
        ></i>
      </a>
    )
  }
}
