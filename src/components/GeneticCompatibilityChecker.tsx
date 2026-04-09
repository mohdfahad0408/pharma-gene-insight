import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const TRAITS = [
  { name: "Eye Color", options: ["Brown", "Blue", "Green", "Hazel"], icon: "👁️" },
  { name: "Hair Color", options: ["Black", "Brown", "Blonde", "Red"], icon: "💇" },
  { name: "Blood Type", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], icon: "🩸" },
  { name: "Hair Texture", options: ["Straight", "Wavy", "Curly", "Coily"], icon: "〰️" },
  { name: "Dimples", options: ["Present", "Absent"], icon: "😊" },
  { name: "Freckles", options: ["Present", "Absent"], icon: "🌟" },
];

// Dominance rules for simplified Mendelian-ish prediction
const DOMINANCE: Record<string, Record<string, string[]>> = {
  "Eye Color": {
    dominant: ["Brown"],
    recessive: ["Blue"],
    codominant: ["Green", "Hazel"],
  },
  "Hair Color": {
    dominant: ["Black", "Brown"],
    recessive: ["Blonde", "Red"],
  },
  "Dimples": { dominant: ["Present"], recessive: ["Absent"] },
  "Freckles": { dominant: ["Present"], recessive: ["Absent"] },
};

function predictTrait(trait: string, parent1: string, parent2: string): { outcome: string; probability: number; explanation: string } {
  const dom = DOMINANCE[trait];

  // Blood type uses special logic
  if (trait === "Blood Type") {
    return predictBloodType(parent1, parent2);
  }

  // Hair texture blending
  if (trait === "Hair Texture") {
    const order = ["Straight", "Wavy", "Curly", "Coily"];
    const i1 = order.indexOf(parent1);
    const i2 = order.indexOf(parent2);
    const avg = Math.round((i1 + i2) / 2);
    const jitter = Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const final = Math.max(0, Math.min(3, avg + jitter));
    return {
      outcome: order[final],
      probability: 0.55 + Math.random() * 0.2,
      explanation: `Hair texture tends to blend between parents. With ${parent1} and ${parent2}, ${order[final]} is a likely outcome.`,
    };
  }

  if (!dom) {
    // Fallback random pick
    return {
      outcome: Math.random() > 0.5 ? parent1 : parent2,
      probability: 0.5,
      explanation: `Equal chance of inheriting either parent's trait.`,
    };
  }

  const p1Dom = dom.dominant?.includes(parent1);
  const p2Dom = dom.dominant?.includes(parent2);

  if (p1Dom && p2Dom) {
    // Both dominant — child gets dominant, slight chance of recessive
    const outcome = Math.random() > 0.25 ? parent1 : parent2;
    return { outcome, probability: 0.75, explanation: `Both parents carry dominant alleles. High likelihood of ${outcome}.` };
  }
  if (p1Dom && !p2Dom) {
    const outcome = Math.random() > 0.3 ? parent1 : parent2;
    return { outcome, probability: 0.7, explanation: `${parent1} is dominant over ${parent2}. ~70% chance of ${outcome}.` };
  }
  if (!p1Dom && p2Dom) {
    const outcome = Math.random() > 0.3 ? parent2 : parent1;
    return { outcome, probability: 0.7, explanation: `${parent2} is dominant over ${parent1}. ~70% chance of ${outcome}.` };
  }
  // Both recessive
  const co = dom.codominant;
  if (co && Math.random() > 0.7) {
    const outcome = co[Math.floor(Math.random() * co.length)];
    return { outcome, probability: 0.3, explanation: `Both recessive — rare codominant expression possible: ${outcome}.` };
  }
  const outcome = Math.random() > 0.5 ? parent1 : parent2;
  return { outcome, probability: 0.5, explanation: `Both parents carry recessive alleles. Equal chance.` };
}

function predictBloodType(p1: string, p2: string) {
  const type1 = p1.replace(/[+-]/, "");
  const type2 = p2.replace(/[+-]/, "");
  const rh1 = p1.includes("+");
  const rh2 = p2.includes("+");

  const possibleTypes: string[] = [];
  if (type1 === "O" && type2 === "O") possibleTypes.push("O");
  else if ((type1 === "A" && type2 === "B") || (type1 === "B" && type2 === "A")) possibleTypes.push("A", "B", "AB", "O");
  else if (type1 === "A" || type2 === "A") possibleTypes.push("A", "O");
  else if (type1 === "B" || type2 === "B") possibleTypes.push("B", "O");
  else possibleTypes.push(type1, type2, "O");

  const rhPositive = rh1 || rh2 ? (Math.random() > 0.25 ? "+" : "-") : "-";
  const chosen = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

  return {
    outcome: `${chosen}${rhPositive}`,
    probability: +(1 / possibleTypes.length).toFixed(2),
    explanation: `Based on ABO inheritance from ${p1} × ${p2}, possible types: ${possibleTypes.join(", ")}. Rh factor depends on parental Rh alleles.`,
  };
}

