import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mentor, mentorsApi } from "@/lib/mentors.api";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface MentorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor?: Mentor | null;
  onSuccess: () => void;
}

export function MentorFormDialog({
  open,
  onOpenChange,
  mentor,
  onSuccess,
}: MentorFormDialogProps) {
  const isEditing = !!mentor;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Partial<Mentor>>();
  const [isGenerating, setIsGenerating] = useState(false);
  const avatarUrl = watch("avatarUrl");
  const name = watch("name");

  useEffect(() => {
    if (mentor) {
      reset(mentor);
    } else {
      reset({});
    }
  }, [mentor, reset]);

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Mentor>) => {
      if (isEditing) {
        return mentorsApi.update(mentor.id, data);
      }
      return mentorsApi.create(data);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Mentor updated" : "Mentor created");
      onSuccess();
      onOpenChange(false);
      reset();
    },
    onError: (error) => {
      toast.error("Failed to save mentor");
      console.error(error);
    },
  });

  const onSubmit = (data: Partial<Mentor>) => {
    saveMutation.mutate(data);
  };

  const handleGenerateData = async () => {
    if (!name) {
      toast.error("Please enter a mentor name first");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedData = await mentorsApi.generateData(name);
      Object.keys(generatedData).forEach((key) => {
        // Only set the generated data; don't wipe name/avatarUrl
        if (key !== 'name' && key !== 'id' && key !== 'avatarUrl') {
           setValue(key as keyof Mentor, generatedData[key as keyof Mentor]);
        }
      });
      toast.success("Mentor data generated successfully!");
    } catch (e) {
      toast.error("Failed to generate data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Mentor" : "Create Mentor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="flex gap-2">
                <Input
                  {...register("name", { required: true })}
                  placeholder="e.g. Marcus Aurelius"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateData}
                  disabled={isGenerating || !name}
                  className="shrink-0 group relative overflow-hidden"
                  title="Generate data using AI"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </Button>
              </div>
              {errors.name && <span className="text-sm text-destructive">Name is required</span>}
            </div>

            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                {...register("avatarUrl")}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          {avatarUrl && (
            <div className="flex justify-center my-4">
              <img 
                src={avatarUrl} 
                alt="Avatar Preview" 
                className="w-32 h-32 rounded-full object-cover shadow-md border border-border" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Archetype</Label>
              <Input {...register("archetype")} placeholder="e.g. The Philosopher King" />
            </div>
            <div className="space-y-2">
              <Label>Era</Label>
              <Input {...register("era")} placeholder="e.g. Ancient Rome" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea {...register("bio")} className="h-20" placeholder="Brief biography..." />
          </div>

          <div className="space-y-2">
            <Label>Philosophy</Label>
            <Textarea {...register("philosophy")} placeholder="Core philosophy..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mindset</Label>
              <Input {...register("mindset")} placeholder="Approaches to life..." />
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Input {...register("style")} placeholder="Teaching/leadership style..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Speaking Style</Label>
              <Input {...register("speakingStyle")} />
            </div>
            <div className="space-y-2">
              <Label>Body Language</Label>
              <Input {...register("bodyLanguage")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Mentor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
