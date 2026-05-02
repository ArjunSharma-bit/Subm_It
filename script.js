const evilButton = document.getElementById('evil-submit')
const Sounds = {
    1: new Audio('./media/woosh.mp3'),
    2: new Audio('./media/flash.mp3'),
    3: new Audio('./media/swoop.mp3'),
}

const bgm = new Audio('./media/Megalovania.mp3')
bgm.loop = true;
bgm.volume = 0.4;

let currPhase = 1;
let gameStarted = false;
let messageIndex = 0;
let ironicindex = 0;
let currScale = 1;
let totalbuttons = 1;
let bossHealth = 100;

const trashTalk = ["Tooo slooow....", "Missed mee", "R u even Trying!!!", "Oh You are tryinnng...","Flashesssss...", "This is just Sad.!" ,"uR Dpi is too Low", "I am Speeeeeedddd", "Good Cardio", "HmmmmmMmmmm", "これを翻訳しようとしているのですか!!!", "*Yawns* in Speed", "You are Clearly freeeeee", "Zoooooppp", ]
const ironicTalk = ["Cmon you can do it (Nope)", "Oh You just missed me.. by a Mile!","Almost had it!", "I believe in you (kinda)", "Are you even trying?","Focus!!!!", "Just click it Man, it's easy", "ALL You have to do is click" , "The Damn Button" , "So close, yet so far", "Maybe use two hands?", "Take a deep breast", "Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha","Ha",]

function runAway (e) {
    const targetBtn = e.target;
    //Start
    if(!gameStarted) {
        gameStarted = true;
        bgm.play().catch(e => console.log("Browser needs a click before audio plays."))

        setTimeout(() => {
            currPhase = 2;
            document.querySelectorAll('.evil-btn').forEach(btn => btn.style.backgroundColor ='#c51e48');
            console.log("Entering Phase 2: The Mock");

            setInterval(() => {
                const nameInput = document.getElementById('name');
                if(nameInput && nameInput.value.length > 0) {
                    nameInput.value = scrambleText(nameInput.value)
                }
            }, 200)
        }, 10000)

        setTimeout(() => {
            currPhase = 3;
            document.querySelectorAll('.evil-btn').forEach(btn => {btn.style.backgroundColor ='#5da74b'; btn.classList.add('shaking')});
            console.log("Entering Phase 3: The Irony");

            document.body.classList.add('disco-mode');
            document.getElementById('boss-health-container').style.display = 'block';
            setInterval(createClone ,2000)
        }, 25000)
    }
    //Sound
    const activeSound = Sounds[currPhase];
    if(activeSound) {
        activeSound.currentTime = 0;
        activeSound.play().catch(e => console.log("Browser needs a click before audio plays!"))
    }

    //Position
    const currentRect = targetBtn.getBoundingClientRect()
    const currentX = currentRect.left;
    const currentY = currentRect.top;

    //Phase Change
    if(currPhase === 2 || currPhase === 3) {
        phaseChange(currentX, currentY);
    }

    if(currPhase === 3) {
        currScale -= 0.02;
        if(currScale < 0.75) currScale = 0.75;
        targetBtn.style.transform = `scale(${currScale})`

        bossHealth -= 2;

        if(bossHealth <= 5) {bossHealth = 100};

        document.getElementById('boss-health-bar').style.width = `${bossHealth}%`;
        document.getElementById('health-percentage').textContent = `${bossHealth}%`;
    }

    //Teleport Logic
    targetBtn.style.position = 'fixed';

    const safeWidth = window.innerWidth - targetBtn.offsetWidth;
    const safeHeight = window.innerHeight - targetBtn.offsetHeight;

    let randomX, randomY, distance;
    //Settin a Min_Jump So Rand Doesnt Tp just one Pixel away
    const Min_Jump = 300;
    let attempts = 0;
    do {
        randomX = Math.floor(Math.random() * safeWidth);
        randomY = Math.floor(Math.random() * safeHeight);

        distance = Math.hypot(randomX - currentX, randomY - currentY)
        attempts++;
        if(attempts > 50) break;
    } while (distance < Min_Jump)

    targetBtn.style.left = `${randomX}px`;
    targetBtn.style.top = `${randomY}px`;

    if(currPhase === 3) {
        targetBtn.style.backgroundColor = getRandomColor();
    }
}

function createClone() {
    if(totalbuttons >= 20) return;
    //Create the Base Clone
    const clone = evilButton.cloneNode(true);
    clone.style.backgroundColor = getRandomColor();
    clone.style.transform = `scale(${currScale})`;
    clone.style.position = 'fixed';
    clone.setAttribute('form', 't-form');

    let randomX, randomY, isTooClose;
    const Min_Spawn_dist = 150;
    let attempts = 0;
    //Check the distance bw Clones to Avoid overlap
    do {
        isTooClose = false;
        randomX = Math.floor(Math.random() * (window.innerWidth - 100))
        randomY = Math.floor(Math.random() * (window.innerHeight - 50))

        const allBtns = document.querySelectorAll('.evil-btn');

        allBtns.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const distance = Math.hypot(randomX - rect.left , randomY - rect.top);
            if(distance < Min_Spawn_dist) {
                isTooClose = true
            }
        })
        attempts++;
        if(attempts > 50) break;
    } while(isTooClose)


    clone.style.left = `${randomX}px`;
    clone.style.top = `${randomY}px`;

    clone.addEventListener('mouseover', runAway);
    document.body.appendChild(clone);
    totalbuttons++;
}

function phaseChange(x, y) {
    //Base Trail
    const ghost = document.createElement('div');
    ghost.className = 'button-ghost';
    ghost.textContent = 'Submit';
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    ghost.style.backgroundColor = evilButton.style.backgroundColor;
    ghost.style.transform = `scale(${currScale})`;
    document.body.appendChild(ghost)


    //The Trash Talk
    const talk = document.createElement('div')
    talk.className = 'trash-talk';
    talk.style.left = `${x + 10}px`;
    talk.style.top = `${y + 10}px`;

    //Talk change acc to the phase
    if(currPhase === 2) {
        talk.textContent = trashTalk[messageIndex];
        talk.style.color = "#c44b4b";
        messageIndex++
        if(messageIndex >= trashTalk.length) messageIndex = 0;
    } else if (currPhase === 3) {
        talk.textContent = ironicTalk[ironicindex];
        talk.style.color = getRandomColor();
        ironicindex++
        if(ironicindex >= ironicTalk.length) ironicindex = 0;
    }

    document.body.appendChild(talk)

    //Diff timer for Trail and Talk
    setTimeout(() =>{
        ghost.remove();
    }, 1000)

    setTimeout(() =>{
        talk.remove();
    }, 3000)
}

//Helpers
function getRandomColor() {
    const letters = '0123456788ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function scrambleText(text) {
    return text.split('').sort(() => 0.5 - Math.random()).join('');
}

// THE ENDINGS 
const contactform = document.getElementById('t-form');

contactform.addEventListener('submit', function (event) {
    event.preventDefault(); // Stop the page from actually submitting

    bgm.pause()

    document.getElementById('boss-health-container').style.display = 'none';
    //Victory Screen 
    const winScreen = document.getElementById('win-screen');
    const winMessage = document.getElementById('win-message');

    //Ending (Tab + Enter)
    winMessage.textContent = "Thank you for Contacting us.";
    winMessage.style.color = "#e0e0e0"; 

    winScreen.style.display = "flex";
});

//Reset 
document.getElementById('retry-btn').addEventListener('click', () => {
    location.reload(); 
});

evilButton.classList.add('evil-btn')
evilButton.addEventListener('mouseover', runAway)