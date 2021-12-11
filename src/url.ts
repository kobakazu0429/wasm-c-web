export const resetUrl = () => {
  window.history.pushState("", document.title, "/");
};

export const rewriteUrlParams = (
  params: Array<[key: string, value: string]>
) => {
  window.history.pushState(
    "",
    document.title,
    `/?${params.map((p) => p.join("=")).join("&")}`
  );
};
