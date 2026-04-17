"use client";

import { useState, useMemo } from "react";
import { Modal } from "../ui/Modal";
import { FieldWrapper, Input, Textarea, Select, Button } from "../ui/FormField";
import type { Prospect, ProspectTier, TriggerEventType } from "@/lib/surge/types";

interface AddProspectFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (prospect: Prospect) => void;
  initial?: Partial<Prospect>;
}

export function AddProspectForm({ open, onClose, onSave, initial }: AddProspectFormProps) {
  const [form, setForm] = useState<Partial<Prospect>>(
    initial || {
      companyName: "",
      contactName: "",
      title: "",
      email: "",
      phone: "",
      linkedIn: "",
      trade: "restoration",
      city: "",
      state: "",
      tier: 2,
      triggerEvent: "cold",
      triggerEventSummary: "",
      referralSource: "",
      notes: "",
      annualRevenue: 0,
      employeeCount: 0,
      estimatedValue: 35000,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ICP score calculation (live)
  const icpScore = useMemo(() => {
    let score = 0;
    // Business type fit
    score += form.trade === "restoration" ? 5 : form.trade === "roofing" ? 3 : 1;
    // Revenue band
    const rev = form.annualRevenue || 0;
    score += rev >= 1000000 && rev <= 10000000 ? 5 : rev >= 500000 ? 3 : 1;
    // Default middle values for things we don't capture in form
    score += 3; // current solution
    score += 3; // online presence
    score += 4; // decision accessibility (assume small business)
    score += 3; // geography
    return Math.min(30, score);
  }, [form.trade, form.annualRevenue]);

  // Auto-tier suggestion based on ICP
  const suggestedTier: ProspectTier = icpScore >= 24 ? 1 : icpScore >= 18 ? 2 : 3;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName?.trim()) e.companyName = "Company name required";
    if (!form.contactName?.trim()) e.contactName = "Contact name required";
    if (!form.triggerEventSummary?.trim()) e.triggerEventSummary = "Describe the trigger event";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const now = new Date().toISOString();
    const prospect: Prospect = {
      id: initial?.id || `p-${Date.now()}`,
      companyName: form.companyName!,
      contactName: form.contactName!,
      title: form.title || "",
      email: form.email || "",
      phone: form.phone || "",
      linkedIn: form.linkedIn || "",
      trade: (form.trade as Prospect["trade"]) || "restoration",
      annualRevenue: Number(form.annualRevenue) || 0,
      employeeCount: Number(form.employeeCount) || 0,
      city: form.city || "",
      state: form.state || "",
      tier: (form.tier as ProspectTier) || suggestedTier,
      icpScore,
      stage: initial?.stage || "unreached",
      spinStage: initial?.spinStage || "none",
      triggerEvent: (form.triggerEvent as TriggerEventType) || "cold",
      triggerEventDate: initial?.triggerEventDate || now,
      triggerEventSummary: form.triggerEventSummary || "",
      referralSource: form.referralSource || "",
      lastTouch: initial?.lastTouch || "",
      nextTouch: initial?.nextTouch || "",
      touchCount: initial?.touchCount || 0,
      estimatedValue: Number(form.estimatedValue) || 35000,
      notes: form.notes || "",
      createdAt: initial?.createdAt || now,
      updatedAt: now,
    };
    onSave(prospect);
    onClose();
    setForm({});
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial?.id ? "Edit Prospect" : "Add Prospect"}
      subtitle={`Auto-calculated ICP Score: ${icpScore}/30 · Suggested Tier: ${suggestedTier}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Company + Contact */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Company Name" required error={errors.companyName}>
            <Input
              value={form.companyName || ""}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Acme Restoration Services"
            />
          </FieldWrapper>
          <FieldWrapper label="Contact Name" required error={errors.contactName}>
            <Input
              value={form.contactName || ""}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="John Smith"
            />
          </FieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Title">
            <Input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Owner"
            />
          </FieldWrapper>
          <FieldWrapper label="Trade">
            <Select
              value={form.trade}
              onChange={(e) => setForm({ ...form, trade: e.target.value as Prospect["trade"] })}
            >
              <option value="restoration">Restoration</option>
              <option value="roofing">Roofing</option>
              <option value="hvac">HVAC</option>
              <option value="plumbing">Plumbing</option>
              <option value="other">Other</option>
            </Select>
          </FieldWrapper>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Email">
            <Input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@acme.com"
            />
          </FieldWrapper>
          <FieldWrapper label="Phone">
            <Input
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="LinkedIn URL">
          <Input
            value={form.linkedIn || ""}
            onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </FieldWrapper>

        {/* Location + Size */}
        <div className="grid grid-cols-3 gap-4">
          <FieldWrapper label="City">
            <Input
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Denver"
            />
          </FieldWrapper>
          <FieldWrapper label="State">
            <Input
              value={form.state || ""}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="CO"
              maxLength={2}
            />
          </FieldWrapper>
          <FieldWrapper label="Employees">
            <Input
              type="number"
              value={form.employeeCount || ""}
              onChange={(e) => setForm({ ...form, employeeCount: Number(e.target.value) })}
              placeholder="15"
            />
          </FieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Annual Revenue ($)" hint="Used for ICP scoring">
            <Input
              type="number"
              value={form.annualRevenue || ""}
              onChange={(e) => setForm({ ...form, annualRevenue: Number(e.target.value) })}
              placeholder="2500000"
            />
          </FieldWrapper>
          <FieldWrapper label="Estimated Deal Value ($)">
            <Input
              type="number"
              value={form.estimatedValue || ""}
              onChange={(e) => setForm({ ...form, estimatedValue: Number(e.target.value) })}
              placeholder="35000"
            />
          </FieldWrapper>
        </div>

        {/* Trigger event */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Trigger Event Type">
            <Select
              value={form.triggerEvent}
              onChange={(e) => setForm({ ...form, triggerEvent: e.target.value as TriggerEventType })}
            >
              <option value="hiring">Hiring signal</option>
              <option value="review">Negative review</option>
              <option value="expansion">Expansion announcement</option>
              <option value="leadership">Leadership change</option>
              <option value="competitor">Competitor dissatisfaction</option>
              <option value="award">Award/recognition</option>
              <option value="referral">Referral</option>
              <option value="cold">Cold (no signal)</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Tier">
            <Select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: Number(e.target.value) as ProspectTier })}
            >
              <option value={1}>Tier 1 (Priority)</option>
              <option value={2}>Tier 2 (Structured)</option>
              <option value={3}>Tier 3 (Nurture)</option>
            </Select>
          </FieldWrapper>
        </div>

        <FieldWrapper
          label="Trigger Event Summary"
          required
          error={errors.triggerEventSummary}
          hint="One-liner describing what triggered this prospect"
        >
          <Textarea
            value={form.triggerEventSummary || ""}
            onChange={(e) => setForm({ ...form, triggerEventSummary: e.target.value })}
            placeholder="Posted Ops Manager role on Indeed - $55-70K range. Hiring = investing in ops function."
          />
        </FieldWrapper>

        <FieldWrapper label="Referral Source" hint="Who sent this prospect? (e.g., Jared Watts)">
          <Input
            value={form.referralSource || ""}
            onChange={(e) => setForm({ ...form, referralSource: e.target.value })}
            placeholder="Optional"
          />
        </FieldWrapper>

        <FieldWrapper label="Notes">
          <Textarea
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Anything else worth remembering about this prospect"
            rows={4}
          />
        </FieldWrapper>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2520]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{initial?.id ? "Save Changes" : "Add Prospect"}</Button>
        </div>
      </div>
    </Modal>
  );
}
