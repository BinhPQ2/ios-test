import { copyTextToClipboard } from "./utils/copyClipboard";
import { showToast } from "./utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const handleCopy123 = () => {
    copyTextToClipboard(
      "123",
      () => showToast({ level: "success", title: "Link Copied!" }),
      console.error
    );
  };

  const handleCopyAbc = () => {
    copyTextToClipboard(
      "abc",
      () => showToast({ level: "success", title: "Link Copied!" }),
      console.error
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <button
        onClick={handleCopy123}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Copy "123"
      </button>
      <button
        onClick={handleCopyAbc}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Copy "abc"
      </button>
      <input
        className="border px-2 py-1 rounded"
        placeholder="Paste here to test"
      />
      <ToastContainer />
    </div>
  );
}
