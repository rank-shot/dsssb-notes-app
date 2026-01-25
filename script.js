let testDatabase = {};

// 1. Database Load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('./tests.json');
        testDatabase = await response.json();
    } catch (error) { console.error("DB Error", error); }
});

// 2. Tab Switch Logic
function switchTab(tabName) {
    // Hide all sections
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'none';
    document.getElementById('notice-section').style.display = 'none';
    
    // Reset Nav
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show Selected
    if(tabName === 'home') {
        document.getElementById('home-section').style.display = 'block';
        navItems[0].classList.add('active');
    } else if (tabName === 'pdf') {
        document.getElementById('pdf-section').style.display = 'block';
        navItems[1].classList.add('active');
    } else if (tabName === 'notice') {
        document.getElementById('notice-section').style.display = 'block';
        navItems[2].classList.add('active');
    }
}

// 3. Dark Mode Logic
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// 4. Share App Logic
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'DSSSB Smart Notes',
            text: 'Check out this app for DSSSB Mock Tests!',
            url: window.location.href
        });
    } else {
        alert("Link copied to clipboard!");
    }
}

// 5. Open Tests Folder
function openSubject(subject) {
    const listContainer = document.getElementById('test-list-container');
    const title = document.getElementById('subject-title');
    const itemsDiv = document.getElementById('test-items');

    title.innerText = subject;
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
            itemsDiv.innerHTML = `<p style="text-align:center; color:#999;">No tests found 🚫</p>`;
        }
    }, 200);

    listContainer.style.display = 'block';
}

function closeList() {
    document.getElementById('test-list-container').style.display = 'none';
}
