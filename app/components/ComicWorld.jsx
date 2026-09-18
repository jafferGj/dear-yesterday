"use client";

import { useEffect, useRef, useState } from "react";

const NPCS = [
  {
    id: 1,
    name: "Arun",
    x: 0.19,
    y: 0.67,
    shirt: "#d9c6a5",
    pants: "#30353a",
    hair: "#171717",
    dialogue: "Machan, net cafe open ah?",
    speed: 0.12,
    direction: 1,
  },
  {
    id: 2,
    name: "Priya",
    x: 0.35,
    y: 0.71,
    shirt: "#b85c51",
    pants: "#27262a",
    hair: "#211916",
    dialogue: "I think someone is waiting upstairs.",
    speed: 0.09,
    direction: -1,
  },
  {
    id: 3,
    name: "Karthik",
    x: 0.58,
    y: 0.68,
    shirt: "#496c72",
    pants: "#24262b",
    hair: "#181818",
    dialogue: "Only twenty computers da!",
    speed: 0.1,
    direction: 1,
  },
  {
    id: 4,
    name: "Meena",
    x: 0.77,
    y: 0.73,
    shirt: "#c59a58",
    pants: "#38312c",
    hair: "#191513",
    dialogue: "Did you check your mail?",
    speed: 0.08,
    direction: -1,
  },
];

