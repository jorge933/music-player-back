import { URLSearchParams } from "url";

type Params = {
  [key: string]: string | string[];
};

export function buildUrlSearchParams(params: Params) {
  const urlSearchParams = new URLSearchParams();
  const entries = Object.entries(params);

  entries.forEach(([key, value]) => {
    const isArray = Array.isArray(value);

    isArray
      ? value.forEach((value) => urlSearchParams.append(key, value))
      : urlSearchParams.append(key, value);
  });

  return urlSearchParams;
}
