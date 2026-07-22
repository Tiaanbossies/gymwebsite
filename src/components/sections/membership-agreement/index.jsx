import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';

import StepDetails from './StepDetails.jsx';
import StepIndicator from './StepIndicator.jsx';
import StepPlan from './StepPlan.jsx';
import StepSign from './StepSign.jsx';
import SuccessPanel from './SuccessPanel.jsx';
import { STEPS } from './plans.js';
import { useAgreementForm } from './useAgreementForm.js';

const LAST_STEP = STEPS.length;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -36 : 36, opacity: 0, transition: { duration: 0.2 } }),
};

export default function MembershipAgreementForm() {
  const {
    form,
    errors,
    errorCount,
    step,
    maxStep,
    direction,
    isPt,
    planSummary,
    formRef,
    sendState,
    submitted,
    showResumeNotice,
    onChange,
    onHealthToggle,
    goNext,
    goBack,
    goToStep,
    onSubmit,
    downloadCopy,
    startOver,
    dismissResumeNotice,
  } = useAgreementForm();

  if (submitted) {
    return <SuccessPanel form={form} planSummary={planSummary} onDownload={downloadCopy} />;
  }

  const isSending = sendState.status === 'sending';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <StepIndicator currentStep={step} maxStep={maxStep} onStepSelect={goToStep} />

      {showResumeNotice && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-ink-300">
          <span>We kept what you filled in earlier — carry on where you left off.</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startOver}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 underline-offset-2 hover:underline"
            >
              <RotateCcw size={13} strokeWidth={2.5} />
              Start over
            </button>
            <button
              type="button"
              onClick={dismissResumeNotice}
              className="text-xs font-semibold text-ink-500 underline-offset-2 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Announced to screen readers; the visible cue is the summary below. */}
      <p aria-live="polite" className="sr-only">
        {errorCount > 0
          ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} your attention.`
          : ''}
      </p>

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 1 && (
              <StepPlan
                form={form}
                errors={errors}
                onChange={onChange}
                planSummary={planSummary}
                isPt={isPt}
              />
            )}
            {step === 2 && (
              <StepDetails
                form={form}
                errors={errors}
                onChange={onChange}
                onHealthToggle={onHealthToggle}
              />
            )}
            {step === 3 && (
              <StepSign
                form={form}
                errors={errors}
                onChange={onChange}
                planSummary={planSummary}
                isPt={isPt}
                onEditStep={goToStep}
                sendState={sendState}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {errorCount > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
          <span>
            {errorCount === 1
              ? 'One field still needs your attention — it is highlighted above.'
              : `${errorCount} fields still need your attention — they are highlighted above.`}
          </span>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="btn-ghost disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink-500">
            Step {step} of {LAST_STEP}
          </span>
          {step < LAST_STEP ? (
            <button type="button" onClick={goNext} className="btn-primary">
              <span>Next</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSending}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <span>Sending…</span>
                  <Loader2 size={15} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Complete agreement</span>
                  <CheckCircle2 size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-500">
        No payment is taken here — the gym confirms final sign-up steps with you directly.
      </p>
    </form>
  );
}
