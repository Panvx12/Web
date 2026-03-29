// --- 1. 保留原本的 HTML 生成邏輯 ---
function createPostHTML(data) {
    return `
        <article class="post-column">
            <img class="post-img" src="${data.imageSrc}" alt="${data.imageAlt}">
            <h1 class="post-title">${data.title}</h1>
            <section class="post-info">
                <section class="post-meta">
                    <img class="post-icon" src="../asset/icon/calendar.png" alt="calendar Image">
                    <span>發布日期 : ${data.date}</span>
                </section>
                <section class="post-meta">
                    <img class="post-icon" src="../asset/icon/person0.png" alt="author Image">
                    <span>作者 : ${data.author}</span>
                </section>
            </section>
            <p class="post-summary">${data.summary}</p>
        </article>
    `;
}

// --- 2. 渲染邏輯不變，但我們現在傳入的是從 JSON 抓來的資料 ---
function renderAllPosts(postsData) {
    if (!postsData || postsData.length === 0) {
        console.log("沒有文章資料可供渲染。");
        return;
    }
    const postsHTMLArray = postsData.map(post => createPostHTML(post));
    const postsContent = postsHTMLArray.join('');
    
    const fullStructureHTML = `
        <section id="post-container">
            ${postsContent}
        </section>
    `;
    
    const placeholder = document.getElementById('post-field');
    if (placeholder) {
        placeholder.innerHTML = fullStructureHTML;
    } else {
        console.error("找不到 ID 為 'post-field' 的元素。");
    }
}

// --- 3. 重點：抓取外部 JSON 的邏輯 ---
async function fetchAndRenderPosts(DataFilePath) {
    try {
        // 使用 fetch 抓取 json 檔案
        const response = await fetch(DataFilePath);
        
        // 檢查回應是否正常
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 解析成 JSON 物件
        const data = await response.json();
        
        // 呼叫渲染函式
        renderAllPosts(data);
        
    } catch (error) {
        console.error("抓取貼文資料時發生錯誤:", error);
        // 可以在畫面上給使用者一點錯誤提示
        const placeholder = document.getElementById('post-field');
        if (placeholder) {
            placeholder.innerHTML = "<p>貼文載入失敗，請稍後再試。</p>";
        }
    }
}

// --- 4. 啟動器 ---
document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderPosts('../Data/postsData.json');
});