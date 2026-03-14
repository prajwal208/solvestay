"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Search,
  MapPin,
  Home,
  Building2,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Eye,
  IndianRupee,
  Map,
  Phone,
  CreditCard,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomeCitySelect } from "@/components/HomeCitySelect";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const propertyTypes = [
  {
    icon: Home,
    label: "Houses",
    count: "2,500+",
    href: "/properties?property_type=house",
  },
  {
    icon: Building2,
    label: "Apartments",
    count: "4,200+",
    href: "/properties?property_type=apartment",
  },
  {
    icon: Users,
    label: "PG/Hostels",
    count: "1,800+",
    href: "/properties?property_type=pg",
  },
  {
    icon: MapPin,
    label: "Land/Plots",
    count: "950+",
    href: "/properties?property_type=land",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "All properties undergo document verification ensuring authenticity and trust.",
  },
  {
    icon: Phone,
    title: "Direct Owner Contact",
    description:
      "Get owner phone, WhatsApp & email instantly. No middlemen, no brokerage.",
  },
  {
    icon: Eye,
    title: "360° Virtual Tours",
    description:
      "Explore properties from your home with immersive virtual reality tours.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description:
      "Find properties on map with nearby schools, hospitals, and amenities.",
  },
  {
    icon: TrendingUp,
    title: "Price Analytics",
    description:
      "AI-powered fair market value predictions to help you negotiate better.",
  },
  {
    icon: CreditCard,
    title: "Affordable Plans",
    description:
      "Access owner contacts for just ₹49/day. No hidden fees or commissions.",
  },
];

const faqs = [
  {
    question: "How does Solvestay work?",
    answer:
      "Solvestay connects you directly with property owners. Browse verified listings, view 360° tours, and unlock owner contact (phone, WhatsApp, email) with an affordable pass. No brokers, no hidden fees.",
  },
  {
    question: "Is there any brokerage or commission?",
    answer:
      "No. We charge zero brokerage. You only pay for a short-term pass (from ₹49 for 2 days) to reveal owner contacts. Once you have the contact, you deal directly with the owner.",
  },
  {
    question: "How do I contact a property owner?",
    answer:
      "After signing up and choosing a plan, you can unlock contacts for the properties you’re interested in. You’ll get the owner’s phone number, WhatsApp, and email to reach out directly.",
  },
  {
    question: "Are the listings verified?",
    answer:
      "Yes. Property owners go through document verification before listing. We also encourage 360° virtual tours and clear photos so you can trust what you see.",
  },
  {
    question: "Can I list my property for free?",
    answer:
      "Yes. Owners can list properties for free. After verification, your listing goes live. You only get more visibility and tools if you opt for optional paid boosts.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, cards, net banking, and wallets. Payment is secure and you get instant access to contacts after a successful payment.",
  },
];

const pricingPlans = [
  {
    name: "Two Day Pass",
    price: "49",
    period: "2 days",
    features: [
      "5 property contacts",
      "Basic search filters",
      "Chat with owners",
      "48 hours access",
    ],
    popular: false,
  },
  {
    name: "Weekly Pass",
    price: "150",
    period: "week",
    features: [
      "20 property contacts",
      "Advanced filters",
      "Priority support",
      "Save favorites",
      "7 days access",
    ],
    popular: true,
  },
  {
    name: "Monthly Pass",
    price: "299",
    period: "month",
    features: [
      "Unlimited contacts",
      "All premium filters",
      "Price insights",
      "Download PDFs",
      "30 days access",
    ],
    popular: false,
  },
];

const stats = [
  { value: "50K+", label: "Properties Listed" },
  { value: "2L+", label: "Happy Customers" },
  { value: "20+", label: "Cities Covered" },
  { value: "₹0", label: "Brokerage Fee" },
];

