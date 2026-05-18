"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Instagram,
  Copy,
  Check,
  Download,
  Calendar,
  MapPin,
  Heart,
  Star,
  Percent,
  Lightbulb,
  ChevronRight,
  X,
  MessageCircle,
  Hash,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// ── Post Template Data ───────────────────────────────────────────────
interface PostTemplate {
  id: string;
  image: string;
  category: "promo" | "tour" | "contenido" | "oferta" | "tips";
  categoryLabel: string;
  title: string;
  caption: string;
  hashtags: string;
  callToAction: string;
  bestDay: string;
  bestTime: string;
  tip: string;
}

const posts: PostTemplate[] = [
  {
    id: "promo-01",
    image: "/images/social/post-promo-01.png",
    category: "promo",
    categoryLabel: "Promocional",
    title: "Descubrí Granada en dos ruedas",
    caption: `Bicicletas frescas, calles coloniales y la brisa del lago.\n\nEn BiciVentura tenemos la bici perfecta para tu aventura por Granada.\n\nCruiser, MTB, Urbana o Tandem — elegí la que vaya con tu ritmo.\n\nVení cuando quieras, salí cuando quieras. Nosotros nos encargamos del resto.\n\n📍 Frente a la Catedral, Calle La Calzada\n📱 +505 1234-5678`,
    hashtags: "#BiciVentura #GranadaNicaragua #AlquilerDeBicicletas #PedaleaLaAventura #GranadaColonial #TravelNicaragua #Bicicleta #CalleLaCalzada #ExploreGranada #NicaLife #CyclingAdventures #CentroAmericaTravel",
    callToAction: "Reservá tu bici hoy con un clic en el link de la bio!",
    bestDay: "Martes o Jueves",
    bestTime: "10:00 AM - 12:00 PM",
    tip: "Las publicaciones promocionales funcionan mejor a media mañana cuando la gente toma un break.",
  },
  {
    id: "tour-02",
    image: "/images/social/post-tour-02.png",
    category: "tour",
    categoryLabel: "Tour / Ruta",
    title: "Ruta al Volcán Mombacho",
    caption: `Este es el tour que todos quieren hacer.\n\nSubí al Volcán Mombacho en bicicleta MTB y viví la selva nubosa como nunca antes.\n\nDistancia: 12km ida y vuelta\nDificultad: Intermedia\nDuración: 3-4 horas\nIncluye: Bicicleta MTB, casco, botella de agua y mapa.\n\nLa vista desde la cima... simplemente no tiene precio.\n\nReservá tu lugar — grupos pequeños, gran experiencia.`,
    hashtags: "#VolcanMombacho #MTBNicaragua #MountainBike #RutaEnBici #GranadaNicaragua #AventuraNatural #BiciVentura #CyclingTour #NatureLovers #NicaraguaTravel #Senderismo #MountainBikeAdventures",
    callToAction: "Escribinos para reservar tu aventura al volcán!",
    bestDay: "Lunes o Miércoles",
    bestTime: "7:00 AM - 9:00 AM",
    tip: "Los tours y aventuras generan más engagement a primera hora, cuando el público viajero planifica el día.",
  },
  {
    id: "contenido-03",
    image: "/images/social/post-accesorios-03.png",
    category: "contenido",
    categoryLabel: "Contenido",
    title: "Todo lo que necesitás para tu paseo",
    caption: `No es solo la bici — es la experiencia completa.\n\nCon cada alquiler en BiciVentura tenés acceso a:\n\nCasco de seguridad\nCandado de alta seguridad\nBotella de agua reutilizable\nFarol LED para paseos nocturnos\nSilla para niños (para los más pequeños)\nKit de picnic gourmet\nMapa ilustrado de Granada\n\nPorque tu aventura merece estar bien equipada.\n\nPreguntá por nuestros combos — más accesorios, mejor precio.`,
    hashtags: "#BiciVentura #CyclingGear #AccesoriosBici #EquipamientoCompleto #AlquilerDeBicicletas #GranadaNicaragua #CyclingLife #BikeAccessories #PreparateParaPedalear #NicaAdventures #TravelReady",
    callToAction: "Mirá todos nuestros combos en biciventura.com",
    bestDay: "Domingo",
    bestTime: "11:00 AM - 1:00 PM",
    tip: "Los domingos la audiencia está más relajada y receptiva a contenido que muestra productos y detalles.",
  },
  {
    id: "tour-04",
    image: "/images/social/post-isletas-04.png",
    category: "tour",
    categoryLabel: "Tour / Ruta",
    title: "Las Isletas de Granada en bici",
    caption: `Uno de los mejores kept secrets de Nicaragua.\n\nPedaleá desde el centro colonial hasta el muelle y tomá un paseo en bote por las 365 isletas del Lago Nicaragua.\n\nNuestra ruta recomendada:\n1. Catedral → Calle La Calzada (10 min)\n2. Malecón del Lago (15 min)\n3. Muelle de las Isletas (5 min)\n4. Tiempo libre para el tour en bote\n\nLa bici la guardamos segura en el muelle mientras explorás las isletas.\n\nPaquete bici + tour en bote: desde $35 USD por persona.`,
    hashtags: "#IsletasDeGranada #LagoNicaragua #GranadaNicaragua #TourEnBote #BiciVentura #RutaEnBici #NicaraguaTravel #HiddenGem #TravelDestinations #CentroAmerica #LakeNicaragua #BiciYBote",
    callToAction: "Reservá el combo bici + isletas — link en bio!",
    bestDay: "Viernes",
    bestTime: "4:00 PM - 6:00 PM",
    tip: "Viernes a la tarde es ideal para publicaciones que inspiran planes de fin de semana.",
  },
  {
    id: "oferta-05",
    image: "/images/social/post-oferta-05.png",
    category: "oferta",
    categoryLabel: "Oferta",
    title: "2x1 en alquiler de bicicletas",
    caption: `Porque las aventuras son mejores en compañía.\n\nLlevá un amigo y el segundo alquiler es GRATIS.\n\nPromoción válida todo el mes en:\n✅ Granada Cruiser\n✅ Colonial Urban\n\nCondiciones:\n- Ambas bicicletas deben devolverse el mismo día\n- Válido para alquileres de 4+ horas\n- No acumulable con otras promos\n- Sujeto a disponibilidad\n\nNo dejes pasar esta oportunidad — los mejores planes se hacen rodando.`,
    hashtags: "#PromoBici #2x1 #Oferta #BiciVentura #GranadaNicaragua #PlanConAmigos #AlquilerDeBicicletas #Descuento #FreeBike #AventuraEnBici #NicaraguaDeals #Promocion",
    callToAction: "Reservá ahora — cupo limitado! Link en bio.",
    bestDay: "Miércoles",
    bestTime: "12:00 PM - 2:00 PM",
    tip: "Las ofertas y promociones tienen mejor alcance a mediodía. Evita lunes que la audiencia está baja.",
  },
  {
    id: "tips-06",
    image: "/images/social/post-tip-06.png",
    category: "tips",
    categoryLabel: "Tips / Carrusel",
    title: "5 cosas que NO sabías de Granada",
    caption: `CARRUSEL — Diapositiva 1 de 5:\n\n5 cosas que NO sabías sobre Granada, Nicaragua 🇳🇮\n\n(Deslizá para descubrir)\n\n1. Es la ciudad más antigua de Centroamérica continental — fundada en 1524 por Francisco Hernández de Córdoba.\n\n2. Tiene 365 isletas formadas por una erupción del Volcán Mombacho hace 20,000 años.\n\n3. La Catedral de Granada tardó más de 100 años en construirse.\n\n4. Fue saqueada tres veces por piratas, incluyendo Henry Morgan.\n\n5. La mejor forma de conocerla es en bicicleta — y nosotros te la tenemos lista.`,
    hashtags: "#DatosDeGranada #GranadaNicaragua #HistoriaNicaragua #DidYouKnow #BiciVentura #TravelFacts #CentroAmerica #NicaraguaCulture #ExploreGranada #Wanderlust #TravelTrivia",
    callToAction: "Guardá este post y vení a verificar el dato #5 en persona!",
    bestDay: "Sábado",
    bestTime: "6:00 PM - 8:00 PM",
    tip: "Los carruseles de tips/datos tienen muy buen rendimiento los sábados por la noche cuando la gente está relajada.",
  },
];

