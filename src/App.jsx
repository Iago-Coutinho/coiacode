import { useState, useEffect, useCallback } from "react";

/* ════════════════════════════════════════════
   1. CONSTANTS & COURSE DATA
   ════════════════════════════════════════════ */

const XP_PER_LEVEL = 500;
const LEVEL_SCALE = 1.15;

function xpForLevel(level) {
  return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALE, level - 1));
}

function getLevelFromXP(totalXP) {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, currentXP: remaining, needed: xpForLevel(level) };
}

const COURSES = [
  {
    id: "ed-poo-python",
    title: "Estrutura de Dados + POO",
    lang: "Python",
    icon: "🐍",
    color: "#3B82F6",
    gradient: "from-blue-600 to-cyan-500",
    description: "Classes, herança, listas encadeadas, pilhas e filas com orientação a objetos.",
    refs: "Goodrich, Ramalho",
    modules: [
      { id: "mod-1", title: "Classes e Objetos", lessons: [
        { id: "l1", title: "Fundamentos de POO", type: "theory", xp: 50 },
        { id: "l2", title: "Atributos e Métodos", type: "practice", xp: 75 },
        { id: "l3", title: "Encapsulamento", type: "practice", xp: 75 },
      ]},
      { id: "mod-2", title: "Herança e Polimorfismo", lessons: [
        { id: "l1", title: "Herança Simples e Múltipla", type: "theory", xp: 50 },
        { id: "l2", title: "Polimorfismo e Duck Typing", type: "practice", xp: 75 },
        { id: "l3", title: "Classes Abstratas (ABC)", type: "practice", xp: 100 },
      ]},
      { id: "mod-3", title: "Estruturas Lineares", lessons: [
        { id: "l1", title: "Listas Encadeadas", type: "theory", xp: 50 },
        { id: "l2", title: "Pilhas (Stacks)", type: "practice", xp: 75 },
        { id: "l3", title: "Filas e Deques", type: "practice", xp: 100 },
      ]},
    ],
  },
  {
    id: "ed-poo-cpp",
    title: "Estrutura de Dados + POO",
    lang: "C++",
    icon: "⚡",
    color: "#8B5CF6",
    gradient: "from-violet-600 to-purple-500",
    description: "Ponteiros, alocação dinâmica, herança virtual, templates e estruturas com memória manual.",
    refs: "Stroustrup, Deitel",
    modules: [
      { id: "mod-1", title: "Classes e Memória", lessons: [
        { id: "l1", title: "Construtores e Destrutores", type: "theory", xp: 50 },
        { id: "l2", title: "Ponteiros e Referências", type: "practice", xp: 75 },
        { id: "l3", title: "Alocação Dinâmica", type: "practice", xp: 100 },
      ]},
      { id: "mod-2", title: "Herança e Templates", lessons: [
        { id: "l1", title: "Herança e Virtual", type: "theory", xp: 50 },
        { id: "l2", title: "Polimorfismo com vtable", type: "practice", xp: 75 },
        { id: "l3", title: "Templates de Classe", type: "practice", xp: 100 },
      ]},
      { id: "mod-3", title: "Estruturas Lineares", lessons: [
        { id: "l1", title: "Listas com Ponteiros", type: "theory", xp: 50 },
        { id: "l2", title: "Pilhas (Array e Lista)", type: "practice", xp: 75 },
        { id: "l3", title: "Filas e Priority Queue", type: "practice", xp: 100 },
      ]},
    ],
  },
  {
    id: "algo-python",
    title: "Algoritmos",
    lang: "Python",
    icon: "🧠",
    color: "#10B981",
    gradient: "from-emerald-600 to-teal-500",
    description: "Busca, ordenação, recursão, programação dinâmica e grafos.",
    refs: "CLRS, Bhargava",
    modules: [
      { id: "mod-1", title: "Busca e Ordenação", lessons: [
        { id: "l1", title: "Busca Linear e Binária", type: "theory", xp: 50 },
        { id: "l2", title: "Bubble e Selection Sort", type: "practice", xp: 75 },
        { id: "l3", title: "Merge Sort", type: "practice", xp: 100 },
      ]},
      { id: "mod-2", title: "Recursão e Divisão e Conquista", lessons: [
        { id: "l1", title: "Fundamentos de Recursão", type: "theory", xp: 50 },
        { id: "l2", title: "Divisão e Conquista", type: "practice", xp: 75 },
        { id: "l3", title: "Programação Dinâmica Intro", type: "practice", xp: 100 },
      ]},
      { id: "mod-3", title: "Grafos", lessons: [
        { id: "l1", title: "Representação de Grafos", type: "theory", xp: 50 },
        { id: "l2", title: "BFS e DFS", type: "practice", xp: 75 },
        { id: "l3", title: "Dijkstra", type: "practice", xp: 100 },
      ]},
    ],
  },
  {
    id: "algo-cpp",
    title: "Algoritmos",
    lang: "C++",
    icon: "🔮",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-500",
    description: "Implementações eficientes com STL, ponteiros, análise assintótica e grafos.",
    refs: "Sedgewick, Skiena",
    modules: [
      { id: "mod-1", title: "Busca e Ordenação", lessons: [
        { id: "l1", title: "Busca com Ponteiros", type: "theory", xp: 50 },
        { id: "l2", title: "Selection e Insertion Sort", type: "practice", xp: 75 },
        { id: "l3", title: "Quick Sort", type: "practice", xp: 100 },
      ]},
      { id: "mod-2", title: "Recursão e Complexidade", lessons: [
        { id: "l1", title: "Recursão e Stack Frames", type: "theory", xp: 50 },
        { id: "l2", title: "Análise Assintótica", type: "practice", xp: 75 },
        { id: "l3", title: "Divisão e Conquista", type: "practice", xp: 100 },
      ]},
      { id: "mod-3", title: "Grafos", lessons: [
        { id: "l1", title: "Representação com Structs", type: "theory", xp: 50 },
        { id: "l2", title: "BFS/DFS com STL", type: "practice", xp: 75 },
        { id: "l3", title: "Shortest Path", type: "practice", xp: 100 },
      ]},
    ],
  },
];

