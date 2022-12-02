import {
    ATTR,
    TEXT,
    REPLACE,
    REMOVE
} from './patchTypes';
import { setAttrs, render } from './virtualDom';
import Element from './Element';

let finalPatches = {},
    rnIndex = 0;

function doPatch(rDom, patches) {
    finalPatches = patches;
    rNodeWalk(rDom);
}

function rNodeWalk(rNode) {
    // console.log([...rNode.childNodes])
    //深度遍历，遍历到当前节点最底层，再依次向外
    const rnPatch = finalPatches[rnIndex++],
        childNodes = rNode.childNodes;


    [...childNodes].map((c) => {
        rNodeWalk(c);
    });

    if (rnPatch) {
        patchAction(rNode, rnPatch);
    }
}
//let i = 0
function patchAction(rNode, rnPatch) {
    //当前的rnode是最底层的节点，补丁也是最底层的补丁
    //接下来就是属性对比，最后才是标签更改
    // i++
    //console.log(i)
    //console.log(rNode)

    console.log(rnPatch)

    rnPatch.map((p) => {
        switch (p.type) {
            case ATTR:
                for (let key in p.attrs) {
                    const value = p.attrs[key];

                    if (value) {
                        setAttrs(rNode, key, value);
                    } else {
                        rNode.removeAttribute(key);
                    }
                }
                break;
            case TEXT:
                rNode.textContent = p.text;
                break;
            case REPLACE:
                const newNode = (p.newNode instanceof Element)
                    ? render(p.newNode)
                    : document.createTextNode(p.newNode);

                rNode.parentNode.replaceChild(newNode, rNode);
                break;
            case REMOVE:
                rNode.parentNode.removeChild(rNode);
                break;
            default:
                break;
        }
    });
}

export default doPatch;

  // vNode = virtual Node
  // vnPatch = virtual Node patch
  // rNode = real Node
  // rnPatch = real Node patch