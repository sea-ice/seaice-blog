import React, { Component } from 'react'

import styles from '../../resources/blog/scss/paginator.scss'
import {loadComponentStyle} from '../../common/utils'

export default class Paginator extends Component {
  constructor (props) {
    super(props)
    this.MIN_ITEMS_COUNT = 5
    this.initialized = false
    this.state = {
      currentPage: props.currentPage || 1,
      itemsPerPage: props.itemsPerPage || 5,
      pageButtonsMax: props.pageButtonsMax || 5,
      totalPage: 0,
      totalItems: 0,
      pageData: []
    }
    this.handlePageButtonClick = this.handlePageButtonClick.bind(this)
    this.handlePageInputChange = this.handlePageInputChange.bind(this)
    this.gotoPage = this.gotoPage.bind(this)
    this.initPaginator()
    console.log('Paginator created')
  }
  componentDidMount () {
    loadComponentStyle(styles)
  }
  initPaginator () {
    this.jumpToNewPage(this.state.currentPage)
  }
  updateTotalItems (totalItems) {
    let {itemsPerPage} = this.state
    let totalPage = Math.ceil(totalItems / itemsPerPage)
    this.setState({
      totalItems,
      totalPage,
      currentPage: 1
    })
  }
  jumpToNewPage (newPage) {
    let {getPageData, handlePageDataChange} = this.props,
        {itemsPerPage, totalPage} = this.state
    if (this.initialized) {
      if (newPage > totalPage) return alert('当前访问的页码已超出最大页码，请输入合理的页码！')
    }
    getPageData(newPage, itemsPerPage).then(data => {
      let totalItems, pageData
      for (let key in data) {
        // 通过对象属性值类型区分总条目和当前页面数据
        if (key.match(/^totalItems/)) {
          totalItems = data[key]
        } else if (key.match(/^pageData/)) {
          pageData = data[key]
        }
      }
      let totalPage = Math.ceil(totalItems / itemsPerPage)
      handlePageDataChange(pageData)
      this.setState(Object.assign({}, this.state, {
        pageData,
        totalPage,
        totalItems,
        currentPage: newPage
      }))
      if (!this.initialized) this.initialized = true
    }).catch(err => {
      console.log(err)
    })
  }
  handlePageButtonClick (e) {
    let targetEle = e.target,
        {currentPage, totalPage} = this.state
    switch (targetEle.getAttribute('data-click-type')) {
      case 'page-num':
        let newPage = Number(targetEle.innerText)
        if (currentPage !== newPage) {
          this.jumpToNewPage(newPage)
        }
        break;
      case 'prev-page':
        if (currentPage !== 1) {
          this.jumpToNewPage(currentPage - 1)
        }
        break;
      case 'next-page':
        if (currentPage !== totalPage) {
          this.jumpToNewPage(currentPage + 1)
        }
        break;
      default:
        break;
    }
  }
  handlePageInputChange (e) {
    console.log(e.keyCode)
    if (
      !e.target.value
      && e.keyCode === 48
      || e.keyCode < 48 && e.keyCode !== 13 && e.keyCode !== 8
      || e.keyCode > 57
    ) {
      return e.preventDefault()
    }
    if (e.keyCode === 13) {
      let newPage = e.target.value
      if (!newPage) return
      this.jumpToNewPage(Number(newPage))
    }
  }
  gotoPage () {
    let newPage = this.pageInput.value
    if (!newPage) return
    this.jumpToNewPage(Number(newPage))
  }
  render () {
    let {
          totalPage,
          totalItems,
          pageButtonsMax,
          currentPage
        } = this.state,
        pageButtons
    if (totalItems > this.MIN_ITEMS_COUNT) {
      pageButtons = Array.apply(null, {
        length: Math.min(totalPage, pageButtonsMax)
      }).map((v, i) => <a
          key={`page-button-${i + 1}`}
          href="javascript:void(0);"
          data-click-type="page-num"
          className={`page-button${i + 1 === currentPage ? ' active' : ''}`}
        >{i + 1}</a>
      )
      pageButtons.unshift(<a
        key="prev-page-button"
        href="javascript:void(0);"
        data-click-type="prev-page"
        className={`prev-page${currentPage === 1 ? ' disabled' : ''}`}
      >PREV</a>)
      pageButtons.push(<a
        key="next-page-button"
        href="javascript:void(0);"
        data-click-type="next-page"
        className={`prev-page${currentPage === totalPage ? ' disabled' : ''}`}
      >NEXT</a>)
    }


    return (
      <div className={`paginator${totalItems > this.MIN_ITEMS_COUNT ? ' show' : ''}`}>
        <p className='total-info'>
          <span
            className="total-items"
            ref={ele => this.totalItems = ele}
          >{totalItems}</span>&nbsp;Posts&nbsp;/&nbsp;
          <span
            className="total-pages"
            ref={ele => this.totalPage = ele}
          >{totalPage}</span>&nbsp;
          {totalPage > 1 ? 'Pages' : 'Page'}
        </p>
        <div className={`paginator-operation${totalItems > this.MIN_ITEMS_COUNT ? ' show' : ''}`}>
          <p
            className="page-button-wrapper"
            onClick={this.handlePageButtonClick}
          >
            {pageButtons}
          </p>
          <p className="turn-to-page">
            To Page&nbsp;
            <input
              type="text"
              className="page-input"
              ref={ele => this.pageInput = ele}
              onKeyDown={this.handlePageInputChange}
            />
            <a
              href="javascript:void(0);"
              className="confirm-btn"
              onClick={this.gotoPage}
            >Go</a>
          </p>
        </div>
      </div>
    )
  }
}
