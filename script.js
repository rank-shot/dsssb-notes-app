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
        document.body.insertAdjacentHTML('beforeend', '<p style="text-align:center; color:red; margin-top:20px;">Error loading tests. Please refresh.</p>');
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
                
                // Agar Badge hai (Jaise 'New' ya 'Imp') to use add karein
                let badgeHTML = '';
                if (test.badge && test.badge !== 'None') {
                    // Badge ka color decide karein
                    let badgeColor = test.badge === 'New' ? '#28a745' : '#dc3545'; // Green for New, Red for Imp
                    badgeHTML = `<span style="background:${badgeColor}; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:8px; vertical-align:middle;">${test.badge}</span>`;
                }

                // Button ka text set karein
                btn.innerHTML = `📝 ${test.name} ${badgeHTML}`;
                
                // Click karne par Link open ho
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
    
    // Animation ke liye class hata kar hide karein (optional, simple display none bhi chalega)
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
