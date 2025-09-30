// src/App.js
import React, { useEffect, useState, useRef } from "react";

/**
 * Complete single-file app UI for CRA (no external deps)
 * - Injects CSS automatically
 * - Uses localStorage for theme & simple persistence
 * - Works with `npm start` CRA dev server
 */

/* --------------------------- Inject CSS --------------------------- */
const INJECTED_CSS = `
:root{
  --bg:#f6f7fb; --card:#ffffff; --muted:#6b7280; --accent:#059669; --accent-2:#047857;
  --text:#0f172a; --glass: rgba(255,255,255,0.65);
  --shadow: 0 6px 18px rgba(15,23,42,0.08);
  --radius:12px;
}
html,body,#root{ height:100%; margin:0; font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial; background:var(--bg); color:var(--text); }
.app { display:flex; height:100vh; overflow:hidden; }
.sidebar { width:72px; transition:width 180ms ease; background:linear-gradient(180deg,#ffffff 0%, #f3f4f6 100%); border-right:1px solid rgba(15,23,42,0.04); display:flex; flex-direction:column; padding:14px; gap:12px; }
.sidebar.open { width:260px; }
.brand { display:flex; align-items:center; gap:12px; font-weight:700; font-size:16px; padding:6px 8px; }
.avatar { width:44px; height:44px; border-radius:10px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
.nav { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
.nav button { display:flex; gap:12px; align-items:center; padding:10px 12px; border-radius:10px; background:transparent; border:0; cursor:pointer; color:inherit; }
.nav button:hover { background:rgba(6,95,70,0.06); }
.nav .active { background:rgba(5,150,105,0.08); box-shadow: inset 0 0 0 1px rgba(5,150,105,0.04); }
.iconBox { width:36px; height:36px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#ecfdf5,#bbf7d0); color:var(--accent-2); }
.main { flex:1; display:flex; flex-direction:column; }
.topbar { height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 18px; border-bottom:1px solid rgba(15,23,42,0.04); background:transparent; }
.search { display:flex; align-items:center; gap:8px; background:rgba(15,23,42,0.03); padding:8px 10px; border-radius:10px; min-width:260px; }
.search input { border:0; outline:none; background:transparent; width:100%; }
.controls { display:flex; gap:8px; align-items:center; }
.iconBtn { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:transparent; border:0; cursor:pointer; }
.workspace { padding:18px; display:flex; gap:16px; height:calc(100vh - 64px - 48px); box-sizing:border-box; }
.leftPane { flex:1.6; display:flex; flex-direction:column; gap:12px; }
.panel { background:var(--card); border-radius:var(--radius); box-shadow:var(--shadow); border:1px solid rgba(15,23,42,0.03); overflow:hidden; display:flex; flex-direction:column; }
.panelHeader { padding:12px 14px; border-bottom:1px solid rgba(15,23,42,0.03); display:flex; align-items:center; justify-content:space-between; }
.panelBody { padding:12px; overflow:auto; flex:1; }
.terminalLines { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; font-size:13px; line-height:1.5; color:#0b8a5f; background:linear-gradient(180deg,#011627 0%,#022b3a 100%); color:#cdeee4; padding:12px; border-radius:8px; min-height:220px; }
.terminalInput { display:flex; gap:8px; padding:10px; border-top:1px solid rgba(15,23,42,0.03); background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent); }
.terminalInput input { flex:1; padding:8px 10px; border-radius:8px; border:1px solid rgba(15,23,42,0.04); outline:none; background:transparent; color:inherit; }
.editorTabs { display:flex; gap:8px; padding:10px; border-bottom:1px solid rgba(15,23,42,0.03); align-items:center; }
.tab { padding:6px 10px; border-radius:8px; background:transparent; cursor:pointer; }
.tab.active { background:rgba(5,150,105,0.08); }
.editorArea { padding:12px; min-height:260px; }
.editorArea textarea { width:100%; min-height:260px; border:0; outline:none; resize:vertical; font-family:ui-monospace,monospace; font-size:13px; background:transparent; }
.rightPane { flex:0.8; display:flex; flex-direction:column; gap:12px; }
.quickGrid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; padding:12px; }
.qbtn { padding:10px; border-radius:10px; border:1px solid rgba(15,23,42,0.04); cursor:pointer; background:linear-gradient(180deg,#fff,#fbfbfb); }
.resourceBar { padding:12px; display:flex; flex-direction:column; gap:8px; }
.progress { height:8px; background:#eef2f7; border-radius:6px; overflow:hidden; }
.progressFill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent-2)); width:30%; }
.notifications { padding:12px; display:flex; flex-direction:column; gap:8px; max-height:220px; overflow:auto; }
.notif { padding:10px; border-radius:8px; border:1px solid rgba(15,23,42,0.03); background:linear-gradient(180deg,#fff,#fbfbfb); }
.footer { height:48px; display:flex; align-items:center; justify-content:space-between; padding:0 18px; border-top:1px solid rgba(15,23,42,0.03); font-size:13px; color:var(--muted); }

/* Dark mode */
body.dark { background:#07142a; color:#e6eef3; }
body.dark .sidebar { background:linear-gradient(180deg,#07142a,#052033); border-right:1px solid rgba(255,255,255,0.03); }
body.dark .panel { background:#082033; border:1px solid rgba(255,255,255,0.03); box-shadow:none; }
body.dark .search { background:rgba(255,255,255,0.03); }
body.dark .terminalLines { background:linear-gradient(180deg,#00131a,#00202a); color:#9be6ce; }
body.dark .qbtn { background:linear-gradient(180deg,#062630,#03343a); color:#c7f0e0; border:1px solid rgba(255,255,255,0.03); }
body.dark .notif { background:linear-gradient(180deg,#062630,#03343a); border:1px solid rgba(255,255,255,0.03); color:#cfeee1; }
@media (max-width:900px){
  .sidebar.open { display:none; }
  .sidebar { width:60px; }
  .workspace { flex-direction:column; height:calc(100vh - 64px - 48px); overflow:auto; }
  .leftPane, .rightPane { width:100%; }
}
`;

