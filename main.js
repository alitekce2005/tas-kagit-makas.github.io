// Oyun değişkenleri
let playerScore = 0;
let computerScore = 0;
let isPlaying = false;
let playerRotationInterval;
let computerRotationInterval;
let playerCurrentChoice = 1;
let computerCurrentChoice = 1;

// Oyuncu resimleri (kendi resimlerinizi buraya ekleyin)
const playerImages = {
    1: 'images/tas_sol.jpg',    // Oyuncunun taş resmi
    2: 'images/kagit_sol.jpg',  // Oyuncunun kağıt resmi
    3: 'images/makas_sol.jpg'   // Oyuncunun makas resmi
};

// Bilgisayar resimleri (kendi resimlerinizi buraya ekleyin)
const computerImages = {
    1: 'images/tas_sag.jpg',    // Bilgisayarın taş resmi
    2: 'images/kagit_sag.jpg',  // Bilgisayarın kağıt resmi
    3: 'images/makas_sag.jpg'   // Bilgisayarın makas resmi
};

// Buton resimleri (butonlarda gösterilecek küçük resimler)
const buttonImages = {
    1: 'images/tas_sol.jpg',    // Buton taş resmi
    2: 'images/kagit_sol.jpg',  // Buton kağıt resmi
    3: 'images/makas_sol.jpg'   // Buton makas resmi
};

// Seçim isimleri
const choiceNames = {
    1: 'TAŞ',
    2: 'KAĞIT',
    3: 'MAKAS'
};

// Sayfa yüklendiğinde başlat
window.onload = function () {
    initializeGame();
    createCyberParticles();
    createEnergyLines();
};

// Gelişmiş ciber parçacık efekti oluştur
function createCyberParticles() {
    const particleContainer = document.getElementById('cyberParticles');

    // 5 farklı tip parçacık, toplam 100 adet
    const particleTypes = ['type1', 'type2', 'type3', 'type4', 'type5'];

    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.className = `particle ${randomType}`;

        // Rastgele başlangıç pozisyonu ve timing
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';

        particleContainer.appendChild(particle);
    }

    // Dinamik parçacık yenileme
    setInterval(() => {
        const particles = particleContainer.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (Math.random() < 0.05) { // %5 şansla yenile
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.animationDelay = Math.random() * 5 + 's';

                // Bazen tip değiştir
                if (Math.random() < 0.3) {
                    const newType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                    particle.className = `particle ${newType}`;
                }
            }
        });
    }, 1500);
}

// Enerji çizgileri efekti
function createEnergyLines() {
    const energyContainer = document.getElementById('energyLines');

    // 15 adet enerji çizgisi oluştur
    for (let i = 0; i < 15; i++) {
        const line = document.createElement('div');
        line.className = 'energy-line';

        // Rastgele yükseklik ve timing
        line.style.top = Math.random() * window.innerHeight + 'px';
        line.style.animationDelay = Math.random() * 10 + 's';
        line.style.animationDuration = (Math.random() * 6 + 4) + 's';

        energyContainer.appendChild(line);
    }

    // Enerji çizgilerini dinamik olarak yenile
    setInterval(() => {
        const lines = energyContainer.querySelectorAll('.energy-line');
        lines.forEach(line => {
            if (Math.random() < 0.1) { // %10 şansla pozisyon değiştir
                line.style.top = Math.random() * window.innerHeight + 'px';
            }
        });
    }, 3000);
}

function initializeGame() {
    // Buton resimlerini ayarla
    document.getElementById('rockBtn').src = buttonImages[1];
    document.getElementById('paperBtn').src = buttonImages[2];
    document.getElementById('scissorsBtn').src = buttonImages[3];

    // Başlangıç rotasyonu
    startRotation();
}

function startRotation() {
    // Oyuncunun kartları - oyuncu resimlerini kullan
    playerRotationInterval = setInterval(() => {
        if (!isPlaying) {
            document.getElementById('playerImage').src = playerImages[playerCurrentChoice];
            playerCurrentChoice = playerCurrentChoice === 3 ? 1 : playerCurrentChoice + 1;
        }
    }, 600);

    // Bilgisayarın kartları - bilgisayar resimlerini kullan
    computerRotationInterval = setInterval(() => {
        if (!isPlaying) {
            document.getElementById('computerImage').src = computerImages[computerCurrentChoice];
            // Bilgisayar için farklı sıralama: 2,1,3,2,1,3...
            if (computerCurrentChoice === 1) {
                computerCurrentChoice = 2;
            } else if (computerCurrentChoice === 2) {
                computerCurrentChoice = 3;
            } else {
                computerCurrentChoice = 1;
            }
        }
    }, 600);
}

function makeChoice(playerChoice) {
    if (isPlaying) return;

    isPlaying = true;
    clearInterval(playerRotationInterval);
    clearInterval(computerRotationInterval);

    // Bilgisayar seçimi
    const computerChoice = Math.floor(Math.random() * 3) + 1;

    // Seçimleri göster
    setTimeout(() => {
        document.getElementById('playerImage').src = playerImages[playerChoice];
        document.getElementById('computerImage').src = computerImages[computerChoice];

        // Sonucu hesapla
        const result = determineWinner(playerChoice, computerChoice);
        displayResult(result, playerChoice, computerChoice);

        // Kazanan efekti ve konfeti - sadece kazanan tarafa
        setTimeout(() => {
            if (result === 'win') {
                addWinnerEffect('playerChoice');
                createConfetti('player');
            } else if (result === 'lose') {
                addWinnerEffect('computerChoice');
                createConfetti('computer');
            }

            // 3 saniye sonra yeni tur
            setTimeout(() => {
                resetRound();
            }, 3000);
        }, 500);

    }, 1000);
}

