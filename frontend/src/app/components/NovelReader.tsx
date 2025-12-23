import { useState } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, Menu, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { NovelWithContent } from "./NovelCard";

interface NovelReaderProps {
  novel: NovelWithContent;
  onClose: () => void;
}

export function NovelReader({ novel, onClose }: NovelReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showChapterMenu, setShowChapterMenu] = useState(false);

  const currentChapter = novel.chapters[currentChapterIndex];
  const currentPage = currentChapter.pages[currentPageIndex];
  
  const totalPages = novel.chapters.reduce((sum, chapter) => sum + chapter.pages.length, 0);
  const pagesRead = novel.chapters
    .slice(0, currentChapterIndex)
    .reduce((sum, chapter) => sum + chapter.pages.length, 0) + currentPageIndex + 1;
  const progress = (pagesRead / totalPages) * 100;

  const goToNextPage = () => {
    if (currentPageIndex < currentChapter.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentChapterIndex < novel.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPageIndex(novel.chapters[currentChapterIndex - 1].pages.length - 1);
    }
  };

  const goToChapter = (chapterIndex: number) => {
    setCurrentChapterIndex(chapterIndex);
    setCurrentPageIndex(0);
    setShowChapterMenu(false);
  };

  const hasNextPage = currentPageIndex < currentChapter.pages.length - 1 || 
                      currentChapterIndex < novel.chapters.length - 1;
  const hasPreviousPage = currentPageIndex > 0 || currentChapterIndex > 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-title"
    >
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="Cerrar lector"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cerrar</span>
            </Button>

            <div className="flex-1 min-w-0 text-center">
              <h2 id="reader-title" className="truncate text-sm sm:text-base">
                {novel.title}
              </h2>
            </div>

            <Button
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="Menú de capítulos"
              aria-expanded={showChapterMenu}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Capítulos</span>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="pb-3 pt-1">
            <Progress value={progress} className="h-1" aria-label={`Progreso de lectura: ${Math.round(progress)}%`} />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Página {pagesRead} de {totalPages}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Menu Overlay */}
      {showChapterMenu && (
        <div 
          className="absolute top-14 inset-x-0 bottom-0 z-10 bg-background/95 backdrop-blur"
          onClick={() => setShowChapterMenu(false)}
        >
          <div className="container mx-auto px-4 py-6">
            <h3 className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              Índice de Capítulos
            </h3>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-2">
                {novel.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      index === currentChapterIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-accent hover:border-accent"
                    }`}
                    aria-current={index === currentChapterIndex ? "true" : undefined}
                  >
                    <div className="font-medium">Capítulo {chapter.number}</div>
                    <div className="text-sm opacity-90 mt-1">{chapter.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {chapter.pages.length} {chapter.pages.length === 1 ? "página" : "páginas"}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main Reading Area */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full flex flex-col">
          {/* Chapter Title */}
          <div className="border-b border-border bg-card/50 px-4 py-3 sticky top-0 z-10">
            <div className="container mx-auto">
              <div className="text-sm text-muted-foreground">Capítulo {currentChapter.number}</div>
              <h3 className="text-primary">{currentChapter.title}</h3>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-8">
              <div 
                className="prose prose-invert max-w-none"
                style={{ 
                  lineHeight: "1.8",
                  letterSpacing: "0.01em",
                  wordSpacing: "0.05em"
                }}
              >
                <p className="whitespace-pre-line text-foreground/95">
                  {currentPage}
                </p>
              </div>
            </div>
          </div>

          {/* Page Info */}
          <div className="border-t border-border bg-card/50 px-4 py-2 sticky bottom-0">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              Página {currentPageIndex + 1} de {currentChapter.pages.length}
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={goToPreviousPage}
              disabled={!hasPreviousPage}
              variant="outline"
              className="gap-2"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="flex-1 max-w-xs">
              <Select
                value={currentChapterIndex.toString()}
                onValueChange={(value) => goToChapter(parseInt(value))}
              >
                <SelectTrigger aria-label="Seleccionar capítulo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {novel.chapters.map((chapter, index) => (
                    <SelectItem key={chapter.id} value={index.toString()}>
                      Cap. {chapter.number}: {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={goToNextPage}
              disabled={!hasNextPage}
              variant="outline"
              className="gap-2"
              aria-label="Página siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}