const calculateMediaSizeWithRatio = (
  eltToResize,
  maxSizeInPercentage,
) => {
  let { width, height } = eltToResize;

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

  eltToResize.style.width = `${width}px`;
  eltToResize.style.height = `${height}px`;

  return eltToResize;
};
export default calculateMediaSizeWithRatio;
