export async function generateShareImage({
  imageUrl,
  title,
  description,
  url,
}: {
  imageUrl: string;
  title: string;
  description: string;
  url: string;
}): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const width = 1080;
  const padding = 40;
  const lineHeight = 40;

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const image = await loadImage(imageUrl);

  // Resize canvas height based on text
  const imageHeight = 600;
  const textAreaHeight = 400;
  canvas.width = width;
  canvas.height = imageHeight + textAreaHeight;

  // Draw image
  ctx.drawImage(image, 0, 0, width, imageHeight);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, imageHeight, width, textAreaHeight);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(title, padding, imageHeight + 60);

  ctx.font = "24px sans-serif";
  wrapText(
    ctx,
    description,
    padding,
    imageHeight + 120,
    width - padding * 2,
    lineHeight
  );

  ctx.fillStyle = "#0077cc";
  ctx.font = "22px sans-serif";
  ctx.fillText(url, padding, canvas.height - 30);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const file = new File([blob!], "shared-news.jpg", {
          type: "image/jpeg",
        });
        resolve(file);
      },
      "image/jpeg",
      0.95
    );
  });
}

// Helper to wrap long text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
