function fallbackCopy(text) {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        resolve();
      } else {
        reject(new Error("execCommand returned false"));
      }
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

// Unified copyTextToClipboard that always returns a Promise and supports callbacks
export function copyTextToClipboard(text, onResolve, onReject) {
  let promise;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    promise = navigator.clipboard
      .writeText(text)
      .catch(() => fallbackCopy(text));
  } else {
    promise = fallbackCopy(text);
  }

  // Attach callbacks if provided
  if (typeof onResolve === "function" || typeof onReject === "function") {
    promise.then(
      () => onResolve && onResolve(),
      (err) => onReject && onReject(err)
    );
  }

  return promise;
}
