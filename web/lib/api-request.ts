interface APIRequest<TypeofPayload = unknown> {
    url: string;
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    include_credentials?: boolean;
    payload?: TypeofPayload;
    params?: Record<string, string | number | boolean | undefined>;
}

export async function apiRequest<T>(req: APIRequest):Promise<T> {
    const url = new URL(req.url);

    if (req.params) {
        Object.entries(req.params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value))
            }
        })
    }
    
    const res = await fetch(url, {
        method: req.method,
        ...(req.method !== "GET" ? {
            headers: {
                "Content-Type": "application/json",
                ...req.headers
            },
            body: JSON.stringify(req.payload)
        }: {}),
        ...(req.include_credentials ? {
            credentials: "include"
        }: {}),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        throw new Error(data?.detail ?? data.details ??data?.message ?? "Something went wrong");
    }

    return data as T;
}

