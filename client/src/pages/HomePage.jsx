const HomePage = () => {
  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-(--border) bg-(--surface) px-4 py-2 text-sm text-(--muted)">
          AI-powered advertising creative
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Turn product ideas into
          <span className="text-(--primary)"> beautiful ads.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-(--muted)">
          CoreClip generates polished advertising creatives from your prompt and
          product imagery in seconds.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/create"
            className="rounded-xl bg-(--primary) px-6 py-3 font-medium text-white transition hover:bg-(--primary-hover)"
          >
            Create an Ad
          </a>

          <a
            href="/community"
            className="rounded-xl border border-(--border) bg-(--surface) px-6 py-3 font-medium transition hover:bg-(--surface-secondary)"
          >
            Explore Community
          </a>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