const PEOPLE = [
  {
    x: 0.12,
    y: 0.7,
    scale: 0.82,
    shirt: "#7c5c4e",
    pants: "#27292c",
    hair: "#161616",
    gender: "male",
  },
  {
    x: 0.28,
    y: 0.76,
    scale: 0.92,
    shirt: "#b65b58",
    pants: "#36343a",
    hair: "#211714",
    gender: "female",
  },
  {
    x: 0.48,
    y: 0.74,
    scale: 0.8,
    shirt: "#557078",
    pants: "#292a2d",
    hair: "#171717",
    gender: "male",
  },
  {
    x: 0.67,
    y: 0.77,
    scale: 0.94,
    shirt: "#d1a36d",
    pants: "#40383a",
    hair: "#201714",
    gender: "female",
  },
  {
    x: 0.9,
    y: 0.7,
    scale: 0.8,
    shirt: "#726c61",
    pants: "#27282b",
    hair: "#151515",
    gender: "male",
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function drawFace(ctx, x, y, scale, hair, female = false) {
  ctx.save();

  ctx.fillStyle = "#c9976b";
  ctx.strokeStyle = "#211f1b";
  ctx.lineWidth = Math.max(1, 2 * scale);

  ctx.beginPath();
  ctx.ellipse(
    x,
    y,
    15 * scale,
    18 * scale,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = hair;

  if (female) {
    ctx.beginPath();
    ctx.arc(
      x,
      y - 4 * scale,
      17 * scale,
      Math.PI,
      Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 16 * scale, y - 4 * scale);
    ctx.quadraticCurveTo(
      x - 22 * scale,
      y + 15 * scale,
      x - 12 * scale,
      y + 20 * scale
    );
    ctx.lineTo(x - 8 * scale, y + 3 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 16 * scale, y - 4 * scale);
    ctx.quadraticCurveTo(
      x + 22 * scale,
      y + 15 * scale,
      x + 12 * scale,
      y + 20 * scale
    );
    ctx.lineTo(x + 8 * scale, y + 3 * scale);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(
      x,
      y - 7 * scale,
      16 * scale,
      Math.PI,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.strokeStyle = "#211f1b";
  ctx.lineWidth = Math.max(1, 1.4 * scale);

  ctx.beginPath();
  ctx.moveTo(x - 7 * scale, y - 1 * scale);
  ctx.lineTo(x - 3 * scale, y - 1 * scale);

  ctx.moveTo(x + 3 * scale, y - 1 * scale);
  ctx.lineTo(x + 7 * scale, y - 1 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    x,
    y + 5 * scale,
    4 * scale,
    0.1,
    Math.PI - 0.1
  );
  ctx.stroke();

  ctx.restore();
}

function drawCharacter(
  ctx,
  x,
  groundY,
  scale,
  {
    shirt = "#566f70",
    pants = "#303034",
    hair = "#171717",
    female = false,
    walking = false,
    direction = 1,
  } = {}
) {
  const bob = walking
    ? Math.sin(Date.now() / 110) * 2 * scale
    : 0;

  const bodyY = groundY - 55 * scale + bob;

  ctx.save();

  ctx.translate(x, 0);

  if (direction < 0) {
    ctx.scale(-1, 1);
  }

  ctx.strokeStyle = "#211f1b";
  ctx.fillStyle = shirt;
  ctx.lineWidth = Math.max(1.5, 2.5 * scale);

  /* legs */
  ctx.beginPath();

  ctx.moveTo(-6 * scale, groundY - 27 * scale);
  ctx.lineTo(-9 * scale, groundY);

  ctx.moveTo(6 * scale, groundY - 27 * scale);
  ctx.lineTo(
    walking ? 12 * scale : 9 * scale,
    groundY
  );

  ctx.stroke();

  /* shoes */
  ctx.beginPath();

  ctx.moveTo(-12 * scale, groundY);
  ctx.lineTo(-3 * scale, groundY);

  ctx.moveTo(
    walking ? 8 * scale : 5 * scale,
    groundY
  );
  ctx.lineTo(15 * scale, groundY);

  ctx.stroke();

  /* body */
  ctx.fillStyle = shirt;

  ctx.beginPath();

  if (female) {
    ctx.moveTo(-13 * scale, bodyY + 12 * scale);
    ctx.lineTo(13 * scale, bodyY + 12 * scale);
    ctx.lineTo(18 * scale, groundY - 27 * scale);
    ctx.lineTo(-18 * scale, groundY - 27 * scale);
    ctx.closePath();
  } else {
    ctx.roundRect(
      -16 * scale,
      bodyY + 5 * scale,
      32 * scale,
      35 * scale,
      4 * scale
    );
  }

  ctx.fill();
  ctx.stroke();

  /* arms */
  ctx.beginPath();

  if (walking) {
    ctx.moveTo(-14 * scale, bodyY + 11 * scale);
    ctx.lineTo(-20 * scale, bodyY + 27 * scale);

    ctx.moveTo(14 * scale, bodyY + 11 * scale);
    ctx.lineTo(20 * scale, bodyY + 19 * scale);
  } else {
    ctx.moveTo(-14 * scale, bodyY + 11 * scale);
    ctx.lineTo(-18 * scale, bodyY + 31 * scale);

    ctx.moveTo(14 * scale, bodyY + 11 * scale);
    ctx.lineTo(18 * scale, bodyY + 31 * scale);
  }

  ctx.stroke();

  drawFace(
    ctx,
    0,
    bodyY - 7 * scale,
    scale,
    hair,
    female
  );

  ctx.restore();
}

function drawBike(ctx, x, y, scale, direction = 1) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(direction, 1);

  ctx.strokeStyle = "#211f1b";
  ctx.lineWidth = Math.max(1.5, 3 * scale);

  /* wheels */
  ctx.beginPath();

  ctx.arc(
    -31 * scale,
    0,
    14 * scale,
    0,
    Math.PI * 2
  );

  ctx.arc(
    31 * scale,
    0,
    14 * scale,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  /* frame */
  ctx.beginPath();

  ctx.moveTo(-31 * scale, 0);
  ctx.lineTo(-7 * scale, -14 * scale);
  ctx.lineTo(18 * scale, 0);
  ctx.lineTo(-31 * scale, 0);

  ctx.moveTo(-7 * scale, -14 * scale);
  ctx.lineTo(3 * scale, 0);

  ctx.moveTo(18 * scale, 0);
  ctx.lineTo(11 * scale, -17 * scale);

  ctx.moveTo(11 * scale, -17 * scale);
  ctx.lineTo(19 * scale, -19 * scale);

  ctx.stroke();

  /* tank */
  ctx.fillStyle = "#516c68";

  ctx.beginPath();
  ctx.moveTo(-9 * scale, -18 * scale);
  ctx.quadraticCurveTo(
    2 * scale,
    -24 * scale,
    13 * scale,
    -17 * scale
  );
  ctx.lineTo(9 * scale, -8 * scale);
  ctx.lineTo(-7 * scale, -8 * scale);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* seat */
  ctx.beginPath();
  ctx.moveTo(-5 * scale, -25 * scale);
  ctx.lineTo(10 * scale, -25 * scale);
  ctx.stroke();

  /* headlight */
  ctx.beginPath();
  ctx.arc(
    21 * scale,
    -17 * scale,
    4 * scale,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.restore();
}

function drawMaruti800(ctx, x, y, scale, direction = 1) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(direction, 1);

  ctx.strokeStyle = "#211f1b";
  ctx.lineWidth = Math.max(1.5, 2.5 * scale);
  ctx.fillStyle = "#eee7d0";

  ctx.beginPath();

  ctx.moveTo(-52 * scale, 0);
  ctx.lineTo(-47 * scale, -18 * scale);
  ctx.lineTo(-30 * scale, -31 * scale);
  ctx.lineTo(25 * scale, -31 * scale);
  ctx.lineTo(45 * scale, -17 * scale);
  ctx.lineTo(53 * scale, 0);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* windows */
  ctx.fillStyle = "#8e9b98";

  ctx.beginPath();
  ctx.moveTo(-27 * scale, -27 * scale);
  ctx.lineTo(-6 * scale, -27 * scale);
  ctx.lineTo(-6 * scale, -13 * scale);
  ctx.lineTo(-36 * scale, -13 * scale);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-1 * scale, -27 * scale);
  ctx.lineTo(21 * scale, -27 * scale);
  ctx.lineTo(37 * scale, -13 * scale);
  ctx.lineTo(-1 * scale, -13 * scale);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* bumpers */
  ctx.beginPath();

  ctx.moveTo(-52 * scale, -1 * scale);
  ctx.lineTo(-58 * scale, -1 * scale);

  ctx.moveTo(52 * scale, -1 * scale);
  ctx.lineTo(58 * scale, -1 * scale);

  ctx.stroke();

  /* wheels */
  ctx.fillStyle = "#222";

  ctx.beginPath();

  ctx.arc(
    -32 * scale,
    2 * scale,
    9 * scale,
    0,
    Math.PI * 2
  );

  ctx.arc(
    33 * scale,
    2 * scale,
    9 * scale,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "#c9c2aa";

  ctx.beginPath();

  ctx.arc(
    -32 * scale,
    2 * scale,
    4 * scale,
    0,
    Math.PI * 2
  );

  ctx.arc(
    33 * scale,
    2 * scale,
    4 * scale,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

function drawSky(ctx, width, height) {
  ctx.fillStyle = "#c7d0c4";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(245,239,210,0.55)";

  const clouds = [
    [0.16, 0.18, 0.13],
    [0.72, 0.13, 0.16],
    [0.88, 0.31, 0.1],
  ];

  clouds.forEach(([x, y, size]) => {
    ctx.beginPath();

    ctx.ellipse(
      width * x,
      height * y,
      width * size,
      height * 0.035,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  ctx.fillStyle = "#d9c68a";

  ctx.beginPath();

  ctx.arc(
    width * 0.83,
    height * 0.15,
    Math.min(width, height) * 0.06,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

function drawSpencer(ctx, width, height) {
  const ground = height * 0.68;

  /* building */
  ctx.fillStyle = "#b8aa87";
  ctx.strokeStyle = "#29261f";
  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(width * 0.05, ground);
  ctx.lineTo(width * 0.05, height * 0.23);
  ctx.lineTo(width * 0.16, height * 0.14);
  ctx.lineTo(width * 0.84, height * 0.14);
  ctx.lineTo(width * 0.95, height * 0.23);
  ctx.lineTo(width * 0.95, ground);

  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* roof */
  ctx.fillStyle = "#8f8062";

  ctx.beginPath();

  ctx.moveTo(width * 0.03, height * 0.24);
  ctx.lineTo(width * 0.16, height * 0.12);
  ctx.lineTo(width * 0.84, height * 0.12);
  ctx.lineTo(width * 0.97, height * 0.24);

  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  /* sign */
  ctx.fillStyle = "#e8dfbd";

  ctx.fillRect(
    width * 0.34,
    height * 0.18,
    width * 0.32,
    height * 0.075
  );

  ctx.strokeRect(
    width * 0.34,
    height * 0.18,
    width * 0.32,
    height * 0.075
  );

  ctx.fillStyle = "#29261f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = `900 ${Math.max(
    14,
    width * 0.022
  )}px Georgia`;

  ctx.fillText(
    "SPENCER PLAZA",
    width * 0.5,
    height * 0.217
  );

  /* windows */
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x =
        width * 0.09 +
        col * width * 0.095;

      const y =
        height * 0.32 +
        row * height * 0.13;

      ctx.fillStyle =
        col % 2 === 0
          ? "#78898a"
          : "#69797a";

      ctx.fillRect(
        x,
        y,
        width * 0.055,
        height * 0.075
      );

      ctx.strokeRect(
        x,
        y,
        width * 0.055,
        height * 0.075
      );
    }
  }

  /* shops */
  const shopY = ground - 8;

  for (let i = 0; i < 7; i += 1) {
    const x =
      width * 0.075 +
      i * width * 0.12;

    ctx.fillStyle =
      i % 2 === 0
        ? "#6e6654"
        : "#81755d";

    ctx.fillRect(
      x,
      shopY - height * 0.09,
      width * 0.095,
      height * 0.09
    );

    ctx.strokeRect(
      x,
      shopY - height * 0.09,
      width * 0.095,
      height * 0.09
    );

    ctx.fillStyle = "#ddd2ac";

    ctx.font = `700 ${Math.max(
      8,
      width * 0.009
    )}px monospace`;

    const names = [
      "MUSIC",
      "BOOKS",
      "VIDEO",
      "JEANS",
      "CAFE",
      "GAMES",
      "TRAVEL",
    ];

    ctx.fillText(
      names[i],
      x + width * 0.047,
      shopY - height * 0.055
    );
  }
}

function drawRoad(ctx, width, height) {
  const roadTop = height * 0.68;

  ctx.fillStyle = "#78746b";

  ctx.beginPath();

  ctx.moveTo(0, roadTop);
  ctx.lineTo(width, roadTop);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();

  ctx.fill();

  ctx.strokeStyle = "#302e29";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, roadTop);
  ctx.lineTo(width, roadTop);
  ctx.stroke();

  ctx.strokeStyle = "#c6bd98";
  ctx.lineWidth = 4;
  ctx.setLineDash([28, 22]);

  ctx.beginPath();
  ctx.moveTo(0, height * 0.86);
  ctx.lineTo(width, height * 0.86);
  ctx.stroke();

  ctx.setLineDash([]);

  ctx.fillStyle = "#b7aa88";

  ctx.fillRect(
    0,
    roadTop - 15,
    width,
    15
  );
}

function drawTrees(ctx, width, height) {
  const positions = [
    [0.025, 0.48, 1.2],
    [0.16, 0.53, 0.85],
    [0.94, 0.49, 1.15],
    [0.81, 0.52, 0.75],
  ];

  positions.forEach(([x, y, scale]) => {
    const tx = width * x;
    const ty = height * y;

    ctx.strokeStyle = "#40382d";
    ctx.lineWidth = 5 * scale;

    ctx.beginPath();
    ctx.moveTo(tx, ty + 70 * scale);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    ctx.fillStyle = "#63705b";

    ctx.beginPath();

    ctx.arc(
      tx - 20 * scale,
      ty,
      27 * scale,
      0,
      Math.PI * 2
    );

    ctx.arc(
      tx + 10 * scale,
      ty - 13 * scale,
      32 * scale,
      0,
      Math.PI * 2
    );

    ctx.arc(
      tx + 35 * scale,
      ty + 4 * scale,
      24 * scale,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#302e29";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      tx,
      ty,
      42 * scale,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  });
}

function drawBench(ctx, x, y, scale = 1) {
  ctx.save();

  ctx.strokeStyle = "#302a23";
  ctx.fillStyle = "#826a4b";
  ctx.lineWidth = 3 * scale;

  ctx.fillRect(
    x - 45 * scale,
    y - 12 * scale,
    90 * scale,
    12 * scale
  );

  ctx.strokeRect(
    x - 45 * scale,
    y - 12 * scale,
    90 * scale,
    12 * scale
  );

  ctx.fillRect(
    x - 42 * scale,
    y - 30 * scale,
    84 * scale,
    10 * scale
  );

  ctx.strokeRect(
    x - 42 * scale,
    y - 30 * scale,
    84 * scale,
    10 * scale
  );

  ctx.beginPath();

  ctx.moveTo(x - 33 * scale, y);
  ctx.lineTo(x - 29 * scale, y + 20 * scale);

  ctx.moveTo(x + 33 * scale, y);
  ctx.lineTo(x + 29 * scale, y + 20 * scale);

  ctx.stroke();

  ctx.restore();
}

function drawFlyer(ctx, width, height, visible) {
  if (!visible) return;

  const x = width * 0.7;
  const y = height * 0.45;

  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(-0.035);

  ctx.fillStyle = "#f0dfad";
  ctx.strokeStyle = "#28251f";
  ctx.lineWidth = 3;

  ctx.fillRect(
    -105,
    -72,
    210,
    145
  );

  ctx.strokeRect(
    -105,
    -72,
    210,
    145
  );

  ctx.fillStyle = "#26231e";
  ctx.textAlign = "center";

  ctx.font = "900 17px Georgia";
  ctx.fillText(
    "LOOKING FOR",
    0,
    -37
  );

  ctx.font = "900 24px Georgia";
  ctx.fillText(
    "SOMEONE?",
    0,
    -9
  );

  ctx.font = "italic 13px Georgia";
  ctx.fillText(
    "Maybe they're online.",
    0,
    20
  );

  ctx.font = "700 10px monospace";
  ctx.fillText(
    "NET CAFE → FIRST FLOOR",
    0,
    47
  );

  ctx.restore();
}

function drawCafeEntrance(ctx, width, height) {
  const x = width * 0.5;
  const y = height * 0.53;

  ctx.save();

  ctx.fillStyle = "#34312b";
  ctx.strokeStyle = "#1f1d19";
  ctx.lineWidth = 3;

  ctx.fillRect(
    x - 82,
    y - 60,
    164,
    105
  );

  ctx.strokeRect(
    x - 82,
    y - 60,
    164,
    105
  );

  ctx.fillStyle = "#d8c89d";

  ctx.fillRect(
    x - 67,
    y - 45,
    134,
    27
  );

  ctx.strokeRect(
    x - 67,
    y - 45,
    134,
    27
  );

  ctx.fillStyle = "#29261f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "900 15px Georgia";

  ctx.fillText(
    "NET CAFE",
    x,
    y - 31
  );

  ctx.fillStyle = "#626967";

  ctx.fillRect(
    x - 35,
    y - 5,
    70,
    50
  );

  ctx.strokeRect(
    x - 35,
    y - 5,
    70,
    50
  );

  ctx.fillStyle = "#aeb6a6";

  for (let i = -2; i <= 2; i += 1) {
    ctx.fillRect(
      x + i * 24 - 6,
      y + 8,
      12,
      9
    );
  }

  ctx.restore();
}

function drawSpeechBubble(
  ctx,
  width,
  height,
  message,
  x,
  y
) {
  if (!message) return;

  ctx.save();

  ctx.font = "700 12px monospace";

  const maxWidth = Math.min(
    250,
    width * 0.34
  );

  const words = message.split(" ");
  const lines = [];

  let line = "";

  words.forEach((word) => {
    const test =
      line.length > 0
        ? `${line} ${word}`
        : word;

    if (
      ctx.measureText(test).width >
      maxWidth
    ) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);

  const lineHeight = 17;
  const padding = 12;

  const bubbleWidth =
    Math.max(
      120,
      Math.min(
        maxWidth,
        Math.max(
          ...lines.map((text) =>
            ctx.measureText(text).width
          )
        ) + padding * 2
      )
    );

  const bubbleHeight =
    lines.length * lineHeight +
    padding * 2;

  const bx = clamp(
    x,
    bubbleWidth / 2 + 8,
    width - bubbleWidth / 2 - 8
  );

  const by = clamp(
    y,
    bubbleHeight / 2 + 8,
    height - bubbleHeight / 2 - 8
  );

  ctx.fillStyle = "#f3e6bd";
  ctx.strokeStyle = "#29261f";
  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.roundRect(
    bx - bubbleWidth / 2,
    by - bubbleHeight / 2,
    bubbleWidth,
    bubbleHeight,
    7
  );

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#27241e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  lines.forEach((text, index) => {
    ctx.fillText(
      text,
      bx,
      by -
        ((lines.length - 1) * lineHeight) /
          2 +
        index * lineHeight
    );
  });

  ctx.restore();
}

export default function ComicWorld({
  playerGender = "guy",
  flyerVisible = false,
  arrival = 0,
  onEnterCafe,
  onNotice,
}) {
  const canvasRef = useRef(null);

  const animationRef = useRef(null);

  const [selectedNpc, setSelectedNpc] =
    useState(null);

  const [hint, setHint] = useState(
    "MOVE AROUND · TAP / CLICK TO WALK"
  );

  const [cafeReady, setCafeReady] =
    useState(false);

  const playerRef = useRef({
    x: 0.5,
    targetX: 0.5,
    direction: 1,
    walking: false,
  });

  const npcRef = useRef(
    NPCS.map((npc) => ({
      ...npc,
      currentX: npc.x,
      timer: Math.random() * 100,
    }))
  );

  const carRef = useRef({
    x: -0.25,
    direction: 1,
  });

  const bikeRef = useRef({
    x: 1.25,
    direction: -1,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = Math.max(
        320,
        rect.width
      );

      height = Math.max(
        390,
        rect.height
      );

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.floor(width * dpr);

      canvas.height =
        Math.floor(height * dpr);

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /* background */

      drawSky(
        ctx,
        width,
        height
      );

      drawSpencer(
        ctx,
        width,
        height
      );

      drawTrees(
        ctx,
        width,
        height
      );

      drawRoad(
        ctx,
        width,
        height
      );

      drawCafeEntrance(
        ctx,
        width,
        height
      );

      drawBench(
        ctx,
        width * 0.24,
        height * 0.66,
        0.8
      );

      /* moving Maruti 800 */

      carRef.current.x +=
        0.00018 *
        carRef.current.direction;

      if (carRef.current.x > 1.3) {
        carRef.current.x = -0.3;
      }

      drawMaruti800(
        ctx,
        carRef.current.x * width,
        height * 0.69,
        Math.max(
          0.55,
          width / 1100
        ),
        carRef.current.direction
      );

      /* moving RX-100 */

      bikeRef.current.x +=
        0.00022 *
        bikeRef.current.direction;

      if (bikeRef.current.x < -0.3) {
        bikeRef.current.x = 1.3;
      }

      drawBike(
        ctx,
        bikeRef.current.x * width,
        height * 0.79,
        Math.max(
          0.65,
          width / 1100
        ),
        bikeRef.current.direction
      );

      /* background people */

      PEOPLE.forEach((person) => {
        drawCharacter(
          ctx,
          person.x * width,
          height * (person.y - 0.02),
          person.scale *
            Math.max(
              0.72,
              width / 1000
            ),
          {
            shirt: person.shirt,
            pants: person.pants,
            hair: person.hair,
            female:
              person.gender ===
              "female",
          }
        );
      });

      /* NPCs */

      npcRef.current.forEach((npc) => {
        npc.timer += 0.016;

        npc.currentX +=
          0.000012 *
          npc.speed *
          npc.direction;

        if (npc.currentX < 0.08) {
          npc.currentX = 0.08;
          npc.direction = 1;
        }

        if (npc.currentX > 0.92) {
          npc.currentX = 0.92;
          npc.direction = -1;
        }

        const walking =
          Math.abs(
            Math.sin(npc.timer * 1.2)
          ) > 0.25;

        drawCharacter(
          ctx,
          npc.currentX * width,
          height * (npc.y - 0.02),
          Math.max(
            0.72,
            width / 1050
          ),
          {
            shirt: npc.shirt,
            pants: npc.pants,
            hair: npc.hair,
            female:
              npc.id === 2 ||
              npc.id === 4,
            walking,
            direction:
              npc.direction,
          }
        );
      });

      /* player */

      const player =
        playerRef.current;

      const difference =
        player.targetX -
        player.x;

      if (Math.abs(difference) > 0.002) {
        player.x +=
          difference * 0.055;

        player.walking = true;

        player.direction =
          difference > 0
            ? 1
            : -1;
      } else {
        player.x =
          player.targetX;

        player.walking = false;
      }

      drawCharacter(
        ctx,
        player.x * width,
        height * 0.83,
        Math.max(
          0.8,
          Math.min(
            1.05,
            width / 850
          )
        ),
        {
          shirt:
            playerGender === "girl"
              ? "#a65a5c"
              : "#4e6870",
          pants: "#25262a",
          hair: "#151515",
          female:
            playerGender ===
            "girl",
          walking:
            player.walking,
          direction:
            player.direction,
        }
      );

      /* flyer */

      drawFlyer(
        ctx,
        width,
        height,
        flyerVisible
      );

      /* speech */

      if (selectedNpc) {
        const npc =
          npcRef.current.find(
            (item) =>
              item.id === selectedNpc
          );

        if (npc) {
          drawSpeechBubble(
            ctx,
            width,
            height,
            npc.dialogue,
            npc.currentX * width,
            height * (npc.y - 0.22)
          );
        }
      }

      /* intro text */

      if (arrival < 8) {
        ctx.save();

        ctx.globalAlpha = clamp(
          1 - arrival / 8,
          0,
          1
        );

        ctx.fillStyle =
          "rgba(35,32,26,0.88)";

        ctx.textAlign = "center";

        ctx.font =
          "900 14px Georgia";

        ctx.fillText(
          "CHENNAI · SPENCER PLAZA · 2001",
          width / 2,
          height * 0.09
        );

        ctx.font =
          "italic 11px Georgia";

        ctx.fillText(
          "Somewhere between yesterday and tomorrow.",
          width / 2,
          height * 0.125
        );

        ctx.restore();
      }

      /* comic border */

      ctx.strokeStyle =
        "rgba(35,31,24,0.5)";

      ctx.lineWidth = 2;

      ctx.strokeRect(
        7,
        7,
        width - 14,
        height - 14
      );

      animationRef.current =
        requestAnimationFrame(draw);
    };

    animationRef.current =
      requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [
    playerGender,
    flyerVisible,
    arrival,
    selectedNpc,
  ]);

  const handleMove = (event) => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const clientX =
      event.clientX ??
      event.touches?.[0]?.clientX;

    if (clientX == null) return;

    const x = clamp(
      (clientX - rect.left) /
        rect.width,
      0.06,
      0.94
    );

    playerRef.current.targetX =
      x;

    setSelectedNpc(null);

    setHint(
      "WALKING · TAP ANOTHER PLACE TO MOVE"
    );
  };

  const handleClick = (event) => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const x = clamp(
      (event.clientX - rect.left) /
        rect.width,
      0.06,
      0.94
    );

    const y =
      (event.clientY - rect.top) /
      rect.height;

    const nearest =
      npcRef.current
        .map((npc) => ({
          npc,
          distance:
            Math.abs(
              npc.currentX - x
            ),
        }))
        .sort(
          (a, b) =>
            a.distance -
            b.distance
        )[0];

    if (
      nearest &&
      nearest.distance < 0.08 &&
      y > 0.48
    ) {
      setSelectedNpc(
        nearest.npc.id
      );

      setHint(
        `${nearest.npc.name} noticed you.`
      );

      if (onNotice) {
        onNotice(
          `${nearest.npc.name}: ${nearest.npc.dialogue}`
        );
      }

      return;
    }

    handleMove(event);
  };

  useEffect(() => {
    if (flyerVisible) {
      setCafeReady(true);

      setHint(
        "THE FLYER IS HERE · FIND THE NET CAFE"
      );
    }
  }, [flyerVisible]);

  return (
    <div className="comic-world">
      <canvas
        ref={canvasRef}
        className="comic-world-canvas"
        onClick={handleClick}
        onPointerDown={handleMove}
        aria-label="Dear Yesterday comic world"
      />

      <div className="comic-world-hint">
        {hint}
      </div>

      <div className="comic-world-era">
        CHENNAI · 2001
      </div>

      {cafeReady && (
        <button
          type="button"
          className="comic-cafe-button"
          onClick={() => {
            if (onEnterCafe) {
              onEnterCafe();
            }
          }}
        >
          ENTER NET CAFE →
        </button>
      )}
    </div>
  );
}
