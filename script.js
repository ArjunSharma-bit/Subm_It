const evilButton = document.getElementById('evil-submit')
const Sounds = {
    1: new Audio('./media/woosh.mp3'),
    2: new Audio('./media/flash.mp3'),
}

let currPhase = 1;
let gameStarted = false;
let messageIndex = 0;


const trashTalk = ["Tooo slooow....", "Missed mee", "R u even Trying!!!", "Oh You are tryinnng...","Flashesssss...", "This is just Sad.!" ,"uR Dpi is too Low", "I am Speeeeeedddd", "Good Cardio", "HmmmmmMmmmm", "これを翻訳しようとしているのですか!!!", "*Yawns* in Speed", "You are Clearly freeeeee", "Zoooooppp", ]

evilButton.addEventListener('mouseover', function () {
    //Start
    if(!gameStarted) {
        gameStarted = true;

        setTimeout(() => {
            currPhase = 2;
            evilButton.style.backgroundColor = '#c51e48';
            console.log("Entering Phase 2: The Mock");
        }, 10000)
    }
    //Sound
    const activeSound = Sounds[currPhase];
    if(activeSound) {
        activeSound.currentTime = 0;
        activeSound.play().catch(e => console.log("Browser needs a click before audio plays!"))
    }

    //Position
    const currentRect = evilButton.getBoundingClientRect()
    const currentX = currentRect.left;
    const currentY = currentRect.top;

    //Phase Change
    if(currPhase === 2) {
        phase2(currentX, currentY)
    }

    //Teleport Logic
    evilButton.style.position = 'fixed';

    const safeWidth = window.innerWidth - evilButton.offsetWidth;
    const safeHeight = window.innerHeight - evilButton.offsetHeight;

    let randomX, randomY, distance;
    //Settin a Min_Jump So Rand Doesnt Tp just one Pixel away
    const Min_Jump = 300;
    do {
        randomX = Math.floor(Math.random() * safeWidth);
        randomY = Math.floor(Math.random() * safeHeight);

        distance = Math.hypot(randomX - currentX, randomY - currentY)
    } while (distance < Min_Jump)

    evilButton.style.left = `${randomX}px`;
    evilButton.style.top = `${randomY}px`;
})

function phase2(x, y) {
    //Base Trail
    const ghost = document.createElement('div');
    ghost.className = 'button-ghost';
    ghost.textContent = 'Submit';
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    document.body.appendChild(ghost)


    //The Trash Talk
    const talk = document.createElement('div')
    talk.className = 'trash-talk';
    talk.textContent = trashTalk[messageIndex]
    talk.style.left = `${x + 10}px`;
    talk.style.top = `${y + 10}px`;
    document.body.appendChild(talk)

    //Message Cycle
    messageIndex++;
    if(messageIndex >= trashTalk.length) messageIndex = 0;

    setTimeout(() =>{
        ghost.remove();
    }, 1000)

    setTimeout(() =>{
        talk.remove();
    }, 3000)
}