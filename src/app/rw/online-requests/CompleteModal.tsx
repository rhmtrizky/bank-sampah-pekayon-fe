"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/lib/axios";

interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onSuccess: () => void;
  weight: number;
}

export default function CompleteModal({
  isOpen,
  onClose,
  requestId,
  onSuccess,
  weight
}: CompleteModalProps) {
  const [actualWeight, setActualWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActualWeight(weight.toString());
    }
  }, [isOpen, weight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(actualWeight);
    
    if (!actualWeight || weight <= 0) {
      setError("Actual weight must be a positive number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.patch(`/deposit-request/${requestId}/complete`, {
        actual_weight_kg: weight,
      });
      
      onSuccess();
      onClose();
      setActualWeight("");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to complete request"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setActualWeight("");
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Complete Pickup
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <Label>
            Actual Weight (kg) <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            step={0.001}
            min="0.001"
            value={actualWeight}
            onChange={(e) => setActualWeight(e.target.value)}
            placeholder="e.g., 5.5"
            required
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Masukkan berat aktual sampah yang telah dijemput (dalam kg)
          </p>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Completing..." : "Mark as Completed"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
