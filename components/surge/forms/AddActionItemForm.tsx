"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { FieldWrapper, Input, Textarea, Select, Button } from "../ui/FormField";
import type { ActionItem, ActionItemType } from "@/lib/surge/types";

interface AddActionItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: ActionItem) => void;
  clientId: string;
  staff: { id: string; name: string; role: string }[];
  jobs?: { id: string; customerName: string; externalJobId: string }[];
}

export function AddActionItemForm({
  open,
  onClose,
  onSave,
  clientId,
  staff,
  jobs = [],
}: AddActionItemFormProps) {
  const [form, setForm] = useState<Partial<ActionItem>>({
    assignedToStaffId: staff[0]?.id || "",
    type: "call_adjuster",
    priority: "high",
    title: "",
    description: "",
    dollarImpact: 0,
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    sourceJobId: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = "Title required";
    if (!form.assignedToStaffId) e.assignedToStaffId = "Assign to someone";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const item: ActionItem = {
      id: `ai-${Date.now()}`,
      clientId,
      assignedToStaffId: form.assignedToStaffId!,
      type: (form.type as ActionItemType) || "call_adjuster",
      priority: (form.priority as ActionItem["priority"]) || "high",
      title: form.title!,
      description: form.description || "",
      dollarImpact: Number(form.dollarImpact) || 0,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString(),
      completedAt: null,
      sourceJobId: form.sourceJobId || null,
      generatedBy: "manual",
    };
    onSave(item);
    onClose();
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Action Item" subtitle="Create a task for your team">
      <div className="space-y-5">
        <FieldWrapper label="Title" required error={errors.title}>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Call Tom Reynolds at State Farm on James Wilson job"
          />
        </FieldWrapper>

        <FieldWrapper label="Description" hint="Context, dollar impact, what's at stake">
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Job just entered 5.0 status. First collection SMS sent. No response in 72 hours. Direct adjuster call needed."
          />
        </FieldWrapper>

        <div className="grid grid-cols-3 gap-4">
          <FieldWrapper label="Type">
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ActionItemType })}
            >
              <option value="call_adjuster">Call Adjuster</option>
              <option value="upload_docs">Upload Documents</option>
              <option value="follow_up_invoice">Follow Up Invoice</option>
              <option value="supplement_prep">Supplement Prep</option>
              <option value="response_review">Review Response</option>
              <option value="training_assigned">Training Assigned</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Priority">
            <Select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value as ActionItem["priority"] })
              }
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Due Date">
            <Input
              type="date"
              value={form.dueDate || ""}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </FieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Assigned To" required error={errors.assignedToStaffId}>
            <Select
              value={form.assignedToStaffId}
              onChange={(e) => setForm({ ...form, assignedToStaffId: e.target.value })}
            >
              <option value="">— Select team member —</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.replace("_", " ")})
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Dollar Impact ($)" hint="What's at stake if not actioned?">
            <Input
              type="number"
              value={form.dollarImpact || ""}
              onChange={(e) => setForm({ ...form, dollarImpact: Number(e.target.value) })}
              placeholder="0"
            />
          </FieldWrapper>
        </div>

        {jobs.length > 0 && (
          <FieldWrapper label="Source Job" hint="Is this tied to a specific job?">
            <Select
              value={form.sourceJobId || ""}
              onChange={(e) => setForm({ ...form, sourceJobId: e.target.value || null })}
            >
              <option value="">— None —</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.customerName} ({j.externalJobId})
                </option>
              ))}
            </Select>
          </FieldWrapper>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2520]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Action Item</Button>
        </div>
      </div>
    </Modal>
  );
}
