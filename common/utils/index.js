import fetch from 'isomorphic-fetch'
import pinyin from 'pinyin'

export function ajax(method, url, postData) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: postData && JSON.stringify(postData)
  }).then(
    response => response.json()
  ).then(response => {
    if (response.code === 0) {
      return response.data
    } else {
      if (response.message) {
        alert(response.message)
      }
      throw new Error(`POST ${url} Error!`)
    }
  })
}

export function toFixed2 (num) {
  return num > 9 ? num : `0${num}`
}

export function formatDate (d, mode) {
  let {year, month, date, hour, minute} = d
  switch (mode) {
    case 'number-format':
      console.log('number-format')
      return `${year}-${toFixed2(month + 1)}-${toFixed2(date)} ${toFixed2(hour)}:${toFixed2(minute)}`
    case 'object-format': {
      console.log('object-format')
      d = typeof d === 'string' ? new Date(d) : d
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let date = d.getDate()
      let hour = d.getHours()
      let minute = d.getMinutes()
      return {year, month, date, hour, minute}
    }
    case 'zh-cn':
      return `${year}年${month + 1}月${date}日 ${hour}:${minute}`
    default:
      console.log('default-format')
      const months = ['Jan', 'Febr', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      const datePostfixes = ['st', 'nd', 'rd', 'th']
      let datePostfix
      if ((date > 20 && date < 24) || (date < 4)) {
        datePostfix = datePostfixes[date > 20 ? (date - 21) : (date - 1)]
      } else {
        datePostfix = datePostfixes[3]
      }
      return `${toFixed2(hour)}:${toFixed2(minute)} on ${months[month]} ${date}${datePostfix}, ${year}`
  }
}

// 获取给定名称的第一个字母（如果是中文先转化为对应的拼音）
export const firstLetterOfName = (() => {
  let ch_char_begin = /^[\u4e00-\u9fa5]/,
      en_char_begin = /^[A-Za-z]/
  return (name) => {
    let letterClass
    if (name.match(ch_char_begin)) {
      letterClass = pinyin(name)[0][0][0]
    } else if (name.match(en_char_begin)) {
      letterClass = name[0]
    } else {
      letterClass = '#'
    }
    return letterClass
  }
})()

export const transformMarkdown = (() => {
  let strategies = [{
    test: /^#+ +(.*)$/,
    template (line, match) {
      let titleLevel = line.split(/ +/)[0].length
      return `<h${titleLevel}>${match[1]}</h${titleLevel}>`
    }
  }, {
    test: /^> +(.*)$/,
    template (line, match) {
      return `<blockquote><p>${match[1]}</p></blockquote>`
    }
  }, {
    test: /^!\[(.*)\]\((.*)\)$/
  }]
  let nestStrategies = [{
    test: /\*\*((\\\*|[^\*\\(?=\*)])+)\*\*/g,
    template (catchGroup) {
      return `<strong>${catchGroup[0]}</strong>`
    }
  }, {
    test: /\*((\\\*|[^\*\\(?=\*)])+)\*/g,
    template (catchGroup) {
      return `<em>${catchGroup[0]}</em>`
    }
  }, {
    test: /`([^`]+)`/g,
    template (catchGroup) {
      return `<span class="emphasize">${catchGroup[0]}</span>`
    }
  }, {
    test: /\[(.+?)\]\((\S+?)\)/g,
    template (catchGroup) {
      return `<a href="${catchGroup[1]}">${catchGroup[0]}</a>`
    }
  }]
  let listStrategies = {
    ol: {
      test: /^(\s*)(\d+)\. \s*(\S.*)$/,
      template (match) {
        return `<li>${match[2]}、${match[3]}</li>`
      }
    },
    ul: {
      test: /^(\s*)\- \s*(\S.*)$/,
      template (match) {
        return `<li>${match[2]}</li>`
      }
    }
  }
  return (text, noUpload) => {
    if (!text.trim()) return ''
    let lines = text.split('\n')
    let result = ''
    let codeRegExp = /^```/,
        codeConcatFlag = false,
        codeFragment = ''

    let listConstructFlag = false,
        nestListConstructFlag = false,
        outerListFragment = '',
        nestListFragment = '',
        matchList, matchUl
    for (let i = 0, len = lines.length; i < len; i++) {
      if (lines[i].trim()) {
        if (codeRegExp.test(lines[i])) {
          codeConcatFlag = !codeConcatFlag
          if (!codeConcatFlag) {
            result += `<section class="code-wrapper"><pre><code>${codeFragment}</code></pre></section>`
            codeFragment = ''
          }
          continue
        }
        if (codeConcatFlag) {
          codeFragment += `${lines[i]}\n`
        } else {
          if (
            (matchList = lines[i].match(listStrategies.ol.test))
              || (matchUl = lines[i].match(listStrategies.ul.test))
          ) {
            console.log(matchUl)
            if (matchList) {
              matchList.tag = 'ol'
            } else {
              matchList = matchUl
              matchList.tag = 'ul'
            }
            let tag = matchList.tag
            if (!listConstructFlag) {
              listConstructFlag = true
              outerListFragment = `<${tag}>${listStrategies[tag].template(matchList)}`
            } else {
              if (matchList[1]) {
                // 嵌套列表
                if (!nestListConstructFlag) {
                  nestListConstructFlag = true
                  nestListFragment = `<${tag}>`
                }
                nestListFragment += listStrategies[tag].template(matchList)
              } else {
                if (nestListConstructFlag) {
                  nestListConstructFlag = false
                  nestListFragment += `</${nestListFragment.substr(1, 2)}>`
                  outerListFragment += `<li>${nestListFragment}</li>`
                }
                outerListFragment += listStrategies[tag].template(matchList)
              }
            }
          } else {
            let match, isPlainText = true,
                template = (line, match) => {
                  return noUpload ?
                  `<figure>
                    <img src=${match[1]} alt=""/>
                    <figcaption>
                      <p className="figure-caption">${match[2]}</p>
                    </figcaption>
                  </figure>` :
                  `<div class="upload-mount-point" data-image-url="${match[1] || ''}" data-image-title="${match[2] || ''}"></div>`
                }
            for (let s = 0, sLen = strategies.length; s < sLen; s++) {
              if (match = lines[i].match(strategies[s].test)) {
                isPlainText = false
                if (s === sLen - 1) strategies[s].template = template
                result += strategies[s].template(lines[i], match)
                break
              }
            }
            if (isPlainText) {
              result += `<p>${lines[i]}</p>`
            }
          }
        }
      } else {
        if (listConstructFlag) {
          listConstructFlag = false
          outerListFragment += `</${outerListFragment.substr(1, 2)}>`
          result += outerListFragment
          outerListFragment = ''
        }
      }
    }
    for (let n = 0, nLen = nestStrategies.length; n < nLen; n++) {
      result = result.replace(nestStrategies[n].test, (subStr, ...catchGroup) => {
        return nestStrategies[n].template(catchGroup)
      })
    }
    console.log(result)
    result = result.replace(/\\\*/g, '*')
    return result
  }
})()
