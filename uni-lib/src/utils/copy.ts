export const copyText = async (text: string) => {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    throw new Error("copyText can only be used in browser environments.");
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
};
