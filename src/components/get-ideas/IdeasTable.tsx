import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Edit2, Trash2, Check, X, Plus, Star } from "lucide-react";
import { sourcesApi, ExtractedIdea } from "@/lib/sources.api";

type Idea = ExtractedIdea;

interface IdeasTableProps {
  ideas: Idea[];
  sourceId: string;
  sourceCreator: string | null;
  sourceTitle: string;
  onRefresh: () => void;
}

export default function IdeasTable({ ideas, sourceId, sourceCreator, sourceTitle, onRefresh }: IdeasTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ ideaText: "", core: "", importance: "", application: "", example: "" });
  const [addingIdea, setAddingIdea] = useState(false);
  const [newIdea, setNewIdea] = useState({ ideaText: "", core: "", importance: "", application: "", example: "" });

  const handleStartEdit = (idea: Idea) => {
    setEditingId(idea.id);
    setEditValues({
      ideaText: idea.ideaText,
      core: idea.core || "",
      importance: idea.importance || "",
      application: idea.application || "",
      example: idea.example || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await sourcesApi.updateIdea(editingId, editValues);
      setEditingId(null);
      onRefresh();
    } catch (e) {
      toast.error("Failed to update idea");
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await sourcesApi.deleteIdea(id);
      onRefresh();
    } catch (e) {
      toast.error("Failed to delete idea");
    }
  };

  const handleAddIdea = async () => {
    if (!newIdea.ideaText.trim()) return;
    try {
      await sourcesApi.createIdea(sourceId, {
        ideaText: newIdea.ideaText.trim(),
        core: newIdea.core.trim() || undefined,
        importance: newIdea.importance.trim() || undefined,
        application: newIdea.application.trim() || undefined,
        example: newIdea.example.trim() || undefined,
      });
      setNewIdea({ ideaText: "", core: "", importance: "", application: "", example: "" });
      setAddingIdea(false);
      onRefresh();
    } catch (e) {
      toast.error("Failed to add idea");
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Idea</TableHead>
            <TableHead className="w-[15%]">Core</TableHead>
            <TableHead className="w-[15%]">Importance</TableHead>
            <TableHead className="w-[15%]">Application</TableHead>
            <TableHead className="w-[15%]">Example</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea) => (
            <TableRow key={idea.id}>
              {editingId === idea.id ? (
                <>
                  <TableCell>
                    <Input value={editValues.ideaText} onChange={(e) => setEditValues(v => ({ ...v, ideaText: e.target.value }))} />
                  </TableCell>
                  <TableCell>
                    <Input value={editValues.core} onChange={(e) => setEditValues(v => ({ ...v, core: e.target.value }))} />
                  </TableCell>
                  <TableCell>
                    <Input value={editValues.importance} onChange={(e) => setEditValues(v => ({ ...v, importance: e.target.value }))} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Application..." value={editValues.application || ""} onChange={(e) => setEditValues(v => ({ ...v, application: e.target.value }))} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Example..." value={editValues.example || ""} onChange={(e) => setEditValues(v => ({ ...v, example: e.target.value }))} />
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-sm">{idea.ideaText}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{idea.core || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{idea.importance || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{idea.application || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{idea.example || "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEdit(idea)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteIdea(idea.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {addingIdea && (
            <TableRow>
              <TableCell>
                <Input placeholder="New idea..." value={newIdea.ideaText} onChange={(e) => setNewIdea(v => ({ ...v, ideaText: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Input placeholder="Core..." value={newIdea.core} onChange={(e) => setNewIdea(v => ({ ...v, core: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Input placeholder="Importance..." value={newIdea.importance} onChange={(e) => setNewIdea(v => ({ ...v, importance: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Input placeholder="Application..." value={newIdea.application || ""} onChange={(e) => setNewIdea(v => ({ ...v, application: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Input placeholder="Example..." value={newIdea.example || ""} onChange={(e) => setNewIdea(v => ({ ...v, example: e.target.value }))} />
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAddIdea}>
                  <Check className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAddingIdea(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
          {ideas.length === 0 && !addingIdea && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No ideas yet. Add a source to generate ideas with AI.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-start mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={() => setAddingIdea(true)} disabled={addingIdea}>
          <Plus className="h-4 w-4" /> Add Idea
        </Button>
      </div>
    </div>
  );
}
