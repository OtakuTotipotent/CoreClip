import {
  ImagePlus,
  LoaderCircle,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  deleteAd,
  generateAd,
  getMyAds,
  updateAdPrivacy,
} from "../services/adService";

const aspectRatios = [
  {
    value: "1:1",
    label: "Square",
    size: "1:1",
  },
  {
    value: "4:5",
    label: "Portrait",
    size: "4:5",
  },
  {
    value: "16:9",
    label: "Landscape",
    size: "16:9",
  },
  {
    value: "9:16",
    label: "Story",
    size: "9:16",
  },
];

const CreatePage = () => {
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [productImage, setProductImage] = useState("");
  const [productImageName, setProductImageName] = useState("");

  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadAds = useCallback(async () => {
    try {
      setLoadingAds(true);

      const response = await getMyAds();

      if (response.success) {
        setAds(response.ads);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load your ads");
    } finally {
      setLoadingAds(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(loadAds, 0);

    return () => clearTimeout(timeoutId);
  }, [loadAds]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProductImage(reader.result);
      setProductImageName(file.name);
    };

    reader.readAsDataURL(file);
  };

  const removeProductImage = () => {
    setProductImage("");
    setProductImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Enter an ad title");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Describe the ad you want to create");
      return;
    }

    if (prompt.trim().length < 10) {
      toast.error("Your prompt should contain at least 10 characters");
      return;
    }

    try {
      setGenerating(true);

      const response = await generateAd({
        title: title.trim(),
        prompt: prompt.trim(),
        aspectRatio,
        productImage,
      });

      if (response.success) {
        setAds((currentAds) => [response.ad, ...currentAds]);

        setTitle("");
        setPrompt("");
        setProductImage("");
        setProductImageName("");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success("Your ad has been generated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate the ad");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (adId) => {
    const confirmed = window.confirm("Delete this ad permanently?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteAd(adId);

      setAds((currentAds) => currentAds.filter((ad) => ad._id !== adId));

      toast.success("Ad deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete ad");
    }
  };

  const handlePrivacyToggle = async (ad) => {
    const nextPrivacy = ad.privacy === "public" ? "private" : "public";

    try {
      const response = await updateAdPrivacy(ad._id, nextPrivacy);

      if (response.success) {
        setAds((currentAds) =>
          currentAds.map((item) =>
            item._id === ad._id
              ? {
                  ...item,
                  privacy: response.ad.privacy,
                }
              : item,
          ),
        );

        toast.success(
          nextPrivacy === "public" ? "Ad is now public" : "Ad is now private",
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update privacy");
    }
  };

  const copyAdUrl = async (adId) => {
    const url = `${window.location.origin}/community#${adId}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ad URL copied");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1.5 text-xs font-medium text-(--muted)">
            <Sparkles size={14} className="text-(--primary)" />
            AI Ad Studio
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create your next ad
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted) sm:text-base">
            Turn an idea or product image into a polished advertising creative.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="h-fit rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">New advertisement</h2>

              <p className="mt-1 text-sm text-(--muted)">
                Describe what you want CoreClip to create.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label
                  htmlFor="ad-title"
                  className="mb-2 block text-sm font-medium"
                >
                  Ad title
                </label>

                <input
                  id="ad-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Summer Collection"
                  maxLength={100}
                  className="w-full rounded-xl border border-(--border) bg-(--surface-secondary) px-4 py-3 text-sm outline-none transition focus:border-(--primary)"
                />
              </div>

              <div>
                <label
                  htmlFor="ad-prompt"
                  className="mb-2 block text-sm font-medium"
                >
                  Creative prompt
                </label>

                <textarea
                  id="ad-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Create a premium fashion advertisement featuring a modern summer outfit, soft studio lighting, elegant neutral background and luxury editorial styling..."
                  rows={6}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-(--border) bg-(--surface-secondary) px-4 py-3 text-sm leading-6 outline-none transition focus:border-(--primary)"
                />

                <div className="mt-1 text-right text-xs text-(--muted)">
                  {prompt.length}/2000
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Aspect ratio
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {aspectRatios.map((ratio) => {
                    const selected = aspectRatio === ratio.value;

                    return (
                      <button
                        key={ratio.value}
                        type="button"
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`rounded-xl border px-3 py-3 text-left transition ${
                          selected
                            ? "border-(--primary) bg-(--primary-soft)"
                            : "border-(--border) bg-(--surface-secondary) hover:border-(--primary)"
                        }`}
                      >
                        <div className="text-sm font-medium">{ratio.label}</div>

                        <div className="mt-1 text-xs text-(--muted)">
                          {ratio.size}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Product image
                  <span className="ml-1 font-normal text-(--muted)">
                    (optional)
                  </span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {!productImage ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface-secondary) px-4 py-8 text-center transition hover:border-(--primary)"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--primary-soft) text-(--primary)">
                      <ImagePlus size={21} />
                    </div>

                    <span className="text-sm font-medium">
                      Upload product image
                    </span>

                    <span className="mt-1 text-xs text-(--muted)">
                      PNG, JPG or WEBP · Max 5 MB
                    </span>
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface-secondary)">
                    <div className="relative">
                      <img
                        src={productImage}
                        alt="Product preview"
                        className="h-48 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeProductImage}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3">
                      <Upload size={15} className="text-(--primary)" />

                      <span className="truncate text-xs text-(--muted)">
                        {productImageName}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={generating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <WandSparkles size={18} />
                    Generate advertisement
                  </>
                )}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Your advertisements</h2>

                <p className="mt-1 text-sm text-(--muted)">
                  Your newest creations appear first.
                </p>
              </div>

              <span className="rounded-full bg-(--surface-secondary) px-3 py-1 text-xs font-medium text-(--muted)">
                {ads.length} {ads.length === 1 ? "ad" : "ads"}
              </span>
            </div>

            {loadingAds ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface)"
                  >
                    <div className="aspect-square animate-pulse bg-(--surface-secondary)" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 animate-pulse rounded bg-(--surface-secondary)" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-(--surface-secondary)" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-(--border) bg-(--surface)">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
                  <Sparkles size={25} />
                </div>

                <h3 className="font-semibold">No advertisements yet</h3>

                <p className="mt-1 max-w-sm text-center text-sm text-(--muted)">
                  Create your first AI-powered advertisement using the form.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {ads.map((ad) => (
                  <article
                    key={ad._id}
                    className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow)"
                  >
                    <div className="group relative overflow-hidden bg-(--surface-secondary)">
                      <img
                        src={ad.generatedImage}
                        alt={ad.title}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                        {ad.aspectRatio}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {ad.title}
                          </h3>

                          <p className="mt-1 text-xs text-(--muted)">
                            {new Date(ad.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(ad._id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--muted) transition hover:bg-red-50 hover:text-(--danger) dark:hover:bg-red-950/30"
                          title="Delete ad"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handlePrivacyToggle(ad)}
                          className="rounded-lg border border-(--border) px-3 py-2 text-xs font-medium transition hover:border-(--primary)"
                        >
                          {ad.privacy === "public" ? "Public" : "Private"}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyAdUrl(ad._id)}
                          className="rounded-lg border border-(--border) px-3 py-2 text-xs font-medium transition hover:border-(--primary)"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default CreatePage;
