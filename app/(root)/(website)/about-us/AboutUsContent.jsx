"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "@/lib/SplitType/index";
import ShopAllButton from "@/components/Application/Website/ShopAllButton";
import ProductBox from "@/components/Application/Website/ProductBox";
import styles from "./about-us.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  if (!CustomEase.get("hop")) {
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );
  }
}

// ── Scroll-controlled middle image ──────────────────────────────────
const SCROLL_IMAGE = "https://res.cloudinary.com/darrsi9y2/image/upload/v1781947528/qcbfdwai0pmvv97khlcw.jpg";

// Hero images (left thumb · center · right thumb)
const HERO_LEFT_IMAGE = "https://res.cloudinary.com/darrsi9y2/image/upload/v1781947528/qcbfdwai0pmvv97khlcw.jpg";
const HERO_CENTER_IMAGE = "https://res.cloudinary.com/darrsi9y2/image/upload/v1781945835/einxusjo1pubrtkgfddc.jpg";
const HERO_RIGHT_IMAGE = "https://res.cloudinary.com/darrsi9y2/image/upload/v1783063101/WhatsApp_Image_2026-07-03_at_12.46.03_PM_uqte4t.jpg";

// Brand-story paragraphs shown beneath the statement.
const STORY = [
  "Horticultural Development Centre began in Kolkata as a plant nursery, opened in 1990 by a small group of people who had spent their working lives in horticulture. The idea was modest: grow good planting material properly, and sell it honestly. Everything since has grown out of that one decision.",
  "The nursery came first, and it is still the foundation. Our farm at Bibirhut, Ramdevpur in South 24 Parganas runs to roughly fifty bighas, developed scientifically over the years — 2,500 sqm of polyshed house, 2,000 sqm of green house and a 200 sqm fanpad house, served by sprinkler, fogger and drip irrigation. It exists to propagate and produce plants and grasses suited to tropical and subtropical conditions, and to send out material that establishes rather than merely survives the journey.",
  "Landscaping followed naturally. Our qualified horticulturists and skilled field staff design, execute and maintain gardens, and we have built credentials in parks, gardens and beautification work under State Government departments, CPWD and private clients across the country. Alongside it we run a showroom and sale counter at Alipore — the one place in West Bengal where plants, seeds, pots, hanging baskets, nutrients, plant protection chemicals, garden implements and every accessory sit under one roof.",
];

