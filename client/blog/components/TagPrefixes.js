import React, {Component} from 'react'

import TagPrefixesLine from './TagPrefixesLine'
import config from '../../../common/config'

export default class TagPrefixes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: this.props.activeCategory
    }
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
  }
  handleCategoryClick (label) {
    if (label !== this.state.active) {
      console.log(label)
      this.setState({
        active: label
      })
      if (typeof this.props.notifyCategoryChange === 'function') {
        this.props.notifyCategoryChange(label)
      }
    }
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      active: newProps.activeCategory
    })
  }
  render () {
    let {tagCount} = this.props
    let {active} = this.state
    return <div className="tag-prefixes-wrapper">
      <TagPrefixesLine
        active={active}
        tagCount={tagCount.slice(0, 15)}
        tagPrefixes={config.tagPrefixes.slice(0, 15)}
        handleCategoryClick={this.handleCategoryClick} />
      <TagPrefixesLine
        active={active}
        tagCount={tagCount.slice(15)}
        tagPrefixes={config.tagPrefixes.slice(15)}
        handleCategoryClick={this.handleCategoryClick} />
    </div>
  }
}
