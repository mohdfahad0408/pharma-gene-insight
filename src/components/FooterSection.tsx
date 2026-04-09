import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import generxLogo from "@/assets/generx-logo.png";
import { Github } from "lucide-react";

const team = [
  { name: "Mohd. Fahad", role: "Developer", initials: "MF" },
  { name: "Shivendra Pratap Singh", role: "Developer", initials: "SP" },
  { name: "Rashi Tiwari", role: "UI/UX", initials: "RT" },
  { name: "Divyansh Kumar Pandey", role: "UI/UX", initials: "DP" },
];

export const FooterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative pt-24 pb-10 overflow-hidden border-t-2 border-primary/20">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16"
        >
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={generxLogo} alt="GeneRx logo" className="w-10 h-10 rounded-xl" />
              <div>
                <div className="font-display font-bold text-foreground">GeneRx</div>
                <div className="text-xs text-muted-foreground">Pharmacogenomic Analysis</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Precision medicine powered by genomics. Turning genetic data into life-saving clinical decisions.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5">
              {["Genomic Analysis", "Drug Database", "CPIC Guidelines", "API Access", "Clinical Reports"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary footer-link block">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-xs uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2.5">
              {["Documentation", "Research Papers", "CPIC Database", "PharmGKB", "GitHub Repository"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary footer-link block">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4 text-xs uppercase tracking-widest">Team</h4>
            <div className="space-y-3">
              {team.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 btn-warm text-white">
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            © 2026 GeneRx. Built for{" "}
            <span className="text-primary font-medium">precision medicine research</span>.
            Not for clinical use without validation.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-lg p-2 border border-border hover:border-primary/40 hover:shadow-warm social-icon group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
