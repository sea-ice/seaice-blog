import React, {Component} from 'react'

import {
  IMAGE_UPLOAD_INITIAL_STATE,
  SELECTED_IMAGE,
  IMAGE_UPLOADING,
  IMAGE_UPLOAD_FAILED,
  LOADING_IMAGE,
  LOADING_IMAGE_SUCCESS,
  LOADING_IMAGE_FAILED
} from '../constants'
import config from '../../config'
import {formatFileSize} from '../../common/utils'
import ImageUpload from '../../common/utils/upload'
export default class ImageUploader extends Component {
  constructor (props) {
    super(props)
    if (props.url) {
      this.loadImage(props.url, false, true)
    } else {
      this.state = {
        code: IMAGE_UPLOAD_INITIAL_STATE
      }
    }
    this.triggerFileInputClick = this.triggerFileInputClick.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.cancelUpload = this.cancelUpload.bind(this)
  }
  triggerFileInputClick () {
    this.file.click()
  }
  handleFileChange () {
    console.log(this.file.files) // 0
    let files = this.file.files
    if (files.length) {
      this.setState({
        code: SELECTED_IMAGE,
        selectedFile: files[0]
      })
    }
  }
  uploadImage () {
    this.setState(Object.assign({}, this.state, {
      code: IMAGE_UPLOADING,
      percent: 0
    }))
    let imageData = new FormData(),
        selectedFile = this.state.selectedFile,
        self = this
    imageData.append('postImage', selectedFile)
    let upload = new ImageUpload({
      url: `${config.SERVER_URL}/upload`,
      data: imageData,
      onProgress (e) {
        if (e.total > 0) {
          let percent = e.loaded / e.total * 100
          console.log(`${percent}%`)
          self.setState(Object.assign({}, this.state, {
            percent
          }))
        }
      },
      onSuccess (response) {
        if (response.code === 0) {
          self.loadImage(response.data.url, true)
        }
      },
      onError (err) {
        console.log(err)
        self.setState({
          code: IMAGE_UPLOAD_FAILED
        })
      }
    })
  }
  cancelUpload () {
    this.setState({
      code: IMAGE_UPLOAD_INITIAL_STATE
    })
    this.file.value = '' // 清除文件选择控件选择的文件
  }
  loadImage (url, updateMarkdown, construct) {
    let image = new Image()
    if (construct) {
      this.state = {
        code: LOADING_IMAGE
      }
    } else {
      this.setState({
        code: LOADING_IMAGE
      })
    }
    image.onload = () => {
      this.setState({
        code: LOADING_IMAGE_SUCCESS,
        url
      })
      if (updateMarkdown) this.props.markdownUpdate(this.props.id, url)
    }
    image.onerror = () => {
      this.setState({
        code: LOADING_IMAGE_FAILED
      })
    }
    image.src = url
  }
  render () {
    let imageUploader,
        code = this.state.code,
        fileInput = <input
          type="file"
          accept="image/*"
          className="image-uploader"
          onChange={this.handleFileChange}
          ref={ele => this.file = ele}
        />
    if (code === IMAGE_UPLOAD_INITIAL_STATE) {
      imageUploader = <div className="image-uploader-wrapper before-upload">
        {fileInput}
        <a
          href="javascript:void(0);"
          className="uploader-click-area"
          onClick={this.triggerFileInputClick}
        ></a>
        <div className="upload-info">
          <i className="icon upload-icon"></i>
          <p className="upload-instruction">点击上传图片</p>
        </div>
      </div>
    } else if (code === SELECTED_IMAGE || code === IMAGE_UPLOAD_FAILED) {
      let selectedFile = this.state.selectedFile
      imageUploader = <div className="image-uploader-wrapper selected-file">
        {fileInput}
        <div className="upload-info">
          <p className="file-info">
            <span className="file-name">{selectedFile.name}</span>&nbsp;&nbsp;
            <span className="file-size">{formatFileSize(selectedFile.size)}</span>
          </p>
          { code === IMAGE_UPLOAD_FAILED && <p className="upload-failed">上传失败！</p> }
          <p className="buttons-wrapper">
            <a
              href="javascript:void(0);"
              onClick={this.uploadImage}
            >{code === SELECTED_IMAGE ? '上 传' : '重 试'}</a>
            <a
              href="javascript:void(0);"
              onClick={this.triggerFileInputClick}
            >重新选择</a>
            <a
              href="javascript:void(0);"
              onClick={this.cancelUpload}
            >取 消</a>
          </p>
        </div>
      </div>
    } else if (code === IMAGE_UPLOADING) {
      let selectedFile = this.state.selectedFile
      imageUploader = <div className="image-uploader-wrapper uploading">
        {fileInput}
        <div className="upload-info">
          <p className="file-info">
            <span className="file-name">{selectedFile.name}</span>&nbsp;&nbsp;
            <span className="file-size">{formatFileSize(selectedFile.size)}</span>
          </p>
          <div className="upload-progress">
            <div
              className="upload-finished"
              style={{width: `${this.state.percent}%`}}
            ></div>
          </div>
          <p className="buttons-wrapper">
            <a href="javascript:void(0);">停止上传</a>
            <a
              href="javascript:void(0);"
              onClick={this.cancelUpload}
            >取 消</a>
          </p>
        </div>
      </div>
    } else if (code === LOADING_IMAGE) {
      imageUploader = <div className="image-uploader-wrapper loading-image">
        {fileInput}
        <div className="upload-info">
          <i className="icon loading-icon"></i>
          <p className="upload-instruction">加载图片中...</p>
        </div>
      </div>
    } else if (code === LOADING_IMAGE_SUCCESS) {
      let image = <figure>
        <img src={this.state.url} alt=""/>
        {
          this.props.title &&
          <figcaption>
            <p className="figure-caption">{this.props.title}</p>
          </figcaption>
        }
      </figure>
      imageUploader = <div className="image-uploader-wrapper loading-success">
        {fileInput}
        {image}
        <div className="mask">
          <a
            href="javascript:void(0);"
            className="uploader-click-area"
            onClick={this.triggerFileInputClick}
          ></a>
          <div className="upload-info">
            <i className="icon reselect-icon"></i>
            <p className="upload-instruction">重新选择</p>
          </div>
        </div>
      </div>
    } else if (code === LOADING_IMAGE_FAILED) {
      imageUploader = <div className="image-uploader-wrapper loading-failed">
        {fileInput}
        <div className="upload-info">
          <i className="icon error-icon"></i>
          <p className="upload-instruction">
            图片加载出错，
            <a
              href="javascript:void(0);"
              onClick={this.triggerFileInputClick}
            >重新选择</a>
          </p>
        </div>
      </div>
    }
    return imageUploader
  }
}
