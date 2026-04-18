import React from "react";

/**
 * Standard layout wrapper for all modes to enforce layout consistency.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.headerIcon - The icon for the header (e.g. <Search />)
 * @param {string} props.headerTitle - The first part of the title (e.g. "Research")
 * @param {string} props.headerHighlight - The highlighted part of the title (e.g. "Mode")
 * @param {string} props.headerDesc - The description text
 * @param {string} props.color - Base color for neon effects (cyan, violet, emerald, amber)
 * @param {React.ReactNode} props.leftBg - Background orb color for left
 * @param {React.ReactNode} props.rightBg - Background orb color for right
 * @param {React.ReactNode} props.inputSection - The aligned input/control section
 * @param {React.ReactNode} props.contentGrid - The cards underneath the input section
 */
export default function ModeLayout({
  headerIcon: HeaderIcon,
  headerTitle,
  headerHighlight,
  headerDesc,
  color = "cyan",
  leftBg = "cyan-500",
  rightBg = "indigo-500",
  inputSection,
  contentGrid,
  children
}) {
  return (
    <div className="section-stack">
      {/* ── Mode Header ─────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-[16px] glass neon-border-${color} p-[32px]`}>
        <div className={`absolute -top-20 -right-20 h-52 w-52 rounded-full bg-${leftBg}/[0.06] blur-[80px]`} />
        <div className={`absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-${rightBg}/[0.04] blur-[60px]`} />
        
        <div className="relative z-10 flex items-start gap-4">
          {HeaderIcon && (
            <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] bg-${color}-500/10 border border-${color}-500/20 anim-float`}>
              <HeaderIcon className={`h-6 w-6 text-${color}-400`} />
            </div>
          )}
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white mb-1">
              {headerTitle} <span className={`neon-text-${color}`}>{headerHighlight}</span>
            </h1>
            <p className="max-w-xl text-[14px] text-[var(--text-secondary)] leading-relaxed">
              {headerDesc}
            </p>
          </div>
        </div>
      </div>

      {/* ── Input Section ───────────────────────────────────────── */}
      {inputSection && (
        <div className="w-full">
          {inputSection}
        </div>
      )}

      {/* ── Content Grid ────────────────────────────────────────── */}
      {contentGrid && (
        <div className="w-full">
          {contentGrid}
        </div>
      )}
      
      {/* Fallback for components that don't split input/content cleanly */}
      {children}
    </div>
  );
}
