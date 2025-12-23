import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { NovelCard, type Novel, type NovelWithContent } from "./components/NovelCard";
import { NovelDetail } from "./components/NovelDetail";
import { NovelReader } from "./components/NovelReader";
import { TranslationReader } from "./components/TranslationReader";
import { type UserProfile } from "./components/UserSelector";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Search, BookOpen, Library, Loader2, PlayCircle } from "lucide-react";
import { Button } from "./components/ui/button";

// Tipos para documentos de la API
interface APIDocument {
  id: string;
  filename: string;
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  coverImage?: string;
  rating?: number;
  page_count: number;
  pages_processed: number;
  status: string;
  translation_count: number;
}

// Datos de ejemplo para las novelas
const mockNovels: Novel[] = [
  {
    id: "1",
    title: "Las Sombras del Pasado",
    author: "Elena Martínez",
    description: "Una investigadora descubre que los secretos de su familia están enterrados en un antiguo caserón donde las sombras cobran vida y los susurros del pasado revelan horrores inimaginables.",
    genre: "Terror Gótico",
    publishedYear: 2019,
    coverImage: "https://images.unsplash.com/photo-1604510674156-13963471486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwaG9ycm9yJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc2NjQ0OTMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  },
  {
    id: "2",
    title: "El Misterio de Blackwood",
    author: "Jonathan Rivers",
    description: "En un pueblo olvidado por el tiempo, un detective privado investiga una serie de desapariciones que lo llevarán a enfrentarse con fuerzas sobrenaturales y secretos que deberían permanecer ocultos.",
    genre: "Misterio",
    publishedYear: 2021,
    coverImage: "https://images.unsplash.com/photo-1762554901864-7549c8a84182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3RoaWMlMjBteXN0ZXJ5JTIwbm92ZWx8ZW58MXx8fHwxNzY2NDQ5MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4
  },
  {
    id: "3",
    title: "Voces en la Oscuridad",
    author: "María Santander",
    description: "Una escritora se muda a una casa remota para encontrar inspiración, pero pronto descubre que no está sola. Las voces que escucha en la oscuridad la conducirán al límite de la cordura.",
    genre: "Horror Psicológico",
    publishedYear: 2020,
    coverImage: "https://images.unsplash.com/photo-1762554915502-7ce95effe4ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMGJvb2t8ZW58MXx8fHwxNzY2NDQ5MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  },
  {
    id: "4",
    title: "El Último Ritual",
    author: "Carlos Mendoza",
    description: "Un grupo de estudiantes de ocultismo desata una maldición ancestral al realizar un ritual prohibido. Ahora deben encontrar la manera de detener el mal que han liberado antes de que sea demasiado tarde.",
    genre: "Thriller Sobrenatural",
    publishedYear: 2022,
    coverImage: "https://images.unsplash.com/photo-1696947833843-9707b58254fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NjY0MDcyODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4
  },
  {
    id: "5",
    title: "Pesadillas Eternas",
    author: "Ana Delgado",
    description: "Cuando los sueños y la realidad comienzan a fusionarse, una psicóloga debe descifrar el origen de una epidemia de pesadillas que está sumiendo a toda una ciudad en la locura y el terror.",
    genre: "Horror",
    publishedYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1660912354672-42c807fac14c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBzdG9yeSUyMGF0m0zcGhlcmV8ZW58MXx8fHwxNzY2NDQ5MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  },
  {
    id: "6",
    title: "La Mansión Silenciosa",
    author: "Roberto Vega",
    description: "Una familia hereda una mansión victoriana con un pasado oscuro. A medida que exploran sus habitaciones, descubren que los muros guardan secretos mortales y que algunos invitados nunca se fueron.",
    genre: "Terror Gótico",
    publishedYear: 2023,
    coverImage: "https://images.unsplash.com/photo-1562685988-ee07b5835c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwbm9pciUyMGRhcmt8ZW58MXx8fHwxNzY2NDQ5MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4
  }
];

// Novela completa con contenido de ejemplo (solo la primera novela tiene contenido de lectura)
const novelWithContent: NovelWithContent = {
  ...mockNovels[0],
  chapters: [
    {
      id: "ch1",
      number: 1,
      title: "El Regreso",
      pages: [
        `La carretera se extendía como una serpiente oscura entre los árboles desnudos. Elena apretó el volante con fuerza, sus nudillos blancos contra el cuero negro. Hacía veinte años que no recorría ese camino, veinte años desde que había jurado no volver jamás.

El cielo plomizo amenazaba lluvia, y las nubes bajas parecían rozar las copas de los pinos que flanqueaban la ruta. A medida que se adentraba en el bosque, la luz del día se volvía más tenue, como si el mismo tiempo retrocediera con cada kilómetro.

La carta del abogado descansaba en el asiento del pasajero, su papel cremoso un contraste contra la tapicería oscura. "Lamentamos informarle del fallecimiento de su tía Magdalena..." Las palabras danzaban en su memoria.

No había visto a su tía desde aquella noche. La noche en que todo cambió. La noche en que las sombras dejaron de ser simples ausencias de luz.`,

        `El GPS indicaba que faltaban tres kilómetros para llegar a la mansión Valdés. Elena sintió un escalofrío que no tenía nada que ver con el frío otoñal que se colaba por las rendijas del coche.

Sus manos temblaban ligeramente mientras cambiaba de marcha. Los recuerdos comenzaban a filtrarse como agua a través de una presa agrietada. La voz de su madre, susurrando advertencias. Los ojos de su tía, brillantes con un conocimiento terrible. Y las sombras... siempre las sombras.

"Es solo una casa vieja", se dijo en voz alta, necesitando romper el silencio opresivo que llenaba el habitáculo. "Solo piedra y madera. Nada más."

Pero incluso mientras pronunciaba esas palabras, sabía que eran mentira. La mansión Valdés nunca había sido solo una casa. Era un centinela, un guardián de secretos que ahora le pertenecían por derecho de sangre.`,

        `Cuando la mansión finalmente apareció entre la niebla, Elena tuvo que hacer un esfuerzo consciente para no dar la vuelta y huir. La estructura de tres pisos se alzaba contra el cielo gris como una herida abierta en el paisaje.

Las torres gemelas a cada lado de la entrada principal parecían vigilar su aproximación. Las ventanas, oscuras y vacías, eran como ojos ciegos que sin embargo todo lo veían. La hiedra trepaba por los muros de piedra gris, cubriéndolos como venas oscuras.

Elena detuvo el coche frente a la verja de hierro forjado. Las puertas estaban abiertas, colgando de bisagras oxidadas que gemían con el viento. A través de ellas, un camino de grava conducía a la entrada principal.

Respiró hondo, tratando de calmar los latidos acelerados de su corazón.`
      ]
    },
    {
      id: "ch2",
      number: 2,
      title: "Los Susurros Comienzan",
      pages: [
        `La llave giró en la cerradura con un clic que resonó en el vestíbulo vacío. Elena empujó la pesada puerta de roble, y esta se abrió con un quejido prolongado que hizo eco en el interior.

El olor la golpeó primero: una mezcla de moho, madera vieja y algo más, algo indefinible que hacía que su piel se erizara. Polvo flotaba en los rayos de luz que se filtraban a través de las ventanas sucias, creando columnas luminosas en la penumbra.

El vestíbulo era tal como lo recordaba. El candelabro de cristal colgaba del techo alto, sus lágrimas de vidrio cubiertas de telarañas. La gran escalinata se curvaba hacia el segundo piso, sus peldaños cubiertos por una alfombra carmesí que el tiempo había oscurecido hasta un tono casi negro.

Cerró la puerta detrás de ella, y el sonido retumbó por toda la casa como un trueno lejano.`,

        `Elena dejó su maleta al pie de la escalera y avanzó hacia el salón principal. Sus pasos resonaban en el suelo de mármol, cada uno un recordatorio de que estaba completamente sola.

O eso creía.

El primer susurro llegó cuando estaba a mitad del pasillo. Tan suave que al principio pensó que era el viento filtrándose por alguna rendija. Pero no había brisa. El aire dentro de la mansión estaba completamente quieto, como si la casa misma contuviera la respiración.

"Elena..."

Se quedó paralizada. Su nombre, pronunciado con una voz que parecía venir de todas partes y de ninguna a la vez. Una voz que conocía, imposiblemente, terriblemente familiar.

"No", susurró. "No es real. Es solo mi imaginación. El cansancio del viaje."

Pero cuando el susurro volvió, más claro esta vez, supo que se estaba mintiendo a sí misma.`
      ]
    },
    {
      id: "ch3",
      number: 3,
      title: "Las Sombras Se Mueven",
      pages: [
        `La noche cayó sobre la mansión Valdés como un manto de terciopelo negro. Elena había pasado las últimas horas explorando las habitaciones del primer piso, tratando de familiarizarse con el espacio que ahora, técnicamente, le pertenecía.

Cada habitación contaba una historia de decadencia aristocrática. Muebles cubiertos con sábanas blancas como fantasmas silenciosos. Retratos de ancestros cuyos ojos parecían seguirla dondequiera que fuera. Libros antiguos alineados en estanterías que llegaban hasta el techo.

Había encontrado el diario de su tía en el escritorio de la biblioteca. Las páginas amarillentas estaban llenas de una caligrafía elegante que se volvía cada vez más errática hacia el final. Las últimas entradas hablaban de sombras que se movían solas, de susurros en habitaciones vacías, de algo que esperaba en la oscuridad.

Elena cerró el diario con manos temblorosas. Necesitaba café, y pronto.`,

        `La cocina estaba en el sótano, como descubrió siguiendo una escalera estrecha que descendía desde la despensa. El espacio era sorprendentemente moderno en comparación con el resto de la casa, aunque claramente llevaba años sin usarse.

Mientras esperaba que el agua hirviera en una vieja tetera, Elena notó algo extraño. Las sombras proyectadas por la única bombilla que colgaba del techo parecían... moverse. No el movimiento normal causado por el balanceo de la luz, sino algo más deliberado, más consciente.

Se acercó a la pared, observando con creciente inquietud cómo su propia sombra parecía retorcerse y estirarse de formas que no correspondían con sus movimientos.

El silbido de la tetera la hizo saltar. Con manos temblorosas, preparó su café y decidió que era hora de retirarse al dormitorio principal.`
      ]
    }
  ]
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [readingNovel, setReadingNovel] = useState<NovelWithContent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [novels] = useState<Novel[]>(mockNovels);

  // Estados para traducciones
  const [activeTab, setActiveTab] = useState<"novels" | "translations">("translations");
  const [apiDocuments, setApiDocuments] = useState<APIDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<APIDocument | null>(null);

  // Estado del usuario actual
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Cargar documentos de la API
  useEffect(() => {
    async function fetchDocuments() {
      setLoadingDocs(true);
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setApiDocuments(data);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoadingDocs(false);
      }
    }
    fetchDocuments();
  }, []);

  // Manejar el modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Bloquear scroll del body cuando hay un modal abierto
  useEffect(() => {
    if (selectedNovel || readingNovel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedNovel, readingNovel]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Obtener géneros únicos para el filtro
  const genres = ["all", ...Array.from(new Set(novels.map(novel => novel.genre)))];

  // Filtrar novelas
  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = genreFilter === "all" || novel.genre === genreFilter;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen">
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pestañas de navegación */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          <Button
            variant={activeTab === "translations" ? "default" : "ghost"}
            onClick={() => setActiveTab("translations")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Traducciones
          </Button>
          <Button
            variant={activeTab === "novels" ? "default" : "ghost"}
            onClick={() => setActiveTab("novels")}
            className="gap-2"
          >
            <Library className="h-4 w-4" />
            Novelas Demo
          </Button>
        </div>

        {/* Vista de Traducciones */}
        {activeTab === "translations" && (
          <section aria-label="Traducciones disponibles">
            <h2 className="text-2xl font-bold mb-6">📚 Biblioteca de Traducciones</h2>

            {loadingDocs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando documentos...</span>
              </div>
            ) : apiDocuments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay documentos disponibles. Asegúrate de que el backend esté corriendo.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiDocuments.map((doc) => {
                  const progress = currentUser?.reading_progress?.[doc.id];
                  const currentPage = progress ? (progress.current_page || 0) + 1 : 0;

                  return (
                    <div
                      key={doc.id}
                      className="group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50"
                      onClick={() => setSelectedDocument(doc)}
                      role="article"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedDocument(doc);
                        }
                      }}
                    >
                      {/* Cover Image Area */}
                      <div className="relative h-48 sm:h-64 overflow-hidden bg-muted">
                        {doc.coverImage ? (
                          <img
                            src={doc.coverImage}
                            alt={`Portada de ${doc.title || doc.filename}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                            <BookOpen className="h-20 w-20 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-80" />

                        {/* Genre Badge */}
                        {doc.genre && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                            {doc.genre}
                          </span>
                        )}

                        {/* Progress Badge */}
                        <div className="absolute top-3 right-3">
                          {progress ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
                              📖 {currentPage}/{doc.translation_count}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/90 text-muted-foreground backdrop-blur-sm">
                              Sin empezar
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {doc.title || doc.filename.replace('.pdf', '').replace(/_/g, ' ')}
                        </h3>
                        {doc.author && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            ✍️ {doc.author}
                          </p>
                        )}
                        {doc.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        {doc.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < doc.rating! ? 'text-yellow-400' : 'text-muted'}>
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Vista de Novelas Demo (original) */}
        {activeTab === "novels" && (
          <>
            {/* Sección de búsqueda y filtros */}
            <section className="mb-8 space-y-4" aria-label="Búsqueda y filtros">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Buscar por título, autor o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card"
                    aria-label="Buscar novelas"
                  />
                </div>

                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-card" aria-label="Filtrar por género">
                    <SelectValue placeholder="Filtrar por género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre === "all" ? "Todos los géneros" : genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
                {filteredNovels.length} {filteredNovels.length === 1 ? "novela encontrada" : "novelas encontradas"}
              </div>
            </section>

            {/* Grid de novelas */}
            <section
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              aria-label="Lista de novelas"
            >
              {filteredNovels.length > 0 ? (
                filteredNovels.map((novel) => (
                  <NovelCard
                    key={novel.id}
                    novel={novel}
                    onClick={() => setSelectedNovel(novel)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No se encontraron novelas que coincidan con tu búsqueda.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Modal de detalle */}
      {selectedNovel && !readingNovel && (
        <NovelDetail
          novel={selectedNovel}
          onClose={() => setSelectedNovel(null)}
          onRead={selectedNovel.id === "1" ? () => setReadingNovel(novelWithContent) : undefined}
        />
      )}

      {/* Modal de lectura */}
      {readingNovel && (
        <NovelReader
          novel={readingNovel}
          onClose={() => {
            setReadingNovel(null);
            setSelectedNovel(null);
          }}
        />
      )}

      {/* Modal de lectura de traducciones */}
      {selectedDocument && (
        <TranslationReader
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          userId={currentUser?.id}
        />
      )}
    </div>
  );
}

export default App;