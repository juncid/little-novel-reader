import { useState, useEffect } from "react";
import { User, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    reading_progress: Record<string, { current_page: number; last_read: string }>;
}

interface UserSelectorProps {
    currentUser: UserProfile | null;
    onUserChange: (user: UserProfile) => void;
}

export function UserSelector({ currentUser, onUserChange }: UserSelectorProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/users");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                    // Auto-seleccionar primer usuario si no hay ninguno
                    if (!currentUser && data.length > 0) {
                        onUserChange(data[0]);
                    }
                }
            } catch (err) {
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Cargando...</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
            >
                <span className="text-xl">{currentUser?.avatar || "👤"}</span>
                <span className="font-medium">{currentUser?.name || "Seleccionar"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-card shadow-lg z-50">
                        <div className="p-2">
                            <div className="text-xs text-muted-foreground px-2 py-1 mb-1">
                                Cambiar perfil
                            </div>
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        onUserChange(user);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${currentUser?.id === user.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <span className="text-xl">{user.avatar}</span>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {Object.keys(user.reading_progress || {}).length} libros
                                        </div>
                                    </div>
                                    {currentUser?.id === user.id && (
                                        <BookOpen className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
