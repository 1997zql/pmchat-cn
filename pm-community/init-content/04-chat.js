// ============================================
// PM社区 闲聊区初始消息
// 使用说明：将此数据注入到聊天消息列表中
// ============================================

const INITIAL_CHAT_MESSAGES = [
    // 摸鱼时间话题
    {
        id: "msg001",
        userId: "u002",
        content: "下午茶时间到！大家今天摸鱼了吗？☕",
        topic: "摸鱼时间",
        likes: 23,
        time: "15:32"
    },
    {
        id: "msg002",
        userId: "u004",
        content: "刚被老板拉去开了2小时的会，全程在走神...",
        topic: "摸鱼时间",
        likes: 45,
        time: "15:35"
    },
    {
        id: "msg003",
        userId: "u007",
        content: "周五下午战斗力为零，只想下班",
        topic: "摸鱼时间",
        likes: 67,
        time: "15:38"
    },
    {
        id: "msg004",
        userId: "u001",
        content: "推荐一个摸鱼神器：Hidden Brain 播客，听完感觉自己变聪明了 😂",
        topic: "摸鱼时间",
        likes: 89,
        time: "15:42"
    },
    {
        id: "msg005",
        userId: "u005",
        content: "有人用Cursor写PRD吗？感觉AI辅助写作越来越香了",
        topic: "摸鱼时间",
        likes: 34,
        time: "15:50"
    },

    // 求职交流话题
    {
        id: "msg006",
        userId: "u010",
        content: "大厂HC是真的少还是都在养鱼？投了20份只有2个面试...",
        topic: "求职交流",
        likes: 56,
        time: "14:20"
    },
    {
        id: "msg007",
        userId: "u009",
        content: "今年确实行情不好，建议多看看中小厂和外企",
        topic: "求职交流",
        likes: 78,
        time: "14:25"
    },
    {
        id: "msg008",
        userId: "u007",
        content: "有人拿到美团的offer吗？流程走了多久啊",
        topic: "求职交流",
        likes: 23,
        time: "14:30"
    },
    {
        id: "msg009",
        userId: "u004",
        content: "B端现在是不是比C端好找工作？我也在纠结方向",
        topic: "求职交流",
        likes: 45,
        time: "14:35"
    },
    {
        id: "msg010",
        userId: "u001",
        content: "B端确实相对稳定，但天花板没有C端高，看你想要什么",
        topic: "求职交流",
        likes: 67,
        time: "14:40"
    },

    // 求助问答话题
    {
        id: "msg011",
        userId: "u006",
        content: "跪求！有没有好看的后台模板推荐？要Figma的",
        topic: "求助问答",
        likes: 12,
        time: "13:15"
    },
    {
        id: "msg012",
        userId: "u005",
        content: "推荐 Ant Design Pro，免费的，Figma和Axure版本都有",
        topic: "求助问答",
        likes: 89,
        time: "13:18"
    },
    {
        id: "msg013",
        userId: "u006",
        content: "谢谢！正好需要 🙏",
        topic: "求助问答",
        likes: 8,
        time: "13:20"
    },
    {
        id: "msg014",
        userId: "u003",
        content: "有没有做电商的同行？想聊聊大促的产品设计思路",
        topic: "求助问答",
        likes: 34,
        time: "13:25"
    },
    {
        id: "msg015",
        userId: "u002",
        content: "我是做社交的，电商不太懂，但感觉大促最核心的是库存和优惠券系统",
        topic: "求助问答",
        likes: 56,
        time: "13:30"
    },

    // 行业八卦话题
    {
        id: "msg016",
        userId: "u002",
        content: "听说XX公司又开始裁员了，今年互联网真的太难了...",
        topic: "行业八卦",
        likes: 123,
        time: "12:00"
    },
    {
        id: "msg017",
        userId: "u008",
        content: "确实，很多公司都在降本增效。但好的人才还是抢着要",
        topic: "行业八卦",
        likes: 89,
        time: "12:05"
    },
    {
        id: "msg018",
        userId: "u001",
        content: "听说AI产品经理现在很火，年薪50W起步是真的假的？",
        topic: "行业八卦",
        likes: 67,
        time: "12:10"
    },
    {
        id: "msg019",
        userId: "u009",
        content: "没那么多吧，看公司规模和经验。50W应该要5年以上经验才行",
        topic: "行业八卦",
        likes: 45,
        time: "12:15"
    },
    {
        id: "msg020",
        userId: "u007",
        content: "话说PDD又出新产品了，做下沉市场是真的强",
        topic: "行业八卦",
        likes: 34,
        time: "12:20"
    },

    // 内推招聘话题
    {
        id: "msg021",
        userId: "u002",
        content: "腾讯云团队招PM，base深圳，有兴趣的私信我～ 高级别",
        topic: "内推招聘",
        likes: 156,
        time: "11:30"
    },
    {
        id: "msg022",
        userId: "u010",
        content: "您好，请问3年C端经验可以投吗？",
        topic: "内推招聘",
        likes: 0,
        time: "11:32"
    },
    {
        id: "msg023",
        userId: "u002",
        content: "可以，JD要求5年但实际可以聊，简历发我看看",
        topic: "内推招聘",
        likes: 0,
        time: "11:35"
    },
    {
        id: "msg024",
        userId: "u001",
        content: "字节电商也在招人，大厂背书+薪资OK，有想法的pm我",
        topic: "内推招聘",
        likes: 234,
        time: "11:40"
    },
    {
        id: "msg025",
        userId: "u004",
        content: "请问有B端中台方向的岗位吗？刚转B端半年...",
        topic: "内推招聘",
        likes: 0,
        time: "11:45"
    },

    // 工具分享话题
    {
        id: "msg026",
        userId: "u005",
        content: "分享一个数据分析神器 Metabase，开源的，支持各种数据库",
        topic: "工具分享",
        likes: 178,
        time: "10:30"
    },
    {
        id: "msg027",
        userId: "u009",
        content: "最近在用飞书文档写PRD，协同功能太香了",
        topic: "工具分享",
        likes: 123,
        time: "10:35"
    },
    {
        id: "msg028",
        userId: "u006",
        content: "大家原型用什么工具？Figma还是Axure？",
        topic: "工具分享",
        likes: 89,
        time: "10:40"
    },
    {
        id: "msg029",
        userId: "u001",
        content: "我们团队用Figma，协作方便。但Axure做交互真的更专业",
        topic: "工具分享",
        likes: 67,
        time: "10:45"
    },
    {
        id: "msg030",
        userId: "u008",
        content: "推荐 Notion 做个人知识库，模板超多，用了就回不去了",
        topic: "工具分享",
        likes: 234,
        time: "10:50"
    },

    // 职场日常话题
    {
        id: "msg031",
        userId: "u004",
        content: "入职新公司一周，感觉完全融入不进去怎么办 😢",
        topic: "职场日常",
        likes: 56,
        time: "09:45"
    },
    {
        id: "msg032",
        userId: "u007",
        content: "正常，新人期都这样。主动找人吃饭聊天会好很多",
        topic: "职场日常",
        likes: 89,
        time: "09:50"
    },
    {
        id: "msg033",
        userId: "u003",
        content: "带个小零食分享给大家，快速破冰亲测有效",
        topic: "职场日常",
        likes: 123,
        time: "09:55"
    },
    {
        id: "msg034",
        userId: "u002",
        content: "PM和产品设计师的关系太重要了，有什么维护关系的好方法吗？",
        topic: "职场日常",
        likes: 45,
        time: "10:00"
    },
    {
        id: "msg035",
        userId: "u006",
        content: "多夸设计师！他们最怕被说「改一下」改个不停 😂",
        topic: "职场日常",
        likes: 167,
        time: "10:05"
    },

    // 读书分享话题
    {
        id: "msg036",
        userId: "u008",
        content: "最近在读《启示录》， Marty Cagan写的，每章都干货",
        topic: "读书分享",
        likes: 234,
        time: "08:30"
    },
    {
        id: "msg037",
        userId: "u001",
        content: "这本书是PM必读！建议配合《产品心经》一起看",
        topic: "读书分享",
        likes: 178,
        time: "08:35"
    },
    {
        id: "msg038",
        userId: "u004",
        content: "有没有适合新人的产品经理书籍推荐？",
        topic: "读书分享",
        likes: 89,
        time: "08:40"
    },
    {
        id: "msg039",
        userId: "u008",
        content: "《从点子到产品》很适合入门，作者是字节的刘飞",
        topic: "读书分享",
        likes: 345,
        time: "08:45"
    },
    {
        id: "msg040",
        userId: "u009",
        content: "AI时代PM必读《AI产品经理》，入门级的好书",
        topic: "读书分享",
        likes: 123,
        time: "08:50"
    }
];

console.log('✅ 闲聊消息准备完成，共 ' + INITIAL_CHAT_MESSAGES.length + ' 条');