// The people behind the organisation. `reverse` flips the image/text order.
const PEOPLE = [
  {
    name: "Tapan Maiti",
    role: "Proprietor · Horticultural Development Centre",
    image: HERO_CENTER_IMAGE,
    bio: [
      "Landscaping in Kolkata is rarely a matter of taste alone. The soil is heavy, the monsoon is unforgiving, and a terrace has only so much load to give. What survives here is what was chosen with those things in mind.",
      "That conviction is why we kept the nursery rather than becoming a trading house. When a plant is raised on our own farm we know its age, its hardening, and what it will do in its second year — none of which can be guaranteed from a bought-in consignment.",
      "It is also why we invested early in protected cultivation and modern irrigation. Polyshed, green house and fanpad structures with sprinkler, fogger and drip systems let us hold quality through the seasons that would otherwise dictate what we could offer.",
      "We import selected varieties from abroad for projects that call for them, and we stay on afterwards to maintain what we plant. A garden handed over and forgotten is not a finished project.",
    ],
  },
  {
    name: "Our Horticulturists",
    role: "Design · Execution · Maintenance",
    image: HERO_RIGHT_IMAGE,
    reverse: true,
    bio: [
      "Every project is read on site before it is drawn. Light hours, drainage, soil, wind, load and how the space will actually be used decide the planting plan — not a catalogue picked in an office.",
      "Our team covers the full arc: survey and design, soil preparation and planting, lawn laying, roof-garden waterproofing with geotextile and drain cell, and the irrigation that keeps it all alive.",
      "The field staff who plant a garden are the ones who come back to it. Pruning, feeding, pest control, lawn upkeep and seasonal replanting run on a schedule, which is how a garden still looks considered in its fifth year.",
      "That combination — designing, growing and maintaining under one house — is what allowed us to work on the Assembly House, the National Library, Alipore Zoo, Rabindra Sarobar, IT parks at Krishnanagar and Malda, tourist lodges, township landscapes and a great many private gardens.",
    ],
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AboutUsContent = ({ products = [] }) => {
  const container = useRef(null);
  const headlineRef = useRef(null);
  const statementRef = useRef(null);
  const supportRef = useRef(null);
  const peopleRef = useRef(null);
  const scrollImgRef = useRef(null);
  const heroRef = useRef(null);
  const flankLeftRef = useRef(null);
  const flankRightRef = useRef(null);
  const centerImgRef = useRef(null);

  // ── SplitType line reveals + scroll-scrub image ──────────────────
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const splitInstances = [];
    const triggers = [];
    const tweens = [];
    let cancelled = false;

    // Wrap each split line in an overflow-hidden mask so the slide-up reads
    // as a clean "popup from bottom" reveal.
    const splitToMaskedLines = (root) => {
      const targets = root.querySelectorAll("h1, h2, h3, p");
      const spans = [];
      targets.forEach((el) => {
        const split = new SplitType(el, { types: "lines", tagName: "span" });
        splitInstances.push(split);
        split.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = styles.lineWrapper;
          line.parentNode.insertBefore(wrapper, line);
          wrapper.appendChild(line);
          spans.push(line);
        });
      });
      return spans;
    };

    const run = () => {
      if (cancelled || !container.current) return;

      // Statement + supporting copy: reveal when scrolled into view.
      [statementRef.current, supportRef.current].forEach((root) => {
        if (!root) return;
        const spans = splitToMaskedLines(root);
        if (reduced) {
          gsap.set(spans, { y: 0 });
          return;
        }
        gsap.set(spans, { y: "115%" });
        const t = ScrollTrigger.create({
          trigger: root,
          start: "top 82%",
          once: true,
          onEnter: () =>
            tweens.push(
              gsap.to(spans, {
                y: 0,
                stagger: 0.05,
                duration: 1.2,
                ease: "power4.out",
              })
            ),
        });
        triggers.push(t);
      });

      // Profile blocks: editorial reveal — the image clips up from the bottom
      // while its photo settles from a soft zoom, and the text lines stagger in.
      // Each photo also gets a gentle scroll-scrub Ken-Burns drift for depth.
      if (peopleRef.current) {
        const profiles = peopleRef.current.querySelectorAll(`.${styles.profile}`);
        profiles.forEach((profile) => {
          const imgWrap = profile.querySelector(`.${styles.profileImg}`);
          const photo = imgWrap?.querySelector("img");
          const textEls = profile.querySelectorAll(`.${styles.profileBody} > *`);

          if (reduced) {
            if (imgWrap) gsap.set(imgWrap, { clipPath: "none" });
            if (photo) gsap.set(photo, { scale: 1 });
            gsap.set(textEls, { autoAlpha: 1, y: 0 });
            return;
          }

          // Initial hidden states
          if (imgWrap)
            gsap.set(imgWrap, { clipPath: "inset(100% 0% 0% 0% round 6px)" });
          if (photo) gsap.set(photo, { scale: 1.3 });
          gsap.set(textEls, { autoAlpha: 0, y: 28 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: profile, start: "top 75%", once: true },
          });
          if (imgWrap)
            tl.to(
              imgWrap,
              {
                clipPath: "inset(0% 0% 0% 0% round 6px)",
                duration: 1.1,
                ease: "power4.out",
              },
              0
            );
          if (photo)
            tl.to(photo, { scale: 1.04, duration: 1.3, ease: "power3.out" }, 0);
          tl.to(
            textEls,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.25
          );

          tweens.push(tl);
          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

          // Ongoing Ken-Burns drift (scale 1.04 baseline gives headroom so no edge gap)
          if (photo) {
            const kb = gsap.fromTo(
              photo,
              { yPercent: -2.5 },
              {
                yPercent: 2.5,
                ease: "none",
                scrollTrigger: {
                  trigger: profile,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
            tweens.push(kb);
            if (kb.scrollTrigger) triggers.push(kb.scrollTrigger);
          }
        });
      }

      // Hero images: layered parallax — each moves at a different rate as the
      // page scrolls, giving depth. Side thumbs drift the most, center least.
      if (heroRef.current && !reduced) {
        const parallax = [
          { el: flankLeftRef.current, y: -180 },
          { el: flankRightRef.current, y: -260 },
          { el: centerImgRef.current, y: -90 },
        ];
        parallax.forEach(({ el, y }) => {
          if (!el) return;
          const tween = gsap.fromTo(
            el,
            { yPercent: 0 },
            {
              y,
              ease: "none",
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
          tweens.push(tween);
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        });
      }

      // Middle image: scrub-scale on scroll (skipped under reduced motion).
      if (scrollImgRef.current && !reduced) {
        const tween = gsap.fromTo(
          scrollImgRef.current,
          { scale: 1 },
          {
            scale: 1.4,
            ease: "none",
            scrollTrigger: {
              trigger: scrollImgRef.current.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
        tweens.push(tween);
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }

      // Recompute trigger positions once everything is laid out.
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };

    // Split only after fonts are ready so line breaks (and therefore the
    // masks) match the rendered text instead of the fallback font.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(run);

    // A late refresh covers async image loads shifting layout.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      tweens.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
      splitInstances.forEach((s) => s.revert());
    };
  }, []);

  // ── Intro reveal: headline slides up after mount ─────────────────
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(headlineRef.current, { y: 0 });
        return;
      }
      gsap.to(headlineRef.current, {
        y: 0,
        delay: 0.35,
        duration: 1.3,
        ease: "hop",
      });
    },
    { scope: container }
  );

  return (
    <div className={styles.page} ref={container}>
      <div className={styles.inner}>
        {/* Hero: centered image, flanking thumbs, giant headline */}
        <div className={styles.hero} ref={heroRef}>
          <div className={`${styles.flankImage} ${styles.flankLeft}`} ref={flankLeftRef}>
            <Image
              src={HERO_LEFT_IMAGE}
              alt="Nursery detail"
              fill
              sizes="130px"
              className="object-cover"
            />
          </div>
          <div className={`${styles.flankImage} ${styles.flankRight}`} ref={flankRightRef}>
            <Image
              src={HERO_RIGHT_IMAGE}
              alt="Landscaping detail"
              fill
              sizes="110px"
              className="object-cover"
            />
          </div>

          <div className={styles.centerImage} ref={centerImgRef}>
            <Image
              src={HERO_CENTER_IMAGE}
              alt="Our nursery at Bibirhut, Ramdevpur"
              fill
              priority
              sizes="(max-width: 900px) 70vw, 360px"
              className="object-cover"
            />
          </div>

          <div className={styles.headlineMask}>
            <h1 className={styles.headline} ref={headlineRef}>
              about us
            </h1>
          </div>
        </div>

        {/* Plus marker + caption */}
        <div className={styles.marker}>
          <span className={styles.plus}>+</span>
          <span className={styles.rule} />
          <span className={styles.caption}>
            Kolkata since 1989 · our own
            <br />
            nursery, our own field staff
          </span>
        </div>

        {/* Big statement + brand story */}
        <div className={styles.statementWrap}>
          <div ref={statementRef}>
            <h2 className={styles.statement}>
              We are not a garden shop that also plants. We grow the plant,
              design the space it goes into, and come back to look after it.
            </h2>
          </div>
          <div className={styles.story} ref={supportRef}>
            {STORY.map((para, i) => (
              <p className={styles.storyText} key={i}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width scroll-scaled middle image (Image 2) */}
      <div className={styles.scrollImageWrap}>
        <img
          ref={scrollImgRef}
          src={SCROLL_IMAGE}
          alt="Landscaping work in progress"
          className={styles.scrollImage}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.inner}>
        {/* The family behind the brand */}
        <div className={styles.people} ref={peopleRef}>
          <div className={styles.peopleHead}>
            <span className={styles.peopleEyebrow}>THE PEOPLE</span>
            <h2 className={styles.peopleHeadline}>
              Qualified horticulturists, and field staff who come back.
            </h2>
            <p className={styles.peopleIntro}>
              Behind every garden we build is one house doing all of it — raising
              the plants at Bibirhut, surveying and designing the site, executing
              the work, and returning season after season to maintain it. Nothing
              is subcontracted out and then forgotten.
            </p>
          </div>

          {PEOPLE.map((person) => (
            <article
              key={person.name}
              className={`${styles.profile} ${
                person.reverse ? styles.profileReverse : ""
              }`}
            >
              <div className={styles.profileImg}>
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className={styles.profileBody}>
                <span className={styles.profileRole}>{person.role}</span>
                <h3 className={styles.profileName}>{person.name}</h3>
                {person.bio.map((para, i) => (
                  <p className={styles.profileBio} key={i}>
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}

          {/* CTA — shared website button for consistent styling */}
          <div className={styles.ctaWrap}>
            <ShopAllButton
              label="Request a site visit"
              href="/contact"
              colorScheme="dark-red"
              radius="sm"
            />
          </div>
        </div>
      </div>

      {/* ── Curated For You · You May Also Like (centered) ───────────── */}
      {products.length > 0 && (
        <div className={styles.inner}>
          <section className={styles.related}>
            <div className="mb-8 text-center lg:mb-10">
              <p className="eyebrow inline-flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                From the Nursery
                <span aria-hidden className="h-px w-6 bg-current opacity-40" />
              </p>
              <h2 className="mt-3 font-neue text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium tracking-[-0.02em] leading-[1.1] text-[var(--brand-primary)]">
                You May Also Need
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((item) => (
                <ProductBox key={item._id} product={item} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AboutUsContent;
