export function getRootFontSize () {
  return document.querySelector('.app-header').clientWidth * 16 / 1024
}

export function elementPageTop (ele) {
  let top = 0
  while(ele !== null) {
    top += ele.offsetTop
    ele = ele.offsetParent
  }
  return top
}
