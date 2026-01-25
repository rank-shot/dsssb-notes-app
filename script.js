let testDatabase = {};

// 1. Database Load karein
window.addEventListener('load', async () => {
    try {
        const response = await fetch('./tests.json');
        testDatabase = await response.json();
        console.log("Database Loaded!");
    } catch (error) {
        console.error("Error:", error);
    }
});

// 2. Folder Open Function
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
                
                // Badge Logic (New/Free/Live)
                let badgeHtml = '';
                if (test.badge) {
                    badgeHtml = `<span style="background:red; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-right:8px;">${test.badge}</span>`;
                }

                btn.innerHTML = `${badgeHtml} 📝 ${test.name}`;
                
                // Click karne par Link open karein
                btn.onclick = () => openTestLink(test.url);
                
                itemsDiv.appendChild(btn);
            });
        } else {
            itemsDiv.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;">No tests added yet 🚫</p>`;
        }
    }, 300);

    listContainer.style.display = 'block';
}

function closeList() {
    document.getElementById('test-list-container').style.display = 'none';
}

// 3. Link Open karne ka function
function openTestLink(url) {
    if (url) {
        // Link ko naye tab mein kholne ke liye
        window.open(url, '_blank');
    } else {
        alert("Link not available!");
    }
}
