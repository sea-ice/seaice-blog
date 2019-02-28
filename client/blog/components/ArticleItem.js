import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import {formatDate} from '../../../common/utils'
import {loadComponentStyle} from '../../common/utils'
import styles from '../../resources/blog/scss/articleItem.scss'
export default class ArticleItem extends Component {
  componentDidMount () {
    // $clamp为全局变量
    import(
      /* webpackChunkName: "clamp" */
      '../../resources/blog/js/clamp.min'
    ).then(() => {
      $clamp(this.excerptEle, {
        clamp: 3
      })
    })
    console.log(styles)
    // 加载组件样式
    loadComponentStyle(styles)
  }
  render () {
    let {
          _id,
          title,
          excerpt,
          publishTime,
          tags,
          visitCount,
          commentCount,
          location: {
            city
          }
        } = this.props.article,
        postTime = this.props.notShowTime
        ? null : (
          <p className="time-wrapper">
            <i className="article-icons at-icon"></i>&nbsp;
            <time>{formatDate(publishTime)}</time>
          </p>
        )
    return (
      <article className="article-item">
        <header>
          <h2><Link to={`/post/${_id}`}>{title}</Link></h2>
          <p className="article-tags-wrapper">
            <i className="article-icons tag-icon"></i>&nbsp;
            <span>{tags.map(tag => tag.name).join('，')}</span>
          </p>
        </header>
        <section
          className="article-excerpt"
          ref={ (ele) => {this.excerptEle = ele} }
        >
          {excerpt}
        </section>
        <footer>
          { postTime }
          <p className="location-wrapper">
            <i className="article-icons location-icon"></i>&nbsp;
            <span>{city}</span>
          </p>
          <p className="views-count-wrapper">
            <i className="article-icons view-icon"></i>&nbsp;
            <span>
              {visitCount}&nbsp;
              {visitCount !== 1 ? 'views' : 'view'}
            </span>
          </p>
          <p className="comment-count-wrapper">
            <i className="article-icons comment-icon"></i>&nbsp;
            <span>
              {commentCount}&nbsp;
              {commentCount !== 1 ? 'comments' : 'comment'}
            </span>
          </p>
        </footer>
      </article>
    )
  }
}
