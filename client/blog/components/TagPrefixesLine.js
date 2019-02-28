// @flow
import React, { Component } from 'react'

export default class TagPrefixesLine extends Component {
  constructor (props) {
    super(props)
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
  }
  handleCategoryClick (e) {
    let {handleCategoryClick} = this.props
    let label = e.currentTarget.dataset.label
    handleCategoryClick(label)
  }
  render () {
    let {active, tagCount} = this.props
    const LINE_MAXIMUM_ITEMS = 15
    const SQRT3 = Math.sqrt(3)
    const SIDE_LENGTH = 100 // 边长
    const SPACE_LENGTH = 10 // item水平间距
    const PADDING_VERTICAL = 10 // 垂直
    // const DEFAULT_FONT_WIDTH = 20
    let PADDING_HORIZON = PADDING_VERTICAL / SQRT3
    let TRIANGLE_HEIGHT = SIDE_LENGTH * SQRT3 / 2
    let X_CHANGE = PADDING_HORIZON / SQRT3

    let total = this.props.tagPrefixes.length
    let padding = total < LINE_MAXIMUM_ITEMS ? (SIDE_LENGTH / 2 + SPACE_LENGTH) : 0
    let topX = padding + PADDING_HORIZON
    let topY = PADDING_VERTICAL
    let bottomX = topX + SIDE_LENGTH / 2
    let bottomY = PADDING_VERTICAL + TRIANGLE_HEIGHT
    let gravityCenterY

    let tagPrefixes = this.props.tagPrefixes.map((p, i) => {
      let prefix
      // let halfFontWidth = (p.fontWidth || )
      if (p.up) {
        gravityCenterY = PADDING_VERTICAL + TRIANGLE_HEIGHT * 2 / 3
        prefix = (
          <g
            key={`triangle-${i}`}
            data-label={p.label}
            onClick={this.handleCategoryClick}
            style={{'--transform-origin': `${topX}px ${topY}px`}}
            className={`${(p.label === active) ? 'active' : ''}`}
          >
            <polygon
              fill={p.bgColor}
              points={
                (p.label === active)
                ?
                `${topX} ${topY} ${bottomX - X_CHANGE} ${bottomY + PADDING_VERTICAL} ${bottomX + SIDE_LENGTH + X_CHANGE} ${bottomY + PADDING_VERTICAL}`
                :
                `${topX} ${topY} ${bottomX} ${bottomY} ${bottomX + SIDE_LENGTH} ${bottomY}`
              }
            />
            <text className="tag-count" fill="#f0f0f0" x={`${topX - 25}`} y={gravityCenterY + 25}>{tagCount[i]}</text>
            <text x={`${topX - 9 + p.adjustX}`} y={gravityCenterY} fill={p.fontColor}>{p.label}</text>
          </g>
        )
        bottomX += SIDE_LENGTH
      } else {
        gravityCenterY = PADDING_VERTICAL + TRIANGLE_HEIGHT / 3
        prefix = (
          <g
            key={`triangle-${i}`}
            data-label={p.label}
            onClick={this.handleCategoryClick}
            style={{'--transform-origin': `${bottomX}px ${bottomY}px`}}
            className={`${(p.label === active) ? 'active' : ''}`}>
            <polygon
              fill={p.bgColor}
              points={
                (p.label === active)
                ?
                `${topX - X_CHANGE} ${topY - PADDING_VERTICAL} ${bottomX} ${bottomY} ${topX + SIDE_LENGTH + X_CHANGE} ${topY - PADDING_VERTICAL}`
                :
                `${topX} ${topY} ${bottomX} ${bottomY} ${topX + SIDE_LENGTH} ${topY}`
              }
            />
            <text className="tag-count" fill="#f0f0f0" x={`${bottomX - 25}`} y={gravityCenterY}>{tagCount[i]}</text>
            <text x={`${bottomX - 9 + p.adjustX}`} y={gravityCenterY} fill={p.fontColor}>{p.label}</text>
          </g>
        )
        topX += SIDE_LENGTH
      }
      topX += SPACE_LENGTH
      bottomX += SPACE_LENGTH
      return prefix
    })
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${SIDE_LENGTH * Math.ceil(LINE_MAXIMUM_ITEMS / 2) + SPACE_LENGTH * (LINE_MAXIMUM_ITEMS - 1) + 2 * PADDING_HORIZON} ${TRIANGLE_HEIGHT + 2 * PADDING_VERTICAL}`}
      >
        {tagPrefixes}
      </svg>
    )
  }
}
