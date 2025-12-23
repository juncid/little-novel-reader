import { Book, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
}

export interface NovelWithContent extends Novel {
  chapters: Chapter[];
}

interface NovelCardProps {
  novel: Novel;
  onClick: () => void;
}

export function NovelCard({ novel, onClick }: NovelCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50"
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${novel.title} por ${novel.author}`}
    >
      <div className="relative h-48 sm:h-64 overflow-hidden bg-muted">
        <img
          src={novel.coverImage}
          alt={`Portada de ${novel.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-80" />
        <Badge 
          className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm"
          aria-label={`Género: ${novel.genre}`}
        >
          {novel.genre}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {novel.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <User className="h-4 w-4" aria-hidden="true" />
          <span>{novel.author}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-muted-foreground">
          {novel.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{novel.publishedYear}</span>
          </div>
          
          <div className="flex items-center gap-1" aria-label={`Calificación: ${novel.rating} de 5 estrellas`}>
            {[...Array(5)].map((_, i) => (
              <Book
                key={i}
                className={`h-4 w-4 ${
                  i < novel.rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}