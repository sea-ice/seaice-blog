export function arraysHaveEqualEles (a, b) {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0, len = a.length; i < len; i++) {
    if (!(~b.indexOf(a[i]))) return false
  }
  return true
}

export function formatFileSize (size) {
  // 10e2 === 1000
  if (size < 1e3) {
    return `${size} B`
  } else if (size < 1e4) {
    return `${Number(size / 1e3).toFixed(1)} KB`
  } else if (size < 1e6) {
    return `${Math.round(size / 1e3)} KB`
  } else if (size < 10e6) {
    return `${Number(size / 1e6).toFixed(1)} MB`
  } else {
    return `${Math.round(size / 1e6)} MB`
  }
}

export function sortCommentItems (items) {
  if (!items.length) return []
  let timeFields = ['year', 'month', 'date', 'hour', 'minute']
  return items.sort((a, b) => {
    let f
    for (let i = 0, len = timeFields.length; i < len; i++) {
      f = timeFields[i]
      if (a.publishTime[f] === b.publishTime[f]) {
        if (i === len - 1) return 0
        continue
      } else {
        return a.publishTime[f] - b.publishTime[f]
      }
    }
  })
}

export function formatEmojiText (text) {
  if (typeof text !== 'string') return new Error('the parameter must be string')
  return text.replace(/\[em:(\d+)\]/g, (subStr, $1) => {
    let origin = $1
    $1 = Number($1)
    if (
      parseInt($1) === $1
      && $1 > 0
      && $1 <= 30
    ) {
      return `<i class='emoji-icon emoji-icon-${$1}'></i>`
    } else {
      return `[em:${origin}]`
    }
  })
}

export function loadComponentStyle (...componentStyles) {
  for (let styles of componentStyles) {
    for (let ss of styles) {
      let [styleId, style] = ss
      if (!document.getElementById(`style-${styleId}`)) {
        let styleEle = document.createElement('style')
        styleEle.id = `style-${styleId}`
        styleEle.innerHTML = style
        document.head.appendChild(styleEle)
      }
    }
  }
}


