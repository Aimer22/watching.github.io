const ws = new WebSocket('ws://localhost:8080');

const videoUrlInput = document.getElementById('videoUrlInput');
const setVideoUrlButton = document.getElementById('setVideoUrlButton');
const bilibiliVideo = document.getElementById('bilibiliVideo');

// 当 WebSocket 连接打开时
ws.onopen = () => {
    console.log('已连接到 WebSocket 服务器');
};

// 当接收到消息时
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // 如果是视频链接消息
    if (data.type === 'videoUrl') {
        // 更新 iframe 的 src
        const bvId = extractBvId(data.url);
        if (bvId) {
            bilibiliVideo.src = `https://player.bilibili.com/player.html?bvid=${bvId}&autoplay=1`;
        }
    }
};

// 当 WebSocket 连接关闭时
ws.onclose = () => {
    console.log('WebSocket 连接已关闭');
};

// 当 WebSocket 发生错误时
ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
};

// 提取 B站视频的 BV 号
function extractBvId(url) {
    const bvRegex = /(BV[0-9a-zA-Z]{10})/;
    const match = url.match(bvRegex);
    return match ? match[1] : null;
}

// 设置视频链接
function setVideoUrl() {
    const url = videoUrlInput.value.trim();
    if (url) {
        const bvId = extractBvId(url);
        if (bvId) {
            // 发送视频链接到服务器
            ws.send(JSON.stringify({ type: 'videoUrl', url }));
        } else {
            alert('请输入有效的 B站视频链接！');
        }
    } else {
        alert('请输入视频链接！');
    }
}

// 绑定按钮点击事件
setVideoUrlButton.addEventListener('click', setVideoUrl);