// ── Copy feedback ────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-anil-blue/5 hover:bg-anil-blue/10 text-anil-blue text-xs font-medium transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-jungle-green" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado!" : label}
    </button>
  );
}

// ── Post Card ────────────────────────────────────────────────────────
function PostCard({
  post,
  onClick,
}: {
  post: PostTemplate;
  onClick: () => void;
}) {
  const categoryColors: Record<string, string> = {
    promo: "bg-colonial-yellow text-anil-blue",
    tour: "bg-jungle-green text-white",
    contenido: "bg-anil-blue text-white",
    oferta: "bg-coral text-white",
    tips: "bg-anil-blue-light text-white",
  };

  const categoryIcons: Record<string, React.ElementType> = {
    promo: Sparkles,
    tour: MapPin,
    contenido: Heart,
    oferta: Percent,
    tips: Lightbulb,
  };

  const Icon = categoryIcons[post.category] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColors[post.category]} text-[10px] font-semibold px-2 py-0.5 border-0`}>
              <Icon className="w-3 h-3 mr-1" />
              {post.categoryLabel}
            </Badge>
          </div>
          {/* Instagram icon overlay */}
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Instagram className="w-4 h-4 text-anil-blue" />
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold leading-tight line-clamp-2 drop-shadow-md">
            {post.title}
          </p>
        </div>

        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{post.bestDay}</span>
              <span className="text-border">|</span>
              <span>{post.bestTime}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-anil-blue transition-colors" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Post Detail Modal ────────────────────────────────────────────────
function PostDetailModal({
  post,
  open,
  onClose,
}: {
  post: PostTemplate | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!post) return null;

  const fullCaption = `${post.caption}\n\n${post.hashtags}\n\n${post.callToAction}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-muted">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-4">
            {/* Close button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-colonial-yellow flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-anil-blue" />
                </div>
                <span className="text-sm font-bold text-anil-blue">BiciVentura</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-anil-blue">{post.title}</h2>

            {/* Caption preview */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Caption
                </p>
                <div className="bg-muted/50 rounded-xl p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Hashtags
                </p>
                <div className="bg-colonial-yellow/10 rounded-xl p-3 max-h-24 overflow-y-auto">
                  <p className="text-[11px] leading-relaxed text-anil-blue/80">
                    {post.hashtags}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Call to Action
                </p>
                <div className="bg-coral/10 rounded-xl p-3">
                  <p className="text-xs font-medium text-coral flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3 flex-shrink-0" />
                    {post.callToAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Copy buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <CopyButton text={fullCaption} label="Copiar todo" />
              <CopyButton text={post.caption} label="Solo caption" />
              <CopyButton text={post.hashtags} label="Solo hashtags" />
            </div>

            {/* Schedule tip */}
            <div className="bg-jungle-green/5 rounded-xl p-3 mt-auto">
              <p className="text-[11px] font-semibold text-jungle-green flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Mejor momento para publicar
              </p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.bestDay}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {post.bestTime}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/70 mt-1 leading-relaxed">
                {post.tip}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main View ────────────────────────────────────────────────────────
export default function PublicacionesView() {
  const [selectedPost, setSelectedPost] = useState<PostTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("todas");

  const filtered =
    activeTab === "todas"
      ? posts
      : posts.filter((p) => p.category === activeTab);

  const categoryCounts = posts.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-anil-blue flex items-center gap-2">
          <Instagram className="w-5 h-5 text-coral" />
          Publicaciones
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Plantillas listas para Instagram. Copiá el texto, descargá la imagen y publicá.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Plantillas", value: posts.length, color: "#1B4965" },
          { label: "Categorías", value: Object.keys(categoryCounts).length, color: "#2D6A4F" },
          { label: "Listas", value: posts.length, color: "#F2A900" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips bar */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-anil-blue to-anil-blue-dark">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-colonial-yellow" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Tip: Para mejores resultados en Instagram
            </p>
            <p className="text-xs text-white/70">
              Usá las imágenes en formato cuadrado (1080x1080), publicá en los horarios recomendados
              y siempre incluí hashtags relevantes en español e inglés.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-anil-blue/5 flex-wrap">
          <TabsTrigger value="todas" className="data-[state=active]:bg-anil-blue data-[state=active]:text-white text-xs">
            Todas ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="promo" className="data-[state=active]:bg-colonial-yellow data-[state=active]:text-anil-blue text-xs">
            Promo ({categoryCounts.promo || 0})
          </TabsTrigger>
          <TabsTrigger value="tour" className="data-[state=active]:bg-jungle-green data-[state=active]:text-white text-xs">
            Tours ({categoryCounts.tour || 0})
          </TabsTrigger>
          <TabsTrigger value="contenido" className="data-[state=active]:bg-anil-blue data-[state=active]:text-white text-xs">
            Contenido ({categoryCounts.contenido || 0})
          </TabsTrigger>
          <TabsTrigger value="oferta" className="data-[state=active]:bg-coral data-[state=active]:text-white text-xs">
            Ofertas ({categoryCounts.oferta || 0})
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-anil-blue-light data-[state=active]:text-white text-xs">
            Tips ({categoryCounts.tips || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Instagram className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No hay plantillas en esta categoría.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
