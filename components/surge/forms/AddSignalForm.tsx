"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { FieldWrapper, Input, Textarea, Select, Button } from "../ui/FormField";
import type { Signal, TriggerEventType } from "@/lib/surge/types";

interface AddSignalFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (signal: Signal) => void;
}

export function AddSignalForm({ open, onClose, onSave }: AddSignalFormProps) {
  const [form, setForm] = useState<Partial<Signal>>({
    type: "hiring",
    source: "manual",
    companyName: "",
    contactName: "",
    summary: "",
    url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.companyName?.trim()) e.companyName = "Company name required";
    if (!form.summary?.trim()) e.summary = "Summary required";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const signal: Signal = {
      id: `s-${Date.now()}`,
      type: form.type as TriggerEventType,
      source: (form.source as Signal["source"]) || "manual",
      companyName: form.companyName!,
      contactName: form.contactName || "",
      summary: form.summary!,
      url: form.url || "",
      detectedAt: new Date().toISOString(),
      prospectId: null,
      status: "new",
      actionTaken: "",
    };
    onSave(signal);
    onClose();
    setForm({
      type: "hiring",
      source: "manual",
      companyName: "",
      contactName: "",
      summary: "",
      url: "",
    });
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Signal" subtitle="Log a trigger event you spotted manually">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Type">
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as TriggerEventType })}
            >
              <option value="hiring">Hiring</option>
              <option value="review">Negative Review</option>
              <option value="expansion">Expansion</option>
              <option value="leadership">Leadership Change</option>
              <option value="competitor">Competitor Dissatisfaction</option>
              <option value="award">Award</option>
              <option value="referral">Referral</option>
              <option value="cold">Other</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Source">
            <Select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value as Signal["source"] })}
            >
              <option value="manual">Manual entry</option>
              <option value="google_alerts">Google Alerts</option>
              <option value="linkedin">LinkedIn</option>
              <option value="indeed">Indeed</option>
              <option value="reviews">Reviews site</option>
              <option value="referral">Referral</option>
            </Select>
          </FieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Company Name" required error={errors.companyName}>
            <Input
              value={form.companyName || ""}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="ServPro of Denver"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Name">
            <Input
              value={form.contactName || ""}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="Optional"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Summary" required error={errors.summary}>
          <Textarea
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="What did you see that makes this a prospect signal?"
            rows={3}
          />
        </FieldWrapper>

        <FieldWrapper label="Source URL" hint="Link to the job posting, review, or article">
          <Input
            value={form.url || ""}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
        </FieldWrapper>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2520]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Signal</Button>
        </div>
      </div>
    </Modal>
  );
}
