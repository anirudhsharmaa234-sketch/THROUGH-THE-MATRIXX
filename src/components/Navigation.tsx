/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SectionInfoTrigger from './information/SectionInfoTrigger.tsx';

interface NavItem {
  id: string;
  label: string;
  code: string;
  isAvailable: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'surface', label: 'SURFACE', code: '01', isAvailable: true },
  { id: 'deep', label: 'DEEP', code: '02', isAvailable: true },
  { id: 'network', label: 'NETWORK', code: '03', isAvailable: true },
  { id: 'simulation', label: 'SIMULATION', code: '04', isAvailable: false },
  { id: 'core', label: 'CORE', code: '05', isAvailable: false },
];

interface NavigationProps {
  activeSection?: 'surface' | 'deep' | 'network';
  onSurfaceClick?: () => void;
  onDeepClick?: () => void;
  onNetworkClick?: () => void;
  onOpenSectionInfo?: () => void;
}

export default function Navigation({
  activeSection = 'surface',
  onSurfaceClick,
  onDeepClick,
  onNetworkClick,
  onOpenSectionInfo,
}: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleItemClick = (item: NavItem) => {
    if (item.isAvailable) {
      if (item.id === 'surface') {
        if (onSurfaceClick) {
          onSurfaceClick();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (item.id === 'deep') {
        if (onDeepClick) {
          onDeepClick();
        } else {
          const deepSec = document.getElementById('deep-section2-timeline');
          if (deepSec) {
            window.scrollTo({ top: deepSec.offsetTop, behavior: 'smooth' });
          }
        }
      } else if (item.id === 'network') {
        if (onNetworkClick) {
          onNetworkClick();
        } else {
          const netSec = document.getElementById('network-section3-timeline');
          if (netSec) {
            window.scrollTo({ top: netSec.offsetTop, behavior: 'smooth' });
          }
        }
      }
    } else {
      // Gentle restrained feedback for future section placeholders
      setStatusNotice(`[ SEC_${item.code} // LEVEL LOCKED ]`);
      setTimeout(() => {
        setStatusNotice(null);
      }, 1800);
    }
  };

  return (
    <header
      id="main-minimal-nav"
      className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between pointer-events-none select-none transition-all duration-300"
    >
      {/* Brand Identity / Wordmark */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          data-about-id="brand-wordmark"
          title="Tap for System Architecture Info"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
          aria-label="Through The Matrix Home"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e] group-hover:scale-125 transition-transform duration-200" />
          <span className="font-matrix-display tracking-[0.28em] text-[11px] sm:text-xs font-semibold uppercase text-neutral-200 group-hover:text-white transition-colors">
            THROUGH THE MATRIX
          </span>
        </button>
      </div>

      {/* Navigation Targets & Layer Info Trigger */}
      <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
        <nav
          id="section-nav-list"
          aria-label="Experience Navigation"
          className="flex items-center gap-4 sm:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeSection;
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                data-about-id={`nav-${item.id}`}
                title={`Layer ${item.code}: ${item.label} Info`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative py-1 font-matrix-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'text-[#86efac] font-medium'
                    : 'text-neutral-400/70 hover:text-neutral-200'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
                  )}
                  <span>{item.label}</span>
                </span>

                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4ade80] to-transparent opacity-80" />
                )}

                {/* Hover Underline for inactive items */}
                {!isActive && isHovered && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 transition-all duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {onOpenSectionInfo && (
          <SectionInfoTrigger
            sectionCode={activeSection === 'deep' ? '02' : '01'}
            onClick={onOpenSectionInfo}
          />
        )}
      </div>

      {/* Floating Status Notice for Locked Future Targets */}
      {statusNotice && (
        <div
          id="nav-status-toast"
          className="fixed top-16 right-5 sm:right-10 pointer-events-none font-matrix-mono text-[9px] tracking-[0.25em] text-[#4ade80] bg-black/80 border border-[#22c55e]/30 px-3 py-1.5 backdrop-blur-sm animate-fade-in"
        >
          {statusNotice}
        </div>
      )}
    </header>
  );
}
