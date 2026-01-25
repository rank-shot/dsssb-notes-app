let testDatabase = {};

// 1. App Start hote hi Database Load karein
window.addEventListener('load', async () => {
    try {
        // '?t=' + Date.now() isliye lagaya taaki purana data cache na ho, hamesha fresh data aaye
        const response = await fetch('./tests.json?t=' + Date.now());
        testDatabase = await response.json();
        console.log("✅ Database Loaded Successfully!");
    } catch (error) {
        console.error("❌ Database Error:", error);
        // Agar load na ho paye to user ko batayein
        const container = document.querySelector('.container');
        if(container) {
            container.insertAdjacentHTML('beforeend', '<p style="text-align:center; color:red; margin-top:20px;">Error loading tests. Please refresh.</p>');
        }
    }
});

// 2. Folder (Subject) Open karne ka Logic
function openSubject(subject) {
    const listContainer = document.getElementById('test-list-container');
    const title = document.getElementById('subject-title');
    const itemsDiv = document.getElementById('test-items');

    // Title set karein
    title.innerText = subject;
    
    // Loading dikhayein jab tak list ban rahi hai
    itemsDiv.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">Loading tests...</p>';

    // Thoda delay taaki smooth lage
    setTimeout(() => {
        itemsDiv.innerHTML = ''; // Loading hatayein

        // Us subject ke tests nikalein
        const tests = testDatabase[subject];

        if (tests && tests.length > 0) {
            // Agar tests hain toh button banayein
            tests.forEach(test => {
                const btn = document.createElement('button');
                btn.className = 'test-btn';
                
                // --- A. Badge HTML Generate karein ---
                let badgeHTML = '';
                if (test.badge && test.badge !== 'None') {
                    // Badge ka color decide karein (New=Green, Imp=Red)
                    let badgeColor = test.badge === 'New' ? '#28a745' : '#dc3545';
                    badgeHTML = `<span class="badge" style="background:${badgeColor}; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:8px;">${test.badge}</span>`;
                }

                // --- B. Attempts HTML Generate karein ---
                let attemptsHTML = '';
                if (test.attempts) {
                    attemptsHTML = `<span class="attempts" style="font-size:12px; color:#666; background:#f0f2f5; padding:4px 8px; border-radius:20px;">👥 ${test.attempts}</span>`;
                }

                // --- C. Button ka HTML Structure ---
                // Flexbox use kar rahe hain: Left mein Name+Badge, Right mein Attempts
                btn.innerHTML = `
                    <div style="display:flex; align-items:center;">
                        <span style="font-size:16px;">📝</span> &nbsp; 
                        <span>${test.name}</span> 
                        ${badgeHTML}
                    </div>
                    ${attemptsHTML}
                `;
                
                // --- D. Click Event ---
                btn.onclick = () => openTestLink(test.url);
                
                itemsDiv.appendChild(btn);
            });
        } else {
            // Agar test nahi hain
            itemsDiv.innerHTML = `
                <div style="text-align:center; padding: 30px; color:#888;">
                    <span style="font-size:30px;">📭</span>
                    <p>No tests added in this folder yet.</p>
                </div>`;
        }
    }, 200);

    // List wali window khol dein
    listContainer.style.display = 'block';
}

// 3. List Band karne ka Logic
function closeList() {
    const listContainer = document.getElementById('test-list-container');
    listContainer.style.display = 'none';
}

// 4. Link Open karne ka Logic
function openTestLink(url) {
    if (url && url.length > 5) {
        // Agar link sahi hai to wahan le jayein
        window.location.href = url;
    } else {
        alert("🚧 Link not available yet!\nAdmin ne abhi tak link update nahi kiya hai.");
    }
}
