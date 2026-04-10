// ============================================
// PM社区 初始用户数据
// 使用说明：将此数据注入到 app.js 的用户系统中
// ============================================

const INITIAL_USERS = [
    {
        id: "u001",
        name: "李产品",
        avatar: "https://i.pravatar.cc/150?img=1",
        title: "高级产品经理",
        company: "字节跳动",
        tags: ["B端", "中台", "策略"],
        followers: 1250,
        isExpert: true,
        badge: "官方认证"
    },
    {
        id: "u002",
        name: "王小明",
        avatar: "https://i.pravatar.cc/150?img=3",
        title: "产品经理",
        company: "腾讯",
        tags: ["C端", "社交", "用户增长"],
        followers: 890,
        isExpert: false,
        badge: "活跃用户"
    },
    {
        id: "u003",
        name: "张策略",
        avatar: "https://i.pravatar.cc/150?img=5",
        title: "产品总监",
        company: "阿里",
        tags: ["策略", "电商", "商业化"],
        followers: 3200,
        isExpert: true,
        badge: "KOL"
    },
    {
        id: "u004",
        name: "陈小白",
        avatar: "https://i.pravatar.cc/150?img=8",
        title: "产品助理",
        company: "创业公司",
        tags: ["学习", "求职", "B端"],
        followers: 120,
        isExpert: false,
        badge: "新人"
    },
    {
        id: "u005",
        name: "刘数据",
        avatar: "https://i.pravatar.cc/150?img=11",
        title: "数据产品经理",
        company: "美团",
        tags: ["数据", "BI", "策略"],
        followers: 680,
        isExpert: true,
        badge: "数据专家"
    },
    {
        id: "u006",
        name: "赵设计",
        avatar: "https://i.pravatar.cc/150?img=12",
        title: "产品设计师",
        company: "网易",
        tags: ["交互", "体验", "UI"],
        followers: 450,
        isExpert: false,
        badge: "设计师"
    },
    {
        id: "u007",
        name: "孙运营",
        avatar: "https://i.pravatar.cc/150?img=15",
        title: "产品运营",
        company: "拼多多",
        tags: ["增长", "运营", "C端"],
        followers: 320,
        isExpert: false,
        badge: "运营达人"
    },
    {
        id: "u008",
        name: "周经验",
        avatar: "https://i.pravatar.cc/150?img=16",
        title: "产品专家",
        company: "自由职业",
        tags: ["培训", "咨询", "职业规划"],
        followers: 2100,
        isExpert: true,
        badge: "导师"
    },
    {
        id: "u009",
        name: "吴技术",
        avatar: "https://i.pravatar.cc/150?img=20",
        title: "技术产品经理",
        company: "小米",
        tags: ["AI", "硬件", "IoT"],
        followers: 560,
        isExpert: false,
        badge: "技术派"
    },
    {
        id: "u010",
        name: "郑求职",
        avatar: "https://i.pravatar.cc/150?img=22",
        title: "产品经理（求职中）",
        company: "-",
        tags: ["求职", "转型", "学习"],
        followers: 45,
        isExpert: false,
        badge: "求职中"
    }
];

// 导出到 localStorage 的函数
function initUsers() {
    localStorage.setItem('pmchat_users', JSON.stringify(INITIAL_USERS));
    console.log('✅ 用户数据初始化完成，共 ' + INITIAL_USERS.length + ' 个用户');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initUsers);
