import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import { fetchProducts } from "../../services/productService";
import type { ProductSummary } from "../../types/product.types";

const questions = [
  {
    id: "mood",
    title: "What mood are you going for?",
    options: [
      { label: "Bold & confident", value: "bold", tags: ["oud", "spice", "leather"] },
      { label: "Soft & romantic", value: "soft", tags: ["rose", "floral", "jasmine"] },
      { label: "Fresh & clean", value: "fresh", tags: ["citrus", "aquatic", "green"] }
    ]
  },
  {
    id: "occasion",
    title: "When will you wear it?",
    options: [
      { label: "Everyday", value: "daily", families: ["FRESH", "FLORAL"] },
      { label: "Evening events", value: "evening", families: ["ORIENTAL", "WOODY"] },
      { label: "Special occasions", value: "special", families: ["ORIENTAL", "FLORAL"] }
    ]
  },
  {
    id: "intensity",
    title: "How strong should it be?",
    options: [
      { label: "Light", value: "light", concentrations: ["EAU_DE_TOILETTE", "COLOGNE"] },
      { label: "Moderate", value: "moderate", concentrations: ["EAU_DE_PARFUM"] },
      { label: "Long-lasting", value: "strong", concentrations: ["PARFUM", "EXTRAIT"] }
    ]
  }
];

type Answers = Record<string, string>;

function scoreProduct(product: ProductSummary, answers: Answers) {
  let score = 0;

  const moodAnswer = answers.mood;
  if (moodAnswer === "bold") {
    if (product.tags.some((tag) => ["oud", "spice", "leather"].some((key) => tag.toLowerCase().includes(key)))) {
      score += 35;
    }
  } else if (moodAnswer === "soft") {
    if (product.tags.some((tag) => ["rose", "floral", "jasmine"].some((key) => tag.toLowerCase().includes(key)))) {
      score += 35;
    }
  } else if (moodAnswer === "fresh") {
    if (product.tags.some((tag) => ["citrus", "aquatic", "green"].some((key) => tag.toLowerCase().includes(key)))) {
      score += 35;
    }
  }

  const occasionAnswer = answers.occasion;
  if (occasionAnswer === "daily" && ["FRESH", "FLORAL"].includes(product.scentFamily)) {
    score += 35;
  } else if (occasionAnswer === "evening" && ["ORIENTAL", "WOODY"].includes(product.scentFamily)) {
    score += 35;
  } else if (occasionAnswer === "special" && ["ORIENTAL", "FLORAL"].includes(product.scentFamily)) {
    score += 35;
  }

  const intensityAnswer = answers.intensity;
  if (intensityAnswer === "light" && ["EAU_DE_TOILETTE", "COLOGNE"].includes(product.concentration)) {
    score += 20;
  } else if (intensityAnswer === "moderate" && product.concentration === "EAU_DE_PARFUM") {
    score += 20;
  } else if (
    intensityAnswer === "strong" &&
    ["PARFUM", "EXTRAIT"].includes(product.concentration)
  ) {
    score += 20;
  }

  score += Math.min(product.avgRating * 4, 20);
  score += product.isFeatured ? 5 : 0;

  return Math.min(Math.round(score), 99);
}

export default function ScentFinderSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const { data: productResponse } = useQuery({
    queryKey: ["scent-finder-products"],
    queryFn: () => fetchProducts({ limit: 50, inStock: true })
  });

  const recommendations = useMemo(() => {
    const products = productResponse?.data ?? [];
    if (!showResults || products.length === 0) return [];

    return products
      .map((product) => ({ product, match: scoreProduct(product, answers) }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  }, [answers, productResponse?.data, showResults]);

  const currentQuestion = questions[step];
  const progress = showResults ? 100 : ((step + 1) / questions.length) * 100;

  const selectOption = (value: string) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setShowResults(true);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="font-heading text-3xl text-accent-gold">Find your scent</h2>
        <p className="mt-2 text-text-secondary">Answer a few questions and we will recommend your perfect match.</p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-bg-secondary">
          <div
            className="h-full rounded-full bg-accent-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!showResults ? (
          <div className="mt-8">
            <p className="text-sm text-text-secondary">
              Question {step + 1} of {questions.length}
            </p>
            <h3 className="mt-2 font-heading text-2xl text-text-primary">{currentQuestion.title}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option.value)}
                  className="rounded-xl border border-border px-4 py-6 text-left transition hover:border-accent-gold hover:text-accent-gold"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h3 className="font-heading text-2xl text-text-primary">Your top matches</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {recommendations.map(({ product, match }) => (
                <div key={product.id} className="relative">
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-accent-gold px-2 py-1 text-xs font-semibold text-bg-primary">
                    {match}% match
                  </span>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetQuiz}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent-gold hover:text-accent-gold"
              >
                Retake quiz
              </button>
              <Link
                to="/shop"
                className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary"
              >
                View all fragrances
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
