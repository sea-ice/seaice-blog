export default function ImageUpload (option) {
  let {url, data, onProgress, onSuccess, onError} = option
  this.xhr = new XMLHttpRequest()
  this.xhr.onreadystatechange = () => {
    if (
      this.xhr.status === 200 &&
      this.xhr.readyState === 4
    ) {
      if (typeof onSuccess === 'function') onSuccess(
        getResponseBody(this.xhr)
      )
    }
  }
  this.xhr.onerror = err => {
    if (onError && typeof onError === 'function') {
      onError(err)
    }
  }
  this.xhr.open('POST', url, true)
  // console.log(this.xhr.upload)
  if (this.xhr.upload && onProgress) {
    this.xhr.upload.onprogress = onProgress
  }
  this.xhr.send(data)
}

function getResponseBody (xhr) {
  let text = xhr.responseText || xhr.response
  if (!text) return text
  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
