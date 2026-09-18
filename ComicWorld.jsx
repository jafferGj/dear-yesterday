"use client";

import { useEffect, useRef } from "react";

const NPCS = [
  {
    id: "karthik",
    name: "Karthik",
    role: "college friend",
    x: 0.16,
    y: 0.66,
    color: "#6d5845",
    hair: "#171512",
    shirt: "#b9a47a",
    speed: 0.000055,
    dialogue: [
      "Hey! Have you seen the new net cafe?",
      "Spencer Plaza is packed today.",
      "I heard someone is looking for friends online."
    ]
  },
  {
    id: "meena",
    name: "Meena",
    role: "shopper",
    x: 0.31,
    y: 0.69,
    color: "#8d6955",
    hair: "#171512",
    shirt: "#b65f58",
    speed: 0.000045,
    dialogue: [
      "That shop has the cutest stuff.",
      "Are you waiting for someone?",
      "Everyone seems to be online these days."
    ]
  },
  {
    id: "arun",
    name: "Arun",
    role: "music lover",
    x: 0.47,
    y: 0.61,
    color: "#755c4d",
    hair: "#171512",
    shirt: "#66705a",
    speed: 0.00005,
    dialogue: [
      "Did you hear that song?",
      "I need to buy a new cassette.",
      "Music makes this place better."
    ]
  },
  {
    id: "divya",
    name: "Divya",
    role: "student",
    x: 0.63,
    y: 0.7,
    color: "#a87965",
    hair: "#171512",
    shirt: "#9a7566",
    speed: 0.000047,
    dialogue: [
      "My friends are inside.",
      "Wait... are you new here?",
      "The cafe upstairs is interesting."
    ]
  },
  {
    id: "ravi",
    name: "Ravi",
    role: "shopkeeper",
    x: 0.78,
    y: 0.62,
    color: "#765747",
    hair: "#171512",
    shirt: "#756c54",
    speed: 0.000035,
    dialogue: [
      "Come and have a look!",
      "New arrivals today!",
      "Don't stand in the middle of the road!"
    ]
  },
  {
    id: "priya",
    name: "Priya",
    role: "student",
    x: 0.88,
    y: 0.7,
    color: "#9b705f",
    hair: "#211713",
    shirt: "#7b6570",
    speed: 0.000052,
    dialogue: [
      "I think I saw you earlier.",
      "Are you waiting for someone?",
      "Maybe today's your lucky day."
    ]
  }
];

const WAYPOINTS = [
  [0.08, 0.68],
  [0.2, 0.62],
  [0.34, 0.7],
  [0.48, 0.61],
  [0.61, 0.7],
  [0.73, 0.63],
  [0.86, 0.7],
  [0.94, 0.63]
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);

  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function roughLine(ctx, x1, y1, x2, y2, wobble = 1.5) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  ctx.quadraticCurveTo(
    mx + Math.sin(x1 * 0.17 + y2) * wobble,
    my + Math.cos(y1 * 0.13 + x2) * wobble,
    x2,
    y2
  );

  ctx.stroke();
}

function drawPaperTexture(ctx, w, h, t) {
  ctx.save();

  ctx.globalAlpha = 0.045;

  for (let i = 0; i < 180; i++) {
    const x = (i * 137.3) % w;
    const y = (i * 83.7) % h;
    const s = 1 + ((i * 7) % 3);

    ctx.fillStyle = i % 2 ? "#171512" : "#fff8dc";
    ctx.fillRect(x, y, s, s);
  }

  ctx.globalAlpha = 0.035;

  for (let y = 0; y < h; y += 5) {
    ctx.fillRect(0, y, w, 1);
  }

  ctx.restore();
}

