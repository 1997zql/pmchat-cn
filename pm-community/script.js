// ===== Tab切换功能 =====
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== 导航高亮 =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===== 模态框 =====
const loginBtn = document.querySelector('.auth-card .btn-secondary');
const modal = document.getElementById('loginModal');
const modalClose = document.querySelector('.modal-close');
const registerBtn = document.querySelector('.auth-card .btn-primary');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

// ===== 收藏功能 =====
const bookmarkBtns = document.querySelectorAll('.action-btn');
bookmarkBtns.forEach(btn => {
    if (btn.innerHTML.includes('fa-bookmark')) {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.color = '#f59e0b';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.color = '';
            }
        });
    }
});

// ===== 点赞动画 =====
const likeBtns = document.querySelectorAll('.action-btn');
likeBtns.forEach(btn => {
    if (btn.innerHTML.includes('fa-thumbs-up')) {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    }
});

// ===== 关注按钮 =====
const followBtns = document.querySelectorAll('.btn-follow');
followBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.textContent.trim() === '关注') {
            btn.textContent = '已关注';
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--primary)';
        } else {
            btn.textContent = '关注';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--primary)';
        }
    });
});

// ===== 搜索框 =====
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                console.log('搜索:', query);
                // 可以跳转到搜索结果页
            }
        }
    });
}

// ===== 分类卡片点击 =====
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.querySelector('h3').textContent;
        console.log('查看分类:', category);
        // 可以跳转到分类详情页
    });
});

// ===== 话题标签点击 =====
const topicTags = document.querySelectorAll('.topic-tag');
topicTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const topic = tag.textContent;
        console.log('查看话题:', topic);
    });
});

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== 闲聊区输入 =====
const chatInput = document.querySelector('.chat-input input');
const chatSendBtn = document.querySelector('.chat-input button');

if (chatInput && chatSendBtn) {
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            console.log('发送消息:', message);
            chatInput.value = '';
        }
    };
    
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ===== 发布按钮 =====
const publishBtn = document.querySelector('.btn-primary');
if (publishBtn && publishBtn.textContent.includes('发布')) {
    publishBtn.addEventListener('click', () => {
        console.log('打开发布页面');
        // 可以打开发布弹窗或跳转到发布页
    });
}

// ===== 表单提交 =====
const loginForm = document.querySelector('.modal-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('登录提交');
        // 处理登录逻辑
    });
}

// ===== 滚动时Header效果 =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ===== 加载动画 =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // 为卡片添加渐入动画
    const cards = document.querySelectorAll('.post-card, .category-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });
});
