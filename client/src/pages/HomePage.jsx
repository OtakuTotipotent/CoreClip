import { ArrowRight, ImagePlus, Sparkles, WandSparkles } from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: WandSparkles,
    title: "AI-powered creation",
    description:
      "Describe your creative idea and CoreClip turns it into a polished advertisement.",
  },
  {
    icon: ImagePlus,
    title: "Use your product",
    description:
      "Upload a product image and use it as the visual foundation for your generated ad.",
  },
  {
    icon: Sparkles,
    title: "Ready to share",
    description:
      "Save your creations, publish them to the community, download them, or share their URL.",
  },
];

const HomePage = () => {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-(--primary-soft) opacity-60 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface)/80 px-3.5 py-2 text-xs font-medium text-(--muted) shadow-(--shadow) backdrop-blur sm:text-sm">
            <Sparkles size={14} className="text-(--primary)" />
            AI-powered advertising creative
          </div>

          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Turn product ideas into
            <span className="block text-(--primary)">
              beautiful advertisements.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-(--muted) sm:mt-7 sm:text-lg sm:leading-8">
            Create professional advertising creatives from a simple prompt and
            optional product image. Generate, save, share and explore — all in
            one place.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--primary-hover)"
            >
              Create an ad
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/community"
              className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-(--surface) px-6 py-3.5 text-sm font-semibold transition hover:bg-(--surface-secondary)"
            >
              Explore community
            </Link>
          </div>

          <div className="mt-14 grid w-full max-w-3xl grid-cols-3 divide-x divide-(--border) rounded-2xl border border-(--border) bg-(--surface)/80 py-5 shadow-(--shadow) backdrop-blur sm:mt-16">
            <div className="px-3">
              <p className="text-lg font-semibold sm:text-xl">AI</p>

              <p className="mt-1 text-[11px] text-(--muted) sm:text-xs">
                Powered creation
              </p>
            </div>

            <div className="px-3">
              <p className="text-lg font-semibold sm:text-xl">4</p>

              <p className="mt-1 text-[11px] text-(--muted) sm:text-xs">
                Ad ratios
              </p>
            </div>

            <div className="px-3">
              <p className="text-lg font-semibold sm:text-xl">∞</p>

              <p className="mt-1 text-[11px] text-(--muted) sm:text-xs">
                Creative ideas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--primary)">
              Simple workflow
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              From idea to advertisement
            </h2>

            <p className="mt-3 text-sm leading-6 text-(--muted) sm:text-base">
              CoreClip keeps the creative process simple while giving you the
              tools needed to manage your generated advertisements.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-(--border) bg-(--background) p-6 transition hover:-translate-y-0.5 hover:shadow-(--shadow)"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--primary-soft) text-(--primary)">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-(--border)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-(--border) bg-(--surface) p-8 text-center shadow-(--shadow) sm:p-12">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-(--primary-soft) opacity-60 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
                <Sparkles size={21} />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Create something worth sharing.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-(--muted) sm:text-base">
                Start with an idea, give CoreClip some creative direction, and
                generate your next advertisement.
              </p>

              <Link
                to="/create"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-(--primary) px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover)"
              >
                Start creating
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
