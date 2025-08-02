import ora from 'ora'
export const wrapLoading=async (message,fn)=>{
  const spinner=ora(message)
  spinner.start()
  const res=await fn()
  spinner.succeed()
  return res;

}