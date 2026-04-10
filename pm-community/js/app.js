const STORAGE_KEYS = {
    currentUser: 'pmchat_current_user',
    users: 'pmchat_users',
    posts: 'pmchat_posts',
    notifications: 'pmchat_notifications',
    searchHistory: 'pmchat_search_history',
    draft: 'pmchat_create_draft'
};

const CATEGORY_LABELS = {
    c: 'C端产品',
    b: 'B端产品',
    ai: 'AI/大数据',
    growth: '用户增长',
    strategy: '策略产品',
    operation: '产品运营'
};

const CATEGORY_BADGES = {
    c: 'badge-design',
    b: 'badge-b',
    ai: 'badge-ai',
    growth: 'badge-growth',
    strategy: 'badge-strategy',
    operation: 'badge-operation'
};

const TYPE_LABELS = {
    article: '文章',
    question: '问答',
    discussion: '讨论'
};

const SEARCH_SUGGESTIONS = [
    'AI产品经理',
    'B端产品设计',
    '用户增长策略',
    'PRD写作技巧',
    'Axure教程',
    '面试题库'
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: 'seed-like-1',
        type: 'like',
        actor: '王雨晴',
        title: '王雨晴 赞了你的文章',
        text: '从0到1搭建AI产品经理能力模型的一些思考',
        timeText: '10分钟前',
        link: 'detail.html',
        unread: true,
        createdAt: Date.now() - 10 * 60 * 1000
    },
    {
        id: 'seed-comment-1',
        type: 'comment',
        actor: '张晓东',
        title: '张晓东 评论了你的文章',
        text: '写得很好！AI产品经理确实需要新的能力模型支持。',
        timeText: '30分钟前',
        link: 'detail.html',
        unread: true,
        createdAt: Date.now() - 30 * 60 * 1000
    },
    {
        id: 'seed-follow-1',
        type: 'follow',
        actor: '林静',
        title: '林静 关注了你',
        text: '你的文章很专业，已关注，期待更多分享~',
        timeText: '1小时前',
        link: 'profile.html',
        unread: true,
        createdAt: Date.now() - 60 * 60 * 1000
    },
    {
        id: 'seed-system-1',
        type: 'system',
        actor: '系统通知',
        title: '系统通知',
        text: '恭喜！你的文章「用户增长团队的KPI制定」被推荐到首页精选',
        timeText: '1天前',
        link: 'detail.html',
        unread: false,
        createdAt: Date.now() - 24 * 60 * 60 * 1000
    }
];

let isLoggedIn = false;
let currentUser = null;
let searchHistory = [];
let currentCreateType = 'article';

document.addEventListener('DOMContentLoaded', () => {
    hydrateState();
    ensureSeedData();
    initTabs();
    initNavHighlight();
    initSearch();
    initKeyboardShortcuts();
    showPageLoadingAnimation();
    initLazyLoad();
    initSmoothScroll();
    initAuthState();
    initCreatePage();
    initMessagesPage();
    initSearchPage();
    renderDynamicHomeFeed();
    updateNotificationBadges();
    initChatInput();
    initMessageCategoryTabs();
});

function hydrateState() {
    currentUser = Storage.get(STORAGE_KEYS.currentUser);
    isLoggedIn = Boolean(currentUser);
    searchHistory = Storage.get(STORAGE_KEYS.searchHistory) || [];
}

function ensureSeedData() {
    if (!Storage.get(STORAGE_KEYS.notifications)) {
        Storage.set(STORAGE_KEYS.notifications, DEFAULT_NOTIFICATIONS);
    }
    if (!Storage.get(STORAGE_KEYS.posts)) {
        Storage.set(STORAGE_KEYS.posts, []);
    }
    if (!Storage.get(STORAGE_KEYS.users)) {
        Storage.set(STORAGE_KEYS.users, []);
    }
}

function initAuthState() {
    updateAuthUI(isLoggedIn, currentUser);
}

function showPageLoadingAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function initNavHighlight() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.toggle('active', item.getAttribute('href') === currentPage);
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    const searchParams = new URLSearchParams(window.location.search);
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && !searchInput.value) {
        searchInput.value = queryFromUrl;
    }

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            showSearchSuggestions(query);
        }
    }, 250));
}

function performSearch(query) {
    addToSearchHistory(query);
    if (window.location.pathname.endsWith('search.html')) {
        const nextUrl = `search.html?q=${encodeURIComponent(query)}`;
        window.history.replaceState({}, '', nextUrl);
        renderSearchPage();
    } else {
        location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

function searchTopic(topic) {
    performSearch(topic);
}

function addToSearchHistory(query) {
    const deduped = searchHistory.filter((item) => item !== query);
    deduped.unshift(query);
    searchHistory = deduped.slice(0, 10);
    Storage.set(STORAGE_KEYS.searchHistory, searchHistory);
}

function getSearchHistory() {
    return Storage.get(STORAGE_KEYS.searchHistory) || [];
}

function showSearchSuggestions(query) {
    const suggestions = SEARCH_SUGGESTIONS.filter((item) => item.includes(query));
    debug('搜索建议', suggestions);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchModal(hideId, showId) {
    hideModal(hideId);
    setTimeout(() => showModal(showId), 200);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    if (toast.timeout) {
        clearTimeout(toast.timeout);
    }

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.className = `toast ${type}`;
    const icon = toast.querySelector('i');
    if (icon) {
        icon.className = `fas ${icons[type] || icons.info}`;
    }
    toastMessage.textContent = message;
    toast.style.display = 'flex';
    toast.timeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function toggleLike(btn) {
    const icon = btn.querySelector('i');
    let count = parseInt(btn.textContent.trim(), 10) || 0;
    const liked = icon.classList.contains('fas');

    if (liked) {
        icon.classList.replace('fas', 'far');
        btn.classList.remove('liked');
        count = Math.max(count - 1, 0);
        btn.innerHTML = `<i class="far fa-thumbs-up"></i> ${count}`;
        showToast('已取消点赞', 'info');
        return;
    }

    icon.classList.replace('far', 'fas');
    btn.classList.add('liked');
    btn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${count + 1}`;
    showToast('点赞成功！', 'success');
}

function toggleCollect(btn) {
    const icon = btn.querySelector('i');
    const collected = icon.classList.contains('fas');
    if (collected) {
        icon.classList.replace('fas', 'far');
        btn.classList.remove('collected');
        showToast('已取消收藏', 'info');
        return;
    }
    icon.classList.replace('far', 'fas');
    btn.classList.add('collected');
    showToast('已收藏', 'success');
}

function toggleFollow(btn) {
    const followed = btn.classList.contains('followed');
    if (followed) {
        btn.classList.remove('followed');
        btn.textContent = '关注';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary)';
        showToast('已取消关注', 'info');
        return;
    }
    btn.classList.add('followed');
    btn.textContent = '已关注';
    btn.style.background = 'var(--primary)';
    btn.style.color = 'white';
    showToast('关注成功', 'success');
}

function createUserFromAccount(account, profile = {}) {
    const accountText = account || 'pm_demo_user';
    const safeSeed = encodeURIComponent(accountText);
    const nickname = profile.nickname || accountText.split('@')[0] || `PM${Math.floor(Math.random() * 1000)}`;
    return {
        id: `user-${Date.now()}`,
        nickname,
        account: accountText,
        role: profile.role || '产品经理',
        industry: profile.industry || '',
        experience: profile.experience || '',
        bio: profile.bio || '热爱产品、持续学习中',
        seed: safeSeed,
        interests: profile.interests || []
    };
}

function persistCurrentUser(user) {
    currentUser = user;
    isLoggedIn = true;
    Storage.set(STORAGE_KEYS.currentUser, user);
    const users = Storage.get(STORAGE_KEYS.users) || [];
    const nextUsers = [user, ...users.filter((item) => item.account !== user.account)];
    Storage.set(STORAGE_KEYS.users, nextUsers.slice(0, 20));
    updateAuthUI(true, user);
    updateNotificationBadges();
}

function updateAuthUI(loggedIn, user = null) {
    isLoggedIn = loggedIn;
    currentUser = loggedIn ? user : null;

    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.style.display = loggedIn ? 'none' : 'block';
    }

    document.querySelectorAll('.avatar img').forEach((img) => {
        if (loggedIn && user) {
            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed}`;
            img.alt = `${user.nickname}头像`;
        }
    });
}

function handleDemoLogin(event) {
    event.preventDefault();
    const accountInput = document.getElementById('loginAccount');
    const phoneInput = document.getElementById('loginPhone');
    const account = accountInput?.value.trim() || phoneInput?.value.trim() || 'demo@pmchat.cn';
    const user = createUserFromAccount(account, {
        nickname: account.includes('@') ? account.split('@')[0] : `PM${account.slice(-4) || '0001'}`,
        role: '产品经理'
    });
    persistCurrentUser(user);
    addNotification({
        type: 'system',
        actor: '系统通知',
        title: '系统通知',
        text: `欢迎回来，${user.nickname}。你已成功登录 PM社区。`,
        link: 'messages.html',
        unread: true
    });
    showToast('登录成功！', 'success');
    setTimeout(() => {
        location.href = 'index.html';
    }, 900);
}

function handleLogin(event) {
    handleDemoLogin(event);
}

function handleDemoRegister(event) {
    event.preventDefault();
    const nickname = document.getElementById('registerNickname')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const roleText = document.getElementById('registerRole')?.selectedOptions[0]?.textContent || '产品经理';
    const user = createUserFromAccount(email || `${nickname}@pmchat.cn`, {
        nickname: nickname || '新用户',
        role: roleText,
        industry: document.getElementById('registerIndustry')?.value || '',
        experience: document.getElementById('registerExperience')?.value || '',
        bio: document.getElementById('registerBio')?.value.trim() || '',
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map((item) => item.nextElementSibling.textContent.trim())
    });
    persistCurrentUser(user);
    addNotification({
        type: 'system',
        actor: '欢迎通知',
        title: '欢迎加入 PM社区',
        text: '账号已创建完成，去发布你的第一篇内容吧。',
        link: 'create.html',
        unread: true
    });
    showToast('注册成功！正在进入社区...', 'success');
    setTimeout(() => {
        location.href = 'index.html';
    }, 1100);
}

function handleRegister(event) {
    handleDemoRegister(event);
}

function login() {
    const demoUser = createUserFromAccount('demo@pmchat.cn', {
        nickname: '演示用户',
        role: '产品经理'
    });
    persistCurrentUser(demoUser);
    showToast('已模拟登录', 'success');
}

function logout() {
    Storage.remove(STORAGE_KEYS.currentUser);
    currentUser = null;
    isLoggedIn = false;
    updateAuthUI(false, null);
    updateNotificationBadges();
    showToast('已退出登录', 'info');
}

function initCreatePage() {
    if (!window.location.pathname.endsWith('create.html')) return;

    const queryType = new URLSearchParams(window.location.search).get('type');
    if (queryType && ['article', 'question', 'discussion'].includes(queryType)) {
        currentCreateType = queryType;
    }

    const draft = Storage.get(STORAGE_KEYS.draft) || {};
    const titleInput = document.getElementById('postTitle');
    const editor = document.getElementById('editorContent');
    const categorySelect = document.getElementById('categorySelect');
    const tagInput = document.getElementById('tagInput');
    const visibilityInput = document.querySelector('input[name="visibility"]:checked');

    if (draft.title && titleInput) titleInput.value = draft.title;
    if (draft.content && editor) editor.innerHTML = draft.content;
    if (draft.category && categorySelect) categorySelect.value = draft.category;
    if (draft.type) currentCreateType = draft.type;
    if (draft.tags) renderTags(draft.tags);
    selectType(currentCreateType);
    if (draft.visibility) {
        const target = document.querySelector(`input[name="visibility"][value="${draft.visibility}"]`);
        if (target) target.checked = true;
    } else if (visibilityInput) {
        visibilityInput.checked = true;
    }

    [titleInput, editor, categorySelect].forEach((element) => {
        if (!element) return;
        const eventName = element === editor ? 'input' : 'input';
        element.addEventListener(eventName, saveDraft);
    });

    document.querySelectorAll('input[name="visibility"]').forEach((item) => {
        item.addEventListener('change', saveDraft);
    });

    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = tagInput.value.trim().replace(/^#/, '');
                if (!value) return;
                const currentTags = getCurrentTags();
                if (currentTags.includes(value)) {
                    showToast('标签已存在', 'warning');
                    return;
                }
                if (currentTags.length >= 5) {
                    showToast('最多添加 5 个标签', 'warning');
                    return;
                }
                renderTags([...currentTags, value]);
                tagInput.value = '';
                saveDraft();
            }
        });
    }
}

