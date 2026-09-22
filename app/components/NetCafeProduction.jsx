"use client";

import { useEffect, useMemo, useState } from "react";

const ROOT = "/assets/dear-yesterday/spencer-plaza-2001";

const COMPUTERS = [
  [10, 72], [23, 70], [37, 72], [51, 70], [64, 72], [78, 71], [91, 70],
  [8, 57], [20, 56], [32, 57], [44, 56], [56, 57], [68, 56], [80, 57], [92, 56],
  [14, 45], [28, 44], [42, 45], [58, 44], [74, 45],
];

export default function NetCafeProduction({
  computer,
  storyStep = 'cafe',
  setComputer,
  leaveCafe,
  openMail,
  openShops,
}) {
  const [opening, setOpening] = useState(true);
  const [notice, setNotice] = useState("FIRST FLOOR · NET CAFÉ · 2001");
  const [blink, setBlink] = useState(0);
  const [activeNpc, setActiveNpc] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpening(false), 1600);
    const pulse = window.setInterval(() => setBlink((v) => v + 1), 1800);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(pulse);
    };
  }, []);

  const selectedLabel = useMemo(
    () => (computer === null ? null : `PC ${String(computer + 1).padStart(2, "0")}`),
    [computer]
  );

  function chooseComputer(index) {
    setComputer(index);
    setNotice(`PC ${String(index + 1).padStart(2, "0")} selected · READY FOR DEARMAIL`);
  }

  const cafeNpcs = [
    { id: 'student', left: 34, top: 56, label: 'STUDENT', line: '“The chat rooms are packed tonight.”' },
    { id: 'office', left: 57, top: 51, label: 'OFFICE GUY', line: '“Try the terminal near the window.”' },
    { id: 'friend', left: 74, top: 58, label: 'COLLEGE BOY', line: '“Have you heard about DearMail?”' },
  ];

  return (
    <section className="netcafe-production">
      <header className="netcafe-header">
        <div>
          <b>SPENCER PLAZA · FIRST FLOOR</b>
          <span>NET CAFÉ · 2001 · 20 COMPUTERS</span>
        </div>
        <div className="netcafe-live"><i /> OPEN · ₹20 / HOUR</div>
      </header>

      <div className={`netcafe-stage ${opening ? "opening" : ""}`}>
        <div className="netcafe-image-wrap">
          <img
            className="netcafe-art"
            src={`${ROOT}/environment/net-cafe-main-scene.png`}
            alt="Illustrated Spencer Plaza Net Café with twenty computers"
          />
          <div className="netcafe-warm-vignette" />
          <div className="crt-scanlines" />

          <div className="cafe-ambient-lights" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>

          {cafeNpcs.map((npc) => (
            <button
              key={npc.id}
              className={`cafe-npc-hotspot ${activeNpc === npc.id ? 'selected' : ''}`}
              style={{ left: `${npc.left}%`, top: `${npc.top}%` }}
              onClick={() => {
                setActiveNpc(npc.id);
                setNotice(npc.line);
              }}
            >
              <span className="cafe-npc-dot" />
              <b>{activeNpc === npc.id ? npc.label : 'TALK'}</b>
            </button>
          ))}

          <div className="cafe-story-path" aria-hidden="true">
            <span className="done">1 PLAZA</span>
            <i>→</i>
            <span className="done">2 FLYER</span>
            <i>→</i>
            <span className="done">3 NET CAFÉ</span>
            <i>→</i>
            <span className={computer !== null ? 'done' : ''}>4 COMPUTER</span>
            <i>→</i>
            <span className={storyStep === 'mail' ? 'done' : ''}>5 DEARMAIL</span>
          </div>

          {COMPUTERS.map(([left, top], index) => (
            <button
              key={index}
              className={`computer-hotspot ${computer === index ? "selected" : ""}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => chooseComputer(index)}
              aria-label={`Select computer ${index + 1}`}
            >
              <span className="computer-glow" />
              <b>{String(index + 1).padStart(2, "0")}</b>
            </button>
          ))}

          <div className="cafe-sign-overlay">
            <strong>INTERNET</strong>
            <span>E-MAIL · CHAT · GAMES</span>
          </div>

          <div className="cafe-clock">10:42 PM · CHENNAI</div>

          {opening && (
            <div className="cafe-opening-card">
              <span>SPENCER PLAZA</span>
              <b>NET CAFÉ</b>
              <small>2001 · FIRST FLOOR</small>
            </div>
          )}
        </div>

        {computer !== null && (
          <div className="terminal-focus" aria-live="polite">
            <div className="terminal-screen">
              <span>DEARMAIL_2001.EXE</span>
              <b>PC {String(computer + 1).padStart(2, '0')}</b>
              <small>{storyStep === 'mail' ? 'CONNECTED' : 'READY · CLICK OPEN DEARMAIL'}</small>
            </div>
          </div>
        )}

        <div className="netcafe-caption">
          <b>{notice}</b>
          <span>Choose a computer. Your first online conversation begins here.</span>
        </div>

        {computer !== null && (
          <div className="dearmail-prompt">
            <div>
              <small>SELECTED TERMINAL</small>
              <b>{selectedLabel}</b>
              <span>CRT ONLINE · MODEM CONNECTED</span>
            </div>
            <button onClick={openMail}>OPEN DEARMAIL →</button>
          </div>
        )}

        <button className="netcafe-shop-hotspot" onClick={openShops}>
          <span>CDs · BOOKS · CLOTHES</span>
          <b>RETRO SHOP</b>
        </button>

        <div className="modem-status" key={blink}>
          <i /> 56K MODEM CONNECTED
        </div>
      </div>

      <footer className="netcafe-controls">
        <button onClick={leaveCafe}>← BACK TO SPENCER PLAZA</button>
        <div className="netcafe-instruction">
          {computer === null ? "TAP A COMPUTER TO SIT DOWN" : "YOUR COMPUTER IS READY"}
        </div>
        {computer !== null && <button className="dearmail-button" onClick={openMail}>DEARMAIL →</button>}
      </footer>
    </section>
  );
}
