const buildQuery = (params) => {
  if (!params || typeof params !== "object") return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
      continue;
    }
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const safeJsonParse = (value) => {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const fetchWithTimeout = async (url, options = {}) => {
  const { timeoutMs = 15000, ...rest } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

export const requestJson = async ({
  baseUrl,
  path,
  method = "POST",
  body,
  headers,
  timeoutMs,
}) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const upperMethod = method.toUpperCase();

  let url = `${normalizedBase}${normalizedPath}`;
  const init = {
    method: upperMethod,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (upperMethod === "GET") {
    url = `${url}${buildQuery(body)}`;
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetchWithTimeout(url, {
    ...init,
    timeoutMs,
  });

  const text = await response.text();
  const json = safeJsonParse(text);

  return {
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    json,
    text,
  };
};
