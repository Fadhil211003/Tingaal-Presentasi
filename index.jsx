import { useState, useRef } from "react";

const C = {
  bg: "#181818", s1: "#222222", s2: "#2C2C2C", s3: "#343434",
  bd: "rgba(252,252,252,0.07)", bdH: "rgba(252,252,252,0.15)", bdS: "rgba(252,252,252,0.28)",
  tx: "#FCFCFC", tx2: "rgba(252,252,252,0.52)", tx3: "rgba(252,252,252,0.26)",
  Y: "#F1D709", YBg: "rgba(241,215,9,0.1)", YBd: "rgba(241,215,9,0.35)", YDark: "#181818",
  R: "#E11B22", RBg: "rgba(225,27,34,0.1)", RBd: "rgba(225,27,34,0.3)", RL: "#F07272",
};

const KB = `
RUMUS OPENING (dari ebook "Opening Mahal" by Fadhil Hary Mukti, GenZpede.id):
AIDA: Attention → Interest → Desire → Action
HAPI: Hook → Amplify → Personal → Invite
WHY-WHAT-HOW-WHAT IF: Why → What → How → What If
TAPE opening: Trigger → Analogy → Personal Story → Engagement
WHY-WHAT-HOW (Golden Circle): WHY dulu, baru WHAT, baru HOW
STAR: Situation → Task → Action → Result
PASTOR: Problem → Amplify → Story → Testimony → Offer → Response
FOMO: Ancaman halus → Rasa penasaran → Relevansi
PPP opening: Pertanyaan → Pernyataan → Pemantik
SADAR: Situasi → Aneh → Dampak → Arahkan
RELATE: Relate → Retak → Realita → Relevansi
DIAM: Jeda hening → Isi pikiran audiens → Arahkan → Manfaatkan
KEBIASAAN: Kebiasaan → Konsekuensi → Kesadaran → Kaitan
KATA TERAKHIR: Kalimat umum → Dibalik → Diperdalam → Ditantang
RUMUS BERBICARA (dari ebook "Tinggal Gomong" by Fadhil Hary Mukti):
OREO: Opini → Reason → Example → Opini ulang
OPEO: Opener → Point → Explanation → Outcome
HERO: Hook → Emotion → Reason → Outcome
TAPE data: Tesis → Alasan → Pernyataan data → Example
5B: Butuh → Apa → Bukti → Bagaimana → Bangunkan aksi
1-2-3 Statement: 1 inti + 2 alasan + 3 langkah
PPP laporan: Point → Proof → Path
ETHOS (Kredibilitas): data valid, pengalaman relevan, kutipan pakar
PATHOS (Emosi): cerita personal, analogi menyentuh, itu gue banget
LOGOS (Logika): fakta, angka, cause-effect, perbandingan
CLOSING: selalu ada recap + CTA + kalimat terakhir memorable.
JANGAN tutup dengan Sekian dari saya terima kasih atas perhatiannya.
`.trim();

