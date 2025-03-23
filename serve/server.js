const WebSocket = require('ws');

// 创建 WebSocket 服务器，监听 8080 端口
const wss = new WebSocket.Server({ port: 8080 });

// 当有客户端连接时
wss.on('connection', (ws) => {
    console.log('新的客户端连接');

    // 当接收到客户端消息时
    ws.on('message', (message) => {
        console.log(`收到消息: ${message}`);

        // 解析消息
        const data = JSON.parse(message);

        // 如果是视频链接消息
        if (data.type === 'videoUrl') {
            // 广播新的视频链接给所有客户端
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'videoUrl', url: data.url }));
                }
            });
        }
    });

    // 当客户端断开连接时
    ws.on('close', () => {
        console.log('客户端断开连接');
    });
});

console.log('WebSocket 服务器已启动，正在监听 ws://localhost:8080');