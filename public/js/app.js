// State
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const uploadModal = document.getElementById('uploadModal');
const videoModal = document.getElementById('videoModal');

const loginBtn = document.getElementById('loginBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadBtnAuth = document.getElementById('uploadBtnAuth');
const logoutBtn = document.getElementById('logoutBtn');

const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const closeUpload = document.getElementById('closeUpload');
const closeVideo = document.getElementById('closeVideo');

const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const uploadForm = document.getElementById('uploadForm');

const navButtons = document.getElementById('navButtons');
const userMenu = document.getElementById('userMenu');
const usernameDisplay = document.getElementById('usernameDisplay');

const videoGrid = document.getElementById('videoGrid');
const videoFile = document.getElementById('videoFile');
const fileName = document.getElementById('fileName');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadVideos();
});

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUI();
        } else {
            currentUser = null;
            updateUI();
        }
    } catch (error) {
        currentUser = null;
        updateUI();
    }
}

// Update UI based on auth state
function updateUI() {
    if (currentUser) {
        navButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        usernameDisplay.textContent = currentUser.username;
    } else {
        navButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Modal controls
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

uploadBtn.addEventListener('click', () => {
    if (!currentUser) {
        loginModal.style.display = 'block';
    } else {
        uploadModal.style.display = 'block';
    }
});

uploadBtnAuth.addEventListener('click', () => {
    uploadModal.style.display = 'block';
});

closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

closeSignup.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

closeUpload.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

closeVideo.addEventListener('click', () => {
    videoModal.style.display = 'none';
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.pause();
    videoPlayer.src = '';
});

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
    if (e.target === uploadModal) {
        uploadModal.style.display = 'none';
    }
    if (e.target === videoModal) {
        videoModal.style.display = 'none';
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.pause();
        videoPlayer.src = '';
    }
});

// File input
videoFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileName.textContent = e.target.files[0].name;
    } else {
        fileName.textContent = 'No file chosen';
    }
});

// Login form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateUI();
            loginModal.style.display = 'none';
            loginForm.reset();
            alert('Login successful!');
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Signup form
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateUI();
            signupModal.style.display = 'none';
            signupForm.reset();
            alert('Account created successfully!');
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        updateUI();
        alert('Logged out successfully!');
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});

// Upload form
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const file = videoFile.files[0];
    
    if (!file) {
        alert('Please select a video file');
        return;
    }
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    uploadProgress.style.display = 'block';
    
    try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressFill.style.width = percentComplete + '%';
                progressText.textContent = Math.round(percentComplete) + '%';
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                uploadModal.style.display = 'none';
                uploadForm.reset();
                fileName.textContent = 'No file chosen';
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
                progressText.textContent = '0%';
                alert('Video uploaded successfully!');
                loadVideos();
            } else {
                const data = JSON.parse(xhr.responseText);
                alert(data.error || 'Upload failed');
            }
        });
        
        xhr.addEventListener('error', () => {
            alert('Upload failed. Please try again.');
        });
        
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
        
    } catch (error) {
        alert('An error occurred. Please try again.');
        uploadProgress.style.display = 'none';
    }
});

// Load videos
async function loadVideos() {
    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();
        
        videoGrid.innerHTML = '';
        
        if (videos.length === 0) {
            videoGrid.innerHTML = `
                <div class="empty-state">
                    <h2>No videos yet</h2>
                    <p>Be the first to upload a video!</p>
                </div>
            `;
            return;
        }
        
        videos.reverse().forEach(video => {
            const videoCard = createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Failed to load videos:', error);
    }
}

// Create video card
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    const uploadDate = new Date(video.uploadedAt);
    const formattedDate = uploadDate.toLocaleDateString();
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <video src="${video.filepath}" preload="metadata"></video>
            <div class="play-icon"></div>
        </div>
        <div class="video-details">
            <div class="video-title">${escapeHtml(video.title)}</div>
            <div class="video-meta">
                <div>${escapeHtml(video.username)}</div>
                <div>${video.views} views • ${formattedDate}</div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        playVideo(video.id);
    });
    
    return card;
}

// Play video
async function playVideo(videoId) {
    try {
        const response = await fetch(`/api/videos/${videoId}`);
        const video = await response.json();
        
        const videoPlayer = document.getElementById('videoPlayer');
        const videoTitle = document.getElementById('videoTitle');
        const videoUsername = document.getElementById('videoUsername');
        const videoViews = document.getElementById('videoViews');
        const videoDate = document.getElementById('videoDate');
        const videoDescription = document.getElementById('videoDescription');
        
        videoPlayer.src = video.filepath;
        videoTitle.textContent = video.title;
        videoUsername.textContent = video.username;
        videoViews.textContent = `${video.views} views`;
        
        const uploadDate = new Date(video.uploadedAt);
        videoDate.textContent = uploadDate.toLocaleDateString();
        
        videoDescription.textContent = video.description || 'No description';
        
        videoModal.style.display = 'block';
        videoPlayer.play();
    } catch (error) {
        alert('Failed to load video');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
