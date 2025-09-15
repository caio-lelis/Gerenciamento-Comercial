"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, Clock, CheckCircle, DollarSign, User, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pedido {
  id: number
  cliente_id: number
  cliente_nome: string
  descricao: string
  valor: number
  pago: boolean
  entregue: boolean
  data_pedido: string
  observacoes?: string
}

export function PedidoManager() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null)
  const [formData, setFormData] = useState({
    cliente_id: "",
    cliente_nome: "",
    descricao: "",
    valor: "",
    observacoes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data - replace with actual API calls
  const mockPedidos: Pedido[] = [
    {
      id: 1,
      cliente_id: 1,
      cliente_nome: "João Silva",
      descricao: "2 Frangos inteiros + acompanhamentos",
      valor: 85.5,
      pago: true,
      entregue: true,
      data_pedido: "2024-01-15T10:30:00",
      observacoes: "Sem pimenta",
    },
    {
      id: 2,
      cliente_id: 2,
      cliente_nome: "Maria Santos",
      descricao: "1 Frango inteiro + farofa + vinagrete",
      valor: 45.0,
      pago: false,
      entregue: false,
      data_pedido: "2024-01-15T11:15:00",
    },
    {
      id: 3,
      cliente_id: 3,
      cliente_nome: "Pedro Oliveira",
      descricao: "3 Frangos inteiros para festa",
      valor: 120.0,
      pago: true,
      entregue: false,
      data_pedido: "2024-01-15T12:00:00",
      observacoes: "Entregar às 18h",
    },
    {
      id: 4,
      cliente_id: 4,
      cliente_nome: "Ana Costa",
      descricao: "1 Frango inteiro + batata frita",
      valor: 52.0,
      pago: false,
      entregue: false,
      data_pedido: "2024-01-15T13:30:00",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setPedidos(mockPedidos)
  }, [])

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toString().includes(searchTerm)

    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "pendentes" && (!pedido.pago || !pedido.entregue)) ||
      (statusFilter === "nao-pagos" && !pedido.pago) ||
      (statusFilter === "nao-entregues" && !pedido.entregue) ||
      (statusFilter === "finalizados" && pedido.pago && pedido.entregue)

    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingPedido) {
        // Update pedido
        const updatedPedidos = pedidos.map((p) =>
          p.id === editingPedido.id
            ? {
                ...p,
                cliente_nome: formData.cliente_nome,
                descricao: formData.descricao,
                valor: Number.parseFloat(formData.valor),
                observacoes: formData.observacoes,
              }
            : p,
        )
        setPedidos(updatedPedidos)
        toast({
          title: "Pedido atualizado",
          description: "Os dados do pedido foram atualizados com sucesso.",
        })
      } else {
        // Create new pedido
        const newPedido: Pedido = {
          id: Math.max(...pedidos.map((p) => p.id)) + 1,
          cliente_id: Number.parseInt(formData.cliente_id) || 1,
          cliente_nome: formData.cliente_nome,
          descricao: formData.descricao,
          valor: Number.parseFloat(formData.valor),
          pago: false,
          entregue: false,
          data_pedido: new Date().toISOString(),
          observacoes: formData.observacoes,
        }
        setPedidos([...pedidos, newPedido])
        toast({
          title: "Pedido criado",
          description: "Novo pedido foi adicionado com sucesso.",
        })
      }

      setIsDialogOpen(false)
      setEditingPedido(null)
      setFormData({ cliente_id: "", cliente_nome: "", descricao: "", valor: "", observacoes: "" })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o pedido.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pedido: Pedido) => {
    setEditingPedido(pedido)
    setFormData({
      cliente_id: pedido.cliente_id.toString(),
      cliente_nome: pedido.cliente_nome,
      descricao: pedido.descricao,
      valor: pedido.valor.toString(),
      observacoes: pedido.observacoes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      setPedidos(pedidos.filter((p) => p.id !== id))
      toast({
        title: "Pedido excluído",
        description: "Pedido foi removido com sucesso.",
      })
    }
  }

  const handleTogglePago = async (id: number) => {
    const updatedPedidos = pedidos.map((p) => (p.id === id ? { ...p, pago: !p.pago } : p))
    setPedidos(updatedPedidos)
    const pedido = pedidos.find((p) => p.id === id)
    toast({
      title: pedido?.pago ? "Marcado como não pago" : "Marcado como pago",
      description: "Status de pagamento atualizado.",
    })
  }

  const handleToggleEntregue = async (id: number) => {
    const updatedPedidos = pedidos.map((p) => (p.id === id ? { ...p, entregue: !p.entregue } : p))
    setPedidos(updatedPedidos)
    const pedido = pedidos.find((p) => p.id === id)
    toast({
      title: pedido?.entregue ? "Marcado como não entregue" : "Marcado como entregue",
      description: "Status de entrega atualizado.",
    })
  }

  const openNewPedidoDialog = () => {
    setEditingPedido(null)
    setFormData({ cliente_id: "", cliente_nome: "", descricao: "", valor: "", observacoes: "" })
    setIsDialogOpen(true)
  }

  const getStatusBadge = (pedido: Pedido) => {
    if (pedido.pago && pedido.entregue) {
      return <Badge className="bg-green-100 text-green-800">Finalizado</Badge>
    }
    if (!pedido.pago && !pedido.entregue) {
      return <Badge variant="destructive">Pendente</Badge>
    }
    if (!pedido.pago) {
      return <Badge variant="secondary">Não Pago</Badge>
    }
    if (!pedido.entregue) {
      return <Badge className="bg-yellow-100 text-yellow-800">Não Entregue</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestão de Pedidos</h2>
          <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewPedidoDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPedido ? "Editar Pedido" : "Novo Pedido"}</DialogTitle>
              <DialogDescription>
                {editingPedido ? "Atualize as informações do pedido." : "Adicione um novo pedido ao sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cliente_nome">Cliente *</Label>
                  <Input
                    id="cliente_nome"
                    value={formData.cliente_nome}
                    onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição do Pedido *</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: 2 Frangos inteiros + acompanhamentos"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações especiais"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingPedido ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>Total de {pedidos.length} pedidos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, descrição ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendentes">Pendentes</SelectItem>
                <SelectItem value="nao-pagos">Não Pagos</SelectItem>
                <SelectItem value="nao-entregues">Não Entregues</SelectItem>
                <SelectItem value="finalizados">Finalizados</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary">{filteredPedidos.length} encontrados</Badge>
          </div>

          <Tabs defaultValue="lista" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="lista">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">#{pedido.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {pedido.cliente_nome}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{pedido.descricao}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            R$ {pedido.valor.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(pedido)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePago(pedido.id)}
                              className={pedido.pago ? "text-green-600" : "text-red-600"}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleEntregue(pedido.id)}
                              className={pedido.entregue ? "text-green-600" : "text-yellow-600"}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(pedido)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(pedido.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPedidos.map((pedido) => (
                  <Card key={pedido.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                        {getStatusBadge(pedido)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {pedido.cliente_nome}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{pedido.descricao}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                          <DollarSign className="h-4 w-4" />
                          R$ {pedido.valor.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      {pedido.observacoes && (
                        <p className="text-sm text-muted-foreground italic">{pedido.observacoes}</p>
                      )}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePago(pedido.id)}
                          className={pedido.pago ? "text-green-600" : "text-red-600"}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          {pedido.pago ? "Pago" : "Não Pago"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleEntregue(pedido.id)}
                          className={pedido.entregue ? "text-green-600" : "text-yellow-600"}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {pedido.entregue ? "Entregue" : "Pendente"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredPedidos.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "todos"
                  ? "Tente ajustar os filtros de busca."
                  : "Comece adicionando seu primeiro pedido."}
              </p>
              {!searchTerm && statusFilter === "todos" && (
                <Button onClick={openNewPedidoDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pedido
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
