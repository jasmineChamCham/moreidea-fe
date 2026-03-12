import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mentor, mentorsApi } from "@/lib/mentors.api";
import { MentorsTable } from "@/components/Mentors/MentorsTable";
import { MentorFormDialog } from "@/components/Mentors/MentorFormDialog";
import { toast } from "sonner";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MentorsPage() {
  const queryClient = useQueryClient();
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: mentorsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: mentorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      toast.success("Mentor deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete mentor");
    },
  });

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) setEditingMentor(null);
  };

  const refreshMentors = () => {
    queryClient.invalidateQueries({ queryKey: ["mentors"] });
  };

  return (
    <div className="container py-6 lg:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Mentors
        </h1>
        <Button className="font-display" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Mentor
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <MentorsTable
              mentors={mentors}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onSuccess={refreshMentors}
            />
          </CardContent>
        </Card>
      )}

      {editingMentor && (
        <MentorFormDialog
          open={isEditDialogOpen}
          onOpenChange={handleEditClose}
          mentor={editingMentor}
          onSuccess={refreshMentors}
        />
      )}

      <MentorFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refreshMentors}
      />
    </div>
  );
}