async function callAI(sys, msg, b64 = null) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: sys, message: msg, pdf: b64 })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #181818; }
  @keyframes scSpin { to { transform: rotate(360deg); } }
  .sc-inp { background: #2C2C2C !important; color: #FCFCFC !important; border: 0.5px solid rgba(252,252,252,0.07) !important; border-radius: 6px !important; transition: border-color 0.15s !important; outline: none !important; }
  .sc-inp:focus { border-color: rgba(241,215,9,0.35) !important; }
  .sc-inp::placeholder { color: rgba(252,252,252,0.26) !important; }
  .sc-btn { cursor: pointer; border: none; font-family: inherit !important; }
  .sc-btn:focus { outline: none !important; }
  .sc-card:hover { background: #343434 !important; border-color: rgba(252,252,252,0.15) !important; }
  .sc-choice:hover { border-color: rgba(241,215,9,0.35) !important; }
`;

function SCMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <path d="M3 3H31V11H11V31H3V3Z" fill="white"/>
      <path d="M49 49H21V41H41V21H49V49Z" fill="white"/>
      <path d="M41 11C19 11 11 17.8 11 26C11 34.2 19 41 41 41V33C23 33 19 30 19 26C19 22 23 19 41 19V11Z" fill="#F1D709"/>
    </svg>
  );
}

function SCWordmark() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <div style={{ background: C.R, display: "inline-block", padding: "2px 9px" }}>
        <span style={{ color: "white", fontWeight: 800, fontSize: "11px", letterSpacing: "0.02em" }}>Storytelling</span>
      </div>
      <div style={{ background: C.Y, display: "inline-block", padding: "2px 9px" }}>
        <span style={{ color: C.YDark, fontWeight: 800, fontSize: "11px", letterSpacing: "0.02em" }}>Corner</span>
      </div>
    </div>
  );
}

function Spin() {
  return <div style={{ width: "30px", height: "30px", border: `2.5px solid ${C.s3}`, borderTop: `2.5px solid ${C.Y}`, borderRadius: "50%", margin: "0 auto", animation: "scSpin 0.7s linear infinite" }} />;
}

function Badge({ type }) {
  const s = { FREE: { bg: "rgba(30,160,70,0.15)", color: "#52C97A" }, PREMIUM: { bg: C.RBg, color: C.RL }, COMPLETE: { bg: C.YBg, color: C.Y } };
  const b = s[type] || s.FREE;
  return <span style={{ fontSize: "9px", fontWeight: 700, padding: "3px 8px", background: b.bg, color: b.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{type}</span>;
}

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="sc-btn" onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 600, background: ok ? "rgba(30,160,70,0.14)" : "transparent", color: ok ? "#52C97A" : C.tx2, border: `0.5px solid ${ok ? "rgba(30,160,70,0.4)" : C.bd}`, transition: "all 0.2s" }}>
      {ok ? "Copied ✓" : "Copy teks"}
    </button>
  );
}

function BackBtn({ onClick }) {
  return <button className="sc-btn" onClick={onClick} style={{ fontSize: "13px", fontWeight: 500, color: C.tx3, background: "none", border: "none", padding: "0 0 20px", display: "flex", alignItems: "center", gap: "5px" }}>← Kembali</button>;
}

function ToolHeader({ badge, icon, title, desc }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <Badge type={badge} />
      <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "10px 0 6px", color: C.tx, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{icon} {title}</h1>
      <p style={{ fontSize: "13px", color: C.tx2, margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button className="sc-btn" onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: "13px", fontSize: "15px", fontWeight: 800, background: !disabled ? C.Y : "transparent", color: !disabled ? C.YDark : C.tx3, border: `1px solid ${!disabled ? C.Y : C.bd}`, transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function ChoiceBtn({ label, sub, selected, onClick }) {
  return (
    <button className={selected ? "sc-btn" : "sc-btn sc-choice"} onClick={onClick}
      style={{ padding: "13px 16px", textAlign: "left", background: selected ? C.YBg : C.s1, border: `${selected ? "1.5px" : "0.5px"} solid ${selected ? C.Y : C.bd}`, transition: "all 0.15s", width: "100%", cursor: "pointer" }}>
      <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: "14px", color: selected ? C.Y : C.tx }}>{label}</p>
      <p style={{ margin: 0, fontSize: "12px", color: selected ? C.Y : C.tx3, opacity: selected ? 0.8 : 1 }}>{sub}</p>
    </button>
  );
}

function TextInput({ label, required, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "11px", fontWeight: 700, color: C.tx2, display: "block", marginBottom: "7px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.Y }}> *</span>}
      </label>
      <input className="sc-inp" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 13px", fontSize: "14px" }} />
    </div>
  );
}

function TextArea({ label, required, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "11px", fontWeight: 700, color: C.tx2, display: "block", marginBottom: "7px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.Y }}> *</span>}
      </label>
      <textarea className="sc-inp" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: "100%", padding: "11px 13px", fontSize: "14px", resize: "vertical", lineHeight: 1.6 }} />
    </div>
  );
}

function LoadingBlock({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px" }}>
      <Spin />
      <p style={{ fontSize: "16px", fontWeight: 700, color: C.tx, margin: "22px 0 6px" }}>Lagi ngeracik...</p>
      <p style={{ fontSize: "13px", color: C.tx2, margin: 0 }}>{msg}</p>
    </div>
  );
}

function ResultToolbar({ text, onReset, label = "Buat lagi" }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "14px" }}>
      <CopyBtn text={text} />
      <button className="sc-btn" onClick={onReset} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 600, background: "transparent", border: `0.5px solid ${C.bd}`, color: C.tx2 }}>{label}</button>
    </div>
  );
}

const TOOLS = [
  { id: "coach", icon: "🎬", title: "Presentation Coach", desc: "Upload slide PDF → script lengkap dari opening sampai closing", badge: "COMPLETE" },
  { id: "hook", icon: "✦", title: "Hook Generator", desc: "Ketik topik → 5 opening mahal berbeda, siap ucap", badge: "FREE" },
  { id: "qa", icon: "🎯", title: "Q&A Simulator", desc: "Input topik → 10 pertanyaan killer + cara jawab", badge: "PREMIUM" },
  { id: "humanizer", icon: "✏️", title: "Script Humanizer", desc: "Paste script kaku → versi natural yang enak didengar", badge: "PREMIUM" },
];

function Home({ onSelect }) {
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 0 40px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ position: "relative", padding: "32px 20px 36px", borderBottom: `0.5px solid ${C.bd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <SCMark size={40} />
          <SCWordmark />
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, lineHeight: 0.95, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
          <span style={{ color: C.tx, display: "block" }}>TINGGAL</span>
          <span style={{ color: C.Y, display: "block" }}>PRESENTASI.</span>
        </h1>
        <p style={{ fontSize: "14px", color: C.tx2, margin: "0 0 28px", lineHeight: 1.6 }}>Tools agar presentasi lo terdengar mahal.</p>
        <div style={{ display: "flex" }}>
          {[["4", "Tools AI"], ["15+", "Rumus"], ["2", "Ebook"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? `0.5px solid ${C.bd}` : "none" }}>
              <div style={{ fontSize: "24px", fontWeight: 900, color: C.Y }}>{n}</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: C.tx3, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: C.tx3, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Pilih Tools</p>
        <div style={{ display: "grid", gap: "8px" }}>
          {TOOLS.map((t) => (
            <button key={t.id} className="sc-btn sc-card" onClick={() => onSelect(t.id)}
              style={{ textAlign: "left", padding: "16px 18px", background: C.s1, border: `0.5px solid ${C.bd}`, cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.15s", width: "100%" }}>
              <div style={{ width: "42px", height: "42px", background: C.s2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.tx }}>{t.title}</span>
                  <Badge type={t.badge} />
                </div>
                <p style={{ fontSize: "12px", color: C.tx3, margin: 0, lineHeight: 1.45 }}>{t.desc}</p>
              </div>
              <span style={{ color: C.Y, flexShrink: 0, fontWeight: 900, fontSize: "18px" }}>→</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
          <SCMark size={18} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: C.tx3 }}>GenZpede.id × Storytelling Corner</span>
        </div>
      </div>
    </div>
  );
}

const HOOK_SYS = `Kamu adalah AI Hook Generator dari GenZpede.id by Fadhil Hary Mukti. Kamu ahli membuat opening presentasi "mahal" menggunakan rumus dari ebook Opening Mahal.\n\n${KB}\n\nBuat TEPAT 5 opening hooks berbeda. Setiap hook pakai rumus yang berbeda.\n\nFormat output PERSIS:\n\nHOOK 1 – [NAMA RUMUS]\n[Script opening 4-5 kalimat yang bisa langsung diucapkan.]\n\nHOOK 2 – [NAMA RUMUS]\n[Script]\n\nHOOK 3 – [NAMA RUMUS]\n[Script]\n\nHOOK 4 – [NAMA RUMUS]\n[Script]\n\nHOOK 5 – [NAMA RUMUS]\n[Script]\n\nATURAN: Setiap hook pakai rumus BERBEDA. Script langsung bisa diucapkan. Bahasa Indonesia natural. JANGAN mulai dengan Halo perkenalkan nama saya atau Assalamualaikum.`;

function HookGenerator({ onBack }) {
  const [topik, setTopik] = useState(""); const [audiens, setAudiens] = useState(""); const [tujuan, setTujuan] = useState("");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const run = async () => {
    if (!topik.trim()) { setErr("Isi topik dulu ya!"); return; }
    setLoading(true); setErr(""); setResult("");
    try { setResult(await callAI(HOOK_SYS, `Topik: ${topik}\nAudiens: ${audiens || "umum"}\nTujuan: ${tujuan || "menginformasi"}`)); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  const hooks = result.split(/\n(?=HOOK \d+ [–-])/).filter(b => b.trim());
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 16px", background: C.bg, minHeight: "100vh" }}>
      <BackBtn onClick={onBack} />
      <ToolHeader badge="FREE" icon="✦" title="Hook Generator" desc="5 opening mahal berbeda — tinggal pilih, tinggal ucapkan" />
      {!result && !loading && (
        <div>
          <TextInput label="Topik presentasi" required value={topik} onChange={setTopik} placeholder="cth: Pentingnya public speaking untuk mahasiswa" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <TextInput label="Audiens" value={audiens} onChange={setAudiens} placeholder="cth: mahasiswa" />
            <TextInput label="Tujuan" value={tujuan} onChange={setTujuan} placeholder="cth: meyakinkan" />
          </div>
          {err && <p style={{ color: C.Y, fontSize: "13px", margin: "0 0 12px" }}>{err}</p>}
          <PrimaryBtn onClick={run} disabled={!topik.trim()}>Generate 5 Hook ✦</PrimaryBtn>
        </div>
      )}
      {loading && <LoadingBlock msg="Milih 5 rumus yang paling cocok..." />}
      {result && !loading && (
        <div>
          <ResultToolbar text={result} onReset={() => setResult("")} />
          <div style={{ display: "grid", gap: "8px" }}>
            {hooks.map((block, i) => {
              const lines = block.trim().split("\n");
              const rumus = lines[0].replace(/HOOK \d+ [–-] /, "");
              const body = lines.slice(1).filter(l => l.trim()).join("\n");
              return (
                <div key={i} style={{ background: C.s1, border: `0.5px solid ${C.bd}`, overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", borderBottom: `0.5px solid ${C.bd}`, display: "flex", alignItems: "center", gap: "8px", background: C.s2 }}>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: C.YDark, background: C.Y, padding: "3px 10px" }}>HOOK {i + 1}</div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: C.tx3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{rumus}</div>
                  </div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, color: C.tx2, margin: 0, padding: "14px 16px", whiteSpace: "pre-wrap" }}>{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const QA_SYS = `Kamu adalah AI Q&A Simulator dari GenZpede.id by Fadhil Hary Mukti.\n\n${KB}\n\nBuat TEPAT 10 pertanyaan + cara jawabnya.\n\nFormat PERSIS:\n\nPERTANYAAN 1 – [MUDAH/SEDANG/SULIT]\n[Pertanyaan]\nCara jawab (Rumus [nama rumus]):\n[Jawaban 3-5 kalimat]\n\n[dst sampai PERTANYAAN 10]\n\nATURAN: Mix 3 mudah, 4 sedang, 3 sulit. Setiap jawaban sebutkan rumusnya. Bahasa Indonesia natural.`;

function QASimulator({ onBack }) {
  const [topik, setTopik] = useState(""); const [konteks, setKonteks] = useState(""); const [level, setLevel] = useState("campuran");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const run = async () => {
    if (!topik.trim()) { setErr("Isi topik dulu!"); return; }
    setLoading(true); setErr(""); setResult("");
    try { setResult(await callAI(QA_SYS, `Topik: ${topik}\nKonteks: ${konteks || "-"}\nLevel audiens: ${level}`)); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  const blocks = result.split(/\n(?=PERTANYAAN \d+ [–-])/).filter(b => b.trim());
  const lvlMap = { MUDAH: { bg: "rgba(30,160,70,0.14)", color: "#52C97A" }, SEDANG: { bg: C.YBg, color: C.Y }, SULIT: { bg: C.RBg, color: C.RL } };
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 16px", background: C.bg, minHeight: "100vh" }}>
      <BackBtn onClick={onBack} />
      <ToolHeader badge="PREMIUM" icon="🎯" title="Q&A Simulator" desc="Gak ada lagi momen blank pas sesi tanya jawab" />
      {!result && !loading && (
        <div>
          <TextInput label="Topik presentasi" required value={topik} onChange={setTopik} placeholder="cth: Strategi marketing digital untuk UMKM" />
          <TextArea label="Konteks singkat (opsional)" value={konteks} onChange={setKonteks} placeholder="cth: Presentasi untuk pitch investor..." rows={3} />
          <div style={{ marginBottom: "18px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: C.tx2, display: "block", marginBottom: "9px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tipe audiens</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[["campuran","Campuran"],["mahasiswa","Mahasiswa"],["profesional","Profesional"],["investor","Investor"]].map(([v,l]) => (
                <button key={v} className="sc-btn" onClick={() => setLevel(v)}
                  style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 600, background: level === v ? C.YBg : "transparent", color: level === v ? C.Y : C.tx2, border: `${level === v ? "1.5px" : "0.5px"} solid ${level === v ? C.Y : C.bd}` }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {err && <p style={{ color: C.Y, fontSize: "13px", margin: "0 0 12px" }}>{err}</p>}
          <PrimaryBtn onClick={run} disabled={!topik.trim()}>Simulate Q&A →</PrimaryBtn>
        </div>
      )}
      {loading && <LoadingBlock msg="Nyiapin pertanyaan dari gampang sampai yang tricky..." />}
      {result && !loading && (
        <div>
          <ResultToolbar text={result} onReset={() => setResult("")} />
          <div style={{ display: "grid", gap: "8px" }}>
            {blocks.map((block, i) => {
              const lines = block.trim().split("\n");
              const match = lines[0].match(/PERTANYAAN (\d+) [–-] (MUDAH|SEDANG|SULIT)/);
              const num = match ? match[1] : i + 1;
              const lvl = match ? match[2] : "SEDANG";
              const ls = lvlMap[lvl] || lvlMap.SEDANG;
              const rest = lines.slice(1).filter(l => l.trim());
              const pertanyaan = rest[0] || "";
              const caraIdx = rest.findIndex(l => l.startsWith("Cara jawab"));
              const cara = caraIdx >= 0 ? rest[caraIdx] : "";
              const jawaban = caraIdx >= 0 ? rest.slice(caraIdx + 1).join("\n") : rest.slice(1).join("\n");
              return (
                <div key={i} style={{ background: C.s1, border: `0.5px solid ${C.bd}`, overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", borderBottom: `0.5px solid ${C.bd}`, display: "flex", gap: "8px", background: C.s2 }}>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: C.YDark, background: C.Y, padding: "3px 9px" }}>#{num}</div>
                    <div style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", background: ls.bg, color: ls.color }}>{lvl}</div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: C.tx, margin: "0 0 9px", lineHeight: 1.5 }}>{pertanyaan}</p>
                    {cara && <p style={{ fontSize: "11px", fontWeight: 600, color: C.Y, margin: "0 0 6px" }}>{cara}</p>}
                    <p style={{ fontSize: "13px", lineHeight: 1.75, color: C.tx2, margin: 0, whiteSpace: "pre-wrap" }}>{jawaban}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const HUM_SYS = `Kamu adalah AI Script Humanizer dari GenZpede.id by Fadhil Hary Mukti.\n\n${KB}\n\nTransformasi script yang diberikan. Hilangkan kalimat robot, tambahkan transisi smooth, sisipkan Ethos/Pathos/Logos, sesuaikan gaya.\n\nFormat output PERSIS:\n\nVERSI HUMANIZED\n[Script yang sudah di-transform. Langsung script-nya, siap diucapkan.]\n\n---\n\nYANG DIUBAH\n• [Perubahan 1]\n• [Perubahan 2]\n• [Perubahan 3]\n• [Perubahan 4]\n• [Perubahan 5 atau lebih]`;

function ScriptHumanizer({ onBack }) {
  const [script, setScript] = useState(""); const [gaya, setGaya] = useState("santai");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const GAYAS = { santai: "santai dan relate, Gen Z friendly", formal: "profesional tapi engaging", inspiratif: "inspiratif dan emotif", tegas: "tegas dan direct, no basa-basi" };
  const run = async () => {
    if (!script.trim()) { setErr("Paste script lo dulu!"); return; }
    setLoading(true); setErr(""); setResult("");
    try { setResult(await callAI(HUM_SYS, `Gaya bicara: ${GAYAS[gaya]}\n\nScript asli:\n\n${script}`)); }
    catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  const parts = result.split(/\n(?=YANG DIUBAH)/);
  const humanized = (parts[0] || "").replace(/^VERSI HUMANIZED\n/, "").trim();
  const changes = parts[1] ? parts[1].replace(/^YANG DIUBAH\n/, "").trim() : "";
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 16px", background: C.bg, minHeight: "100vh" }}>
      <BackBtn onClick={onBack} />
      <ToolHeader badge="PREMIUM" icon="✏️" title="Script Humanizer" desc="Bunuh kaku. Sampai script lo terdengar mahal." />
      {!result && !loading && (
        <div>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: C.tx2, display: "block", marginBottom: "9px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Gaya bicara</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[["santai","Santai"],["formal","Formal"],["inspiratif","Inspiratif"],["tegas","Tegas"]].map(([v,l]) => (
                <button key={v} className="sc-btn" onClick={() => setGaya(v)}
                  style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 600, background: gaya === v ? C.YBg : "transparent", color: gaya === v ? C.Y : C.tx2, border: `${gaya === v ? "1.5px" : "0.5px"} solid ${gaya === v ? C.Y : C.bd}` }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <TextArea label="Script yang mau di-humanize" required value={script} onChange={setScript} placeholder="Paste script presentasi lo di sini..." rows={9} />
          {err && <p style={{ color: C.Y, fontSize: "13px", margin: "0 0 12px" }}>{err}</p>}
          <PrimaryBtn onClick={run} disabled={!script.trim()}>Humanize Script ✏️</PrimaryBtn>
        </div>
      )}
      {loading && <LoadingBlock msg="Lagi nge-humanize script lo..." />}
      {result && !loading && (
        <div>
          <ResultToolbar text={humanized} onReset={() => setResult("")} />
          <div style={{ background: C.s1, border: `0.5px solid ${C.bd}`, overflow: "hidden", marginBottom: "8px" }}>
            <div style={{ padding: "8px 14px", borderBottom: `0.5px solid ${C.bd}`, background: C.s2, display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "7px", height: "7px", background: "#52C97A" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: C.tx3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Versi Humanized</span>
            </div>
            <div style={{ padding: "18px", whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: 1.85, color: C.tx2 }}>{humanized}</div>
          </div>
          {changes && (
            <div style={{ background: C.s1, border: `0.5px solid ${C.bd}`, overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: `0.5px solid ${C.bd}`, background: C.s2 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: C.tx3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Yang diubah & kenapa</span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                {changes.split("\n").filter(l => l.trim()).map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ color: C.Y, flexShrink: 0, fontWeight: 900 }}>•</span>
                    <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: C.tx2 }}>{line.replace(/^•\s*/, "")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CQ = [
  { id: "audience", label: "Siapa audiens presentasimu?", opts: [["Teman / Mahasiswa (setara, santai)","Teman / Mahasiswa","Setara, santai"],["Dosen / Atasan (formal, butuh kredibilitas)","Dosen / Atasan","Formal, kredibel"],["Profesional / Corporate","Profesional / Corporate","Bisnis, results-oriented"],["Umum / Campuran","Umum / Campuran","Beragam latar belakang"]] },
  { id: "purpose", label: "Apa tujuan utama presentasimu?", opts: [["Menginformasi (biar audiens ngerti & paham)","Menginformasi","Biar audiens ngerti & paham"],["Meyakinkan / Persuasi","Meyakinkan","Biar audiens setuju & percaya"],["Menjual / Pitching","Pitching","Biar audiens beli atau dukung"],["Menginspirasi","Menginspirasi","Biar audiens tergerak & berubah"]] },
  { id: "duration", label: "Berapa lama durasi presentasi?", opts: [["Di bawah 5 menit","< 5 menit","Super singkat, harus nendang"],["5 – 15 menit","5-15 menit","Standar presentasi"],["15 – 30 menit","15-30 menit","Ada ruang storytelling"],["Lebih dari 30 menit","> 30 menit","Seminar / workshop"]] },
  { id: "style", label: "Gaya bicara yang kamu mau?", opts: [["Formal & Profesional (runtut, sopan, kredibel)","Formal","Runtut, sopan, kredibel"],["Santai & Relate (Gen Z friendly)","Santai","Ngobrol, Gen Z friendly"],["Inspiratif & Emotif","Inspiratif","Bikin hati tergerak"],["Tegas & Direct (no basa-basi)","Tegas","To the point"]] },
  { id: "outcome", label: "Setelah presentasi, audiens harus...", opts: [["Ngerti & Paham topiknya","Paham",'"Oh jadi gitu ya"'],["Percaya & Setuju dengan argumen lo","Percaya",'"Masuk akal, gue setuju"'],["Tergerak untuk ambil aksi","Aksi",'"Gue mau coba ini"'],["Terkesan dan ingat presentasi lo lama","Terkesan",'"Terbaik yang pernah gue denger"']] },
];

const COACH_SYS = `Kamu adalah AI Presentation Coach dari GenZpede.id by Fadhil Hary Mukti.\n\n${KB}\n\nBaca slide PDF. Buat panduan presentasi LENGKAP. Format output PERSIS:\n\n🎬 OPENING MAHAL\nRumus: [nama rumus]\nAlasan: [kenapa rumus ini cocok, 1 kalimat]\n\n[Script opening 4-6 kalimat. Powerful, natural. JANGAN mulai dengan perkenalan biasa.]\n\n---\n\n📋 SCRIPT PER SLIDE\n\nSlide 1 – [judul]\n[Narasi 2-4 kalimat]\nTransisi: "[kalimat smooth ke slide berikutnya]"\n\n[Lanjutkan untuk SETIAP slide]\n\n---\n\n⚡ ETHOS, PATHOS, LOGOS\n\nEthos – Slide [no]: [kalimat membangun kredibilitas]\nPathos – Slide [no]: [momen emosional + contoh kalimat]\nLogos – Slide [no]: [cara menyampaikan data dengan kuat]\n\n---\n\n📖 MOMEN STORYTELLING\n\nWaktu terbaik: Slide [no] — [alasannya]\nTemplate: "[Kalimat pembuka]\n[Situasi — 1-2 kalimat]\n[Konflik — 1 kalimat]\n[Pelajaran — 1 kalimat]"\n\n---\n\n🎯 CLOSING BERKESAN\n\n[Script penutup 4-5 kalimat. Recap + CTA + kalimat memorable. BUKAN Sekian terima kasih.]\n\n---\n\n💡 3 TIPS SPESIFIK\n\n1. [Tip spesifik]\n2. [Tip kedua]\n3. [Tip ketiga]`;

function PresentationCoach({ onBack }) {
  const [step, setStep] = useState("upload");
  const [pdf, setPdf] = useState(null); const [b64, setB64] = useState(null);
  const [ans, setAns] = useState({}); const [qi, setQi] = useState(0);
  const [result, setResult] = useState(""); const [err, setErr] = useState("");
  const fRef = useRef();
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f || f.type !== "application/pdf") { setErr("Harus file PDF ya!"); return; }
    if (f.size > 15 * 1024 * 1024) { setErr("Maks 15MB ya!"); return; }
    setPdf(f); setErr("");
    const r = new FileReader(); r.onload = (ev) => setB64(ev.target.result.split(",")[1]); r.readAsDataURL(f);
  };
  const pick = (val) => { setAns(p => ({ ...p, [CQ[qi].id]: val })); if (qi < CQ.length - 1) setTimeout(() => setQi(n => n + 1), 200); };
  const allDone = CQ.every(q => ans[q.id]);
  const gen = async () => {
    setStep("loading");
    try {
      const sum = CQ.map(q => `${q.label} → ${ans[q.id]}`).join("\n");
      setResult(await callAI(COACH_SYS, `Slide presentasi terlampir.\n\nPreferensi:\n${sum}\n\nBuat panduan lengkap.`, b64));
      setStep("result");
    } catch (e) { setErr(e.message); setStep("questions"); }
  };
  const reset = () => { setStep("upload"); setPdf(null); setB64(null); setAns({}); setQi(0); setResult(""); setErr(""); };
  const sn = { upload: 0, questions: 1, loading: 2, result: 2 }[step] || 0;
  const renderResult = (text) => text.split("\n").map((line, i) => {
    if (/^[🎬📋⚡📖🎯💡]/.test(line)) return <h2 key={i} style={{ fontSize: "15px", fontWeight: 800, margin: i === 0 ? "0 0 10px" : "24px 0 10px", color: C.tx }}>{line}</h2>;
    if (/^(Rumus|Alasan|Waktu terbaik|Template):/.test(line)) { const [k,...v] = line.split(":"); return <p key={i} style={{ margin: "3px 0", fontSize: "13px" }}><span style={{ fontWeight: 700, color: C.tx2 }}>{k}:</span><span style={{ color: C.tx3 }}>{v.join(":")}</span></p>; }
    if (/^Slide \d+/.test(line)) return <h3 key={i} style={{ fontSize: "13px", fontWeight: 700, margin: "16px 0 5px", color: C.Y, borderLeft: `2px solid ${C.Y}`, paddingLeft: "10px" }}>{line}</h3>;
    if (/^Transisi:/.test(line)) return <p key={i} style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(90,170,230,0.7)", fontStyle: "italic" }}>{line}</p>;
    if (/^(Ethos|Pathos|Logos) [–-]/.test(line)) return <p key={i} style={{ margin: "6px 0", fontSize: "13px" }}><span style={{ fontWeight: 700, color: C.tx2 }}>{line.split(/[–-]/)[0].trim()}</span><span style={{ color: C.tx3 }}>{" – " + line.split(/[–-]/).slice(1).join("–")}</span></p>;
    if (/^---$/.test(line)) return <div key={i} style={{ height: "0.5px", background: C.bd, margin: "20px 0" }} />;
    if (/^\d+\./.test(line)) return <p key={i} style={{ margin: "6px 0", fontSize: "13px", color: C.tx3 }}>{line}</p>;
    if (line.startsWith('"')) return <p key={i} style={{ margin: "4px 0", fontSize: "14px", lineHeight: 1.75, color: C.tx2, background: C.YBg, padding: "4px 12px", borderLeft: `2px solid ${C.Y}` }}>{line}</p>;
    if (line === "") return <br key={i} />;
    return <p key={i} style={{ margin: "3px 0", fontSize: "13px", lineHeight: 1.75, color: C.tx3 }}>{line}</p>;
  });
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 16px", background: C.bg, minHeight: "100vh" }}>
      <BackBtn onClick={step === "result" ? reset : onBack} />
      <ToolHeader badge="COMPLETE" icon="🎬" title="Presentation Coach" desc="Upload slide → script lengkap yang mahal dari opening sampai closing" />
      {step !== "result" && step !== "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "28px" }}>
          {["Upload","Preferensi","Generate"].map((l, i) => {
            const done = i < sn; const active = i === sn;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, background: done ? C.Y : active ? C.s2 : "transparent", border: done ? "none" : active ? `1px solid ${C.YBd}` : `0.5px solid ${C.bd}`, color: done ? C.YDark : active ? C.Y : C.tx3 }}>{done ? "✓" : i + 1}</div>
                  <span style={{ fontSize: "12px", fontWeight: active ? 700 : 400, color: active ? C.tx2 : C.tx3 }}>{l}</span>
                </div>
                {i < 2 && <div style={{ width: "20px", height: "0.5px", background: C.bd, margin: "0 6px" }} />}
              </div>
            );
          })}
        </div>
      )}
      {step === "upload" && (
        <div>
          <div onClick={() => fRef.current?.click()} style={{ border: `1px dashed ${pdf ? C.YBd : C.bd}`, padding: "40px 20px", textAlign: "center", cursor: "pointer", background: pdf ? C.YBg : C.s1 }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>📄</div>
            {pdf ? <><p style={{ fontWeight: 700, margin: "0 0 3px", color: C.Y }}>{pdf.name}</p><p style={{ fontSize: "12px", color: C.Y, margin: 0, opacity: 0.7 }}>{(pdf.size / 1024).toFixed(0)} KB · Siap dianalisis</p></>
              : <><p style={{ fontWeight: 700, margin: "0 0 3px", color: C.tx2 }}>Upload slide presentasi (PDF)</p><p style={{ fontSize: "12px", color: C.tx3, margin: 0 }}>Klik untuk pilih file · Maks 15MB</p></>}
          </div>
          <input ref={fRef} type="file" accept=".pdf" onChange={onFile} style={{ display: "none" }} />
          {err && <p style={{ color: C.Y, fontSize: "13px", margin: "8px 0 0" }}>{err}</p>}
          <div style={{ marginTop: "14px" }}><PrimaryBtn onClick={() => setStep("questions")} disabled={!pdf}>Lanjut ke Preferensi →</PrimaryBtn></div>
        </div>
      )}
      {step === "questions" && (
        <div>
          <div style={{ height: "3px", background: C.s2, marginBottom: "24px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((qi + 1) / CQ.length) * 100}%`, background: C.Y, transition: "width 0.3s ease" }} />
          </div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: C.tx3, margin: "0 0 7px", letterSpacing: "0.08em" }}>{qi + 1} / {CQ.length}</p>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 18px", color: C.tx }}>{CQ[qi].label}</h2>
          <div style={{ display: "grid", gap: "8px" }}>
            {CQ[qi].opts.map(([val, label, sub]) => <ChoiceBtn key={val} label={label} sub={sub} selected={ans[CQ[qi].id] === val} onClick={() => pick(val)} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "8px" }}>
            <button className="sc-btn" onClick={() => qi > 0 ? setQi(n => n - 1) : setStep("upload")} style={{ padding: "10px 16px", background: "transparent", border: `0.5px solid ${C.bd}`, fontSize: "13px", fontWeight: 600, color: C.tx2 }}>← Kembali</button>
            {qi < CQ.length - 1
              ? <button className="sc-btn" onClick={() => setQi(n => n + 1)} disabled={!ans[CQ[qi].id]} style={{ padding: "10px 20px", background: "transparent", border: `0.5px solid ${C.bd}`, fontSize: "13px", fontWeight: 600, color: ans[CQ[qi].id] ? C.tx2 : C.tx3 }}>Lanjut →</button>
              : <button className="sc-btn" onClick={gen} disabled={!allDone} style={{ padding: "10px 24px", background: allDone ? C.Y : "transparent", color: allDone ? C.YDark : C.tx3, border: `0.5px solid ${allDone ? C.Y : C.bd}`, fontSize: "14px", fontWeight: 800 }}>Generate ✦</button>}
          </div>
          {err && <p style={{ color: C.Y, fontSize: "13px", marginTop: "10px" }}>{err}</p>}
        </div>
      )}
      {step === "loading" && <LoadingBlock msg="Baca slide lo + pilih rumus yang paling cocok..." />}
      {step === "result" && result && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {CQ.map(q => ans[q.id] && <span key={q.id} style={{ fontSize: "10px", fontWeight: 600, padding: "2px 9px", background: C.s2, border: `0.5px solid ${C.bd}`, color: C.tx3 }}>{ans[q.id].split(" (")[0]}</span>)}
          </div>
          <ResultToolbar text={result} onReset={reset} label="Upload slide baru" />
          <div style={{ background: C.s1, border: `0.5px solid ${C.bd}`, padding: "20px 22px" }}>{renderResult(result)}</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tool, setTool] = useState("home");
  return (
    <>
      <style>{GCSS}</style>
      {tool === "home" && <Home onSelect={setTool} />}
      {tool === "hook" && <HookGenerator onBack={() => setTool("home")} />}
      {tool === "qa" && <QASimulator onBack={() => setTool("home")} />}
      {tool === "humanizer" && <ScriptHumanizer onBack={() => setTool("home")} />}
      {tool === "coach" && <PresentationCoach onBack={() => setTool("home")} />}
    </>
  );
}
