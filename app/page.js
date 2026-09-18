'use client';

import { useEffect, useRef, useState } from 'react';
import ComicWorld from "./components/ComicWorld";
import Script from 'next/script';
import { getSupabaseBrowser } from '../lib/supabase-browser';

const NPCS = [
  { id:'n1', name:'Karthik', role:'college friend', x:17, y:54, dir:1 },
  { id:'n2', name:'Meena', role:'shopper', x:33, y:63, dir:-1 },
  { id:'n3', name:'Arun', role:'music lover', x:49, y:50, dir:1 },
  { id:'n4', name:'Divya', role:'student', x:65, y:61, dir:-1 },
  { id:'n5', name:'Ravi', role:'shopkeeper', x:79, y:53, dir:1 },
  { id:'n6', name:'Priya', role:'student', x:88, y:66, dir:-1 },
];

const DEFAULT_COMMERCE = [
  { id:'clothes', category:'RETRO CLOTHING', title:'Denim / Streetwear', description:'Open a current marketplace search for retro-style clothing.', provider:'Amazon India', url:'https://www.amazon.in/s?k=retro+denim+streetwear' },
  { id:'books', category:'BOOK SHOP', title:'Vintage & Chennai reads', description:'Browse books inspired by the old-world reading corner.', provider:'Flipkart', url:'https://www.flipkart.com/search?q=vintage+books' },
  { id:'music', category:'CD WORLD', title:'2001 Tamil & Indian playlists', description:'Jump from the CD shop into streaming search.', provider:'Spotify', url:'https://open.spotify.com/search/2001%20Tamil%20songs' },
  { id:'photo', category:'PHOTO SHOP', title:'Disposable-camera mood', description:'A simple inspiration link for retro photography.', provider:'Pinterest', url:'https://www.pinterest.com/search/pins/?q=disposable%20camera%20photography' },
];

