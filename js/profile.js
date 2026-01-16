/**
 * ZKSentinel Profile Page - User Dashboard Controller
 */

class ProfilePage {
    constructor() {
        this.init();
        this.loadUserData();
        this.setupEventListeners();
        this.createMatrixRain();
        this.displayUserStats();
        this.setupAchievements();
        this.setupSocialConnections();
    }

    init() {
        this.userData = {};
        this.achievements = [
            { id: 1, name: 'First Race', icon: '🏁', desc: 'Complete your first race', earned: false },
            { id: 2, name: 'Speed Demon', icon: '⚡', desc: 'Reach 200 mph', earned: false },
            { id: 3, name: 'Coin Collector', icon: '💰', desc: 'Collect 1000 coins', earned: false },
            { id: 4, name: 'Quantum Master', icon: '🌀', desc: 'Generate 10 ZK proofs', earned:  false },
            { id: 5, name: 'NFT Hunter', icon: '🎨', desc: 'Earn 5 NFTs', earned: false },
            { id: 6, name: 'Social Butterfly', icon: '🦋', desc: 'Connect all social accounts', earned: false }
        ];
        this.socialPlatforms = [
            { id:  'twitter', name: 'Twitter/X', icon: '𝕏', color: '#000000' },
            { id:  'discord', name: 'Discord', icon: '💬', color: '#5865F2' },
            { id: 'telegram', name:  'Telegram', icon: '✈️', color: '#0088cc' },
            { id: 'github', name: 'GitHub', icon: '👨‍💻', color: '#333333' }
        ];
        this.connectedSocials = JSON.parse(localStorage.getItem('connectedSocials')) || [];
    }

    createMatrixRain() {
        const matrixBg = document.getElementById('matrix-bg');
        if (! matrixBg) return;

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

        setInterval(draw, 33);
    }

    loadUserData() {
        const savedData = localStorage.getItem('zkSentinelUserData');
        if (savedData) {
            try {
                this.userData = JSON.parse(savedData);
            } catch (error) {
                console.error('Error loading user data:', error);
                this.userData = this.getDefaultUserData();
            }
        } else {
            this.userData = this.getDefaultUserData();
        }
    }

    getDefaultUserData() {
        return {
            currentAccount: '0x0000000000000000000000000000000000000000',
            isWalletConnected: false,
            zkCoins: 0,
            zkProofs: 0,
            bestLap: 0,
            achievements: [],
            userProfile: {
                username: 'Anonymous',
                level: 0,
                joinDate: new Date().toLocaleDateString(),
                totalRaces: 0
            }
        };
    }

    setupEventListeners() {
        const avatar = document.querySelector('.profile-avatar');
        avatar?.addEventListener('click', () => this.openAvatarModal());

        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleActionClick(index));
        });

        const closeModal = document.querySelector('.close');
        closeModal?.addEventListener('click', () => this.closeModal());

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('avatar-modal');
            if (e. target === modal) {
                this.closeModal();
            }
        });
    }

    displayUserStats() {
        const { currentAccount, zkCoins, zkProofs, bestLap, userProfile } = this.userData;

        const h1 = document.querySelector('. profile-info h1');
        if (h1) h1.textContent = userProfile?. username || 'Player';

        const walletSpan = document. querySelector('.profile-info p');
        if (walletSpan && currentAccount) {
            walletSpan.textContent = `Wallet: ${currentAccount.substr(0, 6)}...${currentAccount.substr(-4)}`;
        }

        const statsMini = document.querySelectorAll('. stat-mini-value');
        if (statsMini[0]) statsMini[0].textContent = zkCoins;
        if (statsMini[1]) statsMini[1].textContent = zkProofs;

        this. updateStatsSection(zkCoins, zkProofs, bestLap, userProfile);
    }

    updateStatsSection(coins, proofs, bestLap, profile) {
        const statsCards = document. querySelectorAll('. stat-card-value');

        const stats = [
            { label: 'Total Coins', value: coins },
            { label:  'ZK Proofs', value: proofs },
            { label: 'Best Lap', value: bestLap ?  `${bestLap}s` : '0s' },
            { label: 'Level', value: profile?. level || 0 },
            { label: 'Total Races', value: profile?.totalRaces || 0 },
            { label: 'Achievements', value: this.userData.achievements?. length || 0 }
        ];

        statsCards.forEach((card, index) => {
            if (stats[index]) {
                card.textContent = stats[index].value;
            }
        });
    }

    setupAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;

        container.innerHTML = '';

        this. achievements.forEach(achievement => {
            const earned = this.userData.achievements?.includes(achievement.name);
            const div = document. createElement('div');
            div.className = 'achievement-item';
            div.style.opacity = earned ? '1' : '0.5';
            div.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
                ${earned ? '<div style="font-size: 0.7rem; color: #27ca3f; margin-top: 0.5rem;">✓ Earned</div>' : ''}
            `;
            container.appendChild(div);
        });
    }

    setupSocialConnections() {
        const container = document.getElementById('social-list');
        if (!container) return;

        container.innerHTML = '';

        this.socialPlatforms.forEach(platform => {
            const isConnected = this.connectedSocials.includes(platform.id);
            const div = document. createElement('div');
            div.className = 'social-item';
            div.innerHTML = `
                <div class="social-info">
                    <div class="social-icon">${platform.icon}</div>
                    <div>
                        <div class="social-name">${platform.name}</div>
                        <div class="social-status">${isConnected ? 'Connected ✓' : 'Not connected'}</div>
                    </div>
                </div>
                <button class="connect-btn ${isConnected ? 'connected' : ''}" 
                        data-platform="${platform.id}">
                    ${isConnected ? 'Connected' : 'Connect'}
                </button>
            `;
            container.appendChild(div);
        });

        container.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleSocialConnection(e.target));
        });
    }

    toggleSocialConnection(btn) {
        const platform = btn.getAttribute('data-platform');
        const index = this.connectedSocials.indexOf(platform);

        if (index > -1) {
            this.connectedSocials.splice(index, 1);
        } else {
            this.connectedSocials.push(platform);
        }

        localStorage.setItem('connectedSocials', JSON.stringify(this.connectedSocials));
        this.setupSocialConnections();
        this.showMessage(`${platform} ${index > -1 ? 'disconnected' : 'connected'}!`);
    }

    openAvatarModal() {
        const modal = document.getElementById('avatar-modal');
        if (modal) modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('avatar-modal');
        if (modal) modal.classList.remove('active');
    }

    handleActionClick(index) {
        const actions = ['Edit Profile', 'Download Stats', 'Share Profile', 'Settings'];
        this.showMessage(`Clicked: ${actions[index]}`);
    }

    showMessage(message) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 210, 255, 0.1));
            border:  2px solid #00ff41;
            border-radius: 8px;
            padding: 1. 5rem 2rem;
            color: #00ff41;
            font-weight: 600;
            z-index:  2001;
            animation: slideInRight 0.3s ease-out;
        `;
        div.textContent = message;
        document.body.appendChild(div);

        setTimeout(() => div.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfilePage();
});
