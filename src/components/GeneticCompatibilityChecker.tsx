import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Scissors, Droplets, Waves, Smile, Sparkles, Dna, Baby, RefreshCw, PenLine, AlertTriangle, User, Heart, Loader2 } from "lucide-react";

const TRAITS = [
  { name: "Eye Color", options: ["Brown", "Blue", "Green", "Hazel"], icon: Eye },
  { name: "Hair Color", options: ["Black", "Brown", "Blonde", "Red"], icon: Scissors },
  { name: "Blood Type", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], icon: Droplets },
  { name: "Hair Texture", options: ["Straight", "Wavy", "Curly", "Coily"], icon: Waves },
  { name: "Dimples", options: ["Present", "Absent"], icon: Smile },
  { name: "Freckles", options: ["Present", "Absent"], icon: Sparkles },
];

const DOMINANCE: Record<string, Record<string, string[]>> = {
  "Eye Color": { dominant: ["Brown"], recessive: ["Blue"], codominant: ["Green", "Hazel"] },
  "Hair Color": { dominant: ["Black", "Brown"], recessive: ["Blonde", "Red"] },
  "Dimples": { dominant: ["Present"], recessive: ["Absent"] },
  "Freckles": { dominant: ["Present"], recessive: ["Absent"] },
};

function predictTrait(trait: string, parent1: string, parent2: string): { outcome: string; probability: number; explanation: string } {
  const dom = DOMINANCE[trait];
  if (trait === "Blood Type") return predictBloodType(parent1, parent2);
  if (trait === "Hair Texture") {
    const order = ["Straight", "Wavy", "Curly", "Coily"];
    const i1 = order.indexOf(parent1);
    const i2 = order.indexOf(parent2);
    const avg = Math.round((i1 + i2) / 2);
    const jitter = Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const final = Math.max(0, Math.min(3, avg + jitter));
    return { outcome: order[final], probability: 0.55 + Math.random() * 0.2, explanation: `Hair texture tends to blend between parents. With ${parent1} and ${parent2}, ${order[final]} is a likely outcome.` };
  }
  if (!dom) return { outcome: Math.random() > 0.5 ? parent1 : parent2, probability: 0.5, explanation: `Equal chance of inheriting either parent's trait.` };

  const p1Dom = dom.dominant?.includes(parent1);
  const p2Dom = dom.dominant?.includes(parent2);

  if (p1Dom && p2Dom) {
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
  return { outcome: `${chosen}${rhPositive}`, probability: +(1 / possibleTypes.length).toFixed(2), explanation: `Based on ABO inheritance from ${p1} × ${p2}, possible types: ${possibleTypes.join(", ")}. Rh factor depends on parental Rh alleles.` };
}

interface PredictionResult {
  trait: string;
  Icon: React.ElementType;
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
        return { trait: t.name, Icon: t.icon, ...pred };
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

  const ParentForm = ({
    title,
    name,
    setName,
    traits,
    setTraits,
    accent,
    IconComp,
  }: {
    title: string;
    name: string;
    setName: (v: string) => void;
    traits: Record<string, string>;
    setTraits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    accent: string;
    IconComp: React.ElementType;
  }) => (
    <Card className={`border-${accent}/20 bg-gradient-to-br from-${accent}/[0.02] to-transparent`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${accent}/10 border border-${accent}/20 flex items-center justify-center`}>
            <IconComp className={`w-5 h-5 text-${accent}`} />
          </div>
          {title}
        </CardTitle>
        <div className="pt-2">
          <Label htmlFor={`${title}-name`} className="text-xs text-muted-foreground">Name (optional)</Label>
          <Input
            id={`${title}-name`}
            placeholder={`${title}'s name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {TRAITS.map((t) => {
          const TraitIcon = t.icon;
          return (
            <div key={t.name}>
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <TraitIcon className="w-3.5 h-3.5" />
                {t.name}
              </Label>
              <Select value={traits[t.name] || ""} onValueChange={(v) => setTraits((p) => ({ ...p, [t.name]: v }))}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {t.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

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
          <Badge variant="outline" className="mb-4 text-xs font-mono tracking-wider border-secondary/40 text-secondary gap-1.5">
            <Dna className="w-3.5 h-3.5" />
            NEW FEATURE
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
              {/* Connector line between cards */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <ParentForm title="Father" name={fatherName} setName={setFatherName} traits={fatherTraits} setTraits={setFatherTraits} accent="primary" IconComp={User} />
                  <ParentForm title="Mother" name={motherName} setName={setMotherName} traits={motherTraits} setTraits={setMotherTraits} accent="secondary" IconComp={User} />
                </div>
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Genetics...
                    </>
                  ) : (
                    <>
                      <Dna className="w-4 h-4" />
                      Predict Baby's Traits
                    </>
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
              <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="py-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Baby className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-display font-bold text-foreground">
                      Predicted Traits{fatherName && motherName ? ` for Baby of ${fatherName} & ${motherName}` : ""}
                    </h3>
                  </div>
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
                    <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <p.Icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{p.trait}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs font-mono ${
                              p.probability >= 0.7
                                ? "border-warm-green/40 text-warm-green"
                                : p.probability >= 0.5
                                ? "border-warm-yellow/40 text-warm-yellow"
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
                  <RefreshCw className="w-4 h-4" />
                  Re-roll Predictions
                </Button>
                <Button onClick={handleReset} className="btn-warm gap-2">
                  <PenLine className="w-4 h-4" />
                  New Analysis
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Disclaimer: This is a simplified educational tool using basic Mendelian genetics. Real genetic inheritance involves thousands of genes and complex interactions.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
