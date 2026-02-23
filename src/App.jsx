import { useState, useCallback, useMemo } from "react";

const VALUES = [
  { id: "self_direction", label: "Self-Direction", desc: "Independence of thought and action — choosing, creating, exploring", color: "#6366f1" },
  { id: "stimulation", label: "Stimulation", desc: "Excitement, novelty, challenge in life", color: "#8b5cf6" },
  { id: "hedonism", label: "Hedonism", desc: "Pleasure and sensuous gratification", color: "#a855f7" },
  { id: "achievement", label: "Achievement", desc: "Personal success through demonstrating competence", color: "#ec4899" },
  { id: "power", label: "Power", desc: "Social status, prestige, control over people and resources", color: "#ef4444" },
  { id: "security", label: "Security", desc: "Safety, harmony, stability of society and relationships", color: "#f97316" },
  { id: "conformity", label: "Conformity", desc: "Restraint of actions that may harm others or violate expectations", color: "#eab308" },
  { id: "tradition", label: "Tradition", desc: "Respect and commitment to cultural or religious customs", color: "#84cc16" },
  { id: "benevolence", label: "Benevolence", desc: "Preserving and enhancing the welfare of those close to you", color: "#22c55e" },
  { id: "universalism", label: "Universalism", desc: "Understanding, tolerance, and protection for all people and nature", color: "#06b6d4" },
];

const TRADEOFF_SCENARIOS = [
  {
    scenario: "You're offered a prestigious promotion that requires relocating far from aging parents who need increasing support.",
    optionA: { label: "Take the promotion", values: ["achievement", "power"], weight: 1.5 },
    optionB: { label: "Stay close to family", values: ["benevolence", "security"], weight: 1.5 },
  },
  {
    scenario: "A close friend asks you to lie on their behalf about something that could affect others negatively.",
    optionA: { label: "Protect your friend", values: ["benevolence", "conformity"], weight: 1.5 },
    optionB: { label: "Refuse to lie", values: ["universalism", "self_direction"], weight: 1.5 },
  },
  {
    scenario: "You can take a stable, well-paying job you find boring, or pursue an uncertain creative passion.",
    optionA: { label: "Take the stable job", values: ["security", "conformity"], weight: 1.5 },
    optionB: { label: "Pursue the passion", values: ["self_direction", "stimulation"], weight: 1.5 },
  },
  {
    scenario: "You discover your company is doing something legal but ethically questionable. Whistleblowing would cost you your career.",
    optionA: { label: "Speak up publicly", values: ["universalism", "self_direction"], weight: 1.5 },
    optionB: { label: "Protect your livelihood", values: ["security", "power"], weight: 1.5 },
  },
  {
    scenario: "You have a free weekend: spend it volunteering for a cause, or doing something purely fun for yourself.",
    optionA: { label: "Volunteer", values: ["universalism", "benevolence"], weight: 1.2 },
    optionB: { label: "Enjoy yourself", values: ["hedonism", "stimulation"], weight: 1.2 },
  },
  {
    scenario: "Your cultural community expects you to follow a tradition you find personally meaningless.",
    optionA: { label: "Honor the tradition", values: ["tradition", "conformity"], weight: 1.5 },
    optionB: { label: "Follow your own path", values: ["self_direction", "stimulation"], weight: 1.5 },
  },
  {
    scenario: "You can invest savings in growing a business (risky but exciting) or keep them safe for your family's future.",
    optionA: { label: "Invest in growth", values: ["achievement", "stimulation"], weight: 1.3 },
    optionB: { label: "Protect the nest egg", values: ["security", "benevolence"], weight: 1.3 },
  },
  {
    scenario: "A new policy at work benefits the company but disadvantages a vulnerable group of employees.",
    optionA: { label: "Support the policy", values: ["achievement", "power"], weight: 1.3 },
    optionB: { label: "Advocate against it", values: ["universalism", "benevolence"], weight: 1.3 },
  },
];

