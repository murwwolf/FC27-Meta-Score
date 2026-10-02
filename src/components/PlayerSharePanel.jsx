import { useEffect, useRef, useState } from "react";

const ATTRIBUTES = [
  ["PAC", "pace"],
  ["SHO", "shooting"],
  ["PAS", "passing"],
  ["DRI", "dribbling"],
  ["DEF", "defending"],
  ["PHY", "physical"],
];

function drawCoverImage(context, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function beginRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(x, y, width, height, radius);
  } else {
    context.rect(x, y, width, height);
  }
}

function drawShareCard(player, image) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas export is unavailable in this browser.");

  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#171014");
  background.addColorStop(0.48, "#090a0d");
  background.addColorStop(1, "#050607");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);

  const redGlow = context.createRadialGradient(520, 525, 30, 520, 525, 670);
  redGlow.addColorStop(0, "rgba(181, 20, 39, 0.42)");
  redGlow.addColorStop(1, "rgba(181, 20, 39, 0)");
  context.fillStyle = redGlow;
  context.fillRect(0, 0, 1080, 1100);

  context.strokeStyle = "rgba(255,255,255,0.035)";
  context.lineWidth = 1;
  for (let x = 48; x < 1080; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 1350);
    context.stroke();
  }
  for (let y = 48; y < 1350; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(1080, y);
    context.stroke();
  }

  context.strokeStyle = "rgba(255,215,0,0.14)";
  context.lineWidth = 2;
  context.strokeRect(36, 36, 1008, 1278);
  context.strokeRect(52, 52, 976, 1246);
  context.beginPath();
  context.moveTo(540, 70);
  context.lineTo(540, 1280);
  context.stroke();
  context.beginPath();
  context.arc(540, 690, 190, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#f5d75a";
  context.font = "900 27px Arial, sans-serif";
  context.letterSpacing = "7px";
  context.fillText("FC27 META SCORE", 78, 115);
  context.fillStyle = "rgba(255,255,255,0.55)";
  context.font = "700 16px Arial, sans-serif";
  context.letterSpacing = "4px";
  context.fillText("PLAYER PERFORMANCE CARD", 80, 148);

  context.save();
  beginRoundedRect(context, 76, 188, 928, 662, 20);
  context.clip();
  const imageBackground = context.createLinearGradient(76, 188, 1004, 850);
  imageBackground.addColorStop(0, "rgba(106, 14, 29, 0.35)");
  imageBackground.addColorStop(1, "rgba(5, 6, 8, 0.92)");
  context.fillStyle = imageBackground;
  context.fillRect(76, 188, 928, 662);
  if (image) {
    context.save();
    context.globalAlpha = 0.95;
    drawCoverImage(context, image, 76, 188, 928, 662);
    context.restore();
    const imageShade = context.createLinearGradient(0, 520, 0, 850);
    imageShade.addColorStop(0, "rgba(6,7,9,0)");
    imageShade.addColorStop(1, "rgba(6,7,9,0.9)");
    context.fillStyle = imageShade;
    context.fillRect(76, 500, 928, 350);
  } else {
    context.fillStyle = "rgba(255,215,0,0.85)";
    context.font = "900 250px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(String(player.name || "?").charAt(0), 540, 590);
    context.textAlign = "left";
  }
  context.restore();

  context.fillStyle = "#fff";
  context.font = "900 60px Arial, sans-serif";
  context.fillText(String(player.name || ""), 84, 812, 880);

  context.fillStyle = "rgba(255,255,255,0.68)";
  context.font = "800 23px Arial, sans-serif";
  context.letterSpacing = "3px";
  context.fillText(`${player.position || ""}  /  ${player.overall ?? ""} OVR`, 86, 858);

  context.fillStyle = "rgba(255,255,255,0.035)";
  context.strokeStyle = "rgba(255,215,0,0.4)";
  context.lineWidth = 2;
  beginRoundedRect(context, 76, 900, 928, 232, 18);
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(255,255,255,0.68)";
  context.font = "800 18px Arial, sans-serif";
  context.letterSpacing = "5px";
  context.fillText("META SCORE", 108, 947);
  context.fillStyle = "#ffdf6a";
  context.font = "900 118px Arial, sans-serif";
  context.letterSpacing = "0px";
  context.fillText(String(player.metaScore ?? "—"), 100, 1060);
  context.fillStyle = "#fff";
  context.font = "700 25px Arial, sans-serif";
  context.fillText("/ 100", 285, 1055);
  context.fillStyle = "#f1d779";
  context.font = "900 20px Arial, sans-serif";
  context.letterSpacing = "3px";
  context.fillText(`${player.tier || ""} TIER`, 108, 1100);

  const availableAttributes = ATTRIBUTES.filter(([, key]) => (
    player[key] !== null && player[key] !== undefined && player[key] !== ""
  ));
  const columnWidth = 290;
  const gap = 33;
  availableAttributes.forEach(([label, key], index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 85 + column * (columnWidth + gap);
    const y = 1190 + row * 57;
    context.fillStyle = "rgba(255,255,255,0.62)";
    context.font = "900 16px Arial, sans-serif";
    context.letterSpacing = "3px";
    context.fillText(label, x, y);
    context.fillStyle = "#f7f7f5";
    context.font = "900 30px Arial, sans-serif";
    context.letterSpacing = "0px";
    context.textAlign = "right";
    context.fillText(String(player[key]), x + columnWidth, y);
    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,0.1)";
    context.fillRect(x, y + 12, columnWidth, 4);
    context.fillStyle = "#bd293b";
    context.fillRect(x, y + 12, columnWidth * Math.max(0, Math.min(100, Number(player[key]) || 0)) / 100, 4);
  });

  context.fillStyle = "rgba(255,255,255,0.45)";
  context.font = "700 15px Arial, sans-serif";
  context.letterSpacing = "3px";
  context.fillText("FC27 META SCORE  •  PLAYER PROFILE", 80, 1298);
  return canvas;
}

