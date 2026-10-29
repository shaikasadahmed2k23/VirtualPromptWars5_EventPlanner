import { LIMITS } from '@shared/limits';
import { Wand2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/input';
import { REFINE_SUGGESTIONS } from '../lib/refineSuggestions';

interface RefinePanelProps {
  onRefine: (instruction: string) => void;
  disabled: boolean;
}

/** Chat-style box for asking the AI to adjust the current plan. */
export function RefinePanel({ onRefine, disabled }: RefinePanelProps) {
  const [instruction, setInstruction] = useState('');
  const trimmed = instruction.trim();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed) return;
    onRefine(trimmed);
    setInstruction('');
  };

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={submit} aria-labelledby="refine-title" className="space-y-4">
        <div>
          <h2 id="refine-title" className="text-2xl">
            Refine your plan
          </h2>
          <p className="text-sm text-muted">Tell the planner what to change. Your current plan is kept in history.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested refinements">
          {REFINE_SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion}
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => {
                onRefine(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <Field
          label="Your request"
          hint={`${String(instruction.length)}/${String(LIMITS.refinementMax)} characters`}
          hideLabel
        >
          {(props) => (
            <Textarea
              {...props}
              value={instruction}
              maxLength={LIMITS.refinementMax}
              placeholder="e.g. Swap the DJ for a live band and add a late-night chai counter"
              onChange={(event) => {
                setInstruction(event.target.value);
              }}
            />
          )}
        </Field>
        <Button type="submit" disabled={disabled || !trimmed}>
          <Wand2 aria-hidden="true" />
          Refine plan
        </Button>
      </form>
    </Card>
  );
}
