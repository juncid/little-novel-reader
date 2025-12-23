import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Book, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface Translation {
    id: number;
    pages: number[];
    text: string;
    created_at: string;
    updated_at: string;
}

interface Document {
    id: string;
    filename: string;
    page_count: number;
    pages_processed: number;
    status: string;
    translation_count: number;
}

interface TranslationReaderProps {
    document: Document;
    onClose: () => void;
    userId?: string;
}

export function TranslationReader({ document, onClose, userId }: TranslationReaderProps) {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Guardar progreso en el backend
    const saveProgress = useCallback(async (pageIndex: number) => {
        if (!userId) return;

        try {
            await fetch(`/api/users/${userId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_id: document.id,
                    current_page: pageIndex,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (err) {
            console.error("Error saving progress:", err);
        }
    }, [userId, document.id]);

    // Cargar traducciones y progreso
    useEffect(() => {
        async function fetchData() {
            try {
                // Cargar traducciones
                const response = await fetch(`/api/documents/${document.id}/translations`);
                if (!response.ok) throw new Error("Error al cargar traducciones");
                const data = await response.json();
                setTranslations(data.translations || []);

                // Cargar progreso del usuario
                if (userId) {
                    const progressRes = await fetch(`/api/users/${userId}/progress/${document.id}`);
                    if (progressRes.ok) {
                        const progress = await progressRes.json();
                        if (progress.current_page && progress.current_page < (data.translations?.length || 0)) {
                            setCurrentIndex(progress.current_page);
                        }
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [document.id, userId]);

    const goToNext = () => {
        if (currentIndex < translations.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            saveProgress(newIndex);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            saveProgress(newIndex);
        }
    };

    const goToPage = (index: number) => {
        setCurrentIndex(index);
        saveProgress(index);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goToNext();
            else if (e.key === "ArrowLeft") goToPrev();
            else if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, translations.length]);

    // Guardar progreso al cerrar
    useEffect(() => {
        return () => {
            if (userId && translations.length > 0) {
                saveProgress(currentIndex);
            }
        };
    }, []);

    const currentTranslation = translations[currentIndex];

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden">
            <div className="h-full flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Book className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-lg font-semibold">{document.filename}</h1>
                            <p className="text-sm text-muted-foreground">
                                {translations.length} traducciones disponibles
                                {userId && <span className="ml-2 text-primary">• Progreso guardado</span>}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Cerrar lector"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Cargando traducciones...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-destructive">{error}</p>
                        </div>
                    ) : translations.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No hay traducciones disponibles.</p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Página{currentTranslation.pages.length > 1 ? 's' : ''}: {currentTranslation.pages.join(', ')}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {currentIndex + 1} / {translations.length}
                                </span>
                            </div>
                            <article className="prose prose-lg dark:prose-invert max-w-none">
                                {currentTranslation.text.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 leading-relaxed text-foreground">
                                        {paragraph}
                                    </p>
                                ))}
                            </article>
                        </div>
                    )}
                </main>

                {/* Navigation Footer */}
                {!loading && !error && translations.length > 0 && (
                    <footer className="flex items-center justify-between p-4 border-t">
                        <Button
                            variant="outline"
                            onClick={goToPrev}
                            disabled={currentIndex === 0}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                        </Button>

                        <div className="flex gap-1">
                            {translations.slice(
                                Math.max(0, currentIndex - 3),
                                Math.min(translations.length, currentIndex + 4)
                            ).map((_, idx) => {
                                const actualIdx = Math.max(0, currentIndex - 3) + idx;
                                return (
                                    <button
                                        key={actualIdx}
                                        onClick={() => goToPage(actualIdx)}
                                        className={`w-2 h-2 rounded-full transition-colors ${actualIdx === currentIndex
                                            ? 'bg-primary'
                                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                            }`}
                                        aria-label={`Ir a traducción ${actualIdx + 1}`}
                                    />
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            onClick={goToNext}
                            disabled={currentIndex === translations.length - 1}
                            className="gap-2"
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </footer>
                )}
            </div>
        </div>
    );
}
