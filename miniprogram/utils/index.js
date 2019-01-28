const orderByTime = (data) => {
  return data.sort(sortFunction)
}
const sortFunction = (a, b) => {
  return a.time < b.time
}
const toFix = (data)=>{
  data.map(item=>{
    item.duration =  (item.duration/1000).toFixed(1)
  })
  return data
}
const sortByDateTime = (a,b) => {
  return a.dateTime < b.dateTime
}
const orderByDateTime = (data) =>{
  return data.sort(sortByDateTime)
}
module.exports = {
  orderByTime: orderByTime,
  toFix,
  orderByDateTime
}