/* inject css once */
function injectCssOnce() {
  if (document.getElementById("termux-ui-css")) return;
  const s = document.createElement("style");
  s.id = "termux-ui-css";
  s.innerHTML = INJECTED_CSS;
  document.head.appendChild(s);
}

/* --------------------------- Icons --------------------------- */
const Icon = {
  Menu: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  Terminal: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 7l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 7v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>),
  Code: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6L2 12l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Settings: ()=> (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.4"/><path d="M19.4 15a1.6 1.6 0 0 0 .28 1.7 2 2 0 0 1-2.8 2.8 1.6 1.6 0 0 0-1.7.28 1.6 1.6 0 0 1-2 0 1.6 1.6 0 0 0-1.7-.28 2 2 0 0 1-2.8-2.8 1.6 1.6 0 0 0-.28-1.7 1.6 1.6 0 0 1 0-2 1.6 1.6 0 0 0 .28-1.7 2 2 0 0 1 2.8-2.8 1.6 1.6 0 0 0 1.7-.28 1.6 1.6 0 0 1 2 0 1.6 1.6 0 0 0 1.7.28 2 2 0 0 1 2.8 2.8 1.6 1.6 0 0 0 .28 1.7 1.6 1.6 0 0 1 0 2 1.6 1.6 0 0 0-.28 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Sun: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4v1M12 19v1M4 12H3M21 12h-1M5 5l-.7-.7M19.7 19.7l-.7-.7M5 19l-.7.7M19.7 4.3l-.7.7M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Moon: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Bell: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 17H9m6 0a3 3 0 0 1-6 0M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  User: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.2"/></svg>),
  Cloud: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 17.5A4.5 4.5 0 0 0 16 13H7.5A4.5 4.5 0 0 0 3 17.5 3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 2.5-6.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Download: ()=> (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

/* --------------------------- Helpers --------------------------- */
function now() {
  return new Date().toLocaleTimeString();
}

/* --------------------------- Main App --------------------------- */
export default function App() {
  injectCssOnce();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("terminal"); // terminal, editor, files, packages, plugins, map
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "light");
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("app-font-size")) || 14);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState([
    "$ Welcome to Termux One-In-All (demo)",
    "$ Type 'help' and press Enter",
  ]);

  // Editor state
  const [editorTabs, setEditorTabs] = useState(() => {
    const stored = localStorage.getItem("editor-tabs");
    if (stored) return JSON.parse(stored);
    return [{ id: "t1", title: "README.md", content: "# Welcome\nThis is a demo editor tab." }];
  });
  const [activeEditor, setActiveEditor] = useState(editorTabs[0]?.id || null);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Misc
  const [profile] = useState({ name: "Local User" });
  const termInputRef = useRef(null);

  useEffect(() => { // theme persistence / body class
    localStorage.setItem("app-theme", theme);
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  useEffect(() => { localStorage.setItem("app-font-size", String(fontSize)); }, [fontSize]);

  useEffect(() => { localStorage.setItem("editor-tabs", JSON.stringify(editorTabs)); }, [editorTabs]);

  /* --------------------------- Terminal --------------------------- */
  function runTerminalCommand(raw) {
    if (!raw || !raw.trim()) return;
    const cmd = raw.trim();
    setTerminalLines((s) => [...s, `$ ${cmd}`]);

    // Basic fake command handling
    if (cmd === "help") {
      setTerminalLines((s) => [
        ...s,
        "available commands: help, clear, theme [light|dark], open <file>, pkg list",
      ]);
    } else if (cmd === "clear") {
      setTerminalLines([]);
    } else if (cmd.startsWith("theme ")) {
      const t = cmd.split(/\s+/)[1];
      if (t === "dark" || t === "light") setTheme(t);
      setTerminalLines((s) => [...s, `theme set to ${t}`]);
    } else if (cmd === "pkg list") {
      setTerminalLines((s) => [...s, "installed (demo): git, nodejs, python, htop"]);
    } else if (cmd.startsWith("open ")) {
      const file = cmd.split(/\s+/).slice(1).join(" ");
      openFileInEditor(file || "untitled.txt");
      setTerminalLines((s) => [...s, `opening ${file} in editor...`]);
    } else {
      setTerminalLines((s) => [...s, `sh: ${cmd}: command not found`]);
    }
  }

  /* --------------------------- Editor --------------------------- */
  function openFileInEditor(filename) {
    if (!filename) filename = `untitled-${Date.now()}.txt`;
    const existing = editorTabs.find((t) => t.title === filename);
    if (existing) {
      setActiveEditor(existing.id);
      setActive("editor");
      return;
    }
    const newTab = { id: String(Date.now()), title: filename, content: `# ${filename}\n\n` };
    setEditorTabs((t) => [...t, newTab]);
    setActiveEditor(newTab.id);
    setActive("editor");
  }

  function updateEditorContent(id, content) {
    setEditorTabs((tabs) => tabs.map((t) => (t.id === id ? { ...t, content } : t)));
  }

  function closeEditorTab(id) {
    setEditorTabs((tabs) => {
      const next = tabs.filter((t) => t.id !== id);
      if (next.length === 0) {
        setActiveEditor(null);
        setActive("terminal");
      } else if (id === activeEditor) {
        setActiveEditor(next[0].id);
      }
      return next;
    });
  }

  /* --------------------------- Packages / Plugins --------------------------- */
  function installPackage(pkg) {
    pushNotification(`Installing ${pkg}...`);
    setTimeout(() => pushNotification(`${pkg} installed.`), 1400);
  }

  function pushNotification(text) {
    const n = { id: Date.now(), text, time: now() };
    setNotifications((s) => [n, ...s].slice(0, 20));
  }

  /* --------------------------- UI helpers --------------------------- */
  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  /* --------------------------- Render --------------------------- */
  return (
    <div className="app" role="application" aria-label="Termux One-In-All UI">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen}>
        <div className="brand">
          <div className="avatar">{profile.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
          {sidebarOpen && <div>
            <div style={{fontSize:14, fontWeight:800}}>{profile.name}</div>
            <div style={{fontSize:12, color:"var(--muted)"}}>termux.one</div>
          </div>}
          <div style={{marginLeft:"auto"}}>
            <button className="iconBtn" title="Toggle" onClick={toggleSidebar}><Icon.Menu/></button>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <button className={active === "terminal" ? "active" : ""} onClick={() => setActive("terminal")}>
            <div className="iconBox"><Icon.Terminal /></div>
            {sidebarOpen && <div>Terminal</div>}
          </button>

          <button className={active === "editor" ? "active" : ""} onClick={() => setActive("editor")}>
            <div className="iconBox"><Icon.Code/></div>
            {sidebarOpen && <div>Editor</div>}
          </button>

          <button className={active === "files" ? "active" : ""} onClick={() => setActive("files")}>
            <div className="iconBox"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 0 0 2 2h14V7H3z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg></div>
            {sidebarOpen && <div>Files</div>}
          </button>

          <button className={active === "packages" ? "active" : ""} onClick={() => setActive("packages")}>
            <div className="iconBox"><Icon.Download/></div>
            {sidebarOpen && <div>Packages</div>}
          </button>

          <button className={active === "plugins" ? "active" : ""} onClick={() => setActive("plugins")}>
            <div className="iconBox"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 12l4 8 12-16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg></div>
            {sidebarOpen && <div>Plugins</div>}
          </button>

          <button className={active === "map" ? "active" : ""} onClick={() => setActive("map")}>
            <div className="iconBox"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M20.5 3l-5 2-5-2-6 2.5v13L10 21l5-2 5 2 5-2.5V3z" stroke="currentColor" strokeWidth="1.0" fill="none"/></svg></div>
            {sidebarOpen && <div>Map</div>}
          </button>
        </nav>

        <div style={{marginTop:"auto"}}>
          <div style={{padding:"10px 6px"}}>
            <button className="iconBtn" title="Settings" onClick={()=>{ setActive("settings"); pushNotification("Open settings from topbar"); }}><Icon.Settings/></button>
          </div>
          <div style={{padding:"10px 6px", fontSize:12, color:"var(--muted)"}}>v1.0 • Demo</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <div style={{fontWeight:700, fontSize:17, display:"flex", alignItems:"center", gap:8}}>
                <Icon.Code/> Termux One-In-All
              </div>
              <div className="search" role="search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <input placeholder="Search commands, files, plugins..." aria-label="search"/>
              </div>
            </div>
          </div>

          <div className="controls">
            <button className="iconBtn" title="Toggle theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Icon.Moon/> : <Icon.Sun/>}
            </button>
            <button className="iconBtn" title="Notifications" onClick={() => pushNotification("This is a sample notification.")}><Icon.Bell/></button>
            <button className="iconBtn" title="Sync" onClick={() => pushNotification("Sync started (demo).")}><Icon.Cloud/></button>
            <div style={{width:10}} />
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <div style={{fontSize:13, color:"var(--muted)"}}>Theme</div>
              <div style={{fontWeight:700}}>{theme}</div>
            </div>
          </div>
        </header>

        <section className="workspace">
          <div className="leftPane">
            {/* Terminal Panel */}
            {active === "terminal" && (
              <div className="panel" style={{minHeight:300}}>
                <div className="panelHeader">
                  <div style={{fontWeight:700}}>Terminal — session</div>
                  <div style={{fontSize:12, color:"var(--muted)"}}>Shell: bash • {fontSize}px</div>
                </div>

                <div className="panelBody">
                  <div className="terminalLines" style={{fontSize:fontSize-1}}>
                    {terminalLines.length === 0 && <div style={{opacity:0.6}}>No output — try `help`</div>}
                    {terminalLines.map((l, i) => <div key={i}>{l}</div>)}
                  </div>

                  <div className="terminalInput">
                    <form style={{display:"flex",width:"100%",gap:8}} onSubmit={(e)=>{
                      e.preventDefault();
                      const v = termInputRef.current.value;
                      runTerminalCommand(v);
                      termInputRef.current.value = "";
                    }}>
                      <div style={{display:"flex", alignItems:"center", fontFamily:"ui-monospace,monospace", color:"var(--accent)"}}>user@termux:$</div>
                      <input ref={termInputRef} placeholder="type command..." />
                      <button className="qbtn" type="submit">Run</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Panel */}
            {active === "editor" && (
              <div className="panel" style={{minHeight:380}}>
                <div className="panelHeader">
                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <div style={{fontWeight:700}}>Editor</div>
                    <div style={{fontSize:12, color:"var(--muted)"}}>Tabs: {editorTabs.length}</div>
                  </div>
                  <div style={{display:"flex", gap:8, alignItems:"center"}}>
                    <button className="qbtn" onClick={()=>openFileInEditor(`script-${Date.now()}.sh`)}>New</button>
                    <button className="qbtn" onClick={()=>pushNotification("All files saved (demo)")}>Save</button>
                  </div>
                </div>

                <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
                  <div className="editorTabs">
                    {editorTabs.map(t => (
                      <div key={t.id} className={`tab ${activeEditor === t.id ? "active":""}`} onClick={()=>setActiveEditor(t.id)}>
                        {t.title} <button style={{marginLeft:8}} onClick={(e)=>{e.stopPropagation(); closeEditorTab(t.id);}}>✕</button>
                      </div>
                    ))}
                  </div>

                  <div className="panelBody" style={{flex:1}}>
                    <div className="editorArea">
                      {editorTabs.map(t => (
                        <div key={t.id} style={{display: activeEditor === t.id ? "block" : "none"}}>
                          <textarea value={t.content} onChange={(e)=>updateEditorContent(t.id, e.target.value)} style={{fontSize}}/>
                        </div>
                      ))}
                      {editorTabs.length === 0 && (<div style={{color:"var(--muted)"}}>No open files. Click New or open a file from terminal: <code>open filename</code></div>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Panel */}
            {active === "files" && (
              <div className="panel" style={{minHeight:320}}>
                <div className="panelHeader">
                  <div style={{fontWeight:700}}>File Manager</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Local & SD</div>
                </div>
                <div className="panelBody">
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                    {["/home/user","/sdcard","/projects","/downloads"].map(p => (
                      <div key={p} className="qbtn" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <div style={{overflow:"hidden", textOverflow:"ellipsis"}}>{p}</div>
                        <div style={{display:"flex", gap:6}}>
                          <button onClick={()=>openFileInEditor(`${p}/example.txt`)}>Open</button>
                          <button onClick={()=>pushNotification(`Copied ${p}`)}>Copy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Packages Panel */}
            {active === "packages" && (
              <div className="panel" style={{minHeight:320}}>
                <div className="panelHeader">
                  <div style={{fontWeight:700}}>Package Manager (demo)</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>install & info</div>
                </div>
                <div className="panelBody">
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                    {["git","nodejs","python","neovim","htop"].map(p => (
                      <div key={p} className="qbtn" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>{p}</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>pushNotification(`Info: ${p}`)}>Info</button>
                          <button onClick={()=>installPackage(p)} style={{background:"var(--accent)", color:"white", border:"none", padding:"8px 10px", borderRadius:8}}>Install</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Plugins Panel */}
            {active === "plugins" && (
              <div className="panel" style={{minHeight:320}}>
                <div className="panelHeader">
                  <div style={{fontWeight:700}}>Plugins & Marketplace</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Extend</div>
                </div>
                <div className="panelBody">
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[
                      {id:"g1",name:"termux-gui",desc:"GUI utilities & toggles"},
                      {id:"g2",name:"autosync",desc:"Device-cloud sync"},
                      {id:"g3",name:"ssh-manager",desc:"SSH profiles & keys"},
                    ].map(p => (
                      <div key={p.id} className="panel" style={{padding:10, borderRadius:10}}>
                        <div style={{fontWeight:700}}>{p.name}</div>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:6}}>{p.desc}</div>
                        <div style={{marginTop:10,display:"flex",gap:8}}>
                          <button onClick={()=>pushNotification(`Details for ${p.name}`)}>Details</button>
                          <button onClick={()=>installPackage(p.name)} style={{background:"var(--accent)",color:"white",border:"none",padding:"8px 10px",borderRadius:8}}>Install</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Map Panel */}
            {active === "map" && (
              <div className="panel" style={{minHeight:320}}>
                <div className="panelHeader">
                  <div style={{fontWeight:700}}>Map & Location</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Placeholder</div>
                </div>
                <div className="panelBody" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}>
                  Map placeholder — integrate Mapbox/Google Maps for live features.
                </div>
              </div>
            )}

            {/* Settings Panel (shortcut) */}
            {active === "settings" && (
              <SettingsModal initial={{theme,fontSize}} onClose={()=>setActive("terminal")} onApply={({theme:t, fontSize:fs})=>{setTheme(t); setFontSize(fs); setActive("terminal");}} />
            )}
          </div>

          <aside className="rightPane">
            <div className="panel">
              <div className="panelHeader">
                <div style={{fontWeight:700}}>Quick Actions</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>tools</div>
              </div>
              <div className="panelBody">
                <div className="quickGrid">
                  <button className="qbtn" onClick={()=>{ setActive("terminal"); setTerminalLines((s)=>[...s, "$ new terminal created (demo)"]); }}>New Terminal</button>
                  <button className="qbtn" onClick={()=>openFileInEditor("notes.md")}>Open Notes</button>
                  <button className="qbtn" onClick={()=>pushNotification("Backup started (demo)")}>Backup</button>
                  <button className="qbtn" onClick={()=>pushNotification("Restore started (demo)")}>Restore</button>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panelHeader">
                <div style={{fontWeight:700}}>Resource Monitor</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>live (demo)</div>
              </div>
              <div className="panelBody resourceBar">
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><div>CPU</div><div>12%</div></div>
                <div className="progress"><div className="progressFill" style={{width:"12%"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><div>Memory</div><div>420MB</div></div>
                <div className="progress"><div className="progressFill" style={{width:"38%"}}/></div>
              </div>
            </div>

            <div className="panel" style={{flex:1}}>
              <div className="panelHeader">
                <div style={{fontWeight:700}}>Notifications</div>
                <div style={{fontSize:12,color:"var(--muted)"}}><button onClick={()=>setNotifications([])} style={{border:0,background:"transparent",cursor:"pointer"}}>Clear</button></div>
              </div>
              <div className="panelBody notifications">
                {notifications.length === 0 && <div style={{color:"var(--muted)"}}>No notifications</div>}
                {notifications.map(n => (
                  <div key={n.id} className="notif">
                    <div style={{fontWeight:700}}>{n.text}</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <footer className="footer">
          <div>Ready • {new Date().toLocaleString()}</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div>Theme: <strong>{theme}</strong></div>
            <div>Font: <strong>{fontSize}px</strong></div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* --------------------------- Settings Modal --------------------------- */
function SettingsModal({ initial = { theme: "light", fontSize: 14 }, onClose = ()=>{}, onApply = ()=>{} }) {
  const [theme, setTheme] = useState(initial.theme || "light");
  const [fontSize, setFontSize] = useState(initial.fontSize || 14);
  const [autosave, setAutosave] = useState(true);
  const [sync, setSync] = useState(false);
  const [passcode, setPasscode] = useState("");

  useEffect(()=>{ setTheme(initial.theme); setFontSize(initial.fontSize); }, [initial]);

  function apply() {
    onApply({ theme, fontSize, autosave, sync, passcode });
  }

  return (
    <div style={{
      position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1200
    }}>
      <div onClick={onClose} style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.35)"}} />
      <div style={{position:"relative", width:860, maxWidth:"94%", background:"var(--card)", borderRadius:12, boxShadow:"0 12px 40px rgba(2,6,23,0.3)", overflow:"hidden"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:16, borderBottom:"1px solid rgba(15,23,42,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><Icon.Settings/><div style={{fontWeight:700}}>Preferences</div></div>
          <div style={{fontSize:13,color:"var(--muted)"}}>Changes saved locally — demo</div>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, padding:16}}>
          <div>
            <div style={{marginBottom:12}}><div style={{fontWeight:700}}>Appearance</div></div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              <button className="qbtn" onClick={()=>setTheme("light")} style={{background: theme==="light" ? "rgba(6,95,70,0.06)" : undefined}}>Light</button>
              <button className="qbtn" onClick={()=>setTheme("dark")} style={{background: theme==="dark" ? "rgba(6,95,70,0.06)" : undefined}}>Dark</button>

              <div style={{marginLeft:"auto", display:"flex", alignItems:"center", gap:8}}>
                Font size
                <input type="range" min="12" max="20" value={fontSize} onChange={(e)=>setFontSize(Number(e.target.value))} />
                <div style={{minWidth:36,textAlign:"center"}}>{fontSize}px</div>
              </div>
            </div>

            <div style={{marginTop:18}}>
              <div style={{fontWeight:700}}>Editor & Terminal</div>
              <div style={{display:"flex",gap:12,marginTop:8}}>
                <label style={{display:"flex", gap:8, alignItems:"center"}}><input type="checkbox" checked={autosave} onChange={(e)=>setAutosave(e.target.checked)}/> Autosave</label>
                <label style={{display:"flex", gap:8, alignItems:"center"}}><input type="checkbox" checked={sync} onChange={(e)=>setSync(e.target.checked)}/> Cloud Sync</label>
              </div>
            </div>

            <div style={{marginTop:18}}>
              <div style={{fontWeight:700}}>Security</div>
              <div style={{marginTop:8}}>
                <div style={{fontSize:13,color:"var(--muted)"}}>Passcode to lock app (demo)</div>
                <input value={passcode} onChange={(e)=>setPasscode(e.target.value)} placeholder="Set passcode" style={{width:"100%",padding:10,marginTop:8,borderRadius:8,border:"1px solid rgba(15,23,42,0.04)"}}/>
                <div style={{fontSize:12,color:"var(--muted)", marginTop:8}}>Enable biometric unlock where supported (platform-specific).</div>
              </div>
            </div>
          </div>

          <aside style={{borderLeft:"1px solid rgba(15,23,42,0.03)", paddingLeft:12}}>
            <div style={{fontWeight:700}}>Shortcuts</div>
            <div style={{fontSize:13,color:"var(--muted)", marginTop:8}}>Customize keyboard shortcuts for quick workflows.</div>

            <div style={{marginTop:16}}>
              <div style={{fontWeight:700}}>Backup</div>
              <div style={{fontSize:13,color:"var(--muted)"}}>Local backups, cloud backups, and scheduled backups. (demo)</div>
              <div style={{display:"flex", gap:8, marginTop:8}}>
                <button className="qbtn" onClick={()=>alert("Run backup (demo)")}>Run Backup</button>
                <button className="qbtn" onClick={()=>alert("Export settings (demo)")}>Export</button>
              </div>
            </div>
          </aside>
        </div>

        <div style={{display:"flex", justifyContent:"space-between", padding:12, borderTop:"1px solid rgba(15,23,42,0.04)"}}>
          <div style={{fontSize:12,color:"var(--muted)"}}>Pro tip: Use fast shortcuts to jump between terminals and editor tabs.</div>
          <div style={{display:"flex", gap:8}}>
            <button className="qbtn" onClick={onClose}>Cancel</button>
            <button className="qbtn" onClick={apply} style={{background:"var(--accent)", color:"white", border:"none"}}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}
