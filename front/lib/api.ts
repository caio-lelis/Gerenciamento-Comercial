// API service layer to connect with your FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface Cliente {
  id?: number
  nome: string
  telefone: string
  endereco?: string
  email?: string
}

export interface Pedido {
  id?: number
  cliente_id: number
  descricao: string
  valor: number
  pago?: boolean
  entregue?: boolean
  observacoes?: string
}

// Cliente API functions
export const clienteApi = {
  async getAll(): Promise<Cliente[]> {
    const response = await fetch(`${API_BASE_URL}/clientes/get`)
    if (!response.ok) throw new Error("Failed to fetch clientes")
    return response.json()
  },

  async getById(id: number): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/get/${id}`)
    if (!response.ok) throw new Error("Failed to fetch cliente")
    return response.json()
  },

  async getByTelefone(telefone: string): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/get/telefone/${telefone}`)
    if (!response.ok) throw new Error("Failed to fetch cliente")
    return response.json()
  },

  async create(cliente: Cliente): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    })
    if (!response.ok) throw new Error("Failed to create cliente")
    return response.json()
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    })
    if (!response.ok) throw new Error("Failed to update cliente")
    return response.json()
  },

  async delete(id: number): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete cliente")
    return response.json()
  },
}

// Pedido API functions
export const pedidoApi = {
  async getAll(): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos/get`)
    if (!response.ok) throw new Error("Failed to fetch pedidos")
    return response.json()
  },

  async getById(id: number): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/get/${id}`)
    if (!response.ok) throw new Error("Failed to fetch pedido")
    return response.json()
  },

  async getByCliente(clienteId: number): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos/get/cliente/${clienteId}`)
    if (!response.ok) throw new Error("Failed to fetch pedidos")
    return response.json()
  },

  async getNaoPagos(): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos/get/nao-pagos`)
    if (!response.ok) throw new Error("Failed to fetch pedidos não pagos")
    return response.json()
  },

  async getPendentesEntrega(): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos/get/pendentes-entrega`)
    if (!response.ok) throw new Error("Failed to fetch pedidos pendentes")
    return response.json()
  },

  async create(pedido: Pedido): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    })
    if (!response.ok) throw new Error("Failed to create pedido")
    return response.json()
  },

  async update(id: number, pedido: Partial<Pedido>): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    })
    if (!response.ok) throw new Error("Failed to update pedido")
    return response.json()
  },

  async marcarPago(id: number): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/marcar-pago/${id}`, {
      method: "PATCH",
    })
    if (!response.ok) throw new Error("Failed to mark pedido as paid")
    return response.json()
  },

  async marcarEntregue(id: number): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/marcar-entregue/${id}`, {
      method: "PATCH",
    })
    if (!response.ok) throw new Error("Failed to mark pedido as delivered")
    return response.json()
  },

  async delete(id: number): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/delete/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete pedido")
    return response.json()
  },
}
