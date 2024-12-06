import dbUtils from "./util.strotage";
var stringSimilarity = require("string-similarity");

/**
 * 16进制颜色转换透明度后的16进制颜色值
 * @param {string} color 原始颜色 #FFFFFF
 * @param {number} opacity 颜色透明度 10 20
 * @returns {string} 转换后的颜色值
 */
export const adjustColorOpacity = function (color, opacity) {
    // 移除 # 号（如果有）
    color = color.replace("#", "");

    // 将十六进制颜色值转换为 RGB 值
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // 将透明度转换为 0 到 1 之间的值
    opacity = opacity / 100;

    // 计算插值后的颜色值
    let interpolatedR = Math.round((1 - opacity) * 255 + opacity * r);
    let interpolatedG = Math.round((1 - opacity) * 255 + opacity * g);
    let interpolatedB = Math.round((1 - opacity) * 255 + opacity * b);

    // 将插值后的 RGB 值转换回十六进制颜色值
    let result = "#" + (interpolatedR < 16 ? "0" : "") + interpolatedR.toString(16);
    result += (interpolatedG < 16 ? "0" : "") + interpolatedG.toString(16);
    result += (interpolatedB < 16 ? "0" : "") + interpolatedB.toString(16);

    return result;
}

/**
 * 判断空对象
 * @param {Object} obj 原始对象
 * @returns {Boolean} 返回true/false
 */
export const isEmptyObject = function (obj) {
    return JSON.stringify(obj) === '{}';
}


/**
 * 替换字符串中间的数字为指定字符
 * @param {string} str 原始字符串
 * @param {string} replaceChar 替换的字符，默认为'*'
 * @param {number} numDigits 保留的数字位数，默认为1
 * @returns {string} 替换后的字符串
 */
export const replaceMiddleDigits = (str, replaceChar = '*', numDigits = 1) => {
    if (str.length < numDigits + 2) {
        return str;
    }
    const firstPart = str.substring(0, numDigits);
    const lastPart = str.substring(str.length - numDigits);
    const middlePart = replaceChar.repeat(str.length - numDigits * 2);

    return firstPart + middlePart + lastPart;
}


/**
 * 判断本地存储用户的权限信息作对比
 * @param {string} permission 权限标识 ‘sys:demon:list’
 * @returns {Boolean} 返回true/false
 */
export const hasPerms = function (permission) {
    const permissionList = dbUtils.get('Frontperms');
    if (permissionList.includes('*')) return true
    return permissionList.includes(permission)
}

export const getBottomDivs = function(tag) {
    // 检查当前元素是否是 div 且没有直接子 div
    const children = Array.from(tag.children).filter(child => child.tagName.toLowerCase() === 'div');

    // 如果当前 div 没有子 div，则返回当前 div
    if (children.length === 0) {
        return [tag]; // 返回当前 div 作为最底层 div
    }

    let bottomDivs = [];
    // 遍历所有直接的子 div 元素，并递归处理
    children.forEach(child => {
        bottomDivs = bottomDivs.concat(getBottomDivs(child)); // 递归查找子 div
    });

    return bottomDivs;
}
 // 去除多余的空格（忽略空格的影响）
 export const preprocessString = function(text) {
    return text.replace(/\s+/g, '').trim();
}
// 提取 HTML 中的文本
export const getHtmlText = function(bottomDivs) {
    
    return bottomDivs.map(div => div.textContent.trim());
}

export const findMostSimilarSubstring = function(A, B) {
    const lenA = A.length;
    const lenB = B.length;

    let maxSimilarity = 0;
    let mostSimilarSubstring = '';
    let i = 0;
    const subB = preprocessString(B);
    let beginIndex = 0;
    let endIndex = 0;
    while (i < lenA) {
        let subString = "";
        let j = i;

        for (; j < lenA; j++) {
            subString += A[j];
            if (subString.length >= subB.length) {
                break;
            }
        }

        const similarity = stringSimilarity.compareTwoStrings(subString, subB);

        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarSubstring = subString;
            beginIndex = i;
            endIndex = j;
        }

        
        if (maxSimilarity > 0.9) {
            return {beginIndex:beginIndex, endIndex:endIndex, substring: mostSimilarSubstring, similarity: maxSimilarity };
        }
        i += Math.max(1, Math.floor((j - i) * (1 - similarity)));
    }

    return { beginIndex:beginIndex, endIndex:endIndex,substring: mostSimilarSubstring, similarity: maxSimilarity };
}

export const getMatchArray = function(textArray,matchStr){
    const combinedString = textArray.join('');
    const delSpaceStr = matchStr;
    const positions = [];
    let pos = combinedString.indexOf(delSpaceStr);

    // 循环查找所有匹配项的位置
    while (pos !== -1) {
        positions.push(pos);
        // 从找到的匹配位置之后继续搜索
        pos = combinedString.indexOf(delSpaceStr, pos + 1);
    }
    //let matchStrLen = len(delSpaceStr);
    let textArrayLen = textArray.length;

    let i = 0;
    let j =0;
    let totalLen = 0
    let htmlPos = []
    console.log(combinedString)
    console.log(positions)
    while (i < textArrayLen && j < positions.length) {
        if(positions[j]<totalLen){
            console.log(textArray[i-1])
            htmlPos.push(i-1)
            j++
        }else{
            totalLen += textArray[i].length
            i++
        }   
    }
    return htmlPos
    console.log(htmlPos)
}