const bangaloreAreas = [
  { name: "Whitefield", tag: "Key area", search: "Whitefield" },
  { name: "Outer Ring Road (ORR)", tag: "Key area", search: "ORR" },
  { name: "Koramangala", tag: "Key area", search: "Koramangala" },
  { name: "Indiranagar", tag: "Key area", search: "Indiranagar" },
  { name: "Devanahalli", tag: "Emerging", search: "Devanahalli" },
  { name: "Sarjapur Road", tag: "Emerging", search: "Sarjapur" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [areaOptions, setAreaOptions] = useState<
    { id: string; text: string }[]
  >([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  const defaultSearchCity = "Bangalore";

  const fetchAreaSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setAreaOptions([]);
        return;
      }
      const cityForSearch = selectedCity || defaultSearchCity;
      try {
        const res = await fetch(
          `/api/place?q=${encodeURIComponent(query + ", " + cityForSearch)}&limit=6`,
        );
        const data = await res.json();
        const places = data.success && data.places ? data.places : [];
        const options = places.map((p: any, i: number) => ({
          id: `${p.display_name}-${i}`,
          text: p.area || p.display_name || "",
        }));
        setAreaOptions(options);
      } catch {
        setAreaOptions([]);
      }
    },
    [selectedCity],
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setAreaOptions([]);
      setShowAreaSuggestions(false);
      return;
    }
    const t = setTimeout(() => fetchAreaSuggestions(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery, selectedCity, fetchAreaSuggestions]);

  useEffect(() => {
    if (areaOptions.length > 0) setShowAreaSuggestions(true);
  }, [areaOptions.length]);

  const handleSearch = (overrides?: { city?: string; q?: string }) => {
    const params = new URLSearchParams();
    const q = overrides?.q ?? searchQuery;
    const city = overrides?.city ?? selectedCity;
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    router.push(`/properties?${params.toString()}`);
  };

  const popularBangaloreSearches = [
    { label: "2 BHK in Whitefield", city: "Bangalore", q: "2 BHK Whitefield" },
    { label: "PG in Koramangala", city: "Bangalore", q: "PG Koramangala" },
    {
      label: "Flat for rent Indiranagar",
      city: "Bangalore",
      q: "Flat rent Indiranagar",
    },
    { label: "Properties in ORR", city: "Bangalore", q: "ORR" },
    { label: "3 BHK Sarjapur Road", city: "Bangalore", q: "3 BHK Sarjapur" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20 relative z-10 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn}>
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Zero Brokerage Property Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Find Your{" "}
              <span className="text-gradient font-serif italic">Perfect</span>
              <br />
              Home Today
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            >
              Connect directly with property owners. No brokers, no hidden fees.
              Get owner contact for just{" "}
              <span className="text-primary font-semibold">₹49</span>.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="bg-card rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-[100rem] mx-auto border"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="w-full sm:w-52 flex-shrink-0">
                  <HomeCitySelect
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="All Cities"
                    heightClass="h-12 sm:h-14"
                  />
                </div>
                <div className="flex-1 min-w-0 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    placeholder={
                      selectedCity
                        ? `Search area, locality or property in ${selectedCity}`
                        : "Search area, locality or property in Bangalore"
                    }
                    className="pl-12 h-12 sm:h-14 text-base border-0 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      areaOptions.length > 0 && setShowAreaSuggestions(true)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowAreaSuggestions(false), 150)
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  {showAreaSuggestions && areaOptions.length > 0 && (
                    <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden py-1">
                      {areaOptions.map((area) => (
                        <li
                          key={area.id}
                          className="px-4 py-2.5 cursor-pointer hover:bg-accent text-sm transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(area.text);
                            if (!selectedCity)
                              setSelectedCity(defaultSearchCity);
                            setAreaOptions([]);
                            setShowAreaSuggestions(false);
                          }}
                        >
                          {area.text}
                          {selectedCity && (
                            <span className="ml-2 text-muted-foreground text-xs">
                              {selectedCity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-8 flex-shrink-0"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">
                  Popular in Bangalore:
                </span>
                {popularBangaloreSearches.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSearch({ city: item.city, q: item.q })}
                    className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {propertyTypes.map((type) => (
              <motion.div key={type.label} variants={fadeIn}>
                <Link
                  href={type.href}
                  className="group block p-6 sm:p-8 bg-card rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <type.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{type.label}</h3>
                  <p className="text-muted-foreground">{type.count} listings</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="mb-4">
                Why Choose Solvestay
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Everything You Need to
              <br />
              <span className="text-gradient font-serif italic">
                Find Your Home
              </span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              We&apos;ve built India&apos;s most transparent property platform
              with features designed to make your search effortless.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className="p-6 sm:p-8 rounded-2xl bg-card border hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="mb-4">
                Bangalore
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Explore Properties in
              <br />
              <span className="text-gradient font-serif italic">
                Key Bangalore Areas
              </span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Whitefield, Outer Ring Road (ORR), Koramangala, Indiranagar, and
              emerging areas like Devanahalli and Sarjapur Road.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {bangaloreAreas.map((area, index) => (
              <motion.div key={area.name} variants={fadeIn}>
                <Link
                  href={`/properties?city=Bangalore&q=${encodeURIComponent(area.search)}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{area.tag}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="mb-4">
                Simple Pricing
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Affordable Plans for
              <br />
              <span className="text-gradient font-serif italic">Everyone</span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Pay only when you need to contact property owners. No subscription
              traps.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeIn}
                className={`relative p-8 rounded-2xl ${
                  plan.popular
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground scale-105 shadow-2xl"
                    : "bg-card border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-background text-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <IndianRupee className="w-6 h-6" />
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }
                  >
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`}
                      />
                      <span
                        className={
                          plan.popular ? "text-primary-foreground/90" : ""
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full ${plan.popular ? "bg-background text-foreground hover:bg-background/90" : ""}`}
                  variant={plan.popular ? "secondary" : "default"}
                >
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Frequently Asked
              <br />
              <span className="text-gradient font-serif italic">Questions</span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Everything you need to know about Solvestay and how we help you
              find your perfect property.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border rounded-lg px-6 mb-3 bg-card data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left font-semibold py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to Find Your Dream Home?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl text-primary-foreground/80 mb-10"
            >
              Join over 2 lakh happy customers who found their perfect property
              on Solvestay.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8"
              >
                <Link href="/properties">
                  Browse Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                <Link href="/auth/register?role=owner">
                  List Your Property Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
