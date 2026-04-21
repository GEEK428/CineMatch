// Simple auth helper for CineMatch

const processUrlData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token) {
        localStorage.setItem('token', token);
    }
    if (userStr) {
        localStorage.setItem('user', userStr);
    }

    if (token || userStr) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

// Execute immediately
processUrlData();

const checkAuth = () => {
    const savedToken = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let savedUser = {};
    
    try {
        savedUser = JSON.parse(userStr || '{}');
    } catch (e) {
        console.error("Corrupt session, clearing...");
        localStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.includes('login.html') || (path.includes('login') && !path.includes('api'));
    const isSignupPage = path.includes('signup.html') || path.includes('signup');
    const isAuthPage = isLoginPage || isSignupPage || path.includes('forgot-password');
    const isCompleteProfilePage = path.includes('complete-profile');

    // Logic 1: If no token, you MUST be on an Auth Page
    if (!savedToken) {
        if (!isAuthPage && !isCompleteProfilePage) {
            window.location.href = 'login.html';
        }
        return;
    }

    // Logic 2: If profile is incomplete, you MUST be on Setup page
    const isIncomplete = !savedUser || !savedUser.username || !savedUser.favoriteMovie;
    if (isIncomplete) {
        if (!isCompleteProfilePage) {
            window.location.href = 'complete-profile.html';
        }
        return;
    }

    // Logic 3: If authenticated and complete, STAY AWAY from Login/Signup/Setup
    if (isAuthPage || isCompleteProfilePage) {
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', checkAuth);
