"use client";

import { useEffect, useState } from "react";

const NPCS = [
  {
    id: 1,
    name: "Arun",
    role: "college friend",
    x: 18,
    y: 62,
    skin: "#b97852",
    shirt: "#557078",
    pants: "#292a2d",
    hair: "#171412",
    female: false,
    dialogue: "Machan... net cafe open ah?",
  },
  {
    id: 2,
    name: "Priya",
    role: "student",
    x: 34,
    y: 68,
    skin: "#c98c67",
    shirt: "#b85c63",
    pants: "#302c31",
    hair: "#211714",
    female: true,
    dialogue: "Someone said there is a new chat service upstairs.",
  },
  {
    id: 3,
    name: "Karthik",
    role: "music lover",
    x: 56,
    y: 64,
    skin: "#a96e4f",
    shirt: "#d0a05d",
    pants: "#28282a",
    hair: "#171412",
    female: false,
    dialogue: "Only twenty computers da!",
  },
  {
    id: 4,
    name: "Meena",
    role: "shopper",
    x: 76,
    y: 70,
    skin: "#c78865",
    shirt: "#66807b",
    pants: "#373137",
    hair: "#201613",
    female: true,
    dialogue: "Did you check your mail?",
  },
];

function Character({
  person,
  player = false,
  walking = false,
  direction = 1,
}) {
  return (
    <div
      className={[
        "comic-character",
        person.female ? "female" : "male",
        player ? "player-character" : "",
        walking ? "walking" : "",
      ].join(" ")}
      style={{
        left: `${person.x}%`,
        bottom: `${person.y}%`,
        "--skin": person.skin,
        "--shirt": person.shirt,
        "--pants": person.pants,
        "--hair": person.hair,
        "--dir": direction,
      }}
    >
      <div className="character-shadow" />
      <div className="character-legs">
        <span />
        <span />
      </div>

      <div className="character-body">
        <span className="arm left" />
        <span className="arm right" />
      </div>

      <div className="character-neck" />

      <div className="character-head">
        <div className="hair-back" />
        <div className="face">
          <span className="eye left-eye" />
          <span className="eye right-eye" />
          <span className="nose" />
          <span className="mouth" />
        </div>
        <div className="hair-front" />
      </div>

      {player && (
        <div className="player-label">
          YOU
        </div>
      )}
    </div>
  );
}

function SpeechBubble({ children }) {
  return (
    <div className="comic-speech">
      {children}
      <span className="speech-tail" />
    </div>
  );
}

function Rx100() {
  return (
    <div className="rx100">
      <div className="bike-wheel front" />
      <div className="bike-wheel back" />
      <div className="bike-frame" />
      <div className="bike-tank">RX</div>
      <div className="bike-seat" />
      <div className="bike-handle" />
      <div className="bike-light" />
    </div>
  );
}

function Maruti800() {
  return (
    <div className="maruti">
      <div className="maruti-window front-window" />
      <div className="maruti-window rear-window" />
      <div className="maruti-body">
        <span className="maruti-line" />
      </div>
      <div className="car-wheel left-wheel" />
      <div className="car-wheel right-wheel" />
      <div className="car-light" />
    </div>
  );
}

function SpencerBuilding() {
  return (
    <>
      <div className="spencer-sky">
        <div className="comic-sun" />
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
      </div>

      <div className="spencer-building">
        <div className="spencer-roof" />

        <div className="spencer-sign">
          SPENCER PLAZA
          <small>CHENNAI</small>
        </div>

        <div className="spencer-floor windows-one">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="spencer-floor windows-two">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="shop-row">
          <span>MUSIC</span>
          <span>BOOKS</span>
          <span>VIDEO</span>
          <span>DENIM</span>
          <span>GAMES</span>
          <span>TRAVEL</span>
        </div>
      </div>

      <div className="plaza-pillars">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="side-tree tree-one">
        <i />
        <i />
        <i />
      </div>

      <div className="side-tree tree-two">
        <i />
        <i />
        <i />
      </div>

      <div className="street-ground">
        <div className="kerb" />
        <div className="road-line" />
      </div>
    </>
  );
}