export default function Home() {
  const sbRef = useRef(null);
  const channelRef = useRef(null);
  const notificationChannelRef = useRef(null);
  const [view, setView] = useState('intro');
  const [scene, setScene] = useState('street');
  const [arrival, setArrival] = useState(0);
  const [player, setPlayer] = useState({ x:10, y:69 });
  const [flyerVisible, setFlyerVisible] = useState(false);
  const [computer, setComputer] = useState(null);
  const [pendingCafeComputer, setPendingCafeComputer] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [visits, setVisits] = useState([]);
  const [premium, setPremium] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [playerGender, setPlayerGender] = useState('guy');
  const [authMsg, setAuthMsg] = useState('');
  const [payMsg, setPayMsg] = useState('');
  const [notice, setNotice] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [selectedSocials, setSelectedSocials] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [commerce, setCommerce] = useState(DEFAULT_COMMERCE);
  const [adminReports, setAdminReports] = useState([]);
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    try {
      const savedGender = window.localStorage.getItem('dy_player_gender');
      if (savedGender === 'girl' || savedGender === 'guy') setPlayerGender(savedGender);
    } catch {}
    const sb = getSupabaseBrowser();
    sbRef.current = sb;
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session) loadUser(data.session);
    });
    const { data:{ subscription } } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s || null);
      if (s) loadUser(s);
      else {
        setProfile(null); setPeople([]); setPremium(false); setNotifications([]); setUnreadCount(0);
        if (notificationChannelRef.current) sb.removeChannel(notificationChannelRef.current);
      }
    });
    loadCommerce();
    return () => {
      subscription.unsubscribe();
      if (channelRef.current) sb.removeChannel(channelRef.current);
      if (notificationChannelRef.current) sb.removeChannel(notificationChannelRef.current);
    };
  }, []);

  useEffect(() => {
    if (view === 'world' && scene === 'street' && arrival >= 10) setFlyerVisible(true);
  }, [arrival, view, scene]);

  useEffect(() => {
    if (view !== 'world' || scene !== 'street') return;
    const timer = setInterval(() => setArrival(v => Math.min(v + 1, 10)), 1000);
    return () => clearInterval(timer);
  }, [view, scene]);

  async function loadCommerce() {
    const sb = sbRef.current;
    if (!sb) return;
    const { data } = await sb.from('commerce_items').select('id,category,title,description,provider,url').eq('active', true).order('sort_order');
    if (data?.length) setCommerce(data);
  }

  async function loadUser(s) {
    const sb = sbRef.current;
    if (!s?.user || !sb) return;
    const { data:p } = await sb.from('profiles').select('id,username,display_name,bio,player_gender,is_premium,role,created_at').eq('id', s.user.id).maybeSingle();
    setProfile(p || null);
    setUsername(p?.username || s.user.user_metadata?.username || '');
    setDisplayName(p?.display_name || s.user.user_metadata?.display_name || '');
    setBio(p?.bio || '');
    if (p?.player_gender === 'girl' || p?.player_gender === 'guy') setPlayerGender(p.player_gender);
    setPremium(!!p?.is_premium);
    const { data:links } = await sb.from('private_social_links').select('whatsapp_url,instagram_url').eq('user_id', s.user.id).maybeSingle();
    setWhatsappUrl(links?.whatsapp_url || ''); setInstagramUrl(links?.instagram_url || '');
    const { data:ps } = await sb.from('profiles').select('id,username,display_name,bio,player_gender').neq('id', s.user.id).limit(50);
    setPeople(ps || []);
    const { data:v } = await sb.from('passport_visits').select('location,visited_at').eq('user_id', s.user.id).order('visited_at',{ascending:false});
    setVisits(v || []);
    await refreshNotifications(s.user.id);
    subscribeNotifications(s.user.id);
  }

  async function ensureProfile(s, fallback={}) {
    if (!s?.user) return;
    const sb = sbRef.current;
    const name = (fallback.displayName || s.user.user_metadata?.display_name || s.user.email?.split('@')[0] || 'Explorer').slice(0,80);
    const uname = (fallback.username || s.user.user_metadata?.username || `guest${s.user.id.slice(0,8)}`).toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,32) || `user${s.user.id.slice(0,6)}`;
    const { error } = await sb.from('profiles').upsert({ id:s.user.id, username:uname, display_name:name, bio:(fallback.bio || '').slice(0,500), player_gender:fallback.playerGender || playerGender }, { onConflict:'id' });
    if (error) return setAuthMsg(error.message);
    await loadUser(s);
  }

  async function auth(e) {
    e.preventDefault(); setAuthMsg('');
    const sb = sbRef.current;
    if (authMode === 'login') {
      const { data,error } = await sb.auth.signInWithPassword({ email,password });
      if (error) return setAuthMsg(error.message);
      await ensureProfile(data.session); setView('world'); setScene('street'); return;
    }
    try { window.localStorage.setItem('dy_player_gender',playerGender); } catch {}
    const { data,error } = await sb.auth.signUp({ email,password,options:{data:{username,display_name:displayName,bio,player_gender:playerGender}} });
    if (error) return setAuthMsg(error.message);
    if (data.session) {
      await ensureProfile(data.session,{username,displayName,bio,playerGender});
      setAuthMsg('Account created. Welcome to 2001.'); setView('world'); setScene('street');
    } else {
      setAuthMsg('Account created. Confirm the Supabase email before member features. You can enter Spencer Plaza as a guest now.');
      setView('world'); setScene('street');
    }
  }

  async function visit(location) {
    if (!session) { setNotice('Guest mode: explore freely. Log in later to save Passport stamps.'); return; }
    await sbRef.current.from('passport_visits').upsert({user_id:session.user.id,location});
    const { data } = await sbRef.current.from('passport_visits').select('location,visited_at').eq('user_id',session.user.id).order('visited_at',{ascending:false});
    setVisits(data || []);
  }

  function startWorld() {
    setView('world'); setScene('street'); setArrival(0); setFlyerVisible(false); setPlayer({x:10,y:69}); setComputer(null);
  }

  function movePlayer(dx,dy) {
    if (scene !== 'street') return;
    setPlayer(p => ({x:Math.max(6,Math.min(94,p.x+dx)),y:Math.max(43,Math.min(78,p.y+dy))}));
  }

  function enterCafe() {
    if (!flyerVisible) { setNotice(`The flyer appears after 2 minutes of exploring. ${Math.max(0,120-arrival)} seconds to go.`); return; }
    setScene('cafe'); visit('SPENCER PLAZA · 2001');
  }
  function leaveCafe(){ setScene('street'); setComputer(null); }

  async function openPerson(p) {
    if (!session) { setView('account'); setAuthMsg('Create an account to message real members.'); return; }
    setSelected(p); setView('mail'); setMessages([]); setDraft(''); setConnectionStatus('none'); setSelectedSocials(null);
    const sb = sbRef.current;
    const { data:conn } = await sb.from('connections').select('requester_id,recipient_id,status').or(`and(requester_id.eq.${session.user.id},recipient_id.eq.${p.id}),and(requester_id.eq.${p.id},recipient_id.eq.${session.user.id})`).maybeSingle();
    setConnectionStatus(!conn ? 'none' : (conn.status === 'pending' && conn.requester_id === p.id ? 'pending_incoming' : conn.status));
    if (conn?.status === 'accepted') {
      const { data:links } = await sb.from('private_social_links').select('whatsapp_url,instagram_url').eq('user_id',p.id).maybeSingle();
      setSelectedSocials(links || null);
    }
    const { data } = await sb.from('messages').select('*').or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${p.id}),and(sender_id.eq.${p.id},recipient_id.eq.${session.user.id})`).order('created_at');
    setMessages(data || []);
    if (channelRef.current) await sb.removeChannel(channelRef.current);
    channelRef.current = sb.channel(`dm-${session.user.id}-${p.id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},payload=>{
      const m=payload.new;
      if ((m.sender_id===p.id && m.recipient_id===session.user.id)||(m.sender_id===session.user.id&&m.recipient_id===p.id)) setMessages(old=>old.some(x=>x.id===m.id)?old:[...old,m]);
    }).subscribe();
  }

  async function send(){
    if(!draft.trim()||!session||!selected)return;
    if(connectionStatus!=='accepted')return setNotice('Mutual connection is required before DearMail opens.');
    const sb=sbRef.current;
    const {data:blocked}=await sb.from('blocks').select('blocked_id').eq('blocker_id',session.user.id).eq('blocked_id',selected.id).maybeSingle();
    if(blocked)return setNotice('You have blocked this member.');
    const {data,error}=await sb.from('messages').insert({sender_id:session.user.id,recipient_id:selected.id,body:draft.trim()}).select().single();
    if(error)return setNotice(error.message); setMessages(m=>[...m,data]); setDraft('');
  }

  async function connect(){
    if(!session||!selected)return;
    const sb=sbRef.current;
    if(connectionStatus==='pending_incoming'){
      const {error}=await sb.from('connections').update({status:'accepted',updated_at:new Date().toISOString()}).eq('requester_id',selected.id).eq('recipient_id',session.user.id);
      if(error)return setNotice(error.message);
      setConnectionStatus('accepted'); const {data:links}=await sb.from('private_social_links').select('whatsapp_url,instagram_url').eq('user_id',selected.id).maybeSingle(); setSelectedSocials(links||null); setNotice('Connection accepted. DearMail is open.'); return;
    }
    const {error}=await sb.from('connections').upsert({requester_id:session.user.id,recipient_id:selected.id,status:'pending'},{onConflict:'requester_id,recipient_id'});
    if(error)return setNotice(error.message); setConnectionStatus('pending'); setNotice('Connection request sent.');
  }

  async function report(){ if(!session||!selected)return; const {error}=await sbRef.current.from('reports').insert({reporter_id:session.user.id,target_user_id:selected.id,reason:'Report from DearMail'}); setNotice(error?'Could not submit report.': 'Report submitted to moderation.'); }
  async function block(){ if(!session||!selected)return; await sbRef.current.from('blocks').upsert({blocker_id:session.user.id,blocked_id:selected.id}); setNotice('Member blocked.'); setSelected(null); setView('world'); }

  async function saveProfile(){
    if(!session)return;
    const sb=sbRef.current;
    const cleanUsername=username.trim().toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,32);
    if(cleanUsername.length<3)return setNotice('Username must contain at least 3 letters/numbers.');
    const {error}=await sb.from('profiles').update({username:cleanUsername,display_name:displayName.trim().slice(0,80),bio:bio.trim().slice(0,500),player_gender:playerGender}).eq('id',session.user.id);
    if(error)return setNotice(error.message);
    const {error:linkError}=await sb.from('private_social_links').upsert({user_id:session.user.id,whatsapp_url:whatsappUrl.trim()||null,instagram_url:instagramUrl.trim()||null},{onConflict:'user_id'});
    if(linkError)return setNotice(linkError.message);
    await loadUser(session); setNotice('Profile and private contact settings saved.');
  }

  async function refreshNotifications(userId=session?.user?.id){
    if(!userId||!sbRef.current)return;
    const {data}=await sbRef.current.from('notifications').select('id,type,title,body,created_at,read_at').eq('user_id',userId).order('created_at',{ascending:false}).limit(40);
    setNotifications(data||[]); setUnreadCount((data||[]).filter(n=>!n.read_at).length);
  }

  function subscribeNotifications(userId){
    const sb=sbRef.current;
    if(!sb||notificationChannelRef.current)return;
    notificationChannelRef.current=sb.channel(`notifications-${userId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${userId}`},payload=>{
      setNotifications(old=>[payload.new,...old].slice(0,40)); setUnreadCount(c=>c+1);
    }).subscribe();
  }

  async function markNotificationRead(id){
    if(!session)return;
    await sbRef.current.from('notifications').update({read_at:new Date().toISOString()}).eq('id',id).eq('user_id',session.user.id);
    setNotifications(old=>old.map(n=>n.id===id?{...n,read_at:new Date().toISOString()}:n)); setUnreadCount(c=>Math.max(0,c-1));
  }

  async function markAllRead(){
    if(!session||!unreadCount)return;
    await sbRef.current.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',session.user.id).is('read_at',null);
    await refreshNotifications(session.user.id);
  }

  async function openNotifications(){ setView('notifications'); if(session) await refreshNotifications(session.user.id); }

  async function buy(){
    if(!session){setPayMsg('Log in first.');return;}
    setPayMsg('Opening Razorpay…');
    const token=(await sbRef.current.auth.getSession()).data.session?.access_token;
    const r=await fetch('/api/checkout',{method:'POST',headers:{Authorization:`Bearer ${token}`}}); const o=await r.json();
    if(!r.ok)return setPayMsg(o.error||'Checkout unavailable.');
    if(!window.Razorpay)return setPayMsg('Razorpay did not load. Refresh once.');
    const rz=new window.Razorpay({key:o.keyId,amount:o.amount,currency:o.currency,name:'Dear Yesterday',description:o.description,order_id:o.orderId,prefill:o.prefill,handler:async response=>{
      const vr=await fetch('/api/payment/verify',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(response)}); const out=await vr.json();
      setPremium(!!out.ok); setPayMsg(out.ok?'Passport+ unlocked.':(out.error||'Payment verification failed.')); if(out.ok) await loadUser(session);
    },theme:{color:'#1c1a15'}}); rz.open();
  }

  async function loadAdminReports(){
    if(!session||profile?.role!=='admin')return;
    setAdminBusy(true); setAdminMessage('');
    const {data,error}=await sbRef.current.from('reports').select('id,reporter_id,target_user_id,reason,created_at,status,admin_note').order('created_at',{ascending:false}).limit(100);
    if(error)setAdminMessage(error.message); else setAdminReports(data||[]); setAdminBusy(false);
  }

  async function updateReport(id,status){
    if(!session||profile?.role!=='admin')return;
    const {error}=await sbRef.current.from('reports').update({status,reviewed_at:new Date().toISOString(),reviewed_by:session.user.id}).eq('id',id);
    if(error)return setAdminMessage(error.message);
    await loadAdminReports();
  }

  const nav=(v)=>{setView(v); if(v==='world')startWorld(); if(v==='admin')loadAdminReports(); if(v==='notifications')openNotifications();};
  const isAdmin=profile?.role==='admin';

  return <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <main className="site">
      <header className="topbar">
        <button className="brand" onClick={()=>setView('intro')}>DEAR YESTERDAY<span>_</span></button>
        <div className="top-actions">
          {session && <button className="notify-button" onClick={openNotifications}>NOTICES {unreadCount>0&&<b>{unreadCount}</b>}</button>}
          <div className="status">{session?'ONLINE · MEMBER':'ONLINE · GUEST'}</div>
        </div>
      </header>
      {notice&&<div className="notice" onClick={()=>setNotice('')}>{notice}<b>×</b></div>}
      {authMsg&&<div className="notice">{authMsg}</div>}

      {view==='intro'&&<section className="intro-screen"><div className="intro-card scanlines"><div className="datecode">CHENNAI · 2001 · 06:47 PM</div><h1>Somewhere between<br/><em>yesterday</em> and tomorrow.</h1><p>A small retro world for people who still believe the right person can be found in an ordinary place.</p><button className="big-button" onClick={startWorld}>ENTER SPENCER PLAZA</button><button className="ghost-button" onClick={()=>setView('account')}>{session?'OPEN ACCOUNT':'CREATE / LOGIN'}</button><div className="tiny">PHASE I · CHENNAI 2001 · SPENCER PLAZA</div></div></section>}

      {view==='world'&&<>
        <div className="world-head"><div><b>SPENCER PLAZA</b><span>CHENNAI · 2001</span></div><div className="world-time">{scene==='street'?`EXPLORING · ${Math.min(arrival,30)}s / 30s`:'NET CAFÉ · 2001'}</div></div>
        {scene==='street' ? (
  <ComicWorld
    playerGender={playerGender}
    flyerVisible={flyerVisible}
    arrival={arrival}
    onEnterCafe={enterCafe}
    onNotice={(message) => setNotice(message)}
  />
) : (
  <Cafe
    computer={computer}
    setComputer={setComputer}
    leaveCafe={leaveCafe}
    openMail={() => {
      setView('mail');
      setSelected(null);
    }}
    openShops={() => setShopOpen(true)}
  />
)}

  <div className="world-shelf">

    <b>MORE WORLDS</b>

    <span>MARINA BEACH · FREE SOON</span>

    <span>🔒 KASHMIR · 2004</span>

    <span>🔒 ROOFTOP DATE · 2005</span>

    <span>🔒 TOKYO · 2006</span>

  </div>

</>}

      {view==='mail'&&<section className="app-panel"><div className="retro-window"><div className="windowbar"><span>DEARMAIL_2001.EXE</span><button onClick={()=>setView('world')}>×</button></div><div className="mail-layout"><aside className="mail-side"><b>INBOX</b><button onClick={()=>setView('world')}>← WORLD</button>{people.map(p=><button key={p.id} onClick={()=>openPerson(p)} className={selected?.id===p.id?'sel':''}>{p.display_name}<small>@{p.username}</small></button>)}</aside><div className="mail-main"><div className="mail-title">{selected?`CHAT · ${selected.display_name}`:'DEARMAIL'}</div><div className="chat">{selected?messages.map(m=><div key={m.id} className={`bubble ${m.sender_id===session?.user?.id?'mine':''}`}>{m.body}<small>{new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></div>):<div className="empty-mail"><b>Welcome to DearMail.</b><p>This is the fictional in-world internet. Choose a member to start a real conversation.</p></div>}</div>{selected&&session&&(connectionStatus!=='accepted'?<div className="connect-box"><b>{connectionStatus==='pending'?'REQUEST SENT':connectionStatus==='pending_incoming'?'THIS MEMBER WANTS TO CONNECT':'MAKE A CONNECTION'}</b><p>{connectionStatus==='pending'?'Wait for mutual acceptance.':connectionStatus==='pending_incoming'?'Accept to open DearMail.':'Both people must agree before chatting or sharing external contact details.'}</p><button onClick={connect}>{connectionStatus==='pending_incoming'?'ACCEPT CONNECTION':connectionStatus==='pending'?'WAITING…':'SEND CONNECTION REQUEST'}</button></div>:<><div className="composer"><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="type a message…"/><button onClick={send}>SEND</button></div><div className="actions"><button onClick={report}>REPORT</button><button onClick={block}>BLOCK</button>{selectedSocials?.whatsapp_url&&<a href={selectedSocials.whatsapp_url} target="_blank" rel="noreferrer">WHATSAPP</a>}{selectedSocials?.instagram_url&&<a href={selectedSocials.instagram_url} target="_blank" rel="noreferrer">INSTAGRAM</a>}<span className="consent-note">Mutual connection: external contact is visible only after acceptance.</span></div></>)}</div></div><div className="mail-status">CONNECTED TO SPENCER PLAZA NET CAFÉ · NOT REAL GMAIL</div></div></section>}

      {view==='shop'&&<Shop commerce={commerce} close={()=>setView('world')} />}
      {shopOpen&&<Shop commerce={commerce} close={()=>setShopOpen(false)} />}

      {view==='notifications'&&<section className="simple-panel"><div className="auth-panel"><div className="panel-head"><div><small>DEAR YESTERDAY NOTICES</small><h1>YOUR INBOX.</h1></div><button className="ghost-button" onClick={markAllRead}>MARK ALL READ</button></div><div className="notification-list">{notifications.length?notifications.map(n=><button key={n.id} className={`notification ${n.read_at?'read':''}`} onClick={()=>markNotificationRead(n.id)}><span className="notification-dot">{n.read_at?'·':'●'}</span><span><b>{n.title}</b><small>{n.body}</small><i>{new Date(n.created_at).toLocaleString()}</i></span></button>):<div className="empty-mail"><b>No notices yet.</b><p>Connection requests and new DearMail activity will appear here.</p></div>}</div></div></section>}

      {view==='passport'&&<section className="simple-panel"><div className="passport-paper"><small>YOUR RETRO PASSPORT</small><h1>{profile?.display_name||'GUEST'}’S PASSPORT</h1><p>Every place you visit leaves a stamp.</p><div className="stampgrid">{(visits.length?visits:[{location:'SPENCER PLAZA · 2001'}]).map((v,i)=><div className="stamp" key={`${v.location}-${i}`}><b>STAMP {String(i+1).padStart(2,'0')}</b><strong>{v.location}</strong><span>VISITED</span></div>)}</div></div></section>}

      {view==='premium'&&<section className="simple-panel"><div className="passport-paper premium-paper"><small>PASSPORT+</small><h1>{premium?'WELCOME TO THE BIGGER WORLD.':'THE WORLD GETS BIGGER.'}</h1><p>Private date rooms, new eras, deeper NPC stories and custom memory rooms.</p><div className="price">₹199 <small>ONE-TIME</small></div>{premium?<div className="success">✓ PASSPORT+ ACTIVE</div>:<button className="big-button" onClick={buy}>UNLOCK WITH RAZORPAY</button>}<p className="tiny">India: Razorpay Checkout presents available UPI methods. International options depend on merchant approval.</p>{payMsg&&<div className="notice">{payMsg}</div>}</div></section>}

      {view==='account'&&<section className="simple-panel"><div className="auth-panel">{session?<><small>MEMBER ACCOUNT</small><h1>EDIT YOUR PROFILE.</h1><div className="profile-editor"><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} /></label><label>Display name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} /></label><label>Bio<textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={500} placeholder="A little about you…" /></label><label>Arrival<select value={playerGender} onChange={e=>setPlayerGender(e.target.value)}><option value="guy">Guy · Yamaha RX 100</option><option value="girl">Girl · Maruti 800 + friends</option></select></label><label>Private WhatsApp link<input value={whatsappUrl} onChange={e=>setWhatsappUrl(e.target.value)} placeholder="https://wa.me/..." /></label><label>Private Instagram link<input value={instagramUrl} onChange={e=>setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." /></label><button className="big-button" onClick={saveProfile}>SAVE PROFILE</button></div><p className="tiny">WhatsApp and Instagram links are never used for public discovery. They are shown only to accepted connections.</p>{isAdmin&&<button className="ghost-button" onClick={()=>nav('admin')}>OPEN MODERATION DASHBOARD</button>}<button className="big-button" onClick={()=>sbRef.current.auth.signOut()}>SIGN OUT</button></>:<><small>DEAR YESTERDAY MEMBERSHIP</small><h1>{authMode==='login'?'WELCOME BACK.':'CREATE YOUR PASSPORT.'}</h1><form onSubmit={auth}>{authMode==='signup'&&<><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required/><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name" required/><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="A little about you…" maxLength={500}/><select value={playerGender} onChange={e=>setPlayerGender(e.target.value)}><option value="guy">I arrive as a guy · RX 100</option><option value="girl">I arrive as a girl · Maruti 800 + friends</option></select></>}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" minLength={6} required/><button className="big-button">{authMode==='login'?'LOGIN':'CREATE ACCOUNT'}</button></form><button className="ghost-button" onClick={()=>setAuthMode(authMode==='login'?'signup':'login')}>{authMode==='login'?'Need an account? Create one':'Already registered? Login'}</button><button className="ghost-button" onClick={startWorld}>CONTINUE AS GUEST</button></>}</div></section>}

      {view==='admin'&&isAdmin&&<Admin reports={adminReports} busy={adminBusy} message={adminMessage} reload={loadAdminReports} update={updateReport} />}

      <nav className="bottom-nav"><button className={view==='world'?'active':''} onClick={()=>nav('world')}>WORLD</button><button className={view==='mail'?'active':''} onClick={()=>nav('mail')}>DEARMAIL</button><button className={view==='shop'?'active':''} onClick={()=>nav('shop')}>SHOPS</button><button className={view==='passport'?'active':''} onClick={()=>nav('passport')}>PASSPORT</button><button className={view==='premium'?'active':''} onClick={()=>nav('premium')}>PASSPORT+</button><button className={view==='account'?'active':''} onClick={()=>nav('account')}>{session?'ACCOUNT':'LOGIN'}</button>{isAdmin&&<button className={view==='admin'?'active':''} onClick={()=>nav('admin')}>ADMIN</button>}</nav>
      <footer>PHASE I · CHENNAI 2001 · SPENCER PLAZA <span>DEAR YESTERDAY V3 FINAL</span></footer>
    </main>
  </>;
}