const RATING_STATEMENTS = [
  { text: "I need to make my own decisions about what I do", values: ["self_direction"], weight: 1 },
  { text: "Having an exciting life matters deeply to me", values: ["stimulation"], weight: 1 },
  { text: "I believe in enjoying life's pleasures", values: ["hedonism"], weight: 1 },
  { text: "Being very successful is important to me", values: ["achievement"], weight: 1 },
  { text: "Having authority and influence motivates me", values: ["power"], weight: 1 },
  { text: "I need to feel that my world is safe and predictable", values: ["security"], weight: 1 },
  { text: "I try not to do things others would disapprove of", values: ["conformity"], weight: 1 },
  { text: "I feel bound to maintain customs I was raised with", values: ["tradition"], weight: 1 },
  { text: "The wellbeing of people close to me is my priority", values: ["benevolence"], weight: 1 },
  { text: "I believe all people deserve equal treatment and justice", values: ["universalism"], weight: 1 },
  { text: "Creative freedom is essential to who I am", values: ["self_direction"], weight: 1 },
  { text: "Routine and predictability drain me", values: ["stimulation"], weight: 1 },
  { text: "Ambition is one of my defining traits", values: ["achievement"], weight: 1 },
  { text: "I want to be in a position of leadership", values: ["power"], weight: 1 },
  { text: "Protecting the environment is a moral imperative", values: ["universalism"], weight: 1 },
  { text: "I would sacrifice personal gain for my family without hesitation", values: ["benevolence"], weight: 1 },
  { text: "Respecting elders and authorities comes naturally to me", values: ["tradition", "conformity"], weight: 0.7 },
  { text: "Financial and physical safety is a prerequisite for everything else", values: ["security"], weight: 1 },
  { text: "Comfort and sensory enjoyment are underrated", values: ["hedonism"], weight: 1 },
  { text: "I'd rather be original than accepted", values: ["self_direction"], weight: 1 },
];

const PHASES = ["intro", "rating", "tradeoffs", "results"];

