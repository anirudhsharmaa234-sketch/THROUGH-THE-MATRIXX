/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SectionInfoTriggerProps {
  sectionCode: string;
  onClick: () => void;
  className?: string;
}

export default function SectionInfoTrigger({
  sectionCode,
  onClick,
  className = '',
}: SectionInfoTriggerProps) {
  return (
    <button
      type="button"
      id={`section-info-trigger-${sectionCode.toLowerCase()}`}
      onClick={onClick}
      className={`group flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-matrix-mono tracking-[0.22em] uppercase text-neutral-400 hover:text-[#86efac] bg-black/60 hover:bg-[#22c55e]/15 border border-[#22c55e]/30 hover:border-[#4ade80]/60 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#4ade80] pointer-events-auto select-none ${className}`}
      aria-label={`Open Layer ${sectionCode} System Information`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] group-hover:bg-[#86efac] shadow-[0_0_5px_#22c55e] transition-colors" />
      <span className="text-neutral-500 group-hover:text-[#4ade80] transition-colors">[ i ]</span>
      <span className="hidden sm:inline">SYSTEM INFO</span>
    </button>
  );
}
