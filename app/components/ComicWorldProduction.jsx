"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const ROOT = "/assets/dear-yesterday/spencer-plaza-2001";

const PEOPLE = [
  { id: "shop", x: 25, y: 65, name: "Shopkeeper", text: "Net cafe? First floor, pa." },
  { id: "students", x: 47, y: 67, name: "College friends", text: "Everyone is talking about this new chat service." },
  { id: "couple", x: 68, y: 64, name: "Shoppers", text: "Maybe you'll meet someone upstairs." },
  { id: "gate", x: 84, y: 61, name: "Plaza visitor", text: "The Internet Café is on the first floor." },
];

const VEHICLES = [
  { src: `${ROOT}/sprites/mtc-bus.png`, cls: "vehicle-bus", delay: 0 },
  { src: `${ROOT}/sprites/auto.png`, cls: "vehicle-auto", delay: 4 },
  { src: `${ROOT}/sprites/taxi.png`, cls: "vehicle-taxi", delay: 8 },
];

export default function ComicWorldProduction({
  playerGender = "guy",
  flyerVisible = false,
  arrival = 0,
  onEnterCafe,
  onNotice,
}) {
  const [playerX, setPlayerX] = useState(18);
  const [walking, setWalking] = useState(false);
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [showFlyer, setShowFlyer] = useState(flyerVisible);
  const [camera, setCamera] = useState(0);
  const [arrivalActive, setArrivalActive] = useState(true);
  const [flyerRead, setFlyerRead] = useState(false);
  const walkTimer = useRef(null);

  useEffect(() => {
    setShowFlyer(flyerVisible || arrival >= 10);
  }, [flyerVisible, arrival]);

  useEffect(() => {
    if (arrival >= 4) {
      const timer = window.setTimeout(() => setArrivalActive(false), 700);
      return () => window.clearTimeout(timer);
    }
    setArrivalActive(true);
  }, [arrival]);

  useEffect(() => {
    const nextCamera = Math.max(-12, Math.min(12, (playerX - 50) * -0.22));
    setCamera(nextCamera);
  }, [playerX]);

  useEffect(() => () => window.clearTimeout(walkTimer.current), []);

  function walkTo(x) {
    const next = Math.max(8, Math.min(92, x));
    setPlayerX(next);
    setWalking(true);
    setSelectedNpc(null);
    window.clearTimeout(walkTimer.current);
    walkTimer.current = window.setTimeout(() => setWalking(false), 650);
  }

  function readFlyer() {
    setFlyerRead(true);
    onNotice?.("FLYER: “LOOKING FOR SOMEONE? Maybe they’re online.” · First floor, Net Café.");
  }

  function enterCafe() {
    if (!showFlyer) return;
    if (!flyerRead) {
      readFlyer();
      return;
    }
    setShowFlyer(false);
    onEnterCafe?.();
  }


  const playerAsset = useMemo(() => {
    if (playerGender === "girl") {
      return walking
        ? `${ROOT}/characters/meera-walking.png`
        : `${ROOT}/characters/meera-front.png`;
    }
    return walking
      ? `${ROOT}/characters/arjun-walking.png`
      : `${ROOT}/characters/arjun-front.png`;
  }, [playerGender, walking]);

  return (
    <section className="production-world production-world-v3">
      <div className="production-titlebar">
        <div>
          <b>SPENCER PLAZA · 2001</b>
          <span>CHENNAI · A LIVING MEMORY</span>
        </div>
        <div className="production-status">
          {arrival < 4 ? "ARRIVAL" : showFlyer ? "LOOKING FOR SOMEONE?" : "EXPLORE"}
        </div>
      </div>

      <div
        className="production-stage-v3"
        onClick={(event) => {
          if (event.target.closest("button")) return;
          const rect = event.currentTarget.getBoundingClientRect();
          walkTo(((event.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div
          className="production-world-track"
          style={{ transform: `translate3d(${camera}%,0,0)` }}
        >
          <div className="scene-sky-v3" />
          <img
            className="scene-base-v3"
            src={`${ROOT}/environment/spencer-plaza-main-scene.png`}
            alt="Spencer Plaza Chennai 2001 illustrated environment"
          />

          <div className="parallax-crowd-v3" aria-hidden="true">
            <img src={`${ROOT}/sprites/npc-strip.png`} alt="" />
          </div>

          <div className="vehicle-lane-v3" aria-hidden="true">
            {VEHICLES.map((vehicle) => (
              <img
                key={vehicle.cls}
                className={`moving-vehicle-v3 ${vehicle.cls}`}
                src={vehicle.src}
                alt=""
              />
            ))}
          </div>

          <img
            className="foreground-props-v3"
            src={`${ROOT}/sprites/foreground-props.png`}
            alt=""
            aria-hidden="true"
          />

          {arrivalActive && arrival < 5 && (
            <div className={`arrival-sequence-v3 ${playerGender === "girl" ? "girl-arrival" : "guy-arrival"}`} aria-hidden="true">
              <img
                className="arrival-bike-v3"
                src={playerGender === "girl" ? `${ROOT}/characters/meera-with-bag.png` : `${ROOT}/characters/arjun-on-bike.png`}
                alt=""
              />
              <span>{playerGender === "girl" ? "MEERA · SPENCER PLAZA" : "RX-100 · SPENCER PLAZA"}</span>
            </div>
          )}

          {PEOPLE.map((npc) => (
            <button
              key={npc.id}
              className={`npc-hotspot-v3 ${selectedNpc === npc.id ? "selected" : ""}`}
              style={{ left: `${npc.x}%`, top: `${npc.y}%` }}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedNpc(npc.id);
                onNotice?.(`${npc.name}: “${npc.text}”`);
              }}
              aria-label={`Talk to ${npc.name}`}
            >
              <span className="npc-dot-v3" />
              <small>{selectedNpc === npc.id ? npc.name : "TALK"}</small>
            </button>
          ))}

          <div
            className={`production-player-v3 ${walking ? "walking" : ""}`}
            style={{ left: `${playerX}%` }}
          >
            <img src={playerAsset} alt={playerGender === "girl" ? "Meera" : "Arjun"} />
            <b>YOU</b>
          </div>

          <button
            className={`production-flyer-v3 ${showFlyer ? "visible" : ""}`}
            onClick={enterCafe}
            disabled={!showFlyer}
            aria-label={flyerRead ? "Enter the Net Café from the flyer" : "Read the Looking for Someone flyer"}
          >
            <img src={`${ROOT}/interactive/flyer.png`} alt="Looking for someone?" />
            {showFlyer && <span>{flyerRead ? "ENTER NET CAFÉ →" : "READ FLYER"}</span>}
          </button>

          <button className="production-cafe-hotspot-v3" onClick={enterCafe}>
            <img src={`${ROOT}/interactive/net-cafe-sign.png`} alt="Internet Café" />
            <span>NET CAFÉ →</span>
          </button>
        </div>

        <div className="production-caption-v3">
          <b>SPENCER PLAZA</b>
          <span>Somewhere in Chennai, 2001.</span>
        </div>

        <div className="production-help-v3">
          {showFlyer ? (flyerRead ? "FLYER READ · TAP AGAIN TO ENTER THE NET CAFÉ" : "TAP THE FLYER TO READ IT") : "TAP THE PLAZA TO WALK · TAP PEOPLE TO TALK"}
        </div>

        {flyerRead && (
          <div className="flyer-story-card" role="dialog" aria-label="Looking for someone flyer">
            <div className="flyer-story-paper">
              <small>SPENCER PLAZA · 2001</small>
              <b>LOOKING FOR<br />SOMEONE?</b>
              <span>Maybe they’re online.</span>
              <em>FIRST FLOOR · NET CAFÉ</em>
              <button onClick={() => { setFlyerRead(false); onEnterCafe?.(); }}>GO TO NET CAFÉ →</button>
              <button className="flyer-close" onClick={() => setFlyerRead(false)}>KEEP EXPLORING</button>
            </div>
          </div>
        )}
      </div>

      <div className="production-controls-v3">
        <button onClick={() => walkTo(playerX - 10)} aria-label="Walk left">←</button>
        <button onClick={() => walkTo(50)}>CENTER</button>
        <button onClick={() => walkTo(playerX + 10)} aria-label="Walk right">→</button>
        {showFlyer && <button className="production-cafe-button-v3" onClick={enterCafe}>ENTER NET CAFÉ →</button>}
      </div>
    </section>
  );
}
