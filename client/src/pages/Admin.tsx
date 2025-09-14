import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const [generating, setGenerating] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const { toast } = useToast();

  const generateSingleAudio = async () => {
    if (!lessonId) {
      toast({
        title: "Error",
        description: "Please enter a lesson ID",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-lesson-audio", {
        lessonId: parseInt(lessonId)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Audio generated for lesson ${lessonId}`,
        });
      } else {
        throw new Error("Failed to generate audio");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate audio",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateAllAudio = async () => {
    setBulkGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-all-audio", {});

      if (response.ok) {
        const result = await response.json();
        const successCount = result.results.filter((r: any) => r.success).length;
        toast({
          title: "Success",
          description: `Generated audio for ${successCount} lessons`,
        });
      } else {
        throw new Error("Failed to generate audio");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate audio",
        variant: "destructive",
      });
    } finally {
      setBulkGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Generate audio for lessons</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Single Lesson Audio Generation */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Single Lesson Audio</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label htmlFor="lessonId" className="block text-sm font-medium mb-2">
                  Lesson ID
                </label>
                <input
                  id="lessonId"
                  type="number"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter lesson ID (1-25)"
                  data-testid="input-lesson-id"
                />
              </div>
              <Button 
                onClick={generateSingleAudio} 
                disabled={generating}
                data-testid="button-generate-single"
              >
                {generating ? "Generating..." : "Generate Audio"}
              </Button>
            </div>
          </Card>

          {/* Bulk Audio Generation */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Audio for All Lessons</h2>
            <p className="text-muted-foreground mb-4">
              This will generate audio for the first 10 lessons. Each lesson will have both normal and slow speed audio.
            </p>
            <Button 
              onClick={generateAllAudio} 
              disabled={bulkGenerating}
              data-testid="button-generate-all"
            >
              {bulkGenerating ? "Generating All..." : "Generate All Audio"}
            </Button>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Single lesson: Generate audio for a specific lesson by ID (1-25)</p>
              <p>• Bulk generation: Generate audio for the first 10 lessons at once</p>
              <p>• Audio files are saved to the public/audio directory</p>
              <p>• Each lesson gets both normal and slow speed pronunciation</p>
              <p>• The system uses OpenAI's text-to-speech API to generate authentic Amharic pronunciation</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}