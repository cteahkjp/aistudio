import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getWarningMeta } from "../utils/weatherUtils";
import { AlertCircle, ChevronDown, ShieldAlert, Sparkles } from "lucide-react";

interface WarningTickerProps {
  warnings?: string[];
}

export default function WarningTicker({ warnings }: WarningTickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out any empty, null, or placeholder warning messages from HKO
  const validWarnings = (warnings || []).filter((w) => w && w.trim().length > 0);

  if (validWarnings.length === 0) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest font-mono">
              Sky Condition Normal
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              No severe weather warnings are currently in force by the Hong Kong Observatory
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1 rounded-full font-black tracking-widest shrink-0 self-start sm:self-center">
          All Clear
        </span>
      </div>
    );
  }

  // Get style details from the first matching warning type
  const styleMeta = getWarningMeta(validWarnings[0]);

  return (
    <div className="w-full bg-gradient-to-r from-rose-600 via-red-650 to-rose-700 border border-rose-500/40 rounded-[32px] overflow-hidden transition-all duration-300 shadow-2xl relative" id="warning-ticker-box">
      {/* Absolute Underlay Alert Icon */}
      <div className="absolute right-[-30px] bottom-[-30px] opacity-10 pointer-events-none text-white">
        <ShieldAlert className="w-48 h-48" />
      </div>

      <div
        className="flex items-center justify-between p-6 cursor-pointer select-none relative z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 text-white border border-white/25 rounded-2xl animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[#fcd34d] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              {validWarnings.length} Active Weather Warning{validWarnings.length > 1 ? "s" : ""}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
              {validWarnings[0]}
            </h3>
            <p className="text-xs text-white/80 mt-1 select-none font-medium">
              Click to view complete advisory guidelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-5 h-5 text-white/85 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 border-t border-white/10 pt-5 bg-black/15 flex flex-col gap-4 relative z-10">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-white/60 block">
                Official Observatory Advisories
              </span>
              <div className="flex flex-col gap-2.5">
                {validWarnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start bg-white/10 border border-white/10 p-4 rounded-[20px]"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-white leading-relaxed font-bold">
                      {warning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
