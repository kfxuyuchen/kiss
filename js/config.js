/** 页面文案与内容配置 — 修改这里即可定制 */

/** GitHub Pages 地址（部署后访问） */
export const SITE = {
    repo: 'kiss',
    url: 'https://kfxuyuchen.github.io/kiss/',
};

export const CONFIG = {
    title: 'For You ❤️',

    hero: {
        tag: 'A Love Story',
        phrases: ['献给我的爱人', 'For You', '永远爱你'],
        subtitle: '每一颗星，都是我想你的证明\n向下滚动，开启这段浪漫旅程',
        buttonText: '✨ 点击绽放玫瑰',
    },

    constellation: {
        tag: 'Constellation',
        title: '我们的星座',
        subtitle: '拖动连线，点击星星点亮它们',
        hint: '已连接 {count} 颗星 · 组成一颗爱心',
    },

    memories: {
        tag: 'Memories',
        title: '那些美好的瞬间',
        subtitle: '点击卡片，翻转查看',
        cards: [
            {
                icon: '🌸',
                title: '初见',
                hint: '点击翻转 →',
                date: 'THE BEGINNING',
                text: '那一刻，世界仿佛静止了。你的笑容，是我见过最美的风景。',
            },
            {
                icon: '🌙',
                title: '相伴',
                hint: '点击翻转 →',
                date: 'EVERY DAY',
                text: '每一个平凡的日子，因为有你而变得特别。愿与你共度每个朝夕。',
            },
            {
                icon: '✨',
                title: '未来',
                hint: '点击翻转 →',
                date: 'FOREVER',
                text: '未来的路还很长，但我只想牵着你的手，一步一步走下去。',
            },
        ],
    },

    letter: {
        tag: 'Love Letter',
        title: '写给你的信',
        content: `亲爱的，

写下这些字的时候，我想起了我们在一起的每一个瞬间。你的温柔、你的笑容、你说过的话，都深深刻在我心里。

我想告诉你，遇见你是我这辈子最幸运的事。无论未来如何，我都想陪在你身边，做你最坚实的依靠。

谢谢你，让我相信爱情。`,
        signature: '—— 永远爱你的人 ❤️',
    },

    interactive: {
        tag: 'Interactive',
        title: '收集爱心',
        subtitle: '快速点击飘来的爱心，看看你能收集多少',
    },

    finale: {
        tag: 'Forever',
        title: 'I Love You',
        subtitle: '谢谢你出现在我的生命里\n愿这份爱，如星辰永恒',
        buttonText: '🎆 释放烟花',
    },

    dream: {
        tag: 'Our Dream',
        title: '车与房子',
        subtitle: '开着小车，驶向我们的家\n点击汽车出发，点击大房子点亮灯光',
        hint: '🚗 点击小汽车或下方按钮，驶向大房子',
        driveButton: '🚗 出发回家',
    },

    nav: [
        { id: 'hero', label: '开始' },
        { id: 'constellation', label: '星座' },
        { id: 'memories', label: '回忆' },
        { id: 'letter', label: '情书' },
        { id: 'dream', label: '梦想' },
        { id: 'interactive', label: '互动' },
        { id: 'finale', label: '终章' },
    ],
};

export const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
