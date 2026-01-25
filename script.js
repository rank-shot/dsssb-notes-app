let testDatabase = {};

// 1. Load Data on Startup
window.addEventListener('load', async () => {
    try {
        const response = await fetch('./tests.json');
        testDatabase = await response.json();
        
        // Load Extra Content
        loadPDFs(testDatabase.pdfs);
        loadNotices(testDatabase.notices);
        
    } catch (error) { console.error("DB Error", error); }
});

// 2. Load PDFs dynamically
function loadPDFs(pdfList) {
    const container = document.getElementById('pdf-list');
    if(!pdfList || pdfList.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">No PDFs available.</p>';
        return;
    }
    
    container.innerHTML = ''; // Clear hardcoded HTML
    pdfList.forEach(pdf => {
        const card = `
            <div class="pdf-card">
                <div class="pdf-icon">📄</div>
                <div class="pdf-info">
                    <h3>${pdf.title}</h3>
                    <p>${pdf.size}</p>
                </div>
                <button class="download-btn" onclick="window.open('${pdf.url}', '_blank')">⬇️</button>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 3. Load Notices dynamically
function loadNotices(noticeList) {
    const container = document.getElementById('notice-section');
    // Title ko bachate hue baaki content clear karein
    const title = '<div class="section-title">🔔 Important Updates</div>';
    
    if(!noticeList || noticeList.length === 0) {
        container.innerHTML = title + '<p style="text-align:center; color:#999;">No new notices.</p>';
        return;
    }

    let html = title;
    noticeList.forEach(notice => {
        html += `
            <div class="notice-card">
                <span class="date">${notice.date}</span>
                <h3>${notice.title}</h3>
                <p>${notice.desc}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// 4. Tab Switch Logic
function switchTab(tabName) {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'none';
    document.getElementById('notice-section').style.display = 'none';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    if(tabName === 'home') {
        document.getElementById('home-section').style.display = 'block';
        document.querySelectorAll('.nav-item')[0].classList.add('active');
    } else if (tabName === 'pdf') {
        document.getElementById('pdf-section').style.display = 'block';
        document.querySelectorAll('.nav-item')[1].classList.add('active');
    } else if (tabName === 'notice') {
        document.getElementById('notice-section').style.display = 'block';
        document.querySelectorAll('.nav-item')[2].classList.add('active');
    }
}

// 5. Common Functions
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

function openSubject(subject) {
    const listContainer = document.getElementById('test-list-container');
    const itemsDiv = document.getElementById('test-items');
    
    document.getElementById('subject-title').innerText = subject;
    itemsDiv.innerHTML = '<p style="text-align:center;">Loading...</p>';

    setTimeout(() => {
        itemsDiv.innerHTML = '';
        const tests = testDatabase[subject];
        if (tests && tests.length > 0) {
            tests.forEach(test => {
                const btn = document.createElement('button');
                btn.className = 'test-btn';
                let badgeHtml = test.badge ? `<span style="background:red; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-right:8px;">${test.badge}</span>` : '';
                btn.innerHTML = `${badgeHtml} 📝 ${test.name}`;
                btn.onclick = () => window.open(test.url, '_blank');
                itemsDiv.appendChild(btn);
            });
        } else {
            itemsDiv.innerHTML = `<p style="text-align:center; color:#999;">No tests found.</p>`;
        }
    }, 200);
    listContainer.style.display = 'block';
}

function closeList() { document.getElementById('test-list-container').style.display = 'none'; }

function shareApp() {
    if (navigator.share) {
        navigator.share({ title: 'DSSSB Notes', url: window.location.href });
    } else { alert("Link copied!"); }
}

function searchContent() {
    // Search logic can be added here
}
