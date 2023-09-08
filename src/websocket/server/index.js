// 引入websocket
const ws = require('nodejs-websocket')
// 设置端口号
const port = 3003
var user = 0
const server = ws.createServer((connection) => {
  user += 1
  // 定义连接进来的用户的用户名
  connection.nickname = 'user' + user
  // 用户发送消息
  let mes = {}
  //   console.log(connection.nickname)
  mes.type = 'enter'
  mes.name = '用户' + connection.nickname + '进来了'
  broadcast(JSON.stringify(mes))
  console.log('客户端连接了')
  connection.on('text', (str) => {
    console.log('用户发送消息')
    mes.type = 'message'
    mes.value = connection.nickname + '说:' + str
    broadcast(JSON.stringify(mes))
  })
  // 用户断开连接
  connection.on('close', (str) => {
    mes.type = 'lever'
    console.log('用户断开连接')
  })
})

function broadcast(str) {
  server.connections.forEach((connection) => {
    connection.sendText(str)
  })
}
server.listen(port)
