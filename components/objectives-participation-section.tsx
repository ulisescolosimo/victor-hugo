"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { trackGaEvent } from "@/lib/analytics";
import { SiMercadopago, SiPaypal } from "@icons-pack/react-simple-icons";

type TeamMember = {
  firstName: string;
  lastName: string;
  image: string;
  bio: string;
};

function EquipoSection({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <motion.div
      className="py-12 md:py-16 lg:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <div className="mb-8 md:mb-12">
        <h2
          className="text-white text-[28px] sm:text-[32px] md:text-[40px] font-black leading-tight"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Equipo
        </h2>
      </div>

      {/* Desktop: grid 3x2 — bio siempre visible */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
        {teamMembers.map((person, index) => (
          <motion.div
            key={`${person.firstName}-${person.lastName}`}
            className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-5 lg:p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:bg-white/15"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              className="w-36 h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/25 ring-offset-2 ring-offset-transparent mb-4 bg-gray-700"
              style={{
                boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
              }}
            >
              <img
                src={person.image}
                alt={`${person.firstName} ${person.lastName}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p
              className="text-white font-semibold text-base lg:text-lg"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {person.firstName} {person.lastName}
            </p>
            <p
              className="text-white/80 text-sm leading-snug max-w-[260px] mt-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {person.bio.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile: carrusel — bio siempre visible */}
      <div className="md:hidden">
        <Carousel
          opts={{
            align: "center",
            loop: true,
            dragFree: false,
            containScroll: "trimSnaps",
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {teamMembers.map((person, index) => (
              <CarouselItem
                key={`${person.firstName}-${person.lastName}-carousel`}
                className="pl-3 basis-[85%] min-w-0 shrink-0 grow-0"
              >
                <motion.div
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg p-5 flex flex-col items-center text-center w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/25 mb-3 bg-gray-700">
                    <img
                      src={person.image}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p
                    className="text-white font-semibold text-base"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {person.firstName} {person.lastName}
                  </p>
                  <p
                    className="text-white/80 text-sm leading-snug mt-2 text-left w-full px-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {person.bio.split("\n").map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Indicador de puntos */}
        <div className="flex justify-center gap-2 mt-4">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir a persona ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex ? "w-6 bg-white/90" : "w-2 bg-white/40"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type FundingPhase = {
  id: string;
  sort_order: number;
  title: string;
  amount: string;
  description: string | null;
  items?: string[];
  conclusion?: string;
};

const DEFAULT_PHASES: FundingPhase[] = [
  {
    id: "1",
    sort_order: 1,
    title: "ETAPA 1",
    amount: "250.000 USD",
    description: "Hacer posible la transmisión",
    items: [
      "Derechos de transmisión del Mundial 2026.",
      "Salida al aire por AM750 con Víctor Hugo.",
      "Si se alcanza esta meta, El Último Mundial sucede.",
    ],
  },
  {
    id: "2",
    sort_order: 2,
    title: "ETAPA 2",
    amount: "250.000 USD",
    description: "Transmitir desde los estadios",
    items: [
      "Presencia en los estadios durante el Mundial.",
      "Logística, viajes y cobertura del equipo.",
      "Si se alcanza esta meta, la experiencia se vive desde adentro.",
    ],
  },
];

const MEMBROS_PATH = "/miembros";

function getMembrosUrl(quantity: number) {
  const q = Math.min(50, Math.max(1, quantity));
  return `${MEMBROS_PATH}?quantity=${q}`;
}

type PublicFundingStats = {
  goalUsd: number;
  totalUsd: number;
  totalUnits: number;
  paymentCount: number;
  progressPercent: number;
  payments: { amountUsd: number; quantity: number; at: string }[];
  paymentsPage: number;
  paymentsPageSize: number;
  configured: boolean;
};

function formatUsdEs(value: number) {
  return `${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} USD`;
}

function formatFundingDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

const PAYMENTS_LIST_PAGE_SIZE = 5;

function FundingStatsPanel() {
  const [stats, setStats] = React.useState<PublicFundingStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [listBusy, setListBusy] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const [paymentsListPage, setPaymentsListPage] = React.useState(1);
  const isFirstFundingFetch = React.useRef(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isFirstFundingFetch.current) {
          setLoading(true);
        } else {
          setListBusy(true);
        }
        const params = new URLSearchParams({
          paymentsPage: String(paymentsListPage),
          paymentsPageSize: String(PAYMENTS_LIST_PAGE_SIZE),
        });
        const res = await fetch(
          `/api/public/funding-stats?${params.toString()}`,
        );
        const json = (await res.json()) as PublicFundingStats & {
          error?: string;
        };
        if (!res.ok) throw new Error("bad");
        if (!cancelled) {
          setStats(json);
          if (json.configured && json.paymentsPage !== paymentsListPage) {
            setPaymentsListPage(json.paymentsPage);
          }
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setListBusy(false);
          isFirstFundingFetch.current = false;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paymentsListPage]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-5 animate-pulse px-1">
        <div className="h-5 bg-white/10 rounded-md w-2/3 mx-auto" />
        <div className="h-3 bg-white/10 rounded-full w-full" />
        <div className="h-28 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (loadError || !stats) {
    return (
      <p
        className="text-white/80 text-center text-sm sm:text-base max-w-lg mx-auto"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        No pudimos cargar las estadísticas en este momento. Probá de nuevo más
        tarde.
      </p>
    );
  }

  if (!stats.configured) {
    return (
      <div className="text-center max-w-lg mx-auto space-y-3">
        <p
          className="text-white text-base sm:text-lg md:text-xl font-medium drop-shadow-sm"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Las estadísticas públicas no están disponibles por ahora.
        </p>
        <p
          className="text-white/75 text-sm sm:text-base"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Cuando el servidor esté configurado, vas a ver acá el avance y los
          últimos aportes confirmados.
        </p>
      </div>
    );
  }

  const barPercent =
    stats.goalUsd > 0
      ? Math.min(100, (stats.totalUsd / stats.goalUsd) * 100)
      : 0;
  const overGoal = stats.goalUsd > 0 && stats.totalUsd >= stats.goalUsd;

  const paymentsListTotalPages = Math.max(
    1,
    Math.ceil(stats.paymentCount / stats.paymentsPageSize),
  );
  const paymentsPageDisplay = Math.min(
    Math.max(1, paymentsListPage),
    paymentsListTotalPages,
  );

  return (
    <div className="w-full text-left space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p
              className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-wide"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Recaudado (aportes confirmados)
            </p>
            <p
              className="text-white text-2xl sm:text-3xl md:text-4xl font-black tabular-nums mt-1"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {formatUsdEs(stats.totalUsd)}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p
              className="text-white/70 text-xs sm:text-sm font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Meta publicada (etapa 1)
            </p>
            <p
              className="text-white text-lg sm:text-xl font-bold tabular-nums mt-1"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {formatUsdEs(stats.goalUsd)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={barPercent}
            className="h-3 sm:h-3.5 bg-white/15 rounded-full [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-emerald-400 [&>[data-slot=progress-indicator]]:to-lime-300"
          />
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs sm:text-sm text-white/75">
            <span style={{ fontFamily: "Montserrat, sans-serif" }}>
              {stats.progressPercent}% de la meta
            </span>
            <span style={{ fontFamily: "Montserrat, sans-serif" }}>
              {stats.paymentCount} pago{stats.paymentCount === 1 ? "" : "s"} ·{" "}
              {stats.totalUnits} aporte{stats.totalUnits === 1 ? "" : "s"}{" "}
              (unidades)
            </span>
          </div>
          {overGoal ? (
            <p
              className="text-emerald-200/95 text-sm font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Se alcanzó la meta de esta etapa. Gracias a quienes ya sumaron.
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/15 pt-6 space-y-3">
        <h3
          className="text-white text-base sm:text-lg font-black"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Pagos aprobados
        </h3>
        <p
          className="text-white/65 text-xs sm:text-sm leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Todos los pagos confirmados, con la cantidad de aportes incluidos en
          cada uno.
        </p>
        {stats.paymentCount === 0 ? (
          <p
            className="text-white/70 text-sm"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Todavía no hay pagos aprobados para mostrar.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              {listBusy ? (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#1a2e1a]/55 backdrop-blur-[2px]"
                  aria-busy
                  aria-label="Cargando página"
                />
              ) : null}
              <ul
                className={`rounded-xl border border-white/10 bg-black/20 divide-y divide-white/10 ${listBusy ? "opacity-60" : ""}`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {(stats.payments ?? []).map((row, i) => (
                  <li
                    key={`${row.at}-${row.amountUsd}-${stats.paymentsPage}-${i}`}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] gap-x-4 gap-y-2 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base items-start"
                  >
                    <div>
                      {row.at ? (
                        <p className="text-white/55 text-xs sm:text-sm tabular-nums">
                          {formatFundingDate(row.at)}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-white/90">
                      <p className="font-semibold">
                        {row.quantity}{" "}
                        {row.quantity === 1 ? "aporte" : "aportes"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right sm:min-w-[7.5rem]">
                      <p className="text-white font-bold tabular-nums">
                        {formatUsdEs(row.amountUsd)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {paymentsListTotalPages > 1 ? (
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <p
                  className="text-white/60 text-xs sm:text-sm text-center sm:text-left"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Página {paymentsPageDisplay} de {paymentsListTotalPages} ·{" "}
                  {stats.paymentCount} pago{stats.paymentCount === 1 ? "" : "s"}
                </p>
                <div className="flex justify-center gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={paymentsPageDisplay <= 1 || listBusy}
                    onClick={() =>
                      setPaymentsListPage((p) => Math.max(1, p - 1))
                    }
                    className="border-white/25 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      paymentsPageDisplay >= paymentsListTotalPages || listBusy
                    }
                    onClick={() =>
                      setPaymentsListPage((p) =>
                        Math.min(paymentsListTotalPages, p + 1),
                      )
                    }
                    className="border-white/25 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ObjectivesParticipationSection() {
  const [quantity, setQuantity] = useState(10);
  const [selectedOption, setSelectedOption] = useState<
    "single" | "five" | "custom"
  >("five");
  const [phases, setPhases] = useState<FundingPhase[]>(DEFAULT_PHASES);
  const [authChecking, setAuthChecking] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutProviderLoading, setCheckoutProviderLoading] = useState<
    "mercadopago" | "paypal" | null
  >(null);
  /** Solo para mostrar en UI. Backend usa 0.1 USD en pruebas. */
  const contributionAmount = 18;
  const selectedQuantity =
    selectedOption === "single" ? 1 : selectedOption === "five" ? 5 : quantity;
  const totalAmount = selectedQuantity * contributionAmount;
  const sliderValue = selectedQuantity === 1 ? 0 : selectedQuantity;
  const lastTrackedSliderValue = useRef<number>(sliderValue);

  const openCheckoutModal = useCallback(async () => {
    setCheckoutError(null);
    trackGaEvent("vhm_pay_cta_click", {
      selected_quantity: selectedQuantity,
      selected_amount_usd: totalAmount,
    });
    setAuthChecking(true);
    try {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user?.email) {
        setCheckoutEmail(user.email);
      }
      setCheckoutOpen(true);
    } finally {
      setAuthChecking(false);
    }
  }, [selectedQuantity, totalAmount]);

  const startCheckout = useCallback(
    async (provider: "mercadopago" | "paypal") => {
      const email = checkoutEmail.trim().toLowerCase();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        setCheckoutError("Ingresá un email válido para continuar.");
        return;
      }

      setCheckoutError(null);
      trackGaEvent("vhm_pay_click", {
        provider,
        selected_quantity: selectedQuantity,
        selected_amount_usd: totalAmount,
      });
      trackGaEvent("vhm_email_submitted", {
        provider,
        selected_quantity: selectedQuantity,
        selected_amount_usd: totalAmount,
      });
      setCheckoutProviderLoading(provider);
      try {
        const response = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: selectedQuantity,
            provider,
            email,
          }),
        });
        const data = await response.json();

        if (!response.ok || !data?.paymentUrl) {
          setCheckoutError(
            data?.error ?? "No pudimos iniciar el pago. Probá nuevamente.",
          );
          return;
        }

        window.location.href = data.paymentUrl;
      } catch {
        setCheckoutError("Error de conexión. Intentá nuevamente.");
      } finally {
        setCheckoutProviderLoading(null);
      }
    },
    [checkoutEmail, selectedQuantity, totalAmount],
  );

  // Fases hardcodeadas; conexión a BD comentada.
  // useEffect(() => {
  //   const client = createClient()
  //   client
  //     .from("funding_phases")
  //     .select("id, sort_order, title, amount, description")
  //     .order("sort_order", { ascending: true })
  //     .then(({ data, error }) => {
  //       if (!error && data?.length) {
  //         const filteredPhases = data.filter((phase) => phase.sort_order !== 3 && phase.id !== "3")
  //         setPhases(filteredPhases as FundingPhase[])
  //       }
  //     })
  // }, [])

  // Variantes de animación
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Sin animación de opacidad para que el texto de fases no se vea transparente
  const phaseItemVariants = {
    hidden: { y: 20 },
    visible: {
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const slideInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const linkClass = "text-white font-medium underline hover:no-underline";

  const faqItems: { question: string; answer: React.ReactNode }[] = [
    {
      question: "¿Qué es El Último Mundial y de qué se trata este proyecto?",
      answer: (
        <>
          <p>
            El Último Mundial es un <strong>proyecto colectivo</strong> para
            intentar que Víctor Hugo vuelva a relatar un Mundial. No desde un
            esquema tradicional, sino desde una{" "}
            <strong>comunidad que decide hacerlo posible</strong>.
          </p>
          <p>
            La idea es transmitir el Mundial 2026 por AM750 y, si se puede ir un
            poco más lejos, estar también en los estadios para{" "}
            <strong>vivir el torneo desde adentro</strong> y contarlo desde ahí.
          </p>
        </>
      ),
    },
    {
      question: '¿Cómo puedo participar y qué significa "ser parte"?',
      answer: (
        <>
          <p>
            Podés sumarte con un <strong>aporte único</strong> o{" "}
            <strong>aportar más de una vez</strong>. Ser parte significa
            participar de una idea que se construye entre muchos: no estás
            comprando un producto, estás formando parte de un{" "}
            <strong>proyecto colectivo</strong> para que una transmisión exista.
          </p>
        </>
      ),
    },
    {
      question: "¿Para qué se usa el dinero que se reúne?",
      answer: (
        <>
          <p>
            El dinero que se junta se usa para cubrir los{" "}
            <strong>gastos de gestión</strong> y para comprar los{" "}
            <strong>derechos oficiales de transmisión radial</strong> de todos
            los partidos del Mundial, que hoy están en manos de una sola
            empresa.
          </p>
          <p>
            Además, se destina a avanzar en los dos objetivos del proyecto:
            primero, hacer posible la transmisión del Mundial 2026; y después,
            si se puede, intentar estar también en los estadios para vivirlo
            desde adentro.
          </p>
        </>
      ),
    },
    {
      question: "¿Qué pasa si no se llega a alguna de las etapas?",
      answer: (
        <>
          <p>
            Si no se llega a alguna de las etapas, se van a buscar{" "}
            <strong>alternativas</strong> y esas alternativas se van a{" "}
            <strong>someter a votación entre todos los participantes</strong>.
            Lo que decida la mayoría es lo que se hace.
          </p>
          <p>
            En cualquier caso, siempre va a estar disponible la opción de{" "}
            <strong>devolución total</strong>.
          </p>
        </>
      ),
    },
    {
      question: "¿Quién impulsa este proyecto y qué relación tiene con Orsai?",
      answer: (
        <>
          <p>
            El proyecto es impulsado por{" "}
            <a
              href="https://www.relatores.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline hover:no-underline"
            >
              <strong>Relatorxs</strong>
            </a>{" "}
            junto a Víctor Hugo y su equipo, con el apoyo tecnológico de{" "}
            <strong>Orsai Tech</strong>. La transmisión está pensada para salir
            al aire por AM750, con el acompañamiento de la Asociación de
            Relatores del Fútbol Argentino.
          </p>
          <p>
            El Último Mundial forma parte de{" "}
            <a
              href="https://proyecto18.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Proyecto 18
            </a>
            , una iniciativa de Orsai Tech para que las audiencias no solo
            acompañen los contenidos, sino que también participen y sean parte
            de ellos. Orsai Tech es la empresa que crea y desarrolla los
            proyectos de{" "}
            <a
              href="https://orsai.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Comunidad Orsai
            </a>
            , pensados para que la comunidad tenga un rol activo.
          </p>
          <p>
            Más información en{" "}
            <a
              href="https://proyecto18.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              proyecto18.org
            </a>{" "}
            y{" "}
            <a
              href="https://orsai.org"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              orsai.org
            </a>
            .
          </p>
        </>
      ),
    },
    {
      question:
        "¿Qué pasa si se llega a viajar a los estadios y cómo se sigue el proyecto?",
      answer: (
        <>
          <p>
            Si se alcanza la etapa que permite estar en los estadios, la idea es{" "}
            <strong>registrar todo el viaje para un posible documental</strong>{" "}
            y compartir <strong>material exclusivo</strong> con los
            participantes.
          </p>
          <p>
            Quienes participen van a recibir novedades por email, van a tener un{" "}
            <strong>grupo de WhatsApp</strong> y acceso a información y
            contenido reservado durante todo el recorrido.
          </p>
        </>
      ),
    },
    {
      question: "¿Dónde se va a poder escuchar la transmisión?",
      answer: (
        <>
          <p>
            La transmisión está pensada para salir al aire por{" "}
            <strong>AM750</strong> y por sus canales habituales. A medida que el
            proyecto avance, se va a ir contando con más detalle cómo seguir
            cada partido.
          </p>
        </>
      ),
    },
    {
      question: "¿Y si tengo dudas o necesito escribirles?",
      answer: (
        <>
          <p>
            Si tenés cualquier duda o querés hacer una consulta, podés
            escribirnos a:
          </p>
          <p>
            <a href="mailto:elultimomundialok@gmail.com" className={linkClass}>
              elultimomundialok@gmail.com
            </a>
          </p>
        </>
      ),
    },
  ];

  const TEAM_MEMBERS: TeamMember[] = [
    {
      firstName: "Alejandro",
      lastName: "Fabbri",
      image: "/images/alejandrofabbri.jpg",
      bio: "Periodista deportivo histórico del fútbol argentino.\nAnálisis, opinión y décadas de experiencia en medios.",
    },
    {
      firstName: "Alejandro",
      lastName: "Apo",
      image: "/images/alejandroapo.png",
      bio: "Periodista y relator con una larga trayectoria en radio y TV.\nReferente del periodismo deportivo y la crónica futbolera.",
    },
    {
      firstName: "Viviana",
      lastName: "Vila",
      image: "/images/vivianavila.png",
      bio: "Periodista deportiva y comunicadora.\nConducción, análisis y actualidad del fútbol en medios.",
    },
    {
      firstName: "Hernán",
      lastName: "Kodakian",
      image: "/images/kodakian.jpg",
      bio: "Periodista y comentarista de fútbol.\nEspecialista en análisis y cobertura deportiva.",
    },
    {
      firstName: "Matías",
      lastName: "De Matteo",
      image: "/images/dematteo.png",
      bio: "Periodista y analista deportivo.\nParticipa en transmisiones y debates de actualidad futbolera.",
    },
    {
      firstName: "Néstor",
      lastName: "Centra",
      image: "/images/nestorcentra.png",
      bio: "Periodista deportivo con trayectoria en medios.\nCobertura, análisis y opinión sobre fútbol argentino.",
    },
  ];

  const handleSliderChange = (value: number) => {
    const boundedValue = Math.max(0, Math.min(50, value));
    const nextSelectedQuantity = boundedValue === 0 ? 1 : boundedValue;
    if (lastTrackedSliderValue.current !== boundedValue) {
      trackGaEvent("vhm_selector_moved", {
        selected_quantity: nextSelectedQuantity,
        selected_amount_usd: nextSelectedQuantity * contributionAmount,
      });
      lastTrackedSliderValue.current = boundedValue;
    }
    if (boundedValue === 0) {
      setSelectedOption("single");
      return;
    }
    if (boundedValue === 5) {
      setSelectedOption("five");
      return;
    }
    setSelectedOption("custom");
    setQuantity(boundedValue);
  };

  return (
    <section
      className="relative py-12 px-4 sm:px-6 md:px-8 sm:py-16 md:py-24 overflow-hidden border-b border-white/10"
      style={{
        backgroundImage:
          "url(/images/6ffec3ae67d9dfd1c670aff771877f0f15df6d1c.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-[#1a2e1a]/80 z-0"></div>
      {/* Gradiente negro en la parte superior para continuar del componente anterior */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/50 to-transparent z-[1] h-[200px] sm:h-[300px] md:h-[400px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* ¿De qué se trata? */}
        <motion.div
          id="de-que-se-trata"
          className="mb-16 sm:mb-20 md:mb-24 scroll-mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.h2
            className="text-white mb-4 sm:mb-5 text-left font-montserrat font-black text-[32px] sm:text-[42px] md:text-[56px] leading-[105%] tracking-normal"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            ¿De qué se trata?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 items-start relative z-20">
            {/* Video Side */}
            <motion.div
              className="relative w-full order-1 md:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInLeftVariants}
            >
              <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <video
                  src="/video/videoplayback.mp4"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
              className="space-y-3 sm:space-y-4 order-2 md:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainerVariants}
            >
              <p className="text-white text-base sm:text-lg md:text-xl leading-[1.6]">
                Durante décadas, millones de personas compartimos{" "}
                <span className="font-bold text-white">
                  goles, finales, alegrías y derrotas
                </span>{" "}
                con <span className="font-bold text-white">una misma voz</span>.
              </p>
              <p className="text-white text-base sm:text-lg md:text-xl leading-[1.6]">
                Hoy esa voz puede volver a relatar un{" "}
                <span className="font-bold text-white">Mundial</span>. Pero no
                desde un esquema tradicional, sino desde algo mucho más{" "}
                <span className="font-bold text-white">raro y más lindo</span>:
                una{" "}
                <span className="font-bold text-white">
                  comunidad que decide hacerlo posible
                </span>
                .
              </p>
              <p className="text-white text-base sm:text-lg md:text-xl leading-[1.6]">
                El proyecto es{" "}
                <span className="font-bold text-white">
                  simple y extraordinario
                </span>{" "}
                a la vez: que los{" "}
                <span className="font-bold text-white">oyentes</span>{" "}
                <span className="font-bold text-white">
                  juntemos entre todos lo necesario
                </span>{" "}
                para comprar los{" "}
                <span className="font-bold text-white">
                  derechos de transmisión del Mundial 2026
                </span>{" "}
                y volver a compartir los partidos de la{" "}
                <span className="font-bold text-white">
                  Selección Argentina
                </span>
                .
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Cómo participar */}
        <motion.div
          id="como-funciona"
          className="mb-16 sm:mb-20 md:mb-24 scroll-mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.h2
            className="text-white mb-3 sm:mb-4 text-left font-montserrat font-black text-[32px] sm:text-[42px] md:text-[56px] leading-[105%] tracking-normal"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            ¿Cómo participar?
          </motion.h2>
          <motion.p
            className="text-white mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl leading-[1.6]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            Podés sumarte con un{" "}
            <span className="font-bold text-white">aporte único</span> o{" "}
            <span className="font-bold text-white">aportar más de una vez</span>
            .
            <br />
            Así participás de un{" "}
            <span className="font-bold text-white">
              proyecto colectivo
            </span>{" "}
            para hacer posible la transmisión del{" "}
            <span className="font-bold text-white">Mundial 2026</span>.
          </motion.p>
          <motion.div
            className="flex flex-col gap-5 sm:gap-6 md:gap-7 mb-16 sm:mb-20 md:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            {/* Opción principal: planes múltiples */}
            <motion.div
              className="p-5 sm:p-6 md:p-8 text-center flex flex-col relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-[#0f2012]/55 border border-white/20 shadow-[0px_24px_36px_0px_rgba(0,0,0,0.35)]"
              variants={staggerItemVariants}
            >
              {/* Overlay sutil para profundidad */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />
              <div className="relative z-10 flex flex-col h-full min-h-[120px] sm:min-h-[140px] md:min-h-[150px]">
                <div className="w-full mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    <button
                      type="button"
                      disabled={authChecking}
                      onClick={() => setSelectedOption("single")}
                      className={`rounded-[16px] p-4 text-left transition-all duration-200 border relative cursor-pointer ${
                        selectedOption === "single"
                          ? "bg-[linear-gradient(180deg,rgba(202,0,145,0.26),rgba(80,0,98,0.35))] text-white border-[#d946ef]/70 shadow-[0_12px_26px_rgba(202,0,145,0.3)]"
                          : "bg-white/8 text-white hover:bg-white/14 border-white/25"
                      }`}
                    >
                      <p
                        className={`text-xs uppercase tracking-[0.08em] mb-1 ${selectedOption === "single" ? "text-white/80" : "text-white/60"}`}
                      >
                        Aporte base
                      </p>
                      <p className="text-[28px] sm:text-[32px] font-black leading-none">
                        18
                      </p>
                      <p className="text-sm sm:text-base font-semibold mt-1">
                        USD / 1 aporte
                      </p>
                      <p
                        className={`mt-3 text-xs sm:text-sm ${selectedOption === "single" ? "text-white/85" : "text-white/70"}`}
                      >
                        Forma simple para sumarte hoy.
                      </p>
                      {selectedOption === "single" && (
                        <span className="mt-3 inline-flex text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-[0.08em]">
                          Seleccionado
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={authChecking}
                      onClick={() => setSelectedOption("five")}
                      className={`rounded-[16px] p-4 text-left transition-all duration-200 relative border cursor-pointer ${
                        selectedOption === "five"
                          ? "bg-[linear-gradient(180deg,rgba(202,0,145,0.38),rgba(80,0,98,0.55))] text-white border-[#f0abfc]/75 shadow-[0_20px_40px_rgba(202,0,145,0.42)] scale-[1.03]"
                          : "bg-white/8 text-white hover:bg-white/14 border-white/25 scale-[1.01]"
                      }`}
                    >
                      <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-[#CA0091] text-white uppercase tracking-[0.08em]">
                        Más elegido
                      </span>
                      <p
                        className={`text-xs uppercase tracking-[0.08em] mb-1 ${selectedOption === "five" ? "text-white/90" : "text-white/60"}`}
                      >
                        Aporte recomendado
                      </p>
                      <p className="text-[30px] sm:text-[36px] font-black leading-none">
                        90
                      </p>
                      <p className="text-sm sm:text-base font-semibold mt-1">
                        USD / 5 aportes
                      </p>
                      <p
                        className={`mt-3 text-xs sm:text-sm ${selectedOption === "five" ? "text-white/90" : "text-white/70"}`}
                      >
                        Más impacto para impulsar la meta.
                      </p>
                      {selectedOption === "five" && (
                        <span className="mt-3 inline-flex text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-[0.08em]">
                          Seleccionado
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={authChecking}
                      onClick={() => setSelectedOption("custom")}
                      className={`rounded-[16px] p-4 text-left transition-all duration-200 border relative cursor-pointer ${
                        selectedOption === "custom"
                          ? "bg-[linear-gradient(180deg,rgba(202,0,145,0.26),rgba(80,0,98,0.35))] text-white border-[#d946ef]/70 shadow-[0_12px_26px_rgba(202,0,145,0.3)]"
                          : "bg-white/8 text-white hover:bg-white/14 border-white/25"
                      }`}
                    >
                      <p
                        className={`text-xs uppercase tracking-[0.08em] mb-1 ${selectedOption === "custom" ? "text-white/80" : "text-white/60"}`}
                      >
                        Aporte personalizado
                      </p>
                      <p className="text-[28px] sm:text-[32px] font-black leading-none">
                        {quantity}
                      </p>
                      <p className="text-sm sm:text-base font-semibold mt-1">
                        {quantity === 1 ? "aporte" : "aportes"} /{" "}
                        {quantity * contributionAmount} USD
                      </p>
                      <p
                        className={`mt-3 text-xs sm:text-sm ${selectedOption === "custom" ? "text-white/85" : "text-white/70"}`}
                      >
                        Definís tu nivel de participación.
                      </p>
                      {selectedOption === "custom" && (
                        <span className="mt-3 inline-flex text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-[0.08em]">
                          Seleccionado
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      Seleccionado: {selectedQuantity}{" "}
                      {selectedQuantity === 1 ? "aporte" : "aportes"} (
                      {totalAmount} USD)
                    </span>
                    <span className="text-white/70 text-xs sm:text-sm">
                      50 aportes
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={sliderValue}
                    onChange={(e) =>
                      handleSliderChange(parseInt(e.target.value))
                    }
                    className="w-full h-4 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, rgba(202, 0, 145, 0.9) 0%, rgba(80, 0, 98, 0.9) ${(sliderValue / 50) * 100}%, rgba(255, 255, 255, 0.2) ${(sliderValue / 50) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                    }}
                  />
                </div>
                <div className="mt-auto flex flex-col items-end gap-4">
                  <Button
                    type="button"
                    disabled={authChecking}
                    onClick={openCheckoutModal}
                    className="w-full font-black text-white text-sm sm:text-base px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 h-11 sm:h-12 md:h-14 hover:brightness-110 transition-all duration-200 active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(90deg, #CA0091 0%, #500062 100%)",
                    }}
                  >
                    {authChecking ? "…" : `QUIERO APORTAR ${totalAmount} USD`}
                  </Button>
                  <p className="text-white/65 text-xs sm:text-sm text-center w-full">
                    Vas a ser redireccionado a Mercado Pago o PayPal para
                    completar el aporte.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <DialogContent className="sm:max-w-md bg-[#101010] border-white/15 text-white">
              <DialogHeader>
                <DialogTitle>Finalizar aporte</DialogTitle>
                <DialogDescription className="text-white/70">
                  Ingresá tu email y tocá uno de los botones para continuar al
                  pago.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-email" className="text-white/90">
                    Email
                  </Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/45"
                  />
                </div>
                {checkoutError && (
                  <p className="text-sm text-red-300">{checkoutError}</p>
                )}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    onClick={() => startCheckout("mercadopago")}
                    disabled={checkoutProviderLoading !== null}
                    className="w-full bg-[#009ee3] hover:bg-[#008ccc] text-white font-semibold justify-center gap-2 h-11"
                  >
                    {checkoutProviderLoading === "mercadopago" ? (
                      "Redirigiendo..."
                    ) : (
                      <>
                        <SiMercadopago
                          className="size-4 shrink-0"
                          aria-hidden
                        />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => startCheckout("paypal")}
                    disabled={checkoutProviderLoading !== null}
                    className="w-full bg-[#0070ba] hover:bg-[#005d99] text-white font-semibold justify-center gap-2 h-11"
                  >
                    {checkoutProviderLoading === "paypal" ? (
                      "Redirigiendo..."
                    ) : (
                      <>
                        <SiPaypal className="size-4 shrink-0" aria-hidden />
                        Pagar con PayPal
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-white/55">
                  Te vamos a redireccionar a la plataforma de pago elegida.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Metas y Fases en dos columnas */}
          <motion.div
            id="financiamiento"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 scroll-mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            {/* Columna izquierda: Metas + Transmisión */}
            <motion.div variants={slideInLeftVariants} className="space-y-6">
              <h3
                className="text-white mb-4 sm:mb-5 text-[28px] sm:text-[32px] md:text-[36px] leading-[105%] tracking-normal font-black"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                El objetivo
              </h3>
              <p
                className="text-white text-[18px] sm:text-[20px] md:text-[24px] leading-[1.6] tracking-normal font-normal"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Este proyecto tiene{" "}
                <span className="font-bold text-white">dos grandes pasos</span>.
                Primero,{" "}
                <span className="font-bold text-white">
                  hacer posible la transmisión
                </span>
                . Después, intentar{" "}
                <span className="font-bold text-white">llevarla más lejos</span>
                .
                <br />
                <br />
                Todo lo que se reúna se destina exclusivamente a eso: que el
                Mundial vuelva a escucharse y, si se puede, también a vivirlo{" "}
                <span className="font-bold text-white">desde adentro</span>.
                <br />
                <br />
                Es un recorrido que se construye{" "}
                <span className="font-bold text-white">entre todos</span>.
              </p>
            </motion.div>

            {/* Columna derecha: Fases */}
            <motion.div variants={slideInRightVariants} className="opacity-100">
              <motion.div
                className="space-y-5 sm:space-y-6 opacity-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainerVariants}
              >
                {phases.map((phase) => (
                  <motion.div
                    key={phase.id}
                    className="flex items-start gap-4 sm:gap-6 md:gap-8 opacity-100"
                    variants={phaseItemVariants}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center relative w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20">
                      <img
                        src="/images/Ellipse 49.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <span
                        className="relative text-[48px] sm:text-[56px] md:text-[64px] leading-[128%] tracking-normal text-center font-bold text-white opacity-100"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          color: "#ffffff",
                        }}
                      >
                        {phase.sort_order}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 opacity-100">
                      <h4
                        className="mb-2 text-sm sm:text-base leading-[128%] tracking-normal font-normal text-white/60"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {phase.title} — {phase.amount}
                      </h4>
                      <p
                        className="mb-3 text-xl sm:text-2xl md:text-3xl leading-[128%] tracking-normal font-bold text-white opacity-100"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          color: "#ffffff",
                        }}
                      >
                        {phase.description ?? ""}
                      </p>
                      {phase.items && phase.items.length > 0 && (
                        <ul className="space-y-2 text-base sm:text-lg md:text-xl leading-[128%] tracking-normal font-normal opacity-90 text-white list-none">
                          {phase.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start"
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                color: "rgba(255, 255, 255, 0.9)",
                              }}
                            >
                              <span className="mr-2">–</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Preguntas frecuentes */}
        <motion.div
          id="preguntas-frecuentes"
          className="mb-12 sm:mb-16 md:mb-20 scroll-mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.h2
            className="text-white mb-6 sm:mb-8 text-left font-montserrat font-black text-[32px] sm:text-[42px] md:text-[56px] leading-[105%] tracking-normal"
            style={{ fontFamily: "Montserrat, sans-serif" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            Preguntas frecuentes
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] mb-3 sm:mb-4 border-b border-white/20 last:mb-0 overflow-hidden"
                >
                  <AccordionTrigger className="text-white hover:no-underline hover:bg-white/5 px-4 sm:px-5 md:px-6 py-4 sm:py-5 text-left text-base sm:text-lg md:text-xl font-semibold [&>svg]:text-white [&>svg]:shrink-0 [&[data-state=open]>svg]:rotate-180">
                    <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0">
                    <div
                      className="text-white/90 text-sm sm:text-base md:text-lg leading-[1.6] space-y-3 [&_p]:mb-0 [&_p:last-child]:mb-0"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>

        {/* Cuántos necesitamos ser */}
        <motion.div
          className="mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.div
            className="p-4 sm:p-5 md:p-6 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] block w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2
              className="text-white mb-6 sm:mb-7 md:mb-8 text-left"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px, 5vw, 36px)",
                lineHeight: "105%",
                letterSpacing: "0%",
              }}
            >
              CUÁNTOS NECESITAMOS SER
            </h2>

            {/* APORTE MÚLTIPLE */}
            <div style={{ fontFamily: "Montserrat, sans-serif" }}>
              <h3
                className="text-white mb-4 sm:mb-5 text-lg sm:text-xl font-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                APORTE MÚLTIPLE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4">
                <div>
                  <p className="text-white/80 text-sm sm:text-base font-semibold mb-1">
                    Aporte de referencia:
                  </p>
                  <p className="text-white text-base sm:text-lg">3 aportes</p>
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-bold mb-1">
                    Personas necesarias:
                  </p>
                  <p className="text-white text-xl sm:text-2xl font-bold">
                    ≈ 4.700 personas
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-sm sm:text-base font-semibold mb-1">
                    Objetivo:
                  </p>
                  <p className="text-white text-base sm:text-lg">250.000 USD</p>
                </div>
              </div>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Si algunas personas participan más de una vez, el número de
                personas necesarias baja de forma concreta. Con este escenario
                de referencia, alcanza con ser alrededor de cuatro mil
                setecientas.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Sección Estadísticas — recaudación pública */}
        <motion.div
          className="mt-10 sm:mt-14 md:mt-20 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="text-white mb-4 sm:mb-6 text-left font-montserrat font-black text-[28px] sm:text-[36px] md:text-[44px] leading-[105%] tracking-normal"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Estadísticas
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-[#1a2e1a]/60 border border-white/10 py-10 sm:py-14 md:py-16 px-5 sm:px-8 md:px-10 min-h-[240px] sm:min-h-[280px] flex items-center justify-center"
          >
            <FundingStatsPanel />
          </motion.div>
        </motion.div>

        {/* Equipo — rediseño: cercanía, caras protagonistas, no corporativo */}
        <EquipoSection teamMembers={TEAM_MEMBERS} />
      </div>
    </section>
  );
}
