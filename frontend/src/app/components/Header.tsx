import { Moon, Sun, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { UserSelector, type UserProfile } from "./UserSelector";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile) => void;
}

export function Header({ isDarkMode, toggleDarkMode, currentUser, onUserChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen
              className="h-8 w-8 text-primary"
              aria-hidden="true"
            />
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Biblioteca Oscura
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {onUserChange && (
              <UserSelector
                currentUser={currentUser || null}
                onUserChange={onUserChange}
              />
            )}

            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="relative"
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">
                {isDarkMode ? "Modo claro" : "Modo oscuro"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
