import Element from "./Element";
//创建实例对象
function createElement(type, props, children) {

    return new Element(type, props, children)

}
//添加节点属性
function setAttrs(node, prop, value) {
    switch (prop) {
        //key为value
        case 'value':
            if (node.tagName === 'INPUT' || node.tagName === "TEXTAREA") {
                node.value = value
            } else {
                node.setAttribute(prop, value)
            }
            break;
        case "style":
            node.style.cssText = value
            break;
        default:
            node.setAttribute(prop, value)
            break
    }
}
//渲染函数
function render(vDom) {
    const { type, props, children } = vDom
    const el = document.createElement(type)
    for (let key in props) {
        setAttrs(el, key, props[key])
    }
    //递归渲染，考虑到children
    vDom.children.map((c) => {
        c = c instanceof Element ?
            render(c)
            :
            document.createTextNode(c)

        el.appendChild(c)
    })
    return el
}

function renderDom(el, rootEl) {
    rootEl.appendChild(el)
}
export {
    createElement,
    render,
    setAttrs,
    renderDom
}