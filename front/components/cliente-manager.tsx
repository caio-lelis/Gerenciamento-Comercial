"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Search, Plus, Edit, Trash2, Phone, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cliente {
  id: number
  nome: string
  telefone: string
  endereco?: string
  email?: string
  created_at?: string
}

export function ClienteManager() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data - replace with actual API calls
  const mockClientes: Cliente[] = [
    {
      id: 1,
      nome: "João Silva",
      telefone: "(11) 99999-9999",
      endereco: "Rua das Flores, 123",
      email: "joao@email.com",
    },
    {
      id: 2,
      nome: "Maria Santos",
      telefone: "(11) 88888-8888",
      endereco: "Av. Principal, 456",
      email: "maria@email.com",
    },
    { id: 3, nome: "Pedro Oliveira", telefone: "(11) 77777-7777", endereco: "Rua do Comércio, 789" },
    { id: 4, nome: "Ana Costa", telefone: "(11) 66666-6666", endereco: "Praça Central, 321", email: "ana@email.com" },
  ]

  useEffect(() => {
    // Simulate API call
    setClientes(mockClientes)
  }, [])

  const filteredClientes = clientes.filter(
    (cliente) => cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.telefone.includes(searchTerm),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCliente) {
        // Update cliente
        const updatedClientes = clientes.map((c) => (c.id === editingCliente.id ? { ...c, ...formData } : c))
        setClientes(updatedClientes)
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        })
      } else {
        // Create new cliente
        const newCliente: Cliente = {
          id: Math.max(...clientes.map((c) => c.id)) + 1,
          ...formData,
        }
        setClientes([...clientes, newCliente])
        toast({
          title: "Cliente criado",
          description: "Novo cliente foi adicionado com sucesso.",
        })
      }

      setIsDialogOpen(false)
      setEditingCliente(null)
      setFormData({ nome: "", telefone: "", endereco: "", email: "" })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      endereco: cliente.endereco || "",
      email: cliente.email || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id))
      toast({
        title: "Cliente excluído",
        description: "Cliente foi removido com sucesso.",
      })
    }
  }

  const openNewClienteDialog = () => {
    setEditingCliente(null)
    setFormData({ nome: "", telefone: "", endereco: "", email: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerencie todos os clientes da sua loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewClienteDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCliente ? "Atualize as informações do cliente." : "Adicione um novo cliente ao sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Endereço completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingCliente ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
          <CardDescription>Total de {clientes.length} clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredClientes.length} encontrados</Badge>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {cliente.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {cliente.telefone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cliente.endereco ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{cliente.endereco}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{cliente.email || <span className="text-muted-foreground">-</span>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
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

          {filteredClientes.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Tente ajustar os termos de busca." : "Comece adicionando seu primeiro cliente."}
              </p>
              {!searchTerm && (
                <Button onClick={openNewClienteDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
