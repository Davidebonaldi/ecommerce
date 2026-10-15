export async function api(path, { method = "GET", body, token } = {}) {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (res.status === 204) return null;
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Errore di rete");
    return data;
  }
  
  export const formatPrice = (value) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(Number(value));