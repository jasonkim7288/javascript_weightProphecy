export default function runCountAnimation(element, num) {
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
  element.classList.remove('font-weight-bold');
  refreshId = setInterval(() => {
    frame++;
    const progress = 0.02 * Math.log(frame / totalFrames) + 1;
    const currentCount = (num * progress).toFixed(1);
    element.textContent = currentCount + ' kg';

    if(frame === totalFrames) {
      clearInterval(refreshId);
      console.log('end');
      setTimeout(() => {
        element.textContent = (num + 0.1).toFixed(1) + ' kg';
        element.classList.add('font-weight-bold');
        element.classList.remove('font-weight-normal');
      }, 700)
    }
  }, frameDuration);
}