function Cafe({computer,setComputer,leaveCafe,openMail,openShops}){
  return <section className="cafe-scene"><div className="cafe-sign">SPENCER PLAZA NET CAFÉ <small>EST. 2000 · 20 COMPUTERS</small></div><div className="cafe-room"><div className="cafe-counter">NET CAFÉ <small>₹20 / HOUR</small></div><div className="cafe-npc cafe-owner"><span></span><b>RAMESH</b></div>{Array.from({length:20},(_,i)=><button key={i} className={`crt-pc ${computer===i?'chosen':''}`} onClick={()=>setComputer(i)}><span className="crt-screen">{computer===i?'DEARMAIL':'ONLINE'}</span><b>PC {String(i+1).padStart(2,'0')}</b><i></i></button>)}<div className="cafe-poster">DON'T FORGET<br/><b>LOG OFF.</b></div><button className="cafe-shop-corner" onClick={openShops}>RETRO SHOP CORNER<br/><small>CLOTHES · CDS · BOOKS →</small></button></div><div className="cafe-bottom"><button onClick={leaveCafe}>← BACK TO SPENCER PLAZA</button>{computer!==null&&<div className="computer-launch">COMPUTER {String(computer+1).padStart(2,'0')} SELECTED <button onClick={openMail}>OPEN DEARMAIL →</button></div>}</div></section>;
}

