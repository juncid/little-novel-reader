import { X, Calendar, User, Book, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import type { Novel } from "./NovelCard";

interface NovelDetailProps {
  novel: Novel;
  onClose: () => void;
  onRead?: () => void;
}

export function NovelDetail({ novel, onClose, onRead }: NovelDetailProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="novel-detail-title"
    >
      <div className="container mx-auto min-h-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 -mt-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="gap-2"
              aria-label="Volver a la lista de novelas"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="flex-1 pb-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="sticky top-0 space-y-4">
                  <div className="relative overflow-hidden rounded-lg shadow-2xl shadow-primary/30">
                    <img
                      src={novel.coverImage}
                      alt={`Portada de ${novel.title}`}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {novel.genre}
                    </Badge>
                    
                    <div className="flex items-center gap-1" aria-label={`Calificación: ${novel.rating} de 5 estrellas`}>
                      {[...Array(5)].map((_, i) => (
                        <Book
                          key={i}
                          className={`h-5 w-5 ${
                            i < novel.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 id="novel-detail-title" className="mb-4">
                    {novel.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" aria-hidden="true" />
                      <span>{novel.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                      <span>{novel.publishedYear}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="mb-3">Sinopsis</h2>
                  <p className="leading-relaxed text-foreground/90">
                    {novel.description}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="mb-3">Detalles adicionales</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      Esta novela de {novel.genre.toLowerCase()} ha cautivado a lectores 
                      de todo el mundo con su atmósfera única y narrativa envolvente.
                    </p>
                    <p>
                      Publicada en {novel.publishedYear}, esta obra de {novel.author} se 
                      ha convertido en una referencia del género, explorando temas oscuros 
                      y misteriosos que mantienen al lector en suspenso.
                    </p>
                  </div>
                </div>

                {onRead && (
                  <>
                    <Separator />
                    <div>
                      <Button
                        onClick={onRead}
                        size="lg"
                        className="w-full gap-2"
                      >
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                        Comenzar a leer
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}