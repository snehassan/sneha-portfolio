"use client";

import { useEffect, useRef } from "react";

const GAP = 168;

/** Blocky Flight — a Minecraft-themed Flappy Bird, ported from the design prototype. */
export function BlockyFlight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width,
      H = canvas.height,
      GROUND = 64;
    const PW = 64,
      BX = 110,
      BS = 30,
      G = 0.42,
      FLAP = -7.4;

    let bird = { y: H / 2, v: 0 };
    let pipes: { x: number; top: number; passed: boolean }[] = [];
    let frame = 0,
      score = 0,
      dead = false,
      started = false;
    let raf = 0;
    let alive = true;

    let best = 0;
    try {
      best = +(localStorage.getItem("sh_blocky_best") || 0);
    } catch {}

    const flap = () => {
      if (dead) {
        bird = { y: H / 2, v: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        dead = false;
        started = false;
        return;
      }
      started = true;
      bird.v = FLAP;
    };

    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      flap();
    };
    const onSpace = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    canvas.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onSpace);

    const drawBlockCol = (x: number, y0: number, y1: number) => {
      ctx.fillStyle = "#7a5237";
      ctx.fillRect(x, y0, PW, y1 - y0);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      for (let y = Math.ceil(y0 / 32) * 32; y < y1; y += 32) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + PW, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x + 32, y0);
      ctx.lineTo(x + 32, y1);
      ctx.stroke();
      ctx.strokeStyle = "#123c22";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y0, PW, y1 - y0);
    };

    const loop = () => {
      if (!alive) return;
      frame++;
      if (started && !dead) {
        bird.v += G;
        bird.y += bird.v;
        if (frame % 92 === 0)
          pipes.push({
            x: W + PW,
            top: 60 + Math.random() * (H - GROUND - GAP - 120),
            passed: false,
          });
        pipes.forEach((p) => {
          p.x -= 2.6;
          if (!p.passed && p.x + PW < BX) {
            p.passed = true;
            score++;
          }
        });
        pipes = pipes.filter((p) => p.x > -PW - 10);
        const by0 = bird.y - BS / 2,
          by1 = bird.y + BS / 2;
        if (by1 > H - GROUND || by0 < 0) dead = true;
        for (const p of pipes) {
          if (
            BX + BS / 2 > p.x &&
            BX - BS / 2 < p.x + PW &&
            (by0 < p.top || by1 > p.top + GAP)
          ) {
            dead = true;
            break;
          }
        }
        if (dead && score > best) {
          best = score;
          try {
            localStorage.setItem("sh_blocky_best", String(best));
          } catch {}
        }
      }

      // sky
      ctx.fillStyle = "#8fd3ff";
      ctx.fillRect(0, 0, W, H);
      // clouds
      ctx.fillStyle = "#ffffff";
      const cx = ((frame * 0.4) % (W + 200)) - 100;
      ctx.fillRect(W - cx, 90, 90, 26);
      ctx.fillRect(W - cx + 24, 68, 48, 24);
      ctx.fillRect(W - ((cx * 0.6) % (W + 200)), 200, 70, 22);
      // pipes
      pipes.forEach((p) => {
        drawBlockCol(p.x, 0, p.top);
        drawBlockCol(p.x, p.top + GAP, H - GROUND);
        ctx.fillStyle = "#5ec74d";
        ctx.fillRect(p.x - 4, p.top - 14, PW + 8, 14);
        ctx.fillRect(p.x - 4, p.top + GAP, PW + 8, 14);
        ctx.strokeStyle = "#123c22";
        ctx.lineWidth = 4;
        ctx.strokeRect(p.x - 4, p.top - 14, PW + 8, 14);
        ctx.strokeRect(p.x - 4, p.top + GAP, PW + 8, 14);
      });
      // ground
      ctx.fillStyle = "#5ec74d";
      ctx.fillRect(0, H - GROUND, W, 18);
      ctx.fillStyle = "#7a5237";
      ctx.fillRect(0, H - GROUND + 18, W, GROUND - 18);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      for (let x = -((frame * 2.6) % 32); x < W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, H - GROUND + 18);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      // bird
      const tilt = Math.max(-0.4, Math.min(0.6, bird.v * 0.06));
      ctx.save();
      ctx.translate(BX, bird.y);
      ctx.rotate(started ? tilt : 0);
      ctx.fillStyle = "#4dd04d";
      ctx.fillRect(-BS / 2, -BS / 2, BS, BS);
      ctx.strokeStyle = "#123c22";
      ctx.lineWidth = 4;
      ctx.strokeRect(-BS / 2, -BS / 2, BS, BS);
      ctx.fillStyle = "#fff";
      ctx.fillRect(2, -10, 10, 10);
      ctx.fillStyle = "#123c22";
      ctx.fillRect(6, -7, 5, 5);
      ctx.fillStyle = "#f0a24d";
      ctx.fillRect(BS / 2 - 2, -2, 10, 7);
      ctx.restore();
      // HUD
      ctx.fillStyle = "#123c22";
      ctx.font = "bold 34px monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(score), W / 2, 56);
      ctx.font = "bold 15px monospace";
      ctx.fillText("BEST " + best, W / 2, 80);
      if (!started && !dead)
        ctx.fillText("SPACE / TAP TO START", W / 2, H / 2 - 70);
      if (dead) {
        ctx.font = "bold 26px monospace";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 40);
        ctx.font = "bold 15px monospace";
        ctx.fillText("TAP TO RESPAWN", W / 2, H / 2 - 12);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onSpace);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={600}
      tabIndex={0}
      aria-label="Blocky Flight mini-game. Press space to flap."
      style={{
        width: "min(480px,90vw)",
        border: "6px solid #123c22",
        boxShadow: "0 16px 48px rgba(0,40,20,.35)",
        imageRendering: "pixelated",
        background: "#8fd3ff",
        touchAction: "manipulation",
        outline: "none",
      }}
    />
  );
}
