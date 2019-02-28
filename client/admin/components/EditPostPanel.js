import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import styles from '../../resources/admin/scss/addPostPage.scss'
import articleStyles from '../../resources/common/scss/article.scss'

import MarkdownEditor from './MarkdownEditor'
import TagSelect from './TagSelect'
import ImageUploader from './ImageUploader'
import { draftSaveAllStates, saveDraftActions, publishPostActions } from '../reducers/adminPageReducer'
import { arraysHaveEqualEles, loadComponentStyle } from '../../common/utils'
import { ADD_POST_STORAGE_KEY, lStorageRemove } from '../../common/utils/storage'

@connect(state => ({
  draftSaveState: state.addPost.draftSaveState
}), dispatch => bindActionCreators({
  ...saveDraftActions,
  ...publishPostActions
}, dispatch))
class EditPostPanel extends Component {
  constructor (props) {
    super(props)
    this.dialogConfig = {title: '文章设置'}
    this.toggleDialog = this.toggleDialog.bind(this)
    this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
    this.handleProvinceChange = this.handleProvinceChange.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
    this.handleIPageSettingChange = this.handleIPageSettingChange.bind(this)
    this.handleIpageUrlBlur = this.handleIpageUrlBlur.bind(this)

    this.notifyTagsChange = this.notifyTagsChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.saveDraft = this.saveDraft.bind(this)
    this.markdownUpdate = this.markdownUpdate.bind(this)
    this.publishPost = this.publishPost.bind(this)
    let {id, title, content, tags, location: {province, city}, isIndependentPage} = props
    // console.log(props.isDraft)
    this.state = {
      savedPost: {
        id,
        title,
        content,
        tags,
        location: {
          province: province || '',
          city: city || ''
        },
        isIndependentPage
      },
      isDraft: Boolean(props.isDraft),
      Dialog: null
    }
    // console.log('EditPostPanel construct')
  }
  componentDidMount () {
    import(
      /* webpackChunkName: "highlight" */
      'highlight.js'
    ).then(hljs => {
      this.hljs = hljs
    })

    import(
      /* webpackChunkName: "jquery" */
      'jquery'
    ).then($ => this.$ = $)

    import(
      /* webpackChunkName: "Dialog" */
      '../../common/components/Dialog'
    ).then(dialog => {
      // 初始化页面各个控件的值
      this.setState({
        Dialog: dialog.default
      })
      setTimeout(() => {
        let {title, content, tags, location: {province, city}, isIndependentPage} = this.state.savedPost
        this.title.value = title
        this.content.getAndSetContent(content)
        this.province.value = province
        this.city.value = city
        this.selectedTags = tags
        this.isIndependentPage.checked = Boolean(isIndependentPage)
        if (Boolean(isIndependentPage)) {
          this.settingIpageUrl.style.display = 'flex'
          this.ipageUrlInput.value = isIndependentPage
        }
      }, 200)
    })

    loadComponentStyle(styles, articleStyles)
  }
  toggleDialog () {
    this.dialog.toggleDialog()
  }
  handleTitleInputBlur (e) {
    if (e.target.value !== this.state.savedPost.title) {
      this.props.draftUnsaved()
    }
  }
  handleProvinceChange (e) {
    if (e.target.value !== this.state.savedPost.location.province) {
      this.props.draftUnsaved()
    }
  }
  handleCityChange (e) {
    if (e.target.value !== this.state.savedPost.location.city) {
      this.props.draftUnsaved()
    }
  }
  handleIPageSettingChange (e) {
    // 切换设置独立页面的选项
    let checked = e.target.value
    let savedIpageUrl = this.state.savedPost.isIndependentPage
    let currentSetting = checked ? this.ipageUrlInput.value.trim() : false
    console.log(checked)
    if (checked) {
      this.settingIpageUrl.style.display = 'flex'
    } else {
      this.settingIpageUrl.style.display = 'none'
    }
    if (savedIpageUrl !== currentSetting) {
      this.props.draftUnsaved()
    }
  }
  handleIpageUrlBlur () {
    // 独立页面url输入框失焦时触发
    let currentSetting = this.ipageUrlInput.value.trim()
    let savedIpageUrl = this.state.savedPost.isIndependentPage
    if (savedIpageUrl !== currentSetting) {
      this.props.draftUnsaved()
    }
  }
  saveDraft () {
    // 在markdown编辑器中ctrl+S保存时触发
    let postChanges = this.postChanges()
    if (postChanges) {
      let data = {
        ...postChanges,
        id: this.state.savedPost.id,
        tags: this.selectedTags
      }
      this.props.saveDraft(data, res => {
        let savedPost = {
          ...data,
          id: res._id
        }
        this.setState(Object.assign({}, this.state, {
          savedPost,
          isDraft: true
        }))
        let hookOnSaveDraftSuccess = this.props.hookOnSaveDraftSuccess
        if (
          hookOnSaveDraftSuccess &&
          typeof hookOnSaveDraftSuccess === 'function'
        ) {
          hookOnSaveDraftSuccess(savedPost)
        }
      })
    } else {
      alert("当前没有需要保存的内容")
    }
  }
  postChanges () {
    // 在手动保存和点击发表按钮时会调用此方法
    let newTitle = this.title.value,
        newContent = this.content.getAndSetContent(),
        newProvince = this.province.value,
        newCity = this.city.value,
        isIndependentPage = this.isIndependentPage.checked ? this.ipageUrlInput.value.trim() : false,
        savedPost = this.state.savedPost
    if (
      newTitle !== savedPost.title ||
      newContent !== savedPost.content ||
      newProvince !== savedPost.location.province ||
      newCity !== savedPost.location.city ||
      !arraysHaveEqualEles(this.selectedTags, savedPost.tags) ||
      isIndependentPage !== savedPost.isIndependentPage
    ) {
      return {
        title: newTitle,
        content: newContent,
        location: {
          province: newProvince,
          city: newCity
        },
        isIndependentPage
      }
    }
    return false
  }
  notifyTagsChange (tags) {
    this.selectedTags = tags
    if (!arraysHaveEqualEles(tags, this.state.savedPost.tags)) {
      this.props.draftUnsaved()
    }
  }
  handleTextChange (text, html) {
    console.log('html=' + html)
    this.articlePreview.innerHTML = html
    this.$('pre code').each((i, block) => {
      this.hljs.highlightBlock(block)
    })
    if (text !== this.state.savedPost.content) {
      this.props.draftUnsaved()
    }
    let uploadMountPoints = document.querySelectorAll('.upload-mount-point')
    console.log(uploadMountPoints)
    if (uploadMountPoints.length) {
      [].forEach.call(uploadMountPoints, (p, id) => {
        console.log(p)
        let url = p.getAttribute('data-image-url'),
            title = p.getAttribute('data-image-title'),
            props = {url, title, id}
        ReactDOM.render(<ImageUploader {...props} markdownUpdate={this.markdownUpdate} />, p)
      })
    }
  }
  markdownUpdate (id, url) {
    // 实时更新右侧编译的markdown结果
    let lines = this.content.getAndSetContent().split('\n'),
        imageMarkdownRegExp = /^!\[.*\]\((.*)\)$/,
        count = 0
    for (let i = 0, l = lines.length; i < l; i++) {
      if (lines[i].match(imageMarkdownRegExp)) {
        if (count === Number(id)) {
          lines[i] = lines[i].replace(imageMarkdownRegExp, (...match) => {
            return `![${url}](${match[1]})`
          })
          break
        } else {
          count++
        }
      }
    }
    this.content.getAndSetContent(lines.join('\n'), true)
    this.props.draftUnsaved()
  }
  createNewPost () {
    lStorageRemove(ADD_POST_STORAGE_KEY)
    window.location.reload()
  }
  publishPost () {
    if (this.postChanges()) {
      // console.log(this.postChanges())
      alert('文章未保存，请务必先保存之后再发布！')
    } else {
      // console.log(this.state.savedPost)
      this.props.publishPost(this.state.savedPost, () => {
        let hookOnPublishSuccess = this.props.hookOnPublishSuccess
        if (
          hookOnPublishSuccess &&
          typeof hookOnPublishSuccess === 'function'
        ) {
          hookOnPublishSuccess()
        }
        this.setState(Object.assign({}, this.state, {
          isDraft: false
        }))
        alert('文章发布成功！')
      })
    }
  }
  render () {
    let Dialog = this.state.Dialog, dialog
    if (Dialog) {
      dialog = <Dialog
        dialog={this.dialogConfig}
        dialogConfirm={this.toggleDialog}
        ref={ele => this.dialog = ele}
      >
        <form action="#" method='post'>
          <div className="form-field-wrapper">
            <label htmlFor="#article-title">
              文章标题
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="article-title"
              ref={ele => this.title = ele}
              onBlur={this.handleTitleInputBlur}
            />
          </div>
          <div className="form-field-wrapper">
            <label>位置<span className="required">*</span></label>
            <div className="location-select">
              <select
                className="province-select"
                ref={ele => this.province = ele}
                onChange={this.handleProvinceChange}
              >
                <option value="">--请选择--</option>
                <option value="Guangdong">广东</option>
                <option value="Shanxi">陕西</option>
              </select>
              <select
                className="city-select"
                ref={ele => this.city = ele}
                onChange={this.handleCityChange}
              >
                <option value="">--请选择--</option>
                <option value="Swatow">汕头</option>
                <option value="Guangzhou">广州</option>
                <option value="Guangzhou">西安</option>
              </select>
            </div>
          </div>
          <div className="form-field-wrapper">
            <label>标签<span className="required">*</span></label>
            <TagSelect
              selected={this.state.savedPost.tags}
              notifyTagsChange={this.notifyTagsChange}
            />
          </div>
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="set-independent-page"
              ref={ele => this.isIndependentPage = ele}
              onChange={this.handleIPageSettingChange}
            />
            <label htmlFor="set-independent-page"></label>
            <span>设置为独立页面</span>
            <p
              className="ipage-url-setting"
              ref={ele => this.settingIpageUrl = ele}
            >
              <label>页面路径<span className="required">*</span></label>
              <input
                type="text"
                className="ipage-url-input"
                ref={ele => this.ipageUrlInput = ele}
                onBlur={this.handleIpageUrlBlur}
              />
            </p>
          </div>
          <p className="checkbox-wrapper">
            <input type="checkbox" id="share-to-juejin" />
            <label htmlFor="share-to-juejin"></label>
            <span>一键分享到掘金</span>
          </p>
        </form>
      </Dialog>
    }

    // 指示文档保存状态
    let curDraftSaveState = this.props.draftSaveState,
        draftSaveState
    if (curDraftSaveState === draftSaveAllStates.SavingState) {
      draftSaveState = <p className="save-draft-state">正在保存中</p>
    } else if (curDraftSaveState === draftSaveAllStates.ChangeUnsavedState) {
      draftSaveState = <p className="save-draft-state">文章未保存</p>
    } else if (curDraftSaveState === draftSaveAllStates.SaveSuccessState) {
      draftSaveState = <p className="save-draft-state">
        <span>保存成功</span>
        {
          this.props.createNewPost &&
          <a
            href="javascript:void(0);"
            className="create-new-post"
            onClick={this.createNewPost}
          >新建博文</a>
        }
      </p>
    } else if (curDraftSaveState === draftSaveAllStates.SaveFailedState) {
      draftSaveState = <p className="save-draft-state">保存失败</p>
    } else {
      draftSaveState = <p className="save-draft-state">
        {
          this.props.createNewPost &&
          this.state.savedPost.content &&
          <a
            href="javascript:void(0);"
            className="create-new-post"
            onClick={this.createNewPost}
          >新建博文</a>
        }
      </p>
    }
    let publishButton = this.state.isDraft ? <a
      href="javascript:void(0);"
      className="publish-post"
      onClick={this.publishPost}
    >一键发布</a> : <a
      href="javascript:void(0);"
      className="publish-post"
      disabled
    >已发布</a>
    return (
      <div className='edit-post-panel'>
        {dialog}
        <div className="markdown-editor-wrapper">
          <MarkdownEditor
            ref={ele => this.content = ele}
            handleTextChange={this.handleTextChange}
            saveDraft={this.saveDraft}
          />
          <div className="markdown-preview">
            <article className="article-detail-wrapper">
              <main ref={ ele => this.articlePreview = ele }></main>
            </article>
          </div>
        </div>
        <footer className="add-post-footer">
          {draftSaveState}
          <p className="setting-and-publish">
            <i
              className="admin-icon admin-setting-icon"
              ref={ele => this.setting = ele}
              onClick={this.toggleDialog}
            ></i>
            {publishButton}
          </p>
        </footer>
      </div>
    )
  }
}

export default EditPostPanel