function drawSky(ctx, w, h) {
  ctx.fillStyle = "#cfc39d";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#bdb28f";
  ctx.beginPath();
  ctx.arc(w * 0.79, h * 0.17, Math.min(w, h) * 0.065, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#625b48";
  ctx.lineWidth = 2;

  for (let i = 0; i < 5; i++) {
    roughLine(
      ctx,
      w * 0.05 + i * 80,
      h * 0.22 + i * 8,
      w * 0.19 + i * 80,
      h * 0.2 + i * 8,
      2
    );
  }
}

function drawSpencer(ctx, w, h) {
  const buildingY = h * 0.29;
  const buildingH = h * 0.38;

  ctx.fillStyle = "#867d64";
  ctx.strokeStyle = "#25231d";
  ctx.lineWidth = 4;

  roundedRect(ctx, w * 0.07, buildingY, w * 0.86, buildingH, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#615b49";

  for (let i = 0; i < 10; i++) {
    const x = w * 0.1 + i * w * 0.082;

    roundedRect(
      ctx,
      x,
      buildingY + buildingH * 0.12,
      w * 0.055,
      buildingH * 0.15,
      3
    );

    ctx.fill();
  }

  ctx.fillStyle = "#dad0ac";
  ctx.font = `bold ${Math.max(18, w * 0.034)}px Georgia`;
  ctx.textAlign = "center";
  ctx.fillText("SPENCER PLAZA", w / 2, buildingY + buildingH * 0.055);

  const shops = [
    ["MUSIC", 0.1],
    ["BOOKS", 0.27],
    ["VIDEO", 0.44],
    ["FASHION", 0.61],
    ["ELECTRONICS", 0.77]
  ];

  shops.forEach(([label, p], i) => {
    const x = w * p;
    const y = buildingY + buildingH * 0.48;

    ctx.fillStyle = i % 2 ? "#4f5340" : "#62564a";

    roundedRect(ctx, x, y, w * 0.13, h * 0.105, 4);
    ctx.fill();

    ctx.strokeStyle = "#27251e";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#e2d6b1";
    ctx.font = `bold ${Math.max(9, w * 0.014)}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(label, x + w * 0.065, y + h * 0.06);
  });

  ctx.strokeStyle = "#3c392f";
  ctx.lineWidth = 3;

  roughLine(
    ctx,
    w * 0.04,
    buildingY + buildingH,
    w * 0.96,
    buildingY + buildingH,
    2
  );
}

function drawRoad(ctx, w, h) {
  const y = h * 0.67;

  ctx.fillStyle = "#706958";
  ctx.fillRect(0, y, w, h - y);

  ctx.strokeStyle = "#c7bb91";
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 20]);

  ctx.beginPath();
  ctx.moveTo(0, y + h * 0.14);
  ctx.lineTo(w, y + h * 0.14);
  ctx.stroke();

  ctx.setLineDash([]);

  ctx.strokeStyle = "#343128";
  ctx.lineWidth = 3;

  for (let i = 0; i < 8; i++) {
    const x = w * 0.05 + i * w * 0.13;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y - h * 0.045);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 8, y - h * 0.045);
    ctx.lineTo(x - 20, y - h * 0.06);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 8, y - h * 0.045);
    ctx.lineTo(x + 5, y - h * 0.062);
    ctx.stroke();
  }
}

function drawBench(ctx, x, y, s) {
  ctx.save();

  ctx.strokeStyle = "#25231d";
  ctx.lineWidth = 3;
  ctx.fillStyle = "#7a654c";

  roundedRect(ctx, x, y, 80 * s, 10 * s, 3);
  ctx.fill();
  ctx.stroke();

  ctx.fillRect(x + 8 * s, y + 10 * s, 7 * s, 30 * s);
  ctx.fillRect(x + 65 * s, y + 10 * s, 7 * s, 30 * s);

  ctx.restore();
}

function drawPlant(ctx, x, y, s) {
  ctx.save();

  ctx.strokeStyle = "#29291f";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 40 * s);
  ctx.stroke();

  for (let i = 0; i < 5; i++) {
    const angle = -1.1 + i * 0.55;

    ctx.beginPath();
    ctx.moveTo(x, y - 20 * s);
    ctx.lineTo(
      x + Math.cos(angle) * 30 * s,
      y - 20 * s + Math.sin(angle) * 25 * s
    );
    ctx.stroke();
  }

  ctx.fillStyle = "#6c7050";
  ctx.beginPath();
  ctx.ellipse(x, y + 4 * s, 17 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.stroke();

  ctx.restore();
}

function drawFace(ctx, x, y, s, expression, facing) {
  ctx.fillStyle = "#201b16";

  const eyeY = y - 2 * s;

  ctx.beginPath();
  ctx.arc(x - 6 * s, eyeY, 1.7 * s, 0, Math.PI * 2);
  ctx.arc(x + 6 * s, eyeY, 1.7 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#201b16";
  ctx.lineWidth = 1.8 * s;

  if (expression === "happy") {
    ctx.beginPath();
    ctx.arc(x, y + 5 * s, 7 * s, 0, Math.PI);
    ctx.stroke();
  } else if (expression === "surprised") {
    ctx.beginPath();
    ctx.arc(x, y + 5 * s, 3.5 * s, 0, Math.PI * 2);
    ctx.stroke();
  } else if (expression === "sad") {
    ctx.beginPath();
    ctx.arc(x, y + 10 * s, 7 * s, Math.PI, Math.PI * 2);
    ctx.stroke();
  } else if (expression === "angry") {
    ctx.beginPath();
    ctx.moveTo(x - 10 * s, eyeY - 5 * s);
    ctx.lineTo(x - 3 * s, eyeY - 1 * s);
    ctx.moveTo(x + 10 * s, eyeY - 5 * s);
    ctx.lineTo(x + 3 * s, eyeY - 1 * s);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 5 * s, y + 7 * s);
    ctx.lineTo(x + 5 * s, y + 7 * s);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 5 * s, y + 6 * s);
    ctx.lineTo(x + 5 * s, y + 6 * s);
    ctx.stroke();
  }

  if (facing < 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillRect(x - 11 * s, y - 10 * s, 3 * s, 18 * s);
    ctx.globalAlpha = 1;
  }
}

function drawCharacter(
  ctx,
  x,
  y,
  scale,
  character,
  state,
  expression,
  facing,
  phase,
  gender = "male"
) {
  ctx.save();

  const s = scale;

  let walk = 0;

  if (state === "walk" || state === "run") {
    walk = Math.sin(phase * (state === "run" ? 1.8 : 1));
  }

  const speedMultiplier = state === "run" ? 1.5 : 1;

  ctx.translate(x, y);
  ctx.scale(facing, 1);

  /* shadow */

  ctx.fillStyle = "rgba(20,18,14,.28)";
  ctx.beginPath();
  ctx.ellipse(0, 30 * s, 23 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  /* legs */

  ctx.strokeStyle = "#25211b";
  ctx.lineWidth = 5 * s;
  ctx.lineCap = "round";

  const legA = walk * 13 * speedMultiplier;
  const legB = -walk * 13 * speedMultiplier;

  roughLine(ctx, -7 * s, 10 * s, -10 * s + legA, 31 * s, 1);
  roughLine(ctx, 7 * s, 10 * s, 10 * s + legB, 31 * s, 1);

  /* shoes */

  ctx.lineWidth = 6 * s;

  ctx.beginPath();
  ctx.moveTo(-10 * s + legA, 31 * s);
  ctx.lineTo(-17 * s + legA, 32 * s);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(10 * s + legB, 31 * s);
  ctx.lineTo(17 * s + legB, 32 * s);
  ctx.stroke();

  /* torso */

  ctx.fillStyle = character.shirt;

  ctx.beginPath();
  ctx.moveTo(-14 * s, -17 * s);
  ctx.lineTo(14 * s, -17 * s);
  ctx.lineTo(12 * s, 12 * s);
  ctx.lineTo(-12 * s, 12 * s);
  ctx.closePath();

  ctx.fill();

  ctx.strokeStyle = "#25211b";
  ctx.lineWidth = 3 * s;
  ctx.stroke();

  /* arms */

  ctx.strokeStyle = "#25211b";
  ctx.lineWidth = 5 * s;

  const armA = -walk * 15 * speedMultiplier;
  const armB = walk * 15 * speedMultiplier;

  roughLine(ctx, -12 * s, -10 * s, -22 * s + armA, 8 * s, 1.2);
  roughLine(ctx, 12 * s, -10 * s, 22 * s + armB, 8 * s, 1.2);

  /* neck */

  ctx.fillStyle = character.color;
  ctx.fillRect(-5 * s, -24 * s, 10 * s, 10 * s);

  /* head */

  ctx.beginPath();
  ctx.arc(0, -36 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#25211b";
  ctx.lineWidth = 3 * s;
  ctx.stroke();

  /* hair */

  ctx.fillStyle = character.hair;

  if (gender === "female") {
    ctx.beginPath();
    ctx.arc(0, -42 * s, 17 * s, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-14 * s, -35 * s, 8 * s, 0, Math.PI * 2);
    ctx.arc(14 * s, -35 * s, 8 * s, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, -45 * s, 16 * s, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  drawFace(ctx, 0, -36 * s, s, expression, facing);

  /* talking gesture */

  if (state === "talk") {
    ctx.strokeStyle = "#25211b";
    ctx.lineWidth = 5 * s;

    ctx.beginPath();
    ctx.moveTo(13 * s, -8 * s);
    ctx.lineTo(28 * s, -18 * s);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBike(ctx, x, y, s, phase) {
  ctx.save();

  ctx.translate(x, y);

  /* shadow */

  ctx.fillStyle = "rgba(20,18,14,.25)";
  ctx.beginPath();
  ctx.ellipse(0, 30 * s, 65 * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  /* wheels */

  ctx.strokeStyle = "#201e19";
  ctx.lineWidth = 4 * s;

  [-42, 42].forEach((wheelX) => {
    ctx.beginPath();
    ctx.arc(wheelX * s, 0, 16 * s, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(wheelX * s, 0, 4 * s, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + phase * 0.04;

      ctx.beginPath();
      ctx.moveTo(wheelX * s, 0);
      ctx.lineTo(
        wheelX * s + Math.cos(a) * 14 * s,
        Math.sin(a) * 14 * s
      );
      ctx.stroke();
    }
  });

  /* RX frame */

  ctx.strokeStyle = "#27231d";
  ctx.lineWidth = 5 * s;

  ctx.beginPath();
  ctx.moveTo(-42 * s, 0);
  ctx.lineTo(-12 * s, -15 * s);
  ctx.lineTo(20 * s, 0);
  ctx.lineTo(-42 * s, 0);
  ctx.lineTo(-5 * s, 0);
  ctx.lineTo(10 * s, -22 * s);
  ctx.stroke();

  /* fuel tank */

  ctx.fillStyle = "#555d48";

  ctx.beginPath();
  ctx.moveTo(-10 * s, -20 * s);
  ctx.quadraticCurveTo(5 * s, -31 * s, 24 * s, -19 * s);
  ctx.lineTo(15 * s, -8 * s);
  ctx.lineTo(-7 * s, -9 * s);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* handle */

  ctx.beginPath();
  ctx.moveTo(10 * s, -22 * s);
  ctx.lineTo(29 * s, -29 * s);
  ctx.lineTo(34 * s, -25 * s);
  ctx.stroke();

  /* seat */

  ctx.fillStyle = "#292722";
  roundedRect(ctx, -21 * s, -26 * s, 24 * s, 6 * s, 2);
  ctx.fill();

  /* rider */

  ctx.strokeStyle = "#27231d";
  ctx.lineWidth = 7 * s;

  ctx.beginPath();
  ctx.moveTo(-3 * s, -30 * s);
  ctx.lineTo(-1 * s, -50 * s);
  ctx.lineTo(12 * s, -63 * s);
  ctx.stroke();

  ctx.fillStyle = "#6c6250";

  ctx.beginPath();
  ctx.arc(14 * s, -70 * s, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  /* little motion lines */

  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2 * s;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo((-70 - i * 9) * s, (-10 + i * 5) * s);
    ctx.lineTo((-90 - i * 9) * s, (-10 + i * 5) * s);
    ctx.stroke();
  }

  ctx.restore();
}

function drawMaruti(ctx, x, y, s, phase) {
  ctx.save();

  ctx.translate(x, y);

  ctx.fillStyle = "rgba(20,18,14,.25)";
  ctx.beginPath();
  ctx.ellipse(0, 27 * s, 80 * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  /* body */

  ctx.fillStyle = "#9c8060";
  ctx.strokeStyle = "#28251f";
  ctx.lineWidth = 4 * s;

  roundedRect(ctx, -70 * s, -35 * s, 140 * s, 55 * s, 8 * s);
  ctx.fill();
  ctx.stroke();

  /* roof */

  ctx.beginPath();
  ctx.moveTo(-43 * s, -35 * s);
  ctx.lineTo(-27 * s, -61 * s);
  ctx.lineTo(34 * s, -61 * s);
  ctx.lineTo(53 * s, -35 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /* windows */

  ctx.fillStyle = "#59605b";

  ctx.beginPath();
  ctx.moveTo(-23 * s, -54 * s);
  ctx.lineTo(-5 * s, -54 * s);
  ctx.lineTo(-5 * s, -39 * s);
  ctx.lineTo(-31 * s, -39 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(2 * s, -54 * s);
  ctx.lineTo(29 * s, -54 * s);
  ctx.lineTo(42 * s, -39 * s);
  ctx.lineTo(2 * s, -39 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /* occupants */

  ctx.fillStyle = "#a87860";

  [-18, 19].forEach((p) => {
    ctx.beginPath();
    ctx.arc(p * s, -47 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#25221d";

    ctx.beginPath();
    ctx.arc(p * s, -50 * s, 6 * s, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a87860";
  });

  /* bumpers */

  ctx.fillStyle = "#d5c7a3";

  roundedRect(ctx, -76 * s, 8 * s, 12 * s, 7 * s, 2);
  ctx.fill();
  ctx.stroke();

  roundedRect(ctx, 64 * s, 8 * s, 12 * s, 7 * s, 2);
  ctx.fill();
  ctx.stroke();

  /* wheels */

  [-45, 45].forEach((wheelX) => {
    ctx.fillStyle = "#25231f";
    ctx.beginPath();
    ctx.arc(wheelX * s, 20 * s, 13 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a89b7d";
    ctx.beginPath();
    ctx.arc(wheelX * s, 20 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();
  });

  /* headlights */

  ctx.fillStyle = "#e4d79d";

  ctx.beginPath();
  ctx.arc(67 * s, -7 * s, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  /* motion */

  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2 * s;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo((-95 - i * 10) * s, (-10 + i * 5) * s);
    ctx.lineTo((-120 - i * 10) * s, (-10 + i * 5) * s);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBubble(ctx, text, x, y, scale = 1, type = "normal") {
  ctx.save();

  const fontSize = Math.max(12, 14 * scale);
  ctx.font = `bold ${fontSize}px monospace`;

  const maxWidth = 190 * scale;

  const words = text.split(" ");
  const lines = [];

  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;

    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);

  const width = Math.min(
    maxWidth + 26 * scale,
    Math.max(
      100 * scale,
      Math.max(...lines.map((l) => ctx.measureText(l).width)) + 26 * scale
    )
  );

  const lineHeight = fontSize * 1.25;
  const height = lines.length * lineHeight + 22 * scale;

  let bx = x - width / 2;
  let by = y - height - 35 * scale;

  bx = clamp(bx, 8, ctx.canvas.width - width - 8);
  by = Math.max(8, by);

  ctx.fillStyle = type === "thought" ? "#e6dcc0" : "#f0e6c5";
  ctx.strokeStyle = "#26231d";
  ctx.lineWidth = 3 * scale;

  roundedRect(ctx, bx, by, width, height, 10 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 10 * scale, by + height);
  ctx.lineTo(x, by + height + 13 * scale);
  ctx.lineTo(x + 9 * scale, by + height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#201e19";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      bx + width / 2,
      by + 10 * scale + i * lineHeight
    );
  });

  ctx.restore();
}

export default function ComicWorld({
  playerGender = "male",
  flyerVisible = false,
  arrival = 0,
  onEnterCafe,
  onNotice
}) {
  const canvasRef = useRef(null);

  const worldRef = useRef({
    player: {
      x: 0.5,
      y: 0.72,
      targetX: 0.5,
      targetY: 0.72,
      facing: 1
    },

    npc: NPCS.map((npc, index) => ({
      ...npc,
      target: WAYPOINTS[index % WAYPOINTS.length],
      state: "walk",
      expression: index % 3 === 0 ? "happy" : "neutral",
      bubble: "",
      bubbleUntil: 0,
      dialogueIndex: 0,
      pauseUntil: 0
    })),

    bike: {
      x: -0.15,
      direction: 1
    },

    car: {
      x: 1.15,
      direction: -1
    },

    lastTime: 0,
    noticeShown: false,
    activeBubble: null
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationFrame;
    let stopped = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    window.addEventListener("resize", resize);

    function update(dt, time) {
      const world = worldRef.current;

      /* player */

      const p = world.player;

      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.003) {
        const speed = 0.00032 * dt;

        p.x += (dx / distance) * speed;
        p.y += (dy / distance) * speed;

        if (dx !== 0) {
          p.facing = dx > 0 ? 1 : -1;
        }
      }

      p.x = clamp(p.x, 0.04, 0.96);
      p.y = clamp(p.y, 0.58, 0.82);

      /* NPCs */

      world.npc.forEach((npc, index) => {
        if (time < npc.pauseUntil) {
          npc.state = "talk";
          return;
        }

        const tx = npc.target[0];
        const ty = npc.target[1];

        const dx = tx - npc.x;
        const dy = ty - npc.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.01) {
          npc.target =
            WAYPOINTS[
              Math.floor(
                (Math.abs(Math.sin(time / 1000 + index)) *
                  WAYPOINTS.length)
              ) % WAYPOINTS.length
            ];

          npc.pauseUntil =
            time +
            1800 +
            Math.floor(
              Math.abs(Math.sin(time / 1300 + index)) * 3000
            );

          npc.state = "talk";

          if (Math.random() < 0.8) {
            npc.bubble =
              npc.dialogue[
                npc.dialogueIndex % npc.dialogue.length
              ];

            npc.dialogueIndex++;

            npc.bubbleUntil = time + 3500;
          }
        } else {
          const speed = npc.speed * dt;

          npc.x += (dx / dist) * speed;
          npc.y += (dy / dist) * speed;

          npc.state = "walk";

          if (dx !== 0) {
            npc.facing = dx > 0 ? 1 : -1;
          }
        }
      });

      /* bike */

      world.bike.x += 0.00013 * dt;

      if (world.bike.x > 1.2) {
        world.bike.x = -0.2;
      }

      /* car */

      world.car.x -= 0.00009 * dt;

      if (world.car.x < -0.2) {
        world.car.x = 1.2;
      }

      /* delayed world event */

      if (
        arrival >= 30 &&
        !world.noticeShown
      ) {
        world.noticeShown = true;

        if (onNotice) {
          onNotice("Someone nearby is talking about the net cafe...");
        }
      }
    }

    function draw(time) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      drawSky(ctx, w, h);
      drawSpencer(ctx, w, h);
      drawRoad(ctx, w, h);

      /* foreground plants */

      drawPlant(ctx, w * 0.055, h * 0.78, 0.8);
      drawPlant(ctx, w * 0.93, h * 0.78, 0.7);

      drawBench(ctx, w * 0.12, h * 0.76, 0.8);

      /* cafe entrance */

      ctx.fillStyle = "#3b392f";
      ctx.strokeStyle = "#201e19";
      ctx.lineWidth = 4;

      roundedRect(
        ctx,
        w * 0.43,
        h * 0.45,
        w * 0.14,
        h * 0.22,
        4
      );

      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ded2a8";
      ctx.font = `bold ${Math.max(11, w * 0.017)}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(
        "NET CAFE",
        w * 0.5,
        h * 0.49
      );

      /* vehicles */

      const bikeX =
        worldRef.current.bike.x * w;

      drawBike(
        ctx,
        bikeX,
        h * 0.7,
        Math.max(0.55, Math.min(1, w / 850)),
        time / 30
      );

      const carX =
        worldRef.current.car.x * w;

      drawMaruti(
        ctx,
        carX,
        h * 0.77,
        Math.max(0.5, Math.min(0.85, w / 900)),
        time / 30
      );

      /* NPCs */

      worldRef.current.npc.forEach((npc, index) => {
        const x = npc.x * w;
        const y = npc.y * h;

        const scale = Math.max(
          0.55,
          Math.min(0.9, w / 1000)
        );

        const phase =
          time / 130 +
          index * 2.2;

        drawCharacter(
          ctx,
          x,
          y,
          scale,
          npc,
          npc.state,
          npc.expression,
          npc.facing || 1,
          phase,
          index % 2 ? "female" : "male"
        );

        if (
          npc.bubble &&
          time < npc.bubbleUntil
        ) {
          drawBubble(
            ctx,
            npc.bubble,
            x,
            y - 45 * scale,
            scale
          );
        }
      });

      /* player */

      const p = worldRef.current.player;

      const moving =
        Math.abs(p.targetX - p.x) > 0.003 ||
        Math.abs(p.targetY - p.y) > 0.003;

      drawCharacter(
        ctx,
        p.x * w,
        p.y * h,
        Math.max(0.65, Math.min(1, w / 900)),
        {
          color: playerGender === "female" ? "#b27c6e" : "#92715b",
          hair: "#171512",
          shirt:
            playerGender === "female"
              ? "#9b6570"
              : "#586653"
        },
        moving ? "walk" : "idle",
        "happy",
        p.facing,
        time / 120,
        playerGender
      );

      /* arrival labels */

      if (arrival < 10) {
        ctx.fillStyle = "#27241d";
        ctx.font = `bold ${Math.max(
          12,
          w * 0.018
        )}px monospace`;

        ctx.textAlign = "left";

        ctx.fillText(
          "SPENCER PLAZA • CHENNAI • 2001",
          18,
          h - 20
        );
      }

      /* flyer */

      if (flyerVisible) {
        const fx = w * 0.68;
        const fy = h * 0.46;

        ctx.save();

        ctx.translate(fx, fy);
        ctx.rotate(-0.035);

        ctx.fillStyle = "#eee2b8";
        ctx.strokeStyle = "#29261f";
        ctx.lineWidth = 3;

        ctx.shadowColor = "rgba(0,0,0,.25)";
        ctx.shadowBlur = 7;

        roundedRect(
          ctx,
          -75,
          -55,
          150,
          110,
          3
        );

        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.fillStyle = "#302c23";
        ctx.textAlign = "center";

        ctx.font = "bold 12px monospace";
        ctx.fillText(
          "LOOKING FOR",
          0,
          -25
        );

        ctx.font = "bold 14px monospace";
        ctx.fillText(
          "SOMEONE?",
          0,
          -5
        );

        ctx.font = "11px monospace";
        ctx.fillText(
          "Maybe they're",
          0,
          18
        );

        ctx.fillText(
          "online.",
          0,
          34
        );

        ctx.font = "9px monospace";
        ctx.fillText(
          "→ NET CAFE",
          0,
          49
        );

        ctx.restore();
      }

      /* paper effect */

      drawPaperTexture(ctx, w, h, time);

      /* comic frame */

      ctx.strokeStyle = "#211f1a";
      ctx.lineWidth = 5;
      ctx.strokeRect(3, 3, w - 6, h - 6);
    }

    function frame(time) {
      if (stopped) return;

      const world = worldRef.current;

      if (!world.lastTime) {
        world.lastTime = time;
      }

      const dt = Math.min(
        40,
        time - world.lastTime
      );

      world.lastTime = time;

      update(dt, time);
      draw(time);

      animationFrame =
        requestAnimationFrame(frame);
    }

    animationFrame =
      requestAnimationFrame(frame);

    function pointerMove(e) {
      const rect =
        canvas.getBoundingClientRect();

      const clientX =
        e.touches?.[0]?.clientX ??
        e.clientX;

      const clientY =
        e.touches?.[0]?.clientY ??
        e.clientY;

      const x =
        (clientX - rect.left) /
        rect.width;

      const y =
        (clientY - rect.top) /
        rect.height;

      const world = worldRef.current;

      world.player.targetX =
        clamp(x, 0.04, 0.96);

      world.player.targetY =
        clamp(y, 0.58, 0.82);
    }

    function click(e) {
      const rect =
        canvas.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) /
        rect.width;

      const y =
        (e.clientY - rect.top) /
        rect.height;

      /* cafe */

      if (
        flyerVisible &&
        x > 0.4 &&
        x < 0.6 &&
        y > 0.43 &&
        y < 0.7
      ) {
        if (onEnterCafe) {
          onEnterCafe();
        }

        return;
      }

      /* NPC interaction */

      const world =
        worldRef.current;

      world.npc.forEach((npc) => {
        const dx = npc.x - x;
        const dy = npc.y - y;

        if (
          Math.sqrt(dx * dx + dy * dy) <
          0.06
        ) {
          npc.state = "talk";
          npc.expression =
            npc.expression === "happy"
              ? "surprised"
              : "happy";

          npc.bubble =
            npc.dialogue[
              npc.dialogueIndex %
                npc.dialogue.length
            ];

          npc.dialogueIndex++;

          npc.bubbleUntil =
            performance.now() + 4000;
        }
      });
    }

    canvas.addEventListener(
      "pointerdown",
      pointerMove
    );

    canvas.addEventListener(
      "click",
      click
    );

    canvas.addEventListener(
      "touchstart",
      pointerMove,
      { passive: true }
    );

    return () => {
      stopped = true;

      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      canvas.removeEventListener(
        "pointerdown",
        pointerMove
      );

      canvas.removeEventListener(
        "click",
        click
      );

      canvas.removeEventListener(
        "touchstart",
        pointerMove
      );
    };
  }, [
    playerGender,
    flyerVisible,
    arrival,
    onEnterCafe,
    onNotice
  ]);

  return (
    <div className="comic-world">
      <canvas
        ref={canvasRef}
        className="comic-world-canvas"
        aria-label="Dear Yesterday Spencer Plaza world"
      />

      <div className="comic-world-hint">
        TAP ANYWHERE TO WALK • TAP PEOPLE TO TALK
      </div>

      {flyerVisible && (
        <button
          className="comic-cafe-button"
          onClick={onEnterCafe}
        >
          ENTER NET CAFE →
        </button>
      )}

      <div className="comic-world-era">
        CHENNAI • 2001
      </div>
    </div>
  );
}