function Flyer({ onClick }) {
  return (
    <button className="wall-flyer" onClick={onClick}>
      <div className="tape" />
      <small>PERSONAL AD · 2001</small>
      <strong>LOOKING FOR<br />SOMEONE?</strong>
      <em>Maybe they're online.</em>
      <span>NET CAFÉ → FIRST FLOOR</span>
      <b>ENTER</b>
    </button>
  );
}

export default function ComicWorld({
  playerGender = "guy",
  flyerVisible = false,
  arrival = 0,
  onEnterCafe,
  onNotice,
}) {
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [playerX, setPlayerX] = useState(12);
  const [walking, setWalking] = useState(false);
  const [showFlyer, setShowFlyer] = useState(flyerVisible);

  useEffect(() => {
    setShowFlyer(flyerVisible);
  }, [flyerVisible]);

  useEffect(() => {
    if (!walking) return;

    const timer = setTimeout(() => setWalking(false), 450);
    return () => clearTimeout(timer);
  }, [walking, playerX]);

  function walkTo(x) {
    setPlayerX(Math.max(7, Math.min(92, x)));
    setWalking(true);
  }

  function interactNpc(npc) {
    setSelectedNpc(npc.id);
    onNotice?.(`${npc.name}: "${npc.dialogue}"`);
  }

  const player = {
    x: playerX,
    y: 8,
    skin: "#b97852",
    shirt: playerGender === "girl" ? "#a85e63" : "#4f6d75",
    pants: "#28282b",
    hair: "#171412",
    female: playerGender === "girl",
  };

  return (
    <section className="comic-world-v2">
      <div className="comic-frame-title">
        <span>SPENCER PLAZA · CHENNAI</span>
        <b>06:47 PM · 2001</b>
      </div>

      <div
        className="comic-stage"
        onClick={(e) => {
          if (e.target.closest("button")) return;

          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          walkTo(x);
        }}
      >
        <SpencerBuilding />

        <div className="era-sticker">
          <b>2001</b>
          <span>NO SMARTPHONES</span>
        </div>

        <div className="comic-caption">
          <b>SPENCER PLAZA</b>
          <span>Somewhere in Chennai...</span>
        </div>

        <div className="vehicle-arrival">
          {playerGender === "guy" ? <Rx100 /> : <Maruti800 />}
        </div>

        {NPCS.map((npc) => (
          <button
            key={npc.id}
            className="npc-hit"
            style={{
              left: `${npc.x}%`,
              bottom: `${npc.y + 2}%`,
            }}
            onClick={() => interactNpc(npc)}
            aria-label={`Talk to ${npc.name}`}
          >
            <Character person={npc} />
          </button>
        ))}

        <Character
          person={player}
          player
          walking={walking}
          direction={playerX > 50 ? 1 : -1}
        />

        {selectedNpc && (
          <SpeechBubble>
            {NPCS.find((n) => n.id === selectedNpc)?.dialogue}
          </SpeechBubble>
        )}

        {showFlyer && (
          <Flyer
            onClick={() => {
              setShowFlyer(false);
              onEnterCafe?.();
            }}
          />
        )}

        <div className="movement-help">
          TAP ANYWHERE TO WALK
        </div>

        <div className="explore-clock">
          {Math.min(arrival, 10)} / 10 SEC
        </div>
      </div>

      <div className="comic-controls">
        <button onClick={() => walkTo(18)}>← WALK</button>
        <button onClick={() => walkTo(50)}>CENTER</button>
        <button onClick={() => walkTo(82)}>WALK →</button>

        {showFlyer && (
          <button
            className="cafe-entry-button"
            onClick={() => {
              setShowFlyer(false);
              onEnterCafe?.();
            }}
          >
            ENTER NET CAFÉ →
          </button>
        )}
      </div>
    </section>
  );
}
