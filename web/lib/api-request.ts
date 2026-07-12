interface APIRequest<TypeofPayload = unknown> {
    url: string;
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    include_credentials?: boolean;
    payload?: TypeofPayload;
}

export async function apiRequest<T>(req: APIRequest):Promise<T> {
    const res = await fetch(req.url, {
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

