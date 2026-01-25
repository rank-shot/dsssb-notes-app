let testDatabase = {};

// 1. App Load Logic
window.addEventListener('load', async () => {
    // Check Dark Mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Load Banner Slider
    showSlides();

    // Show Popup (Once per session)
    if (!sessionStorage.getItem('popupShown')) {
        setTimeout(() => {
            document.getElementById('announcement-modal').style.display = 'flex';
            sessionStorage.setItem('popupShown', 'true');
        }, 2000);
    }

    // Load Database
    try {
        const response = await fetch('./tests.json?t=' + Date.now());
        testDatabase = await response.json();
    } catch (error) { console.error("DB Error"); }
});

// 2. Tab Switching Logic (Bottom Nav)
function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById('search-results').style.display = 'none';

    // Remove active class from nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show selected section
    if (tabName === 'home') {
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

// 3. Image Slider Logic
let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

// 4. Search Function
function searchContent() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let home = document.getElementById('home-section');
    let results = document.getElementById('search-results');
    let resultsContainer = document.getElementById('search-items');

    if (input.length < 2) {
        home.style.display = 'block';
        results.style.display = 'none';
        return;
    }

    home.style.display = 'none';
    document.getElementById('pdf-section').style.display = 'none';
    document.getElementById('notice-section').style.display = 'none';
    results.style.display = 'block';
    resultsContainer.innerHTML = '';

    // Search in Tests
    for (const category in testDatabase) {
        testDatabase[category].forEach(test => {
            if (test.name.toLowerCase().includes(input)) {
                resultsContainer.appendChild(createTestButton(test));
            }
        });
    }
}

// 5. Utility Functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
function shareApp() {
    if (navigator.share) navigator.share({title: 'DSSSB Notes', url: window.location.href});
    else { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }
}
function closeModal() { document.getElementById('announcement-modal').style.display = 'none'; }
function closeList() { document.getElementById('test-list-container').style.display = 'none'; }

// 6. Test Logic
function openSubject(subject) {
    document.getElementById('subject-title').innerText = subject;
    let container = document.getElementById('test-items');
    container.innerHTML = 'Loading...';
    
    setTimeout(() => {
        container.innerHTML = '';
        let tests = testDatabase[subject];
        if (tests && tests.length > 0) {
            tests.forEach(test => container.appendChild(createTestButton(test)));
        } else {
            container.innerHTML = '<p style="text-align:center; padding:20px;">No Data Found</p>';
        }
    }, 100);
    document.getElementById('test-list-container').style.display = 'block';
}

function createTestButton(test) {
    let btn = document.createElement('button');
    btn.className = 'test-btn';
    let badgeHTML = test.badge ? `<span style="background:${test.badge==='New'?'green':'red'}; color:white; padding:2px 5px; font-size:10px; border-radius:4px; margin-left:5px;">${test.badge}</span>` : '';
    btn.innerHTML = `<div>📝 ${test.name} ${badgeHTML}</div>${test.attempts ? `<span style="font-size:12px; color:grey;">👥 ${test.attempts}</span>` : ''}`;
    btn.onclick = () => window.location.href = test.url;
    return btn;
}
