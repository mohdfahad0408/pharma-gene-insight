import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTiltEffect } from "@/hooks/use-animations";
import { Table2, FlaskConical, Monitor, ShieldCheck, Upload, Microscope, Dna, ClipboardList, BarChart3, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Table2,
    title: "VCF v4.2 Parsing",
    desc: "Validates VCF headers and extracts pharmacogenomic variants from INFO tags with strict format checking.",
  },
  {
    icon: FlaskConical,
    title: "Diplotype → Phenotype",
    desc: "Star allele pairs mapped to metabolizer phenotypes across CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD.",
  },
  {
    icon: Monitor,
    title: "Risk Classification",
    desc: "CPIC engine classifies drug risks as Safe, Adjust Dosage, Toxic, Ineffective, or Unknown with confidence scores.",
  },
  {
    icon: ShieldCheck,
    title: "CPIC Guidelines",
    desc: "All recommendations aligned with CPIC Level A evidence. Schema-validated JSON output for interoperability.",
  },
];

const pipelineSteps = [
  { step: "01", label: "Upload VCF", icon: Upload },
  { step: "02", label: "Parse Variants", icon: Microscope },
  { step: "03", label: "Gene Mapping", icon: Dna },
  { step: "04", label: "CPIC Lookup", icon: ClipboardList },
  { step: "05", label: "Risk Report", icon: BarChart3 },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });
  useTiltEffect(cardRef as React.RefObject<HTMLElement>);
  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="tilt-card card-surface p-6 group cursor-default"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-primary bg-primary/10 border border-primary/20">
          <Icon className="w-6 h-6" />
        </div>
        <div className="font-mono text-xs text-muted-foreground/40 pt-1">0{index + 1}</div>
      </div>
      <h3 className="text-base font-display font-bold text-foreground mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
      <div className="mt-5 h-0.5 w-8 rounded-full bg-primary/30 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
};

export const AboutSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const pipelineRef = useRef<HTMLDivElement>(null);
  const pipelineInView = useInView(pipelineRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="subtitle-accent mb-4">core technology :</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How <span className="gradient-text">GeneRx</span> Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A multi-layered genomic analysis pipeline turning raw genetic data into actionable clinical insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>

        {/* Pipeline visualization */}
        <motion.div
          ref={pipelineRef}
          initial={{ opacity: 0, y: 30 }}
          animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="card-surface p-8"
        >
          <div className="flex items-center justify-between text-center overflow-x-auto gap-4">
            {pipelineSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex items-center gap-4 flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={pipelineInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-xs font-display font-bold text-primary mb-2">
                      {s.step}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{s.label}</div>
                  </motion.div>
                  {i < 4 && (
                    <div className="flex items-center">
                      <div className="w-8 h-px bg-gradient-to-r from-primary/40 to-secondary/40" />
                      <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