function selectType(type) {
    currentCreateType = type;
    document.querySelectorAll('[id^="type"]').forEach((btn) => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    const activeButton = document.getElementById(`type${type.charAt(0).toUpperCase()}${type.slice(1)}`);
    if (activeButton) {
        activeButton.classList.remove('btn-secondary');
        activeButton.classList.add('btn-primary');
    }
    saveDraft();
}

function getCurrentTags() {
    return Array.from(document.querySelectorAll('#tagContainer .mini-tag')).map((item) => item.dataset.tag);
}

function renderTags(tags) {
    const tagContainer = document.getElementById('tagContainer');
    if (!tagContainer) return;
    tagContainer.innerHTML = '';
    tags.forEach((tag) => {
        const tagItem = document.createElement('span');
        tagItem.className = 'mini-tag';
        tagItem.dataset.tag = tag;
        tagItem.style.cursor = 'pointer';
        tagItem.innerHTML = `#${escapeHtml(tag)} <i class="fas fa-times"></i>`;
        tagItem.addEventListener('click', () => removeTag(tag));
        tagContainer.appendChild(tagItem);
    });
}

function removeTag(tag) {
    const nextTags = getCurrentTags().filter((item) => item !== tag);
    renderTags(nextTags);
    saveDraft();
}

function saveDraft() {
    if (!window.location.pathname.endsWith('create.html')) return;
    const title = document.getElementById('postTitle')?.value.trim() || '';
    const content = document.getElementById('editorContent')?.innerHTML || '';
    const category = document.getElementById('categorySelect')?.value || '';
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || 'public';
    Storage.set(STORAGE_KEYS.draft, {
        title,
        content,
        category,
        visibility,
        type: currentCreateType,
        tags: getCurrentTags()
    });
}

function publishCurrentPost() {
    const title = document.getElementById('postTitle')?.value.trim() || '';
    const editor = document.getElementById('editorContent');
    const plainTextContent = editor?.innerText.trim() || '';
    const category = document.getElementById('categorySelect')?.value || '';
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || 'public';
    const tags = getCurrentTags();

    if (!isLoggedIn || !currentUser) {
        showToast('请先登录后再发布', 'error');
        setTimeout(() => {
            location.href = 'login.html';
        }, 900);
        return;
    }
    if (!title) {
        showToast('请输入标题', 'error');
        return;
    }
    if (!plainTextContent || plainTextContent === '开始创作你的内容...') {
        showToast('请输入内容', 'error');
        return;
    }
    if (!category) {
        showToast('请选择分类', 'error');
        return;
    }

    const posts = Storage.get(STORAGE_KEYS.posts) || [];
    const now = Date.now();
    const post = {
        id: `post-${now}`,
        type: currentCreateType,
        title,
        content: plainTextContent,
        excerpt: plainTextContent.length > 120 ? `${plainTextContent.slice(0, 120)}...` : plainTextContent,
        category,
        categoryLabel: CATEGORY_LABELS[category] || category,
        visibility,
        tags,
        authorName: currentUser.nickname,
        authorRole: currentUser.role || '产品经理',
        authorSeed: currentUser.seed,
        likes: 0,
        comments: 0,
        views: 1,
        createdAt: now
    };

    Storage.set(STORAGE_KEYS.posts, [post, ...posts]);
    Storage.remove(STORAGE_KEYS.draft);
    addNotification({
        type: 'system',
        actor: '发布助手',
        title: '你的内容已发布成功',
        text: `《${title}》已进入社区最新列表，可继续分享给同行。`,
        link: 'index.html',
        unread: true
    });
    showToast('发布成功！', 'success');
    setTimeout(() => {
        location.href = 'index.html';
    }, 900);
}

function renderDynamicHomeFeed() {
    const container = document.getElementById('contentList');
    if (!container) return;

    container.querySelectorAll('.user-generated-card').forEach((item) => item.remove());
    const posts = Storage.get(STORAGE_KEYS.posts) || [];
    posts.slice(0, 5).reverse().forEach((post) => {
        container.prepend(createPostCardElement(post));
    });
}

function createPostCardElement(post) {
    const wrapper = document.createElement(post.type === 'question' ? 'div' : 'article');
    wrapper.className = `${post.type === 'question' ? 'question-card' : 'post-card'} user-generated-card`;
    wrapper.onclick = () => {
        location.href = 'detail.html';
    };

    if (post.type === 'question') {
        wrapper.innerHTML = `
            <div class="question-header">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorSeed}" alt="头像" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${escapeHtml(post.authorName)}</span>
                    <span class="post-meta">${escapeHtml(post.authorRole)} · ${formatDate(new Date(post.createdAt))}</span>
                </div>
                <span class="question-status pending">新问题</span>
            </div>
            <h2 class="post-title">${escapeHtml(post.title)}</h2>
            <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="question-stats">
                <span class="question-stat"><i class="far fa-thumbs-up"></i> ${post.likes}</span>
                <span class="question-stat"><i class="far fa-comment"></i> ${post.comments} 个回答</span>
                <span class="question-stat"><i class="far fa-eye"></i> ${formatNumber(post.views)}</span>
            </div>
        `;
        return wrapper;
    }

    wrapper.innerHTML = `
        <div class="post-header">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorSeed}" alt="头像" class="author-avatar">
            <div class="author-info">
                <span class="author-name">${escapeHtml(post.authorName)}</span>
                <span class="post-meta">${escapeHtml(post.authorRole)} · ${formatDate(new Date(post.createdAt))}</span>
            </div>
            <span class="category-badge ${CATEGORY_BADGES[post.category] || 'badge-ai'}">${escapeHtml(post.categoryLabel)}</span>
        </div>
        <h2 class="post-title">${escapeHtml(post.title)}</h2>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="post-footer">
            <div class="post-actions">
                <button class="action-btn like-btn" onclick="event.stopPropagation();toggleLike(this)"><i class="far fa-thumbs-up"></i> ${post.likes}</button>
                <button class="action-btn" onclick="event.stopPropagation();location.href='detail.html#comments'"><i class="far fa-comment"></i> ${post.comments}</button>
                <button class="action-btn"><i class="far fa-eye"></i> ${formatNumber(post.views)}</button>
            </div>
            <div class="post-tags">
                ${(post.tags || []).slice(0, 3).map((tag) => `<span class="mini-tag">#${escapeHtml(tag)}</span>`).join('')}
                <span class="mini-tag" style="background: var(--primary); color: white;">我的发布</span>
            </div>
        </div>
    `;
    return wrapper;
}

function initSearchPage() {
    if (!window.location.pathname.endsWith('search.html')) return;

    const query = new URLSearchParams(window.location.search).get('q') || document.getElementById('searchInput')?.value.trim() || 'AI产品经理';
    const keywordNode = document.getElementById('searchKeyword');
    const input = document.getElementById('searchInput');
    if (keywordNode) keywordNode.textContent = query;
    if (input) input.value = query;

    let totalResults = 0;
    const cards = document.querySelectorAll('.post-card, .question-card');
    cards.forEach((card) => {
        const visible = matchesQuery(card.textContent, query);
        card.style.display = visible ? 'block' : 'none';
        if (visible) totalResults++;
    });

    const users = document.querySelectorAll('.user-item');
    users.forEach((item) => {
        const visible = matchesQuery(item.textContent, query);
        item.style.display = visible ? 'flex' : 'none';
        if (visible) totalResults++;
    });

    const localPosts = Storage.get(STORAGE_KEYS.posts) || [];
    let dynamicContainer = document.getElementById('dynamicSearchResults');
    if (!dynamicContainer) {
        dynamicContainer = document.createElement('div');
        dynamicContainer.id = 'dynamicSearchResults';
        const sectionTitle = document.querySelector('.section-title + .post-card, .section-title + .question-card');
        if (sectionTitle?.parentNode) {
            sectionTitle.parentNode.insertBefore(dynamicContainer, sectionTitle);
        }
    }
    dynamicContainer.innerHTML = '';

    const matchedLocalPosts = localPosts.filter((post) => matchesQuery([post.title, post.content, (post.tags || []).join(' ')].join(' '), query));
    matchedLocalPosts.forEach((post) => {
        dynamicContainer.appendChild(createPostCardElement(post));
        totalResults++;
    });

    if (!totalResults) {
        dynamicContainer.innerHTML = `
            <div class="card" style="padding: 32px; text-align: center; margin-bottom: 24px;">
                <h3 style="margin-bottom: 8px;">没有找到相关结果</h3>
                <p style="color: var(--text-secondary);">试试搜索更短的关键词，或者先发布一篇和该主题相关的内容。</p>
            </div>
        `;
    }

    const resultCount = document.getElementById('resultCount');
    if (resultCount) resultCount.textContent = totalResults;
}

function matchesQuery(text, query) {
    if (!query) return true;
    return text.toLowerCase().includes(query.toLowerCase());
}

function initMessagesPage() {
    if (!window.location.pathname.endsWith('messages.html')) return;

    const messageList = document.querySelector('.message-list');
    if (!messageList) return;

    messageList.querySelectorAll('.dynamic-message-item').forEach((item) => item.remove());
    const notifications = getNotifications();
    notifications.slice().reverse().forEach((notification) => {
        messageList.prepend(createMessageItem(notification));
    });
}

function createMessageItem(notification) {
    const item = document.createElement('div');
    item.className = `message-item dynamic-message-item${notification.unread ? ' unread' : ''}`;
    item.dataset.messageType = notification.type;
    item.onclick = () => {
        markNotificationAsRead(notification.id);
        location.href = notification.link || 'messages.html';
    };

    const iconHtml = notification.type === 'system'
        ? `<div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;"><i class="fas fa-bullhorn"></i></div>`
        : `<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(notification.actor || 'PM')}" alt="" class="message-avatar">`;

    item.innerHTML = `
        ${iconHtml}
        <div class="message-content">
            <div class="message-title">
                <span><strong>${escapeHtml(notification.title)}</strong></span>
                <span class="message-time">${escapeHtml(notification.timeText || formatDate(new Date(notification.createdAt)))}</span>
            </div>
            <p class="message-text">${escapeHtml(notification.text)}</p>
        </div>
    `;
    return item;
}

function initMessageCategoryTabs() {
    const tabs = document.querySelectorAll('.category-nav-item');
    if (!tabs.length) return;
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((item) => item.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.dataset.type || inferMessageTypeFromLabel(tab.textContent.trim());
            document.querySelectorAll('.message-item').forEach((item) => {
                const itemType = item.dataset.messageType || inferMessageTypeFromLabel(item.textContent);
                item.style.display = type === 'all' || itemType === type ? 'flex' : 'none';
            });
        });
    });
}

