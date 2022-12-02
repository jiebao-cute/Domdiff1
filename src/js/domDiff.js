import {
    ATTR,
    TEXT,
    REPLACE,
    REMOVE
} from './patchTypes'

//导入修改的类型
//获取到补丁包这个文件的目的

let patches = {},
    vnIndex = 0;

function domDiff(oldVDom, newVDom) {
    let index = 0;
    //遍历
    vNodeWalk(oldVDom, newVDom, index)
    //返回补丁包
    console.log(patches)
    return patches
}

function vNodeWalk(oldNode, newNode, index) {
    let vnPatch = [];
    //新节点不存在的话，补丁打删除
    if (!newNode) {
        vnPatch.push({
            type: REMOVE,
            index
        })
    } else if (typeof oldNode === 'string' && typeof newNode === "string") {
        //节点是字符串，就在补丁里面打入字符串
        if (oldNode !== newNode) {
            vnPatch.push({
                type: TEXT,
                text: newNode
            })
        }
    } else if (oldNode.type === newNode.type) {
        //节点类型一样，去遍历他们的props,就是class这些
        const attrPatch = attrsWalk(oldNode.props, newNode.props)
        //判断遍历后的长度，有则说明有不一样的
        if (Object.keys(attrPatch).length > 0) {
            vnPatch.push({
                type: ATTR,
                attrs: attrPatch
            })
        }
        //类型一样，去对比子节点
        childrenWalk(oldNode.children, newNode.children)
    } else {
        vnPatch.push({
            type: REPLACE,
            newNode
        })
    }
    // console.log("~~~~~~Vnpatch~~~~~~~~~")
    // console.log(vnPatch)
    if (vnPatch.length > 0) {
        patches[index] = vnPatch
    }


}

function attrsWalk(oldAttrs, newAttrs) {
    let attrPatch = {}
    for (let key in oldAttrs) {
        //修改属性
        if (oldAttrs[key] !== newAttrs[key]) {
            attrPatch[key] = newAttrs[key]
        }
    }
    for (let key in newAttrs) {
        //新增属性
        if (!oldAttrs.hasOwnProperty(key)) {
            attrPatch[key] = newAttrs[key]
        }
    }
    // console.log("------sttrPatch------")
    // console.log(attrPatch)
    return attrPatch

}
function childrenWalk(oldChildren, newChildren) {
    oldChildren.map((c, idx) => {
        vNodeWalk(c, newChildren[idx], ++vnIndex)
    })
}

export default domDiff