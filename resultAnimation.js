export default function runCountAnimation(element, num, text) {
    num = num.toFixed(1);

    let refreshId;
    clearInterval(refreshId);

    // for the last dramatic change
    num -= 0.1;
    const animationDuration = 7000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(animationDuration / frameDuration);

    let frame = 0;
    element.classList.add('font-weight-normal');
    element.classList.remove('font-weight-bold', 'count-effect');
    refreshId = setInterval(() => {
        frame++;
        const progress = 0.02 * Math.log(frame / totalFrames) + 1;
        const currentCount = (num * progress).toFixed(1);
        element.textContent = currentCount + ' kg';

        if (frame === totalFrames) {
            clearInterval(refreshId);

            // TTS
            let utterance = new SpeechSynthesisUtterance();
            utterance.rate = 0.7
            utterance.text = 'Your weight on ' + text + ' will be ';
            speechSynthesis.speak(utterance);

            setTimeout(() => {
                element.textContent = (num + 0.1).toFixed(1) + ' kg';
                element.classList.add('font-weight-bold', 'count-effect');
                element.classList.remove('font-weight-normal');
                // TTS
                utterance.text = element.textContent;
                speechSynthesis.speak(utterance);
            }, 700)
        }
    }, frameDuration);
}