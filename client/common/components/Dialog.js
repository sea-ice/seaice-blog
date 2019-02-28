import React, {Component} from 'react'

import styles from '../../resources/common/scss/dialog.scss'
import {loadComponentStyle} from '../../common/utils'

export default class Dialog extends Component {
  constructor (props) {
    super(props)
    this.onConfirm = this.onConfirm.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }
  componentDidMount () {
    loadComponentStyle(styles)
    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)
  }
  onConfirm () {
    let onConfirm = this.props.dialogConfirm
    if (onConfirm && typeof onConfirm === 'function') onConfirm()
  }
  onCancel () {
    let onCancel = this.props.dialogCancel
    if (onCancel && typeof onCancel === 'function') onCancel()
    this.toggleDialog()
  }
  toggleDialog () {
    this.$(this.dialog).toggleClass('show')
  }
  render () {
    return (
      <div className="dialog-wrapper" ref={ele => this.dialog = ele}>
        <div className="dialog-mask"></div>
        <div className={`dialog${this.props.dialog.noBorder ? '' : ' bordered'}`}>
          <header className="dialog-header">
            <h2 className="dialog-title">{this.props.dialog && this.props.dialog.title}</h2>
          </header>
          <main className="dialog-main">{this.props.children}</main>
          <footer className="dialog-footer">
            <a
              href="javascript:void(0);"
              className="dialog-button dialog-confirm"
              onClick={this.onConfirm}
            >
              {this.props.dialog && this.props.dialog.confirmText || '确 定'}
            </a>
            <a
              href="javascript:void(0);"
              className="dialog-button dialog-cancel"
              onClick={this.onCancel}
            >
              {this.props.dialog && this.props.dialog.cancelText || '取 消'}
            </a>
          </footer>
        </div>
      </div>
    )
  }
}