interface PredictionResult {
  trait: string;
  icon: string;
  outcome: string;
  probability: number;
  explanation: string;
}

export const GeneticCompatibilityChecker = () => {
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherTraits, setFatherTraits] = useState<Record<string, string>>({});
  const [motherTraits, setMotherTraits] = useState<Record<string, string>>({});
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const allTraitsSelected = TRAITS.every((t) => fatherTraits[t.name] && motherTraits[t.name]);

  const handlePredict = () => {
    if (!allTraitsSelected) return;
    setIsCalculating(true);
    setPredictions(null);

    setTimeout(() => {
      const results: PredictionResult[] = TRAITS.map((t) => {
        const pred = predictTrait(t.name, fatherTraits[t.name], motherTraits[t.name]);
        return { trait: t.name, icon: t.icon, ...pred };
      });
      setPredictions(results);
      setIsCalculating(false);
    }, 1500);
  };

  const handleReset = () => {
    setFatherTraits({});
    setMotherTraits({});
    setPredictions(null);
    setFatherName("");
    setMotherName("");
  };

  return (
    <section id="compatibility" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-xs font-mono tracking-wider border-secondary/40 text-secondary">
            🧬 NEW FEATURE
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Genetic Compatibility <span className="gradient-text">Checker</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Predict your baby's possible genetic traits based on parental phenotypes using simplified Mendelian inheritance models.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!predictions ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Father */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">👨</span> Father's Traits
                    </CardTitle>
                    <div className="pt-2">
                      <Label htmlFor="father-name" className="text-xs text-muted-foreground">Name (optional)</Label>
                      <Input
                        id="father-name"
                        placeholder="Father's name"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="mt-1 h-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {TRAITS.map((t) => (
                      <div key={t.name}>
                        <Label className="text-xs text-muted-foreground">{t.icon} {t.name}</Label>
                        <Select value={fatherTraits[t.name] || ""} onValueChange={(v) => setFatherTraits((p) => ({ ...p, [t.name]: v }))}>
                          <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {t.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Mother */}
                <Card className="border-secondary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">👩</span> Mother's Traits
                    </CardTitle>
                    <div className="pt-2">
                      <Label htmlFor="mother-name" className="text-xs text-muted-foreground">Name (optional)</Label>
                      <Input
                        id="mother-name"
                        placeholder="Mother's name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        className="mt-1 h-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {TRAITS.map((t) => (
                      <div key={t.name}>
                        <Label className="text-xs text-muted-foreground">{t.icon} {t.name}</Label>
                        <Select value={motherTraits[t.name] || ""} onValueChange={(v) => setMotherTraits((p) => ({ ...p, [t.name]: v }))}>
                          <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {t.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button
                  onClick={handlePredict}
                  disabled={!allTraitsSelected || isCalculating}
                  size="lg"
                  className="btn-warm px-8 gap-2"
                >
                  {isCalculating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                      </svg>
                      Analyzing Genetics...
                    </>
                  ) : (
                    <>🧬 Predict Baby's Traits</>
                  )}
                </Button>
                {!allTraitsSelected && (
                  <p className="text-xs text-muted-foreground mt-2">Select all traits for both parents to proceed</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Results header */}
              <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="py-6 text-center">
                  <h3 className="text-xl font-display font-bold text-foreground mb-1">
                    🍼 Predicted Traits for Baby {fatherName && motherName ? `of ${fatherName} & ${motherName}` : ""}
                  </h3>
                  <p className="text-xs text-muted-foreground">Based on simplified Mendelian inheritance • For educational purposes only</p>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {predictions.map((p, i) => (
                  <motion.div
                    key={p.trait}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{p.icon} {p.trait}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs font-mono ${
                              p.probability >= 0.7
                                ? "border-green-500/40 text-green-600 dark:text-green-400"
                                : p.probability >= 0.5
                                ? "border-yellow-500/40 text-yellow-600 dark:text-yellow-400"
                                : "border-muted-foreground/40 text-muted-foreground"
                            }`}
                          >
                            {Math.round(p.probability * 100)}%
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-2">{p.outcome}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.explanation}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button onClick={handlePredict} variant="outline" className="gap-2">
                  🔄 Re-roll Predictions
                </Button>
                <Button onClick={handleReset} className="btn-warm gap-2">
                  ✏️ New Analysis
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-6">
                ⚠️ Disclaimer: This is a simplified educational tool using basic Mendelian genetics. Real genetic inheritance involves thousands of genes and complex interactions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
