import { user } from './getUsers.js'

export default function showAvatar() {
    if (user.name) {
        let usernameElement = document.getElementById('user-name');
        let avatarElement = document.getElementById('avatar-img');

        usernameElement.textContent = user.name;
        avatarElement.src = `https://api.adorable.io/avatars/30/${user.name}.png`
        // TTS
        let utterance = new SpeechSynthesisUtterance();
        utterance.rate = 0.7
        utterance.text = 'Welcome to the weight prophecy app ' + user.name;
        speechSynthesis.speak(utterance);

    }
};