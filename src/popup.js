const select = document.getElementById("quality");

for (const { value, label } of QUALITY_OPTIONS) {
  select.add(new Option(label, String(value)));
}

chrome.storage.sync.get({ quality: DEFAULT_QUALITY }).then(({ quality }) => {
  select.value = String(quality);
});

select.addEventListener("change", () => {
  const quality = select.value === "auto" ? "auto" : Number(select.value);
  chrome.storage.sync.set({ quality });
});
