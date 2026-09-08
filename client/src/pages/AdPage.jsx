import {
  ArrowLeft,
  Download,
  LoaderCircle,
  Lock,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import { getAdById } from "../services/adService";

const AdPage = () => {
  const { id } = useParams();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const response = await getAdById(id);

        if (response.success) {
          setAd(response.ad);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load this advertisement",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success("Ad URL copied");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const handleDownload = async () => {
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
    } catch {
      toast.error("Unable to download advertisement");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <LoaderCircle size={32} className="animate-spin text-(--primary)" />
      </main>
    );
  }

  if (!ad) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-secondary)">
            <Lock size={24} />
          </div>

          <h1 className="text-xl font-semibold">Advertisement unavailable</h1>

          <p className="mt-2 text-sm text-(--muted)">
            This advertisement may not exist or may be private.
          </p>

          <Link
            to="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover)"
          >
            <ArrowLeft size={16} />
            Back to Create
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/community"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-(--muted) transition hover:text-(--foreground)"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-(--border) bg-(--surface) shadow-(--shadow) lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex min-h-80 items-center justify-center bg-(--surface-secondary) p-4 sm:p-6 lg:min-h-full">
            <img
              src={ad.generatedImage}
              alt={ad.title}
              className="max-h-[75vh] w-full object-contain"
            />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-(--primary-soft) px-3 py-1.5 text-xs font-medium text-(--primary)">
                <Sparkles size={13} />
                CoreClip Advertisement
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {ad.title}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                {ad.user?.profileImage ? (
                  <img
                    src={ad.user.profileImage}
                    alt={ad.user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--primary-soft) text-xs font-semibold text-(--primary)">
                    {(ad.user?.name || "CU")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">
                    {ad.user?.name || "CoreClip user"}
                  </p>

                  <p className="text-xs text-(--muted)">
                    Advertisement creator
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--muted)">
                  Creative prompt
                </p>

                <p className="rounded-2xl bg-(--surface-secondary) p-4 text-sm leading-6">
                  {ad.prompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-(--border) p-4">
                  <p className="text-xs text-(--muted)">Aspect ratio</p>

                  <p className="mt-1 text-sm font-semibold">{ad.aspectRatio}</p>
                </div>

                <div className="rounded-2xl border border-(--border) p-4">
                  <p className="text-xs text-(--muted)">Visibility</p>

                  <p className="mt-1 text-sm font-semibold capitalize">
                    {ad.privacy}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-hover)"
              >
                <Download size={17} />
                Download
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-sm font-semibold transition hover:border-(--primary)"
              >
                <Share2 size={17} />
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdPage;