function PlayerSharePanel({ player, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [status, setStatus] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const pageUrl = window.location.href;

  function closePanel() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    onCloseRef.current();
    if (previousFocusRef.current instanceof HTMLElement) previousFocusRef.current.focus();
  }

  async function sharePlayer() {
    if (typeof navigator.share !== "function") {
      setStatus("Sharing is not supported here. You can copy the link instead.");
      return;
    }
    try {
      await navigator.share({
        title: `${player.name} — FC27 META SCORE`,
        text: `${player.name} • ${player.overall} OVR • ${player.metaScore} META`,
        url: pageUrl,
      });
      setStatus("PLAYER SHARED");
    } catch (error) {
      if (error?.name !== "AbortError") setStatus("Could not open the share menu. Try copying the link.");
    }
  }

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = pageUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Clipboard copy is unavailable.");
      }
      setStatus("LINK COPIED");
    } catch {
      setStatus("Could not copy the link. Select and copy the address from your browser.");
    }
  }

  async function saveImage() {
    setStatus("PREPARING IMAGE…");
    try {
      let image = null;
      let imageUnavailable = false;
      if (player.image) {
        try {
          image = await new Promise((resolve, reject) => {
            const source = new Image();
            source.crossOrigin = "anonymous";
            source.onload = () => resolve(source);
            source.onerror = () => reject(new Error("Player image could not be loaded for export."));
            source.src = player.image;
          });
        } catch {
          imageUnavailable = true;
          setImageFailed(true);
        }
      }
      const createBlob = (canvas) => new Promise((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error("PNG export failed.")), "image/png");
      });
      let blob;
      try {
        blob = await createBlob(drawShareCard(player, image));
      } catch (error) {
        if (!image || !(error instanceof DOMException && error.name === "SecurityError")) throw error;
        imageUnavailable = true;
        setImageFailed(true);
        blob = await createBlob(drawShareCard(player, null));
      }
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      const playerSlug = String(player.name || "player").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      link.download = `fc27-meta-${playerSlug || "player"}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus(imageUnavailable ? "IMAGE SAVED · PLAYER IMAGE UNAVAILABLE" : "IMAGE SAVED");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create the share image.");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="player-share-dialog"
      aria-labelledby="player-share-title"
      onCancel={(event) => {
        event.preventDefault();
        closePanel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) closePanel();
      }}
    >
      <div className="player-share-panel">
        <header className="player-share-header">
          <div>
            <span className="section-label">FC27 META SCORE / SHARE</span>
            <h2 id="player-share-title">SHARE PLAYER</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="player-share-close" onClick={closePanel} aria-label="Close share player panel">×</button>
        </header>

        <div className="player-share-preview" aria-label={`Share card preview for ${player.name}`}>
          <div className="share-card-pitch" aria-hidden="true"><span /><i /></div>
          <div className="share-card-brand"><span>FC27</span> META SCORE <small>PLAYER CARD</small></div>
          <div className="share-card-player-image">
            {player.image && !imageFailed ? (
              <img src={player.image} alt={`${player.name} player image`} onError={() => setImageFailed(true)} />
            ) : (
              <span aria-hidden="true">{String(player.name || "?").charAt(0)}</span>
            )}
          </div>
          <div className="share-card-identity">
            <span className="share-card-position">{player.position}</span>
            <strong>{player.name}</strong>
            <span>{player.overall} OVERALL</span>
          </div>
          <div className="share-card-score">
            <span>META SCORE</span>
            <strong>{player.metaScore}<small>/100</small></strong>
            <b>{player.tier} TIER</b>
          </div>
          <div className="share-card-attributes">
            {ATTRIBUTES.filter(([, key]) => player[key] !== null && player[key] !== undefined && player[key] !== "").map(([label, key]) => (
              <div key={key}><span>{label}</span><strong>{player[key]}</strong></div>
            ))}
          </div>
          <div className="share-card-footer"><span>PLAYER PERFORMANCE</span><span>FC27 META SCORE</span></div>
        </div>

        <div className="player-share-actions">
          <button type="button" className="share-action-primary" onClick={sharePlayer}>SHARE PLAYER</button>
          <button type="button" className="share-action-secondary" onClick={saveImage}>SAVE IMAGE</button>
          <button type="button" className="share-action-secondary" onClick={copyLink}>COPY LINK</button>
        </div>
        <div className="player-share-feedback" role="status" aria-live="polite">
          {status || (imageFailed ? "Player image may be blocked for export; the card can still be saved with a fallback portrait." : "The share card uses the existing player image and recorded attributes.")}
        </div>
        <div className="player-share-close-footer">
          <button type="button" onClick={closePanel}>CLOSE</button>
        </div>
      </div>
    </dialog>
  );
}

export default PlayerSharePanel;
