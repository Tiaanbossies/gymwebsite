import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import anime from 'animejs';

import { STEPS } from './plans.js';

/**
 * Steps already reached are clickable, so a member reviewing on the last step
 * can jump straight back to the field they want to fix.
 */
export default function StepIndicator({ currentStep, maxStep, onStepSelect }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    lineRefs.current.forEach((el, idx) => {
      if (!el) return;
      anime({
        targets: el,
        scaleX: currentStep > idx + 1 ? 1 : 0,
        duration: 450,
        easing: 'easeOutExpo',
      });
    });
  }, [currentStep]);

  return (
    <ol className="flex items-center" aria-label="Sign-up steps">
      {STEPS.map((s, idx) => {
        const isDone = currentStep > s.id;
        const isActive = currentStep === s.id;
        const canJump = s.id <= maxStep && !isActive;

        return (
          <li key={s.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => canJump && onStepSelect(s.id)}
              disabled={!canJump}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Step ${s.id} of ${STEPS.length}: ${s.label}`}
              className="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-1 enabled:cursor-pointer disabled:cursor-default"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ring-1 transition-[background-color,color,box-shadow] duration-300 ${
                  isDone
                    ? 'bg-brand-500 text-white ring-brand-500 group-enabled:group-hover:bg-brand-400'
                    : isActive
                      ? 'bg-brand-500/15 text-brand-300 ring-brand-500/60'
                      : 'bg-white/[0.04] text-ink-500 ring-white/10'
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : s.id}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] ${
                  isActive ? 'text-brand-300' : isDone ? 'text-ink-300' : 'text-ink-600'
                }`}
              >
                {s.label}
              </span>
            </button>

            {idx < STEPS.length - 1 && (
              <span className="relative mx-2 h-px flex-1 bg-white/10">
                <span
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 origin-left bg-brand-500/70"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
