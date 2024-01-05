const calculateMediaSizeWithRatio = (
  elementToResize,
  maxSizeInPercentage,
) => {
  let { width, height } = elementToResize;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const mediaRatio = width / height;

  const maxSize = Math.min(screenWidth, screenHeight) * (maxSizeInPercentage / 100);

  if (width > height) {
    width = maxSize;
    height = maxSize / mediaRatio;
  } else {
    height = maxSize;
    width = maxSize * mediaRatio;
  }

  elementToResize.style.width = `${width}px`;
  elementToResize.style.height = `${height}px`;

  return elementToResize;
};
export default calculateMediaSizeWithRatio;
