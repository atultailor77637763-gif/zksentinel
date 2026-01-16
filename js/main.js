/**
 * ZKSentinel - Main Application Controller
 * Enhanced UI/UX with smooth animations, better state management, and improved interactions
 */

class ZKSentinel {
    constructor() {
        this.init();
        this.createMatrixRain();
        this.setupEventListeners();
        this.animateStats();
        this.initAudio();
        this.setupTheme();
    }

    /**
     * Initialize application state
     */
    init() {
        this.isWalletConnected = false;
        this.currentAccount = null;
        this.zkCoins = 0;
        this.zkProofs = 0;
        this. bestLap = 0;
        this.achievements = [];
        this.userProfile = {};
        this.loadUserData();
        this.setupResponsiveness();
    }

    /**
     * Create animated matrix rain background
     */
    createMatrixRain() {
        const matrixBg = document.getElementById('matrix-bg');
        if (!matrixBg) return;

        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas. height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: -2;
            pointer-events: none;
            opacity: 0.03;
        `;

        matrixBg.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const charArray = chars.split('');

        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        const draw = () => {
            ctx. fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas. width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px 'Courier New'`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const animationId = setInterval(draw, 33);

        window.addEventListener('resize', () => {
            canvas.width = window. innerWidth;
            canvas.height = window.innerHeight;
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(animationId);
        });
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        this.setupNavigation();

        // Wallet connection
        this.setupWalletConnection();

        // Buttons
        this.setupButtonListeners();

        // Message portal
        this.setupMessagePortal();

        // Parallax effect
        window.addEventListener('scroll', () => this.handleParallax());

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup navigation and hamburger menu
     */
    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = navMenu?. querySelectorAll('. nav-link') || [];

        hamburger?. addEventListener('click', () => {
            navMenu. classList.toggle('active');
            this.animateHamburger(hamburger);
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor. addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Animate hamburger menu
     */
    animateHamburger(hamburger) {
        hamburger.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(8px, 8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(8px, -8px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    }

    /**
     * Setup wallet connection UI and logic
     */
    setupWalletConnection() {
        const walletConnect = document.getElementById('wallet-connect');
        const walletModal = document.getElementById('wallet-modal');
        const closeModal = document.querySelector('.close');

        walletConnect?.addEventListener('click', () => {
            this. openWalletModal(walletModal);
        });

        closeModal?.addEventListener('click', () => {
            this.closeWalletModal(walletModal);
        });

        window.addEventListener('click', (e) => {
            if (e.target === walletModal) {
                this.closeWalletModal(walletModal);
            }
        });

        // Wallet options
        document.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const walletType = e.currentTarget.getAttribute('data-wallet');
                this.connectWallet(walletType);
            });
        });
    }

    /**
     * Open wallet modal with animation
     */
    openWalletModal(modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close wallet modal with animation
     */
    closeWalletModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    /**
     * Setup button listeners
     */
    setupButtonListeners() {
        const launchBtn = document.getElementById('launch-game');
        const profileBtn = document.getElementById('view-profile');

        launchBtn?.addEventListener('click', () => this.launchGame());
        profileBtn?.addEventListener('click', () => this.viewProfile());
    }

    /**
     * Setup message portal form
     */
    setupMessagePortal() {
        const transmitBtn = document.getElementById('transmit-btn');
        transmitBtn?.addEventListener('click', () => this.sendMessage());

        // Allow Enter key to send message
        const messageInput = document.getElementById('message-content');
        messageInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this. sendMessage();
            }
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals
            if (e.key === 'Escape') {
                const modal = document.getElementById('wallet-modal');
                if (modal?. style.display === 'flex') {
                    this.closeWalletModal(modal);
                }
            }
        });
    }

    /**
     * Animate stats section on scroll
     */
    animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (! startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.textContent = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries. forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target')) || 0;
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    /**
     * Connect wallet (simulated for now)
     */
    async connectWallet(walletType) {
        const modal = document.getElementById('wallet-modal');
        const walletConnect = document.getElementById('wallet-connect');

        try {
            this.showLoadingMessage('Connecting wallet...');

            // Simulate wallet connection
            await this.simulateWalletConnection(walletType);

            // Update UI
            this.isWalletConnected = true;
            this.currentAccount = '0x' + Math.random().toString(16).substr(2, 40);

            walletConnect. innerHTML = `
                <span class="wallet-text">Connected:  ${this.currentAccount. substr(0, 6)}...${this.currentAccount.substr(-4)}</span>
                <div class="wallet-icons">
                    <div style="width: 8px; height: 8px; background: #27ca3f; border-radius: 50%; box-shadow: 0 0 10px #27ca3f;"></div>
                </div>
            `;

            walletConnect.style.cursor = 'default';

            this.closeWalletModal(modal);
            this.showSuccessMessage(`Connected to ${walletType}!`);

            // Initialize user data
            this.initializeUserData();
            this.saveUserData();

        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.showErrorMessage('Failed to connect wallet. Please try again.');
        }
    }

    /**
     * Simulate wallet connection
     */
    async simulateWalletConnection(walletType) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Connection failed'));
                }
            }, 1500);
        });
    }

    /**
     * Initialize user profile data
     */
    initializeUserData() {
        this.zkCoins = Math.floor(Math.random() * 10000);
        this.zkProofs = Math.floor(Math. random() * 100);
        this.bestLap = (60 + Math.random() * 30).toFixed(2);
        this.achievements = ['First Race', 'Speed Demon', 'Coin Collector', 'Quantum Master'];
        this.userProfile = {
            username: `User${Math.floor(Math.random() * 9000) + 1000}`,
            level: Math.floor(Math.random() * 50) + 1,
            joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            totalRaces: Math.floor(Math.random() * 500) + 10
        };
    }

    /**
     * Launch game
     */
    launchGame() {
        if (! this.isWalletConnected) {
            this.showErrorMessage('Please connect your wallet first! ');
            return;
        }

        const launchBtn = document.getElementById('launch-game');
        launchBtn.style.transform = 'scale(0.95)';

        this.showLoadingMessage('Launching game...');

        setTimeout(() => {
            window.location.href = 'loading.html';
        }, 800);
    }

    /**
     * View profile
     */
    viewProfile() {
        if (!this.isWalletConnected) {
            this.showErrorMessage('Please connect your wallet first!');
            return;
        }

        window.location.href = 'profile.html';
    }

    /**
     * Send message through portal
     */
    async sendMessage() {
        const senderName = document.getElementById('sender-name')?.value || '';
        const senderEmail = document.getElementById('sender-email')?.value || '';
        const messageContent = document.getElementById('message-content')?.value || '';
        const transmitBtn = document.getElementById('transmit-btn');
        const statusDiv = document.getElementById('transmission-status');

        // Validation
        if (!senderName || !senderEmail || !messageContent) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #ff0080;">[ERROR] All fields required</span>';
            }
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            if (statusDiv) {
                statusDiv.innerHTML = '<span style="color: #ff0080;">[ERROR] Invalid email format</span>';
            }
            return;
        }

        transmitBtn.classList.add('loading');
        if (statusDiv) {
            statusDiv. innerHTML = '<span style="color:  #00d2ff;">[TRANSMITTING] Encoding quantum message... </span>';
        }

        // Simulate message transmission
        await new Promise(resolve => setTimeout(resolve, 2000));

        transmitBtn.classList.remove('loading');
        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color: #27ca3f;">[SUCCESS] Message transmitted through quantum tunnel</span>';
        }

        // Clear form
        document.getElementById('sender-name').value = '';
        document.getElementById('sender-email').value = '';
        document.getElementById('message-content').value = '';

        this.showSuccessMessage('Message transmitted successfully!');

        // Reset status after delay
        setTimeout(() => {
            if (statusDiv) {
                statusDiv.innerHTML = '';
            }
        }, 3000);
    }

    /**
     * Handle parallax effect
     */
    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = 0.5;

        if (parallax) {
            parallax. style.transform = `translateY(${scrolled * speed}px)`;
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        let successDiv = document.getElementById('success-message');

        if (! successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'success-message';
            successDiv.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 210, 255, 0.1));
                border:  2px solid #00ff41;
                border-radius:  8px;
                padding: 1. 5rem 2rem;
                color: #00ff41;
                font-weight: 600;
                z-index: 2001;
                display: flex;
                gap: 1rem;
                align-items: center;
                box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(successDiv);
        }

        const successText = successDiv.querySelector('. success-text') || document.createElement('span');
        successText.className = 'success-text';
        successText.textContent = message;

        if (! successDiv.querySelector('.success-text')) {
            successDiv.appendChild(successText);
        }

        successDiv.style.display = 'flex';
        successDiv.style. background = 'linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 210, 255, 0.1))';

        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        let errorDiv = document.getElementById('error-message');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(255, 64, 129, 0.1));
                border: 2px solid #ff0080;
                border-radius: 8px;
                padding: 1.5rem 2rem;
                color: #ff0080;
                font-weight: 600;
                z-index: 2001;
                display: flex;
                gap:  1rem;
                align-items: center;
                box-shadow: 0 0 30px rgba(255, 0, 128, 0.3);
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(errorDiv);
        }

        const errorText = errorDiv.querySelector('.error-text') || document.createElement('span');
        errorText.className = 'error-text';
        errorText.textContent = message;

        if (!errorDiv.querySelector('.error-text')) {
            errorDiv.appendChild(errorText);
        }

        errorDiv. style.display = 'flex';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    /**
     * Show loading message
     */
    showLoadingMessage(message) {
        let loadingDiv = document.getElementById('loading-message');

        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading-message';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background:  rgba(0, 0, 0, 0.9);
                border:  2px solid #00d2ff;
                border-radius:  8px;
                padding:  2rem;
                color:  #00d2ff;
                font-weight: 600;
                z-index: 2002;
                text-align: center;
                box-shadow: 0 0 30px rgba(0, 210, 255, 0.3);
            `;
            document.body.appendChild(loadingDiv);
        }

        loadingDiv.textContent = message;
        loadingDiv.style.display = 'block';
    }

    /**
     * Load user data from localStorage
     */
    loadUserData() {
        const savedData = localStorage.getItem('zkSentinelUserData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.assign(this, data);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    }

    /**
     * Save user data to localStorage
     */
    saveUserData() {
        const userData = {
            zkCoins: this.zkCoins,
            zkProofs: this.zkProofs,
            bestLap: this.bestLap,
            achievements: this.achievements,
            currentAccount: this.currentAccount,
            isWalletConnected: this. isWalletConnected,
            userProfile: this.userProfile
        };
        localStorage.setItem('zkSentinelUserData', JSON. stringify(userData));
    }

    /**
     * Initialize audio engine
     */
    initAudio() {
        if (window.AudioEngine) {
            this.audioEngine = new AudioEngine();
            this.audioEngine.playBackgroundMusic('landing');
        }
    }

    /**
     * Setup responsive design
     */
    setupResponsiveness() {
        const handleResize = () => {
            const navbar = document.querySelector('.navbar');
            if (window.innerWidth > 768) {
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        };

        window.addEventListener('resize', handleResize);
    }

    /**
     * Setup theme preferences
     */
    setupTheme() {
        const savedTheme = localStorage.getItem('zkSentinelTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZKSentinel();
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations if needed
    } else {
        // Resume animations
    }
});
