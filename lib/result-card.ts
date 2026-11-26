import { dimensionLabels } from "@/data/dimensions";
import { relationshipDimensions, type CharacterMatch } from "@/lib/scoring";
import type { Locale } from "@/lib/types";

async function drawPortrait(context: CanvasRenderingContext2D, artwork: SVGSVGElement) {
  const copy = artwork.cloneNode(true) as SVGSVGElement;
  copy.setAttribute("width", "360");
  copy.setAttribute("height", "360");
  const originals = artwork.querySelectorAll<SVGElement>("g, path, ellipse, circle, rect");
  copy.querySelectorAll<SVGElement>("g, path, ellipse, circle, rect").forEach((element, index) => {
    const style = window.getComputedStyle(originals[index]);
    element.style.fill = style.fill;
    element.style.stroke = style.stroke;
    element.style.opacity = style.opacity;
  });
  const image = new Image();
  image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(copy));
  await image.decode();
  context.drawImage(image, 635, 96, 145, 145);
}

export async function downloadResultCard({ character, scores }: CharacterMatch, nickname: string, locale: Locale, artwork?: SVGSVGElement | null) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1120;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Card rendering unavailable.");

  const sky = context.createLinearGradient(0, 0, 0, 1120);
  sky.addColorStop(0, "#a7adc9");
  sky.addColorStop(0.55, "#f2bf93");
  sky.addColorStop(1, "#778467");
  context.fillStyle = sky;
  context.fillRect(0, 0, 900, 1120);
  context.fillStyle = "#fff1d7";
  context.beginPath();
  context.roundRect(54, 54, 792, 1012, 42);
  context.fill();
  context.fillStyle = "#613e31";
  context.font = "bold 35px system-ui, sans-serif";
  context.fillText("littlematch ✦", 108, 133);
  context.font = "27px system-ui, sans-serif";
  context.fillText("@" + nickname, 108, 185, 505);
  context.fillStyle = "#815a45";
  context.font = "italic 32px Georgia, serif";
  context.fillText(character.animal[locale], 108, 276, 675);
  context.fillStyle = "#3b2b25";
  context.font = "bold 64px Georgia, serif";
  context.fillText(character.name[locale], 108, 352, 675);
  context.font = "28px system-ui, sans-serif";
  context.fillText(character.tagline[locale], 108, 411, 675);
  context.fillStyle = "#654434";
  context.font = "bold 34px Georgia, serif";
  context.fillText(locale === "tr" ? "İlişki haritam" : "My relationship map", 108, 535);

  relationshipDimensions.forEach((dimension, index) => {
    const top = 582 + index * 61;
    context.fillStyle = "#49382c";
    context.font = "23px system-ui, sans-serif";
    context.fillText(dimensionLabels[dimension][locale], 108, top + 11, 360);
    context.fillStyle = "#e8d1af";
    context.fillRect(480, top - 5, 248, 14);
    context.fillStyle = "#6b7757";
    context.fillRect(480, top - 5, 248 * scores[dimension] / 100, 14);
    context.fillText(String(scores[dimension]), 745, top + 11);
  });

  if (artwork) {
    try { await drawPortrait(context, artwork); }
    catch { /* The card stays available if a browser cannot render the portrait. */ }
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((image) => image ? resolve(image) : reject(new Error("Card image unavailable.")), "image/png"),
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "LittleMatch-sonuc.png";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
