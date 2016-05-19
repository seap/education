const adaptString = `function adaptFont() {
  var maxWidth = 750,
      minWidth = 320,
      minSize = 16,
      currentWidth = Math.min(document.documentElement.getBoundingClientRect().width, maxWidth);
  //设置基准值
  document.documentElement.style.fontSize =  (currentWidth/minWidth)*minSize + 'px';
}

adaptFont();`;

export default adaptString;
