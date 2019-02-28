import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import styles from '../../resources/admin/scss/tagSelect.scss'
import {loadComponentStyle} from '../../common/utils'

import AddTag from './AddTag'
import DeleteTag from './DeleteTag'
import Loading from '../../common/components/Loading'
import { postTagsActions } from '../reducers/adminPageReducer'

@connect(state => ({
  getAllTagsState: state.addPost.getAllTagsState
}), dispatch => bindActionCreators(postTagsActions, dispatch))
class TagSelect extends Component {
  constructor (props) {
    super(props)
    // if (Object.prototype.toString.call(props.collection) !== '[object Array]')
    //   throw new Error('The prop of TagSelect: `collection` must be an array!!')
    this.handleAddTagClick = this.handleAddTagClick.bind(this)
    this.showCreateTagInput = this.showCreateTagInput.bind(this)
    this.addNewTag = this.addNewTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.state = {}
  }
  componentDidMount () {
    this.props.getAllTags(data => {
      let collection = data.tags,
          selected = (this.props.selected || []).map(
            id => collection.filter(tag => tag._id === id)[0]
          )
      this.setState({
        selected,
        collection
      })
    })
    loadComponentStyle(styles)
  }
  handleAddTagClick (tag) {
    let copy = this.state.selected.slice()
    copy.push(tag)
    this.setState(Object.assign({}, this.state, {
      selected: copy
    }))
    this.notifyTagsChange(copy)
  }
  showCreateTagInput () {
    this.createTag.showTagAndFocus()
  }
  addNewTag (tag) {
    let newTags = [...this.state.selected, tag]
    this.setState({
      selected: newTags,
      collection: [...this.state.collection, tag]
    })
    this.notifyTagsChange(newTags)
  }
  deleteTag (name) {
    let copy = this.state.selected.slice(),
        i = copy.findIndex(tag => tag.name === name)
    copy.splice(i, 1)
    this.setState(Object.assign({}, this.state, {
      selected: copy
    }))
    this.notifyTagsChange(copy)
  }
  notifyTagsChange (tags) {
    this.props.notifyTagsChange(
      tags.map(tag => tag._id)
    )
  }
  render () {
    // console.log(this.state.collection)
    let deleteTags, renderAllTags,
        getAllTagsState = this.props.getAllTagsState
    if (getAllTagsState.loading) {
      renderAllTags = <Loading />
    } else {
      let {selected, collection} = this.state
      if (selected && selected.length) {
        console.log(selected)
        deleteTags = selected.map(tag => (
          <DeleteTag
            name={tag.name}
            key={tag._id}
            deleteTag={this.deleteTag}
          />
        ))
      }
      if (collection && collection.length) {
        renderAllTags = <ul className="admin-tags-list">{
          collection.map(tag => (
            <li key={tag._id}>
              <AddTag
                tagId={tag._id}
                name={tag.name}
                selected={Boolean(
                  ~selected.findIndex(
                    selectedTag => tag._id === selectedTag._id
                  )
                )}
                handleAddTagClick={this.handleAddTagClick}
              />
            </li>
          ))
        }</ul>
      }
    }
    return (
      <div className="select-tags-wrapper">
        <div className="post-tags-wrapper">
          <i className="admin-add-tag-icon" onClick={this.showCreateTagInput}></i>
          <p className="post-tags">
            {deleteTags}
            <DeleteTag
              type="createTag"
              ref={ele => this.createTag = ele}
              addNewTag={this.addNewTag}
            />
          </p>
        </div>
        {renderAllTags}
      </div>
    )
  }
}

export default TagSelect
