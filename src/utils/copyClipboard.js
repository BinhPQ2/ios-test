function execCopyTextCommand(text, onResolve, onReject) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // avoid scrolling
  textarea.style.top = "0";
  textarea.style.left = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let didCopy = false;
  try {
    // only pass the command name to match current TS defs
    didCopy = document.execCommand("copy");
    if (didCopy) {
      onResolve();
    } else {
      throw new Error("execCommand returned false");
    }
  } catch (err) {
    console.warn("execCommand failed:", err);
    onReject(err);
  } finally {
    document.body.removeChild(textarea);
  }

  return didCopy;
}

function writeTextToNavigatorClipboard(text, onResolve, onReject) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    return false;
  }

  navigator.clipboard
    .writeText(text)
    .then(onResolve)
    .catch((err) => {
      console.warn("navigator.clipboard.writeText failed, falling back:", err);
      // fallback to execCommand if async API rejects
      if (!execCopyTextCommand(text, onResolve, onReject)) {
        onReject(err);
      }
    });

  return true;
}

export async function copyTextToClipboard(text, onResolve, onReject) {
  const isClipboardSuccess = writeTextToNavigatorClipboard(
    text,
    onResolve,
    onReject
  );
  if (!isClipboardSuccess) {
    // fallback to execCommand if async API is not available
    return execCopyTextCommand(text, onResolve, onReject);
  }
}
