import { toast, Zoom } from "react-toastify";

function calculateDurationByTitleLength(title) {
  const DEFAULT_DURATION = 5000;

  // Each 10 characters should be read in 1500 milliseconds
  const duration = Math.floor(title.length / 10) * 1500;
  return Math.max(DEFAULT_DURATION, duration);
}

export function showToast({ level, title, icon = null }) {
  return toast(title, {
    type: level,
    hideProgressBar: true,
    autoClose: calculateDurationByTitleLength(title),
    closeOnClick: false,
    transition: Zoom,
    icon,
  })
}