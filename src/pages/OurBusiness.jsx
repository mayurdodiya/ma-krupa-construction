import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, LayoutGrid, Droplets, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { site } from '@/lib/site';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Reveal, RevealGroup, RevealItem } from '@/components/common/Reveal';
import { ImportExportSpotlight } from '@/components/home/BusinessShowcase';
import businesses from '@/data/businesses.json';

const ICONS = { Globe, LayoutGrid, Droplets };

function ProductCard({ product }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !product.video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [product.video]);

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isActive 
          ? 'border-brand-400 shadow-glow ring-2 ring-brand-400/20' 
          : 'border-ink-200 dark:border-ink-700'
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
        {product.video ? (
          <video
            ref={videoRef}
            src={product.video}
            poster={product.image}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4 bg-white dark:bg-ink-900">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">
          {product.category}
        </span>
        <h4 className="mt-1 font-display text-lg font-bold text-ink-900 dark:text-white">
          {product.name}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}

function ProductCarousel({ products }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isAutoPlaying) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, products.length]);

  // Handle video autoplay/pause based on current slide
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentProduct = products[current];
    if (currentProduct?.video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }

    return () => {
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, [current, products]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrent(index);
  };

  const currentProduct = products[current];

  return (
    <div className="relative">
      {/* Main carousel image/video */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink-100 dark:bg-ink-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {currentProduct?.video ? (
              <video
                ref={videoRef}
                src={currentProduct.video}
                poster={currentProduct.image}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              />
            ) : (
              <img
                src={currentProduct?.image}
                alt={currentProduct?.name}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="inline-block rounded-full bg-brand-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                {currentProduct?.category}
              </span>
              <h3 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
                {currentProduct?.name}
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                {currentProduct?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30"
          aria-label="Previous product"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30"
          aria-label="Next product"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-brand-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product, i) => (
          <button
            key={product.id}
            type="button"
            onClick={() => handleDotClick(i)}
            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
              i === current
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OurBusiness() {
  const [activeTab, setActiveTab] = useState(0);

  usePageMeta(`Our Business — ${site.shortName}`, `Discover the diverse business verticals of Maa Krupa Group`);

  const activeBusiness = businesses[activeTab];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 pt-[100px] pb-16 text-white sm:pt-[120px] sm:pb-20">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-lines bg-[size:56px_56px] opacity-[0.14]" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 start-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-[100px]" />
        
        <div className="container-x relative">
          <Reveal>
            <p className="eyebrow justify-center !text-sky-300">
              <span className="h-px w-8 bg-sky-300" />
              Our Business
            </p>
            <h1 className="mt-4 text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Diverse <span className="italic text-sky-300">Business</span> Verticals
            </h1>
            <p className="mt-5 mx-auto max-w-2xl text-center text-[15px] leading-[1.85] text-white/65 sm:text-base">
              From global trade to premium surfaces to clean living solutions — Maa Krupa Group 
              delivers excellence across multiple business segments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Business Tabs */}
      <section className="bg-white py-12 dark:bg-ink-950 sm:py-16">
        <div className="container-x">
          {/* Tab buttons */}
          <Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              {businesses.map((biz, i) => {
                const Icon = ICONS[biz.icon] ?? Globe;
                return (
                  <button
                    key={biz.id}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`group flex items-center gap-3 rounded-xl px-6 py-4 transition-all duration-300 ${
                      i === activeTab
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                        : 'bg-ink-50 text-ink-700 hover:bg-ink-100 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${i === activeTab ? 'text-white' : 'text-brand-500'}`} />
                    <span className="font-display text-base font-bold">{biz.name}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Business content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBusiness.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              {activeBusiness.id === 'import-export' ? (
                <ImportExportSpotlight business={activeBusiness} />
              ) : (
                <>
                  {/* Business header */}
                  <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <Reveal>
                      <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                          {(() => {
                            const Icon = ICONS[activeBusiness.icon] ?? Globe;
                            return <Icon className="h-4 w-4" />;
                          })()}
                          {activeBusiness.name}
                        </span>
                        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-4xl">
                          {activeBusiness.tagline}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-300">
                          {activeBusiness.description}
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                          <div className="flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 dark:bg-brand-950">
                            <span className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                              {activeBusiness.products.length}
                            </span>
                            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                              Products
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                      <ProductCarousel products={activeBusiness.products} />
                    </Reveal>
                  </div>

                  {/* Product grid */}
                  <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                    {activeBusiness.products.map((product) => (
                      <RevealItem key={product.id} y={20}>
                        <ProductCard product={product} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-50 py-16 dark:bg-ink-900/40 sm:py-20">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-4xl">
              Interested in Our Products?
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-base text-ink-600 dark:text-ink-300">
              Contact us to learn more about our business verticals and how we can serve your needs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={`tel:${site.phoneRaw}`} className="btn-primary group">
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}