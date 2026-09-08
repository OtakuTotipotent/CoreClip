import api from "./api";

export const generateAd = async (data) => {
  const response = await api.post("/ads/generate", data);

  return response.data;
};

export const getMyAds = async () => {
  const response = await api.get("/ads/my-ads");

  return response.data;
};

export const getCommunityAds = async () => {
  const response = await api.get("/ads/community");

  return response.data;
};

export const deleteAd = async (adId) => {
  const response = await api.delete(`/ads/${adId}`);

  return response.data;
};

export const updateAdPrivacy = async (adId, privacy) => {
  const response = await api.patch(`/ads/${adId}/privacy`, {
    privacy,
  });

  return response.data;
};

export const getAdById = async (adId) => {
  const response = await api.get(`/ads/${adId}`);

  return response.data;
};
