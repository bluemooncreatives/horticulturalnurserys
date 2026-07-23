"use client";

import Image from "next/image";
import ShopAllButton from "@/components/Application/Website/ShopAllButton";
import ProductBox from "@/components/Application/Website/ProductBox";
import styles from "./about-us.module.css";

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

const AboutUsContent = ({ products = [] }) => {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Hero: centered image, flanking thumbs, giant headline */}
        <div className={styles.hero}>
          <div className={`${styles.flankImage} ${styles.flankLeft}`}>
            <Image
              src={HERO_LEFT_IMAGE}
              alt="Nursery detail"
              fill
              sizes="130px"
              className="object-cover"
            />
          </div>
          <div className={`${styles.flankImage} ${styles.flankRight}`}>
            <Image
              src={HERO_RIGHT_IMAGE}
              alt="Landscaping detail"
              fill
              sizes="110px"
              className="object-cover"
            />
          </div>

          <div className={styles.centerImage}>
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
            <h1 className={styles.headline}>about us</h1>
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
          <div>
            <h2 className={styles.statement}>
              We are not a garden shop that also plants. We grow the plant,
              design the space it goes into, and come back to look after it.
            </h2>
          </div>
          <div className={styles.story}>
            {STORY.map((para, i) => (
              <p className={styles.storyText} key={i}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width middle image (Image 2) */}
      <div className={styles.scrollImageWrap}>
        <img
          src={SCROLL_IMAGE}
          alt="Landscaping work in progress"
          className={styles.scrollImage}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.inner}>
        {/* The family behind the brand */}
        <div className={styles.people}>
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
