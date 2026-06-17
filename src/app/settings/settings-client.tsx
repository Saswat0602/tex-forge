"use client";

import { useState } from "react";
import { updateProfile, deleteAccount } from "@/actions/user.actions";
import { toast } from "sonner";
import { Loader2, Save, Trash2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SettingsClient({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateProfile(name);
      if (res.ok) {
        toast.success("Profile updated! You may need to log out and log back in to see changes everywhere.");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all your projects!")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.ok) {
        toast.success("Account deleted.");
        signOut({ callbackUrl: "/" });
      } else {
        toast.error(res.error || "Failed to delete account");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Account Preferences</h3>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || name === initialName}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="border rounded-lg bg-card p-6 shadow-sm border-destructive/20">
        <h3 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated LaTeX projects. This action is not reversible.
        </p>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground text-destructive h-10 px-4 py-2"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
          Delete Account
        </button>
      </div>
    </div>
  );
}
