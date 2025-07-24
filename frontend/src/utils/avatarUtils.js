import userPng from "@/assets/user.png";

/**
 * Gets the appropriate avatar source URL with fallback to user.png
 * @param {string} avatarUrl - The user's avatar URL from the server
 * @returns {string} - The URL to use for the avatar
 */
export const getAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return userPng;

  // Add a timestamp to prevent caching issues for fresh uploads
  if (avatarUrl.includes("cloudinary.com")) {
    const separator = avatarUrl.includes("?") ? "&" : "?";
    return `${avatarUrl}${separator}t=${Date.now()}`;
  }

  return avatarUrl;
};

/**
 * Gets the background image style for avatar divs with fallback to user.png
 * @param {string} avatarUrl - The user's avatar URL from the server
 * @returns {object} - Style object for background-image
 */
export const getAvatarBackgroundStyle = (avatarUrl) => {
  return {
    backgroundImage: `url("${getAvatarSrc(avatarUrl)}")`,
  };
};