/* ════════════════════════════════════════════
   2. STORAGE LAYER
   ════════════════════════════════════════════ */

const STORAGE_KEY = "coiacode-progress";

const DEFAULT_PROGRESS = {
  xp: 0,
  completedLessons: [],
  badges: [],
  streak: { current: 0, lastDate: null },
};

async function loadProgress() {
  try {
    const raw = localStorage.getItem("coiacode-progress");
    return raw ? JSON.parse(raw) : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

async function saveProgress(progress) {
  try {
    localStorage.setItem("coiacode-progress", JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

/* ════════════════════════════════════════════
   3. STREAK LOGIC
   ════════════════════════════════════════════ */

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(streak) {
  const today = todayStr();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  if (streak.lastDate === yStr) {
    return { current: streak.current + 1, lastDate: today };
  }
  return { current: 1, lastDate: today };
}

/* ════════════════════════════════════════════
   4. HELPER: COURSE STATS
   ════════════════════════════════════════════ */

function getCourseStats(course, completedLessons) {
  let total = 0, done = 0;
  course.modules.forEach(m => m.lessons.forEach(l => {
    total++;
    if (completedLessons.includes(`${course.id}:${m.id}:${l.id}`)) done++;
  }));
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getModuleStats(course, mod, completedLessons) {
  let total = 0, done = 0;
  mod.lessons.forEach(l => {
    total++;
    if (completedLessons.includes(`${course.id}:${mod.id}:${l.id}`)) done++;
  });
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function isLessonComplete(courseId, modId, lessonId, completedLessons) {
  return completedLessons.includes(`${courseId}:${modId}:${lessonId}`);
}

/* ════════════════════════════════════════════
   5. BADGE DEFINITIONS
   ════════════════════════════════════════════ */

const BADGE_DEFS = [
  { id: "first-lesson", icon: "🎯", title: "Primeira Lição", desc: "Complete sua primeira lição", check: (p) => p.completedLessons.length >= 1 },
  { id: "streak-3", icon: "🔥", title: "3 Dias Seguidos", desc: "Mantenha um streak de 3 dias", check: (p) => p.streak.current >= 3 },
  { id: "streak-7", icon: "💎", title: "7 Dias Seguidos", desc: "Mantenha um streak de 7 dias", check: (p) => p.streak.current >= 7 },
  { id: "xp-500", icon: "⭐", title: "500 XP", desc: "Acumule 500 XP", check: (p) => p.xp >= 500 },
  { id: "xp-2000", icon: "🏆", title: "2000 XP", desc: "Acumule 2000 XP", check: (p) => p.xp >= 2000 },
  { id: "module-complete", icon: "📦", title: "Módulo Completo", desc: "Complete todos as lições de um módulo", check: (p) => {
    return COURSES.some(c => c.modules.some(m => {
      const stats = getModuleStats(c, m, p.completedLessons);
      return stats.done === stats.total && stats.total > 0;
    }));
  }},
  { id: "course-complete", icon: "👑", title: "Curso Completo", desc: "Complete um curso inteiro", check: (p) => {
    return COURSES.some(c => {
      const stats = getCourseStats(c, p.completedLessons);
      return stats.done === stats.total && stats.total > 0;
    });
  }},
];

/* ════════════════════════════════════════════
   6. STYLES (injected via style tag)
   ════════════════════════════════════════════ */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700;800&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --bg-card: #1a1a2e;
    --bg-card-hover: #22223a;
    --border: #2a2a3e;
    --text-primary: #e8e8f0;
    --text-secondary: #8888a8;
    --text-muted: #55556a;
    --accent-blue: #3B82F6;
    --accent-green: #10B981;
    --accent-purple: #8B5CF6;
    --accent-amber: #F59E0B;
    --accent-pink: #EC4899;
  }

  body { background: var(--bg-primary); color: var(--text-primary); font-family: 'Inter', sans-serif; }

  .fade-in { animation: fadeIn 0.4s ease-out; }
  .slide-up { animation: slideUp 0.5s ease-out; }
  .scale-in { animation: scaleIn 0.3s ease-out; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 20px rgba(59,130,246,0.6); } }

  .glow-blue { animation: glow 2s ease-in-out infinite; }

  .card-hover { transition: all 0.3s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

  .progress-bar-fill { transition: width 0.8s ease-out; }

  .mono { font-family: 'JetBrains Mono', monospace; }

  .btn-primary {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    color: white; border: none; padding: 10px 24px; border-radius: 10px;
    font-weight: 600; cursor: pointer; transition: all 0.2s ease;
    font-size: 14px;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }

  .btn-ghost {
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--border); padding: 8px 18px; border-radius: 8px;
    cursor: pointer; transition: all 0.2s ease; font-size: 13px;
  }
  .btn-ghost:hover { color: var(--text-primary); border-color: var(--text-secondary); background: var(--bg-card); }

  .tag {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  }
`;

/* ════════════════════════════════════════════
   7. SUB-COMPONENTS
   ════════════════════════════════════════════ */

function Header({ progress, onNavigate }) {
  const { level, currentXP, needed } = getLevelFromXP(progress.xp);
  const pct = Math.round((currentXP / needed) * 100);

  return (
    <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onNavigate("dashboard")}>
        <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CoiaCode
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: progress.streak.current > 0 ? "#F59E0B" : "var(--text-muted)" }}>
            {progress.streak.current}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
            {level}
          </div>
          <div style={{ width: 120 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)", marginBottom: 3 }}>
              <span>{currentXP} XP</span><span>{needed} XP</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--bg-card)", overflow: "hidden" }}>
              <div className="progress-bar-fill" style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #3B82F6, #8B5CF6)", width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ progress, onSelectCourse, onOpenBadges }) {
  const totalLessons = COURSES.reduce((acc, c) => acc + c.modules.reduce((a2, m) => a2 + m.lessons.length, 0), 0);
  const completedCount = progress.completedLessons.length;
  const earnedBadges = BADGE_DEFS.filter(b => b.check(progress));

  return (
    <div className="fade-in" style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Olá, dev <span style={{ display: "inline-block", animation: "pulse 2s infinite" }}>👋</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          {completedCount === 0 ? "Escolha um curso para começar sua jornada." : `${completedCount}/${totalLessons} lições concluídas. Continue aprendendo!`}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
        <StatCard label="Total XP" value={progress.xp} icon="⚡" />
        <StatCard label="Lições" value={`${completedCount}/${totalLessons}`} icon="📚" />
        <div onClick={onOpenBadges} style={{ cursor: "pointer" }}>
          <StatCard label="Badges" value={`${earnedBadges.length}/${BADGE_DEFS.length}`} icon="🏅" />
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cursos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {COURSES.map((course, i) => (
          <CourseCard key={course.id} course={course} progress={progress} index={i} onClick={() => onSelectCourse(course)} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function CourseCard({ course, progress, index, onClick }) {
  const stats = getCourseStats(course, progress.completedLessons);
  return (
    <div className="card-hover" onClick={onClick} style={{
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
      padding: 22, cursor: "pointer", animationDelay: `${index * 0.1}s`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>{course.icon}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{course.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{course.title}</div>
          <span className="tag mono" style={{ background: `${course.color}22`, color: course.color }}>{course.lang}</span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{course.description}</p>
      <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
        <span>{stats.done}/{stats.total} lições</span><span>{stats.percent}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "var(--bg-primary)", overflow: "hidden" }}>
        <div className="progress-bar-fill" style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${course.color}, ${course.color}88)`, width: `${stats.percent}%` }} />
      </div>
      <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>Ref: {course.refs}</div>
    </div>
  );
}

function CourseView({ course, progress, onSelectModule, onBack }) {
  return (
    <div className="fade-in" style={{ padding: "32px 24px", maxWidth: 720, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Voltar</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <span style={{ fontSize: 42 }}>{course.icon}</span>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{course.title}</h1>
          <span className="tag mono" style={{ background: `${course.color}22`, color: course.color }}>{course.lang}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {course.modules.map((mod, i) => {
          const stats = getModuleStats(course, mod, progress.completedLessons);
          const isComplete = stats.done === stats.total;
          return (
            <div key={mod.id} className="card-hover" onClick={() => onSelectModule(mod)} style={{
              background: "var(--bg-card)", border: `1px solid ${isComplete ? course.color + "44" : "var(--border)"}`,
              borderRadius: 14, padding: 20, cursor: "pointer", position: "relative",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isComplete ? `${course.color}22` : "var(--bg-primary)", fontWeight: 800, fontSize: 16,
                    color: isComplete ? course.color : "var(--text-secondary)", border: `1px solid ${isComplete ? course.color + "44" : "var(--border)"}`,
                  }}>
                    {isComplete ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{mod.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{mod.lessons.length} lições · {stats.done} concluídas</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isComplete ? course.color : "var(--text-muted)" }}>{stats.percent}%</div>
              </div>
              <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: "var(--bg-primary)", overflow: "hidden" }}>
                <div className="progress-bar-fill" style={{ height: "100%", borderRadius: 2, background: course.color, width: `${stats.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModuleView({ course, module: mod, progress, onSelectLesson, onBack }) {
  return (
    <div className="fade-in" style={{ padding: "32px 24px", maxWidth: 720, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Voltar</button>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{mod.title}</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 28 }}>{course.title} · {course.lang}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mod.lessons.map((lesson, i) => {
          const complete = isLessonComplete(course.id, mod.id, lesson.id, progress.completedLessons);
          return (
            <div key={lesson.id} className="card-hover" onClick={() => onSelectLesson(lesson)} style={{
              background: "var(--bg-card)", border: `1px solid ${complete ? "var(--accent-green)33" : "var(--border)"}`,
              borderRadius: 12, padding: "16px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: complete ? "var(--accent-green)18" : "var(--bg-primary)",
                  color: complete ? "var(--accent-green)" : "var(--text-muted)",
                  fontWeight: 700, fontSize: 13, border: `1px solid ${complete ? "var(--accent-green)33" : "var(--border)"}`,
                }}>
                  {complete ? "✓" : i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{lesson.title}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span className="tag" style={{
                      background: lesson.type === "theory" ? "#3B82F622" : "#10B98122",
                      color: lesson.type === "theory" ? "#3B82F6" : "#10B981",
                    }}>
                      {lesson.type === "theory" ? "📖 Teoria" : "💻 Prática"}
                    </span>
                    <span className="tag" style={{ background: "#F59E0B22", color: "#F59E0B" }}>+{lesson.xp} XP</span>
                  </div>
                </div>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonView({ course, module: mod, lesson, progress, onBack }) {
  const complete = isLessonComplete(course.id, mod.id, lesson.id, progress.completedLessons);
  return (
    <div className="fade-in" style={{ padding: "32px 24px", maxWidth: 720, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Voltar</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span className="tag" style={{
          background: lesson.type === "theory" ? "#3B82F622" : "#10B98122",
          color: lesson.type === "theory" ? "#3B82F6" : "#10B981",
        }}>
          {lesson.type === "theory" ? "📖 Teoria" : "💻 Prática"}
        </span>
        <span className="tag" style={{ background: "#F59E0B22", color: "#F59E0B" }}>+{lesson.xp} XP</span>
        {complete && <span className="tag" style={{ background: "#10B98122", color: "#10B981" }}>✓ Concluída</span>}
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{lesson.title}</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 28 }}>{mod.title} · {course.title} ({course.lang})</p>

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
        padding: 28, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🚧</span>
          <p style={{ fontSize: 14, fontWeight: 500 }}>Conteúdo será adicionado na Entrega {lesson.type === "theory" ? "3-6" : "3-6"}</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Teoria + Editor de Código + Test Cases</p>
        </div>
      </div>
    </div>
  );
}

function BadgesView({ progress, onBack }) {
  return (
    <div className="fade-in" style={{ padding: "32px 24px", maxWidth: 720, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Voltar</button>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Conquistas</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 28 }}>
        {BADGE_DEFS.filter(b => b.check(progress)).length} de {BADGE_DEFS.length} desbloqueadas
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {BADGE_DEFS.map(badge => {
          const earned = badge.check(progress);
          return (
            <div key={badge.id} className={earned ? "scale-in" : ""} style={{
              background: "var(--bg-card)", border: `1px solid ${earned ? "#F59E0B44" : "var(--border)"}`,
              borderRadius: 14, padding: 20, opacity: earned ? 1 : 0.4,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 32, filter: earned ? "none" : "grayscale(1)" }}>{badge.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{badge.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{badge.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   8. MAIN APP
   ════════════════════════════════════════════ */

export default function App() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    loadProgress().then(p => {
      const updated = { ...p, streak: updateStreak(p.streak) };
      setProgress(updated);
      saveProgress(updated);
      setLoaded(true);
    });
  }, []);

  const navigate = useCallback((target, data = {}) => {
    setScreen(target);
    if (target === "dashboard") { setSelectedCourse(null); setSelectedModule(null); setSelectedLesson(null); }
    if (data.course !== undefined) setSelectedCourse(data.course);
    if (data.module !== undefined) setSelectedModule(data.module);
    if (data.lesson !== undefined) setSelectedLesson(data.lesson);
  }, []);

  if (!loaded) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{GLOBAL_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12, animation: "pulse 1.5s infinite" }}>⚡</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <Header progress={progress} onNavigate={() => navigate("dashboard")} />

      {screen === "dashboard" && (
        <Dashboard
          progress={progress}
          onSelectCourse={(c) => navigate("course", { course: c })}
          onOpenBadges={() => navigate("badges")}
        />
      )}

      {screen === "course" && selectedCourse && (
        <CourseView
          course={selectedCourse}
          progress={progress}
          onSelectModule={(m) => navigate("module", { module: m })}
          onBack={() => navigate("dashboard")}
        />
      )}

      {screen === "module" && selectedCourse && selectedModule && (
        <ModuleView
          course={selectedCourse}
          module={selectedModule}
          progress={progress}
          onSelectLesson={(l) => navigate("lesson", { lesson: l })}
          onBack={() => navigate("course")}
        />
      )}

      {screen === "lesson" && selectedCourse && selectedModule && selectedLesson && (
        <LessonView
          course={selectedCourse}
          module={selectedModule}
          lesson={selectedLesson}
          progress={progress}
          onBack={() => navigate("module")}
        />
      )}

      {screen === "badges" && (
        <BadgesView progress={progress} onBack={() => navigate("dashboard")} />
      )}
    </div>
  );
}