function determineWinner(player, computer) {
    if (player === computer) {
        return 'draw';
    }

    if ((player === 1 && computer === 3) ||
        (player === 2 && computer === 1) ||
        (player === 3 && computer === 2)) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        return 'win';
    } else {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        return 'lose';
    }
}

function displayResult(result, playerChoice, computerChoice) {
    const resultDiv = document.getElementById('result');
    const resultText = resultDiv.querySelector('.result-text');

    let message = '';
    let className = '';

    if (result === 'win') {
        message = `${choiceNames[playerChoice]} vs ${choiceNames[computerChoice]} - KAZANDINIZ! 🎉`;
        className = 'win';
    } else if (result === 'lose') {
        message = `${choiceNames[playerChoice]} vs ${choiceNames[computerChoice]} - KAYBETTİNİZ! 😢`;
        className = 'lose';
    } else {
        message = `${choiceNames[playerChoice]} vs ${choiceNames[computerChoice]} - BERABERE! 🤝`;
        className = 'draw';
    }

    resultText.textContent = message;
    resultText.className = `result-text ${className}`;
}

function addWinnerEffect(elementId) {
    const element = document.getElementById(elementId);
    const effect = document.createElement('div');
    effect.className = 'winner-effect';
    element.appendChild(effect);

    setTimeout(() => {
        if (effect && effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 2000);
}

function createConfetti(winner) {
    // Kazanan tarafın konumunu al
    const winnerElement = winner === 'player' ?
        document.getElementById('playerChoice').parentElement :
        document.getElementById('computerChoice').parentElement;

    const rect = winnerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Konfeti parçalarını sadece kazanan tarafın üzerinde oluştur
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // Konfeti parçalarını kazanan tarafın etrafında dağıt
            const offsetX = (Math.random() - 0.5) * 200; // ±100px
            confetti.style.left = (centerX + offsetX) + 'px';
            confetti.style.top = (centerY - 50) + 'px';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti && confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3500);
        }, i * 50);
    }
}

function resetRound() {
    isPlaying = false;
    playerCurrentChoice = 1;
    computerCurrentChoice = 1;

    // Efektleri temizle
    document.querySelectorAll('.winner-effect').forEach(effect => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    });

    // Konfetileri temizle
    document.querySelectorAll('.confetti').forEach(confetti => {
        if (confetti && confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    });

    // Rotasyonu yeniden başlat
    startRotation();

    // Sonuç mesajını sıfırla
    const resultText = document.querySelector('.result-text');
    resultText.textContent = 'Bir seçim yapın!';
    resultText.className = 'result-text';
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';

    resetRound();

    // Fade-in efekti
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
}

// ==========================================
// 💰 PUAN HESAPLAMA VE GÖNDERME SİSTEMİ
// ==========================================

function finishAndClaim() {
    // 1. Skor Farkını Hesapla
    const scoreDifference = playerScore - computerScore;

    // 2. Kontrol: Kullanıcı önde mi?
    if (scoreDifference <= 0) {
        // Eğer gerideyse veya berabereyse puan alamaz
        const resultDiv = document.getElementById('result');
        const resultText = resultDiv.querySelector('.result-text');

        resultText.textContent = "KAZANÇ YOK! Puan almak için rakibinden önde olmalısın.";
        resultText.className = "result-text lose";

        // Görsel uyarı
        document.body.style.animation = "shake 0.5s";
        setTimeout(() => document.body.style.animation = "", 500);
        return;
    }

    // 3. Puan Hesapla (Fark x 20 Şans Parası)
    const earnedChanceMoney = scoreDifference * 20;

    // 4. Efektler
    createConfetti('player'); // Kutlama konfetisi

    // 5. Skoru Ana Sisteme Gönder
    sendScoreToParent(earnedChanceMoney);

    // 6. Bilgilendirme ve Sıfırlama
    const resultDiv = document.getElementById('result');
    const resultText = resultDiv.querySelector('.result-text');

    resultText.innerHTML = `TEBRİKLER!<br>Fark: ${scoreDifference} <br>Kazanılan: +${earnedChanceMoney} Şans Parası`;
    resultText.className = "result-text win";

    // Butonu geçici olarak devre dışı bırak (çift tıklamayı önlemek için)
    const btn = document.querySelector('.finish-btn');
    btn.disabled = true;
    btn.innerText = "GÖNDERİLDİ ✅";

    // 3 Saniye sonra oyunu sıfırla
    setTimeout(() => {
        resetGame();
        btn.disabled = false;
        btn.innerText = "💰 OYUNU BİTİR VE KAZANCINI AL";
        resultText.textContent = "Yeni oyun başladı! Risk almaya hazır mısın?";
        resultText.className = "result-text";
    }, 3000);
}

// Localhost ve GitHub uyumlu mesaj gönderme fonksiyonu
function sendScoreToParent(score) {
    window.parent.postMessage({
        type: 'GAME_OVER',
        gameId: 5,               // Taş Kağıt Makas ID'si
        score: score,            // Kazanılan Şans Parası
        pointName: 'Şans Parası' // Puan Adı
    }, '*');

    console.log("Skor ana sisteme gönderildi:", score);
}

// Shake animasyonu için CSS eklemesi (JS ile dinamik ekliyoruz)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(styleSheet);