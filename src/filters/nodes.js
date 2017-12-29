import Vue from 'vue'

export const nodeFilter = Vue.filter('node-filter', (node) => {
  node = addClasses(node, '_cssClass')
  node = addClasses(node, '_labelClass')
  return node
})

const addClasses = (node, className) => {
  let cssClass = node[className]
  cssClass = (cssClass) ? cssClass.split(' ') : []
  cssClass = addOrClean(cssClass, 'inactive', !node.stats.active)

  // if (node.stats.mining) cssClass += ' is-mining'
  node[className] = cssClass.join(' ')
  return node
}

const addOrClean = (classes, name, condition) => {
  if (condition) {
    classes.push(name)
  } else {
    classes = classes.filter((item) => {
      return item !== name
    })
  }
  return classes
}