export default function ValuesAssessment() {
  const [phase, setPhase] = useState("intro");
  const [ratingAnswers, setRatingAnswers] = useState({});
  const [tradeoffAnswers, setTradeoffAnswers] = useState({});
  const [currentRating, setCurrentRating] = useState(0);
  const [currentTradeoff, setCurrentTradeoff] = useState(0);

  const handleRating = useCallback((index, value) => {
    setRatingAnswers(prev => ({ ...prev, [index]: value }));
    if (index < RATING_STATEMENTS.length - 1) {
      setTimeout(() => setCurrentRating(index + 1), 300);
    }
  }, []);

  const handleTradeoff = useCallback((index, choice, strength) => {
    setTradeoffAnswers(prev => ({ ...prev, [index]: { choice, strength } }));
    if (index < TRADEOFF_SCENARIOS.length - 1) {
      setTimeout(() => setCurrentTradeoff(index + 1), 300);
    }
  }, []);

  const ratingsDone = Object.keys(ratingAnswers).length === RATING_STATEMENTS.length;
  const tradeoffsDone = Object.keys(tradeoffAnswers).length === TRADEOFF_SCENARIOS.length;

  const results = useMemo(() => {
    if (!ratingsDone || !tradeoffsDone) return null;

    const scores = {};
    VALUES.forEach(v => { scores[v.id] = { total: 0, count: 0 }; });

    // Process ratings (1-7 scale, normalized)
    RATING_STATEMENTS.forEach((stmt, i) => {
      const answer = ratingAnswers[i];
      if (answer !== undefined) {
        stmt.values.forEach(v => {
          scores[v].total += (answer / 7) * stmt.weight;
          scores[v].count += stmt.weight;
        });
      }
    });

    // Process tradeoffs (more revealing, weighted higher)
    TRADEOFF_SCENARIOS.forEach((sc, i) => {
      const answer = tradeoffAnswers[i];
      if (answer) {
        const chosen = answer.choice === "A" ? sc.optionA : sc.optionB;
        const rejected = answer.choice === "A" ? sc.optionB : sc.optionA;
        const strengthMult = answer.strength === "strong" ? 1.8 : answer.strength === "moderate" ? 1.3 : 0.8;

        chosen.values.forEach(v => {
          scores[v].total += chosen.weight * strengthMult;
          scores[v].count += chosen.weight;
        });
        rejected.values.forEach(v => {
          scores[v].total += (1 - chosen.weight * strengthMult * 0.3) * 0.3;
          scores[v].count += rejected.weight * 0.5;
        });
      }
    });

    const finalScores = VALUES.map(v => ({
      ...v,
      score: scores[v.id].count > 0 ? scores[v.id].total / scores[v.id].count : 0,
    }));

    const maxScore = Math.max(...finalScores.map(f => f.score));
    const minScore = Math.min(...finalScores.map(f => f.score));
    const range = maxScore - minScore || 1;

    return finalScores
      .map(f => ({ ...f, normalized: ((f.score - minScore) / range) * 100 }))
      .sort((a, b) => b.normalized - a.normalized);
  }, [ratingAnswers, tradeoffAnswers, ratingsDone, tradeoffsDone]);

  const getTier = (normalized) => {
    if (normalized >= 75) return { label: "Core Value", color: "#16a34a", bg: "#f0fdf4" };
    if (normalized >= 50) return { label: "Important", color: "#ca8a04", bg: "#fefce8" };
    if (normalized >= 25) return { label: "Moderate", color: "#9ca3af", bg: "#f9fafb" };
    return { label: "Low Priority", color: "#d1d5db", bg: "#f9fafb" };
  };

  // ─── INTRO ───
  if (phase === "intro") {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #06b6d4)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 28 }}>◇</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Values Assessment</h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            Discover the hierarchy and strength of your core values
          </p>
        </div>

        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 24, marginBottom: 32, border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            This assessment uses two complementary methods to map your values with more accuracy than either alone:
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, background: "white", borderRadius: 8, padding: 16, border: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#6366f1", marginBottom: 6 }}>Part 1 — Self-Report Ratings</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>20 statements rated on how strongly they resonate. Captures your conscious value endorsements.</div>
            </div>
            <div style={{ flex: 1, minWidth: 200, background: "white", borderRadius: 8, padding: 16, border: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#06b6d4", marginBottom: 6 }}>Part 2 — Tradeoff Dilemmas</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>8 scenarios forcing a choice between competing values. Reveals priorities under pressure — often more honest than self-report.</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fffbeb", borderRadius: 12, padding: 20, marginBottom: 32, border: "1px solid #fde68a" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
            <strong>Tip:</strong> Answer with how you <em>actually</em> think and behave, not how you wish you did. The value of this exercise is honest self-knowledge. There are no right or wrong answers — every profile is valid.
          </p>
        </div>

        <button
          onClick={() => setPhase("rating")}
          style={{
            width: "100%", padding: "14px 24px", fontSize: 15, fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white",
            border: "none", borderRadius: 10, cursor: "pointer",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
        >
          Begin Assessment
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>Takes about 8–12 minutes</p>
      </div>
    );
  }

  // ─── RATING PHASE ───
  if (phase === "rating") {
    const stmt = RATING_STATEMENTS[currentRating];
    const progress = (Object.keys(ratingAnswers).length / RATING_STATEMENTS.length) * 100;

    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>Part 1 — Self-Report</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{currentRating + 1} / {RATING_STATEMENTS.length}</span>
        </div>
        <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 40 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 2, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>

        <div style={{ minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 500, color: "#111", lineHeight: 1.5, marginBottom: 40, textAlign: "center" }}>
            "{stmt.text}"
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5, 6, 7].map(n => {
              const isSelected = ratingAnswers[currentRating] === n;
              const size = 40 + Math.abs(n - 4) * 3;
              return (
                <button
                  key={n}
                  onClick={() => handleRating(currentRating, n)}
                  style={{
                    width: size, height: size, borderRadius: "50%",
                    border: isSelected ? "2px solid #6366f1" : "2px solid #d1d5db",
                    background: isSelected ? "#6366f1" : "white",
                    color: isSelected ? "white" : "#374151",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Strongly disagree</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Strongly agree</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button
            onClick={() => setCurrentRating(Math.max(0, currentRating - 1))}
            disabled={currentRating === 0}
            style={{ padding: "10px 20px", fontSize: 13, background: "none", border: "1px solid #d1d5db", borderRadius: 8, color: currentRating === 0 ? "#d1d5db" : "#374151", cursor: currentRating === 0 ? "default" : "pointer" }}
          >
            ← Back
          </button>
          {ratingsDone && (
            <button
              onClick={() => setPhase("tradeoffs")}
              style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, background: "#6366f1", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Continue to Part 2 →
            </button>
          )}
          {!ratingsDone && currentRating < RATING_STATEMENTS.length - 1 && ratingAnswers[currentRating] !== undefined && (
            <button
              onClick={() => setCurrentRating(currentRating + 1)}
              style={{ padding: "10px 20px", fontSize: 13, background: "none", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", cursor: "pointer" }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── TRADEOFF PHASE ───
  if (phase === "tradeoffs") {
    const sc = TRADEOFF_SCENARIOS[currentTradeoff];
    const progress = (Object.keys(tradeoffAnswers).length / TRADEOFF_SCENARIOS.length) * 100;
    const currentAnswer = tradeoffAnswers[currentTradeoff];

    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.5px" }}>Part 2 — Tradeoffs</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{currentTradeoff + 1} / {TRADEOFF_SCENARIOS.length}</span>
        </div>
        <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, marginBottom: 40 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #06b6d4, #22d3ee)", borderRadius: 2, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>

        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.7, marginBottom: 28, textAlign: "center", fontStyle: "italic" }}>
          {sc.scenario}
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[
            { key: "A", label: sc.optionA.label },
            { key: "B", label: sc.optionB.label },
          ].map(opt => {
            const isChosen = currentAnswer?.choice === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleTradeoff(currentTradeoff, opt.key, currentAnswer?.strength || "moderate")}
                style={{
                  flex: 1, padding: "18px 16px", fontSize: 14, fontWeight: 500,
                  background: isChosen ? "#f0f9ff" : "white",
                  border: isChosen ? "2px solid #06b6d4" : "2px solid #e5e7eb",
                  borderRadius: 10, cursor: "pointer", color: "#111",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {currentAnswer?.choice && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>How strongly do you feel about this choice?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {["slight", "moderate", "strong"].map(s => (
                <button
                  key={s}
                  onClick={() => handleTradeoff(currentTradeoff, currentAnswer.choice, s)}
                  style={{
                    padding: "6px 16px", fontSize: 12, borderRadius: 20,
                    border: currentAnswer.strength === s ? "1.5px solid #06b6d4" : "1.5px solid #d1d5db",
                    background: currentAnswer.strength === s ? "#ecfeff" : "white",
                    color: currentAnswer.strength === s ? "#0e7490" : "#6b7280",
                    cursor: "pointer", fontWeight: currentAnswer.strength === s ? 600 : 400,
                    textTransform: "capitalize",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button
            onClick={() => currentTradeoff > 0 ? setCurrentTradeoff(currentTradeoff - 1) : setPhase("rating")}
            style={{ padding: "10px 20px", fontSize: 13, background: "none", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", cursor: "pointer" }}
          >
            ← Back
          </button>
          {tradeoffsDone && (
            <button
              onClick={() => setPhase("results")}
              style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              View Results →
            </button>
          )}
          {!tradeoffsDone && currentTradeoff < TRADEOFF_SCENARIOS.length - 1 && tradeoffAnswers[currentTradeoff] && (
            <button
              onClick={() => setCurrentTradeoff(currentTradeoff + 1)}
              style={{ padding: "10px 20px", fontSize: 13, background: "none", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", cursor: "pointer" }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (phase === "results" && results) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 6px", letterSpacing: "-0.3px" }}>Your Values Profile</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Based on your self-report ratings and tradeoff decisions</p>
        </div>

        {/* Ranked bars */}
        <div style={{ marginBottom: 40 }}>
          {results.map((val, i) => {
            const tier = getTier(val.normalized);
            return (
              <div key={val.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, width: 18 }}>#{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{val.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
                      background: tier.bg, color: tier.color, textTransform: "uppercase", letterSpacing: "0.3px"
                    }}>
                      {tier.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{Math.round(val.normalized)}</span>
                </div>
                <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${val.color}, ${val.color}dd)`,
                    width: `${Math.max(val.normalized, 3)}%`,
                    transition: "width 0.8s ease",
                  }} />
                </div>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0 26px" }}>{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Circumplex hint */}
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 10px" }}>How to Read Your Profile</h3>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: "0 0 10px" }}>
            In Schwartz's model, adjacent values (e.g. self-direction & stimulation) are psychologically compatible — it's common and coherent to score high on both. <strong>Opposing</strong> values (e.g. self-direction vs. conformity, or benevolence vs. power) create internal tension when both score high. That tension isn't bad — it often reflects a nuanced person — but it's worth noticing.
          </p>
          <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
            Your <strong>core values</strong> (top 2–3) likely drive your biggest life decisions. Your <strong>low-priority</strong> values aren't absent — you just don't organize your life around them. The tradeoff scenarios often reveal priorities that self-report misses, especially around values people think they "should" hold.
          </p>
        </div>

        {/* Tensions */}
        {(() => {
          const oppositions = [
            ["self_direction", "conformity"],
            ["self_direction", "tradition"],
            ["stimulation", "security"],
            ["universalism", "power"],
            ["benevolence", "power"],
            ["hedonism", "conformity"],
          ];
          const tensions = oppositions.filter(([a, b]) => {
            const scoreA = results.find(r => r.id === a)?.normalized || 0;
            const scoreB = results.find(r => r.id === b)?.normalized || 0;
            return scoreA > 55 && scoreB > 55;
          });
          if (tensions.length === 0) return null;
          return (
            <div style={{ background: "#fffbeb", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #fde68a" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#92400e", margin: "0 0 8px" }}>Notable Tensions</h3>
              <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6, margin: 0 }}>
                You scored high on values that typically pull in opposite directions:{" "}
                {tensions.map(([a, b], i) => {
                  const labelA = VALUES.find(v => v.id === a).label;
                  const labelB = VALUES.find(v => v.id === b).label;
                  return <span key={i}><strong>{labelA}</strong> vs. <strong>{labelB}</strong>{i < tensions.length - 1 ? "; " : ""}</span>;
                })}
                . This tension can be a source of richness and inner conflict — it's worth reflecting on how you navigate it.
              </p>
            </div>
          );
        })()}

        <button
          onClick={() => { setPhase("intro"); setRatingAnswers({}); setTradeoffAnswers({}); setCurrentRating(0); setCurrentTradeoff(0); }}
          style={{ width: "100%", padding: "12px", fontSize: 13, background: "none", border: "1px solid #d1d5db", borderRadius: 8, color: "#374151", cursor: "pointer" }}
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  return null;
}
