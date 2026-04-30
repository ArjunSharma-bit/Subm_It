const evilButton = document.getElementById('evil-submit')

const teleportSound = new Audio('./media/woosh.mp3')

evilButton.addEventListener('mouseover', function () {

    teleportSound.currentTime = 0;
    teleportSound.play().catch(e => console.log("Browser needs a click before audio plays!"))

    evilButton.style.position = 'fixed';

    const safeWidth = window.innerWidth - evilButton.offsetWidth;
    const safeHeight = window.innerHeight - evilButton.offsetHeight;

    const randomX = Math.floor(Math.random() * safeWidth);
    const randomY = Math.floor(Math.random() * safeHeight);

    evilButton.style.left = `${randomX}px`;
    evilButton.style.top = `${randomY}px`;
})