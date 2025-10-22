"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuests } from "@/store/useGuests";
import { useToast } from "./toast";
import { guestFormSchema, GuestFormInput } from "@/lib/guest-validation";
import { Guest, GuestTag } from "@/types/guest";

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

const availableTags: GuestTag[] = ["VIP", "Do-not-disturb", "No-smoking", "Wheelchair-accessible", "Extended-stay", "Corporate"];

export function EditGuestModal({ isOpen, onClose, guest }: EditGuestModalProps) {
  const { updateGuest } = useGuests();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<GuestTag[]>(guest?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GuestFormInput>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: guest?.firstName || "",
      lastName: guest?.lastName || "",
      email: guest?.email || "",
      phone: guest?.phone || "",
      nationality: guest?.nationality || "",
      passportNumber: guest?.passportNumber || "",
      dateOfBirth: guest?.dateOfBirth || "",
      preferredLanguage: guest?.preferredLanguage || "English",
      emergencyContact: guest?.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  });

  useEffect(() => {
    if (guest) {
      setSelectedTags(guest.tags);
      reset({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        nationality: guest.nationality,
        passportNumber: guest.passportNumber,
        dateOfBirth: guest.dateOfBirth,
        preferredLanguage: guest.preferredLanguage,
        preferences: guest.preferences,
        emergencyContact: guest.emergencyContact,
        notes: guest.notes,
      });
    }
  }, [guest, reset]);

  const onSubmitForm = async (data: GuestFormInput) => {
    if (!guest) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateGuest(guest.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality,
        passportNumber: data.passportNumber,
        dateOfBirth: data.dateOfBirth,
        preferredLanguage: data.preferredLanguage,
        tags: selectedTags,
        preferences: data.preferences || {},
        emergencyContact: data.emergencyContact,
        notes: data.notes || "",
      });

      showToast("Guest updated successfully", "success");
      onClose();
    } catch (error) {
      showToast("Failed to update guest", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !guest) return null;

  const toggleTag = (tag: GuestTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: "700px" }}>
        <div className="modal-header">
          <h2>Edit Guest Profile</h2>
          <button className="modal-close" onClick={onClose} title="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                {...register("firstName")}
                className="form-input w-full"
              />
              {errors.firstName && (
                <p className="form-error">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                {...register("lastName")}
                className="form-input w-full"
              />
              {errors.lastName && (
                <p className="form-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Email *</label>
              <input
                type="email"
                {...register("email")}
                className="form-input w-full"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                {...register("phone")}
                className="form-input w-full"
              />
              {errors.phone && (
                <p className="form-error">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Nationality *</label>
              <input
                type="text"
                {...register("nationality")}
                className="form-input w-full"
              />
              {errors.nationality && (
                <p className="form-error">{errors.nationality.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Passport Number *</label>
              <input
                type="text"
                {...register("passportNumber")}
                className="form-input w-full"
              />
              {errors.passportNumber && (
                <p className="form-error">{errors.passportNumber.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="form-input w-full"
              />
              {errors.dateOfBirth && (
                <p className="form-error">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Preferred Language *</label>
              <select {...register("preferredLanguage")} className="form-input w-full">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-white"
                      : "bg-background border border-border hover:border-primary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Emergency Contact Name *</label>
            <input
              type="text"
              {...register("emergencyContact.name")}
              className="form-input w-full"
            />
            {errors.emergencyContact?.name && (
              <p className="form-error">{errors.emergencyContact.name.message}</p>
            )}
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Relationship *</label>
              <input
                type="text"
                {...register("emergencyContact.relationship")}
                className="form-input w-full"
              />
              {errors.emergencyContact?.relationship && (
                <p className="form-error">{errors.emergencyContact.relationship.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                {...register("emergencyContact.phone")}
                className="form-input w-full"
              />
              {errors.emergencyContact?.phone && (
                <p className="form-error">{errors.emergencyContact.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">Allergies (Optional)</label>
            <textarea
              placeholder="Known allergies..."
              {...register("preferences.allergies")}
              className="form-textarea w-full"
              rows={2}
            />
          </div>

          <div>
            <label className="form-label">Special Requests (Optional)</label>
            <textarea
              placeholder="Any special requests or preferences..."
              {...register("preferences.specialRequests")}
              className="form-textarea w-full"
              rows={2}
            />
          </div>

          <div>
            <label className="form-label">Notes (Optional)</label>
            <textarea
              placeholder="Additional notes about this guest..."
              {...register("notes")}
              className="form-textarea w-full"
              rows={2}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Guest"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
