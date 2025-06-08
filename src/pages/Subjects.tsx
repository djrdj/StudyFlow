
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoredData, addSubject, updateSubject, deleteSubject, formatTime } from "@/lib/storage";

const Subjects = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState(() => getStoredData().subjects);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const refreshSubjects = () => {
    setSubjects(getStoredData().subjects);
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName);
      setNewSubjectName("");
      refreshSubjects();
      toast({
        title: "Subject Added",
        description: `${newSubjectName.trim()} has been added to your subjects.`,
      });
    }
  };

  const handleDeleteSubject = (id: string, name: string, totalTime: number) => {
    if (totalTime > 0) {
      const confirmed = window.confirm(
        `⚠️ Warning: "${name}" has ${formatTime(totalTime)} of recorded study time. Deleting this subject will permanently remove all this data. Are you sure you want to continue?`
      );
      if (!confirmed) return;
    }

    deleteSubject(id);
    refreshSubjects();
    toast({
      title: "Subject Deleted",
      description: `${name} has been removed from your subjects.`,
      variant: "destructive",
    });
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = () => {
    if (editingName.trim() && editingId) {
      updateSubject(editingId, { name: editingName.trim() });
      refreshSubjects();
      setEditingId(null);
      setEditingName("");
      toast({
        title: "Subject Updated",
        description: "Subject name has been updated successfully.",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Manage Subjects</h1>
        <p className="text-lg text-muted-foreground">Add, edit, or remove your study subjects</p>
      </div>

      {/* Add New Subject */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Add New Subject</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter subject name (e.g., Mathematics, Science)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddSubject}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!newSubjectName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-secondary-foreground" />
            <span>Your Subjects ({subjects.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No subjects yet</p>
              <p className="text-sm text-muted-foreground">Add your first subject above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 bg-studyflow-light-gray rounded-lg border border-studyflow-gray hover:shadow-sm transition-all">
                  <div className="flex-1">
                    {editingId === subject.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          className="max-w-xs"
                          autoFocus
                        />
                        <Button
                          onClick={saveEdit}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-foreground text-lg">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Total study time: {formatTime(subject.totalTime)}
                        </p>
                      </>
                    )}
                  </div>
                  {editingId !== subject.id && (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => startEditing(subject.id, subject.name)}
                        size="sm"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSubject(subject.id, subject.name, subject.totalTime)}
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;
