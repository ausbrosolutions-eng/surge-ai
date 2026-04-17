"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { FieldWrapper, Input, Textarea, Select, Button } from "../ui/FormField";
import type { Activity, ActivityType, SpinStage } from "@/lib/surge/types";

interface LogActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  prospects: { id: string; companyName: string; contactName: string }[];
  clients: { id: string; companyName: string }[];
  defaultProspectId?: string;
}

export function LogActivityForm({
  open,
  onClose,
  onSave,
  prospects,
  clients,
  defaultProspectId,
}: LogActivityFormProps) {
  const [form, setForm] = useState<Partial<Activity>>({
    prospectId: defaultProspectId || null,
    clientId: null,
    type: "call",
    direction: "outbound",
    subject: "",
    summary: "",
    recordingUrl: "",
    sentiment: "neutral",
    spinStageReached: "none",
    nextStepIdentified: "",
    nextStepDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.subject?.trim()) e.subject = "Subject required";
    if (!form.summary?.trim()) e.summary = "Summary required";
    if (!form.prospectId && !form.clientId) e.target = "Select a prospect or client";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const activity: Activity = {
      id: `ac-${Date.now()}`,
      prospectId: form.prospectId || null,
      clientId: form.clientId || null,
      type: form.type as ActivityType,
      direction: (form.direction as "inbound" | "outbound") || "outbound",
      subject: form.subject!,
      summary: form.summary!,
      recordingUrl: form.recordingUrl || "",
      sentiment: (form.sentiment as Activity["sentiment"]) || "neutral",
      spinStageReached: (form.spinStageReached as SpinStage) || "none",
      nextStepIdentified: form.nextStepIdentified || "",
      nextStepDate: form.nextStepDate || "",
      createdAt: new Date().toISOString(),
    };
    onSave(activity);
    onClose();
    setForm({
      prospectId: null,
      clientId: null,
      type: "call",
      direction: "outbound",
      subject: "",
      summary: "",
      recordingUrl: "",
      sentiment: "neutral",
      spinStageReached: "none",
    });
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Activity"
      subtitle="Every call, email, and touch logged and searchable"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Target */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Prospect">
            <Select
              value={form.prospectId || ""}
              onChange={(e) =>
                setForm({ ...form, prospectId: e.target.value || null, clientId: null })
              }
            >
              <option value="">— None —</option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} · {p.contactName}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Retainer Client">
            <Select
              value={form.clientId || ""}
              onChange={(e) =>
                setForm({ ...form, clientId: e.target.value || null, prospectId: null })
              }
            >
              <option value="">— None —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </div>
        {errors.target && <p className="font-sans text-xs text-[#EF4444]">{errors.target}</p>}

        {/* Type + Direction */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Activity Type">
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })}
            >
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting / Video Call</option>
              <option value="email_sent">Email Sent</option>
              <option value="email_received">Email Received</option>
              <option value="linkedin_touch">LinkedIn Touch</option>
              <option value="contract_sent">Contract Sent</option>
              <option value="payment_received">Payment Received</option>
              <option value="note">Note</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Direction">
            <Select
              value={form.direction}
              onChange={(e) =>
                setForm({ ...form, direction: e.target.value as "inbound" | "outbound" })
              }
            >
              <option value="outbound">Outbound (you initiated)</option>
              <option value="inbound">Inbound (they initiated)</option>
            </Select>
          </FieldWrapper>
        </div>

        {/* Subject + Summary */}
        <FieldWrapper label="Subject" required error={errors.subject}>
          <Input
            value={form.subject || ""}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Discovery call with David Ashton"
          />
        </FieldWrapper>

        <FieldWrapper
          label="Summary"
          required
          error={errors.summary}
          hint="What happened? What did they say? What did you learn?"
        >
          <Textarea
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={5}
            placeholder="45-min call. David confirmed quoting bottleneck, 14 producers doing manual entry. Implication questions hit - he calculated $180K/yr lost capacity. Ready to move on audit."
          />
        </FieldWrapper>

        {/* SPIN stage + sentiment */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper
            label="SPIN Stage Reached"
            hint="How deep did the conversation go?"
          >
            <Select
              value={form.spinStageReached}
              onChange={(e) =>
                setForm({ ...form, spinStageReached: e.target.value as SpinStage })
              }
            >
              <option value="none">— N/A —</option>
              <option value="situation">Situation (facts)</option>
              <option value="problem">Problem (pain surfaced)</option>
              <option value="implication">Implication (cost of inaction)</option>
              <option value="payoff">Need-Payoff (they sold themselves)</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Sentiment">
            <Select
              value={form.sentiment}
              onChange={(e) =>
                setForm({ ...form, sentiment: e.target.value as Activity["sentiment"] })
              }
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </Select>
          </FieldWrapper>
        </div>

        {/* Next step */}
        <div className="grid grid-cols-3 gap-4">
          <FieldWrapper label="Next Step" hint="What's the specific next action?" >
            <Input
              value={form.nextStepIdentified || ""}
              onChange={(e) => setForm({ ...form, nextStepIdentified: e.target.value })}
              placeholder="Send audit proposal + contract"
            />
          </FieldWrapper>
          <FieldWrapper label="Next Step Date">
            <Input
              type="date"
              value={form.nextStepDate ? form.nextStepDate.split("T")[0] : ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  nextStepDate: e.target.value ? new Date(e.target.value).toISOString() : "",
                })
              }
            />
          </FieldWrapper>
          <FieldWrapper label="Recording URL" hint="Fireflies/Loom link">
            <Input
              value={form.recordingUrl || ""}
              onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })}
              placeholder="Optional"
            />
          </FieldWrapper>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2520]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Log Activity</Button>
        </div>
      </div>
    </Modal>
  );
}
