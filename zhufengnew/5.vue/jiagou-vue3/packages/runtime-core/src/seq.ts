// 如何求最长递增子序列  最终序列的索引是我们要的结果

// 先求出最长递增子序列的个数

// 3 5 7 6 2 8 8 11 4 10  (贪心+二分查找)

// 找更有潜力的一项 作为末尾


// [1,2,3,4,5,6,7,8,9]


// 0 也忽略掉  0是新增
export function getSeq(arr){
  const result=[0]
  const len=arr.length

  const p=arr.slice(0).fill(-1);//用来存储标记的索引,内容无所谓  主要是和数组的长度一致


  let start;
  let end;
  let middle;
  for(let i=0;i<len;i++){
    const arrI=arr[i]
    if(arrI!==0){
      let resultLastIndex=result[result.length-1];//获取结果集中的最后一个

      // 和arrI 中的去比较
      if(arr[resultLastIndex]<arrI){
        result.push(i)
        p[i]=resultLastIndex
        continue
      }
      // 如果比当前末尾小 需要通过二分查找找到比当前这一项大的用这一项替换掉他
      start=0;
      end=result.length-1;

      while(start<end){
        middle=((start+end)/2)|0;//向下取值


        if(arr[result[middle]]<arrI){
          start = middle + 1;
        }else{
          end = middle
        }
      }

      // 最终start   和  end 会重合
      p[i]=result[start -1];//记录前一个人的索引
      result[start]=i;//直接用当前的索引换掉

    }
  }



  // 实现倒序追踪
  let i=result.length;//总长度
  let last=result[i-1];//获取最后一项

  while(i-->0){
    result[i]=last;//最后一项是正确
    last=p[last];//通过最后一项找到对应的结果 将他作为最后一项来进行追踪
  }



  return result

}