function inferMessageTypeFromLabel(label) {
    if (label.includes('点赞')) return 'like';
    if (label.includes('评论') || label.includes('回复')) return 'comment';
    if (label.includes('关注')) return 'follow';
    if (label.includes('系统') || label.includes('通知')) return 'system';
    return 'all';
}

function updateNotificationBadges() {
    const unreadCount = getNotifications().filter((item) => item.unread).length;
    document.querySelectorAll('.notification-badge .badge').forEach((badge) => {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
}

function addNotification(notification) {
    const notifications = getNotifications();
    const nextNotification = {
        id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        timeText: '刚刚',
        unread: true,
        link: 'messages.html',
        ...notification
    };
    Storage.set(STORAGE_KEYS.notifications, [nextNotification, ...notifications].slice(0, 30));
    updateNotificationBadges();
}

function getNotifications() {
    return Storage.get(STORAGE_KEYS.notifications) || [];
}

function markNotificationAsRead(id) {
    const notifications = getNotifications().map((item) => (
        item.id === id ? { ...item, unread: false } : item
    ));
    Storage.set(STORAGE_KEYS.notifications, notifications);
    updateNotificationBadges();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    if (!input || !messagesContainer) return;

    const message = input.value.trim();
    if (!message) return;

    const author = currentUser?.nickname || '我';
    const seed = currentUser?.seed || 'Me';
    const newMessage = document.createElement('div');
    newMessage.className = 'chat-message fade-in';
    newMessage.innerHTML = `
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}" alt="" class="chat-avatar">
        <div class="chat-content">
            <span class="chat-name">${escapeHtml(author)}</span>
            <p>${escapeHtml(message)}</p>
            <span class="chat-time">${getCurrentTime()}</span>
        </div>
    `;
    messagesContainer.appendChild(newMessage);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        const replies = [
            { name: '王雨晴', seed: 'Bob', text: '这个观点很实用。' },
            { name: '李明轩', seed: 'Alice', text: '建议顺手整理成一篇帖子。' },
            { name: '张晓东', seed: 'Carol', text: '我也在做类似方案。' }
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const replyMessage = document.createElement('div');
        replyMessage.className = 'chat-message fade-in';
        replyMessage.innerHTML = `
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.seed}" alt="" class="chat-avatar">
            <div class="chat-content">
                <span class="chat-name">${reply.name}</span>
                <p>${reply.text}</p>
                <span class="chat-time">${getCurrentTime()}</span>
            </div>
        `;
        messagesContainer.appendChild(replyMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
}

function initChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return date.toLocaleDateString();
}

function addComment(textarea) {
    const comment = textarea.value.trim();
    if (!comment) {
        showToast('请输入评论内容', 'error');
        return;
    }
    showToast('评论发布成功！', 'success');
    textarea.value = '';
}

function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading';
    loader.innerHTML = '<div class="spinner"></div>';
    return loader;
}

let page = 1;
function loadMore(container) {
    showToast('加载更多内容...', 'info');
    page += 1;
}

function loadMoreContent() {
    loadMore();
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar-left');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach((img) => imageObserver.observe(img));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach((modal) => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) searchInput.focus();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            location.href = 'create.html';
        }
    });
}

function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    });
    animateElements.forEach((el) => observer.observe(el));
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('已复制到剪贴板', 'success');
        });
        return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('已复制到剪贴板', 'success');
}

function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({ title, text, url })
            .then(() => showToast('分享成功', 'success'))
            .catch(() => showToast('分享失败', 'error'));
        return;
    }
    copyToClipboard(url);
    showToast('链接已复制，快去分享吧！', 'success');
}

const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};

const DEBUG = true;
function debug(...args) {
    if (DEBUG) {
        console.log('[PM社区]', ...args);
    }
}

console.log('%c PM社区 v2.1 %c 交互闭环已加载 ', 'background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px;', 'background: #4f46e5; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;');
