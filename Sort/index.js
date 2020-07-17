function bubbleSort(arr) {
    const len = arr.length
    if(len <= 1) return
    for (let i = 0;i<len-1;i++) {
        let hasChange = false
        for (let j = 0;j<len-1-i;j++){
            if(arr[j]>arr[j+1]) {
                [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
                hasChange = true
            }
        }
        if (!hasChange)break;
    }
    return arr
}
// 最优	 平均	最坏  内存   稳定
// n	n^2	  n^2	 1     yes   

function insertSort(arr) {
    const len = arr.length
    if (len <= 1)return
    let preIndex,current
    for (let i = 0;i<len -1;i++){
        preIndex = i-1 //待比较的元素的下标
        current = arr[i] // 当前元素
        if(preIndex >=0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex]
            preIndex--
        }

        if (preIndex+1 !=i) {
            arr[preIndex+1] = current
        }
    }
    return arr
}