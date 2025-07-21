import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Ensure URL doesn't have any cache-busting parameters that could be corrupted
  const cleanUrl = url.includes('?') ? url.split('?')[0] : url;
  console.log("API Request:", method, "Original URL:", url, "Clean URL:", cleanUrl, "Data:", data);
  
  const res = await fetch(cleanUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add cache-busting headers for production
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Extract URL from queryKey array - first element should be the complete URL
    const url = Array.isArray(queryKey) ? String(queryKey[0]) : String(queryKey);
    // Clean URL to prevent any cache-busting corruption
    const cleanUrl = url.includes('?') ? url.split('?')[0] : url;
    console.log("Query Request:", "Original:", url, "Clean:", cleanUrl, "QueryKey:", queryKey);
    
    const res = await fetch(cleanUrl, {
      credentials: "include",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log("Unauthorized request, returning null");
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Return null for auth endpoint, don't throw
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Force fresh requests to avoid cache issues
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