function Shop({commerce,close}){
  return <section className="simple-panel shop-panel"><div className="passport-paper"><div className="panel-head"><div><small>SPENCER PLAZA · SHOPS</small><h1>TAKE A LITTLE<br/>YESTERDAY HOME.</h1></div><button className="ghost-button" onClick={close}>× CLOSE</button></div><p>These are real external discovery links. Dear Yesterday does not process the purchase or payment on these sites.</p><div className="commerce-grid">{commerce.map(item=><article className="commerce-card" key={item.id}><small>{item.category}</small><h2>{item.title}</h2><p>{item.description}</p><a href={item.url} target="_blank" rel="noreferrer">OPEN {item.provider} ↗</a></article>)}</div></div></section>;
}

function Admin({reports,busy,message,reload,update}){
  return <section className="simple-panel"><div className="passport-paper admin-panel"><div className="panel-head"><div><small>STAFF ONLY</small><h1>MODERATION DESK.</h1></div><button className="ghost-button" onClick={reload}>REFRESH</button></div><p>Review user reports without exposing moderation tools to ordinary members.</p>{message&&<div className="notice static-notice">{message}</div>}{busy?<div className="empty-mail">Loading reports…</div>:reports.length?<div className="report-list">{reports.map(r=><article className="report-card" key={r.id}><div><small>{new Date(r.created_at).toLocaleString()}</small><h3>{r.reason}</h3><p>Reporter: <code>{r.reporter_id}</code><br/>Target: <code>{r.target_user_id}</code></p><b>STATUS: {r.status}</b></div><div className="report-actions"><button onClick={()=>update(r.id,'reviewed')}>MARK REVIEWED</button><button onClick={()=>update(r.id,'dismissed')}>DISMISS</button></div></article>)}</div>:<div className="empty-mail"><b>All clear.</b><p>No reports are waiting in the moderation queue.</p></div>}</div></section>;
}
