// 防抖

export function debounce(fn,delay = 1000){
  let timer = null //借助闭包
  return function() {
      if(timer){
          clearTimeout(timer)
      }
      timer = setTimeout(fn,delay) // 简化写法
  }
}