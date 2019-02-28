import React, {Component} from 'react'

import {transformMarkdown} from '../../../common/utils'

export default class MarkdownEditor extends Component {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange().bind(this)
    this.handleKeydown = this.handleKeydown().bind(this)
    this.transformMarkdown = this.transformMarkdown.bind(this)
  }
  componentDidMount () {
    let S_KEY_CODE = 83

    document.addEventListener('keydown', e => {
      if (e.keyCode === S_KEY_CODE && e.ctrlKey) {
        this.props.saveDraft()
        e.preventDefault()
      }
    })
    window.addEventListener('beforeunload', e => {

    })
  }
  handleTextChange () {
    let timer = null
    return () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.transformMarkdown(this.text.value)
      }, 500)
    }
  }
  handleKeydown () {
    let TAB_KEY_CODE = 9
    let TEXT_INDENT_COUNT = 4
    return e => {
      let textInput = this.text
      if (e.keyCode === TAB_KEY_CODE && !e.shiftKey) {
        let start = textInput.selectionStart,
            end = textInput.selectionEnd
        textInput.value = textInput.value.slice(0, start) + (' '.repeat(TEXT_INDENT_COUNT)) + textInput.value.slice(end)
        textInput.setSelectionRange(start + TEXT_INDENT_COUNT, start + TEXT_INDENT_COUNT)
        this.handleTextChange()
        e.preventDefault()
      } else if (
        e.keyCode === TAB_KEY_CODE
        && e.shiftKey
      ) {
        let start = textInput.selectionStart,
            end = textInput.selectionEnd,
            START_FLAG = '__START_FLAG__',
            END_FLAG = '__END_FLAG__',
            originText = textInput.value,
            insertText = originText.slice(0, start) + START_FLAG + originText.slice(start, end) + END_FLAG + originText.slice(end),
            lines = insertText.split('\n'),
            START_FLAG_REG = new RegExp(START_FLAG),
            END_FLAG_REG = new RegExp(END_FLAG),
            TAB_REG = /^\t/,
            SPACES_REG = new RegExp('^' + ' '.repeat(TEXT_INDENT_COUNT)),
            startLineNum, endLineNum
        for (let i = 0, l = lines.length; i < l; i++) {
          if (lines[i].match(START_FLAG_REG)) {
            startLineNum = i
          }
          if (lines[i].match(END_FLAG_REG)) {
            endLineNum = i
          }
        }
        for (let l = startLineNum; l <= endLineNum; l++) {
          if (lines[l].match(TAB_REG)) {
            lines[l] = lines[l].replace(TAB_REG, '')
          } else if (lines[l].match(SPACES_REG)) {
            lines[l] = lines[l].replace(SPACES_REG, '')
          }
        }
        let temp = lines.join('\n'),
            newStartPos = temp.indexOf(START_FLAG),
            newEndPos = temp.indexOf(END_FLAG) - START_FLAG.length,
            newContent = temp.replace(START_FLAG_REG, '').replace(END_FLAG_REG, '')
        textInput.value = newContent
        textInput.setSelectionRange(newStartPos, newEndPos)
        this.handleTextChange()
        e.preventDefault()
      }
    }
  }
  transformMarkdown (text) {
    // let imageCount = 0
    let result = transformMarkdown(text)
    this.props.handleTextChange(text, result)
  }
  getAndSetContent (content, noUpdatePreview) {
    if (!content && content !== '') return this.text.value
    this.text.value = content
    if (!noUpdatePreview) this.transformMarkdown(content)
  }
  render () {
    return (
      <textarea
        ref={ele => this.text = ele}
        onInput={this.handleTextChange}
        onKeyDown={this.handleKeydown}
      ></textarea>
    )
  }
}
