import { Copy, Download, LoaderCircle, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { getCommunityAds } from "../services/adService";

const CommunityPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCommunityAds = async () => {
      try {
        setLoading(true);

        const response = await getCommunityAds();

        if (response.success) {
          setAds(response.ads);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load community advertisements",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommunityAds();
  }, []);

  const filteredAds = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return ads;
    }

    return ads.filter((ad) => {
      return (
        ad.title?.toLowerCase().includes(normalizedSearch) ||
        ad.prompt?.toLowerCase().includes(normalizedSearch) ||
        ad.user?.name?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [ads, search]);

  const getInitials = (name = "User") => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleCopyUrl = async (adId) => {
    const url = `${window.location.origin}/ad/${adId}`;

    try {
      await navigator.clipboard.writeText(url);

      toast.success("Ad URL copied");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const handleDownload = async (ad) => {
    try {
      const response = await fetch(ad.generatedImage);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${ad.title
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      toast.success("Advertisement downloaded");
    } catch {
      toast.error("Unable to download advertisement");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1.5 text-xs font-medium text-(--muted)">
            <Sparkles size={14} className="text-(--primary)" />
            Community
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore the community
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted) sm:text-base">
                Discover advertisements created by the CoreClip community.
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover)"
            >
              <Sparkles size={16} />
              Create an ad
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search advertisements or creators..."
              className="w-full rounded-xl border border-(--border) bg-(--surface) py-3 pl-11 pr-4 text-sm outline-none transition focus:border-(--primary)"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-80 items-center justify-center">
            <LoaderCircle size={32} className="animate-spin text-(--primary)" />
          </div>
        )}

        {/* Empty state */}
        {!loading && ads.length === 0 && (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-(--border) bg-(--surface)">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
              <Sparkles size={25} />
            </div>

            <h2 className="text-lg font-semibold">
              The community is waiting for its first ad
            </h2>

            <p className="mt-2 max-w-md text-center text-sm leading-6 text-(--muted)">
              Make an advertisement, set it to public, and it will appear here.
            </p>

            <Link
              to="/create"
              className="mt-6 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover)"
            >
              Create your first ad
            </Link>
          </div>
        )}

        {/* Search empty state */}
        {!loading && ads.length > 0 && filteredAds.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-(--border) bg-(--surface)">
            <Search size={28} className="mb-4 text-(--muted)" />

            <h2 className="font-semibold">No advertisements found</h2>

            <p className="mt-2 text-sm text-(--muted)">
              Try a different search term.
            </p>
          </div>
        )}

        {/* Community grid */}
        {!loading && filteredAds.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAds.map((ad) => (
              <article
                key={ad._id}
                className="overflow-hidden rounded-3xl border border-(--border) bg-(--surface) shadow-(--shadow) transition hover:-translate-y-0.5"
              >
                {/* Image */}
                <Link
                  to={`/ad/${ad._id}`}
                  className="group relative block overflow-hidden bg-(--surface-secondary)"
                >
                  <img
                    src={ad.generatedImage}
                    alt={ad.title}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                    {ad.aspectRatio}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5">
                  {/* Creator */}
                  <div className="flex items-center gap-3">
                    {ad.user?.profileImage ? (
                      <img
                        src={ad.user.profileImage}
                        alt={ad.user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--primary-soft) text-xs font-bold text-(--primary)">
                        {getInitials(ad.user?.name)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {ad.user?.name || "CoreClip user"}
                      </p>

                      <p className="text-xs text-(--muted)">
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <Link to={`/ad/${ad._id}`} className="mt-5 block">
                    <h2 className="truncate text-base font-semibold transition hover:text-(--primary)">
                      {ad.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--muted)">
                      {ad.prompt}
                    </p>
                  </Link>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(ad)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-(--border) px-3 py-2.5 text-xs font-semibold transition hover:border-(--primary)"
                    >
                      <Download size={15} />
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(ad._id)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-(--border) px-3 py-2.5 text-xs font-semibold transition hover:border-(--primary)"
                    >
                      <Copy size={15} />
                      Copy URL
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CommunityPage;
