const PROFILE_KEY = "profile_data";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/d2/de/10/d2de10032597dc38ac19a57031a3fa47.jpg";

export const getProfile = () => {
  return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
};

export const getAvatar = () => {
  const data = getProfile();
  return data.profileImg || DEFAULT_AVATAR;
};

export const setProfile = (data) => {
  const current = getProfile();
  const updated = { ...current, ...data };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event("profile-update"));
};