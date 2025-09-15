"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Clock, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickActionsProps {
  onPedidoCreated?: () => void
}

export function QuickActions({ onPedidoCreated }: QuickActionsProps) {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const [isSearchClienteOpen, setIsSearchClienteOpen] = useState(false)
  const [quickOrderData, setQuickOrderData] = useState({
    telefone: "",
    nome: "",
    descricao: "",
    valor: "",
    observacoes: "",
  })
  const [searchTelefone, setSearchTelefone] = useState("")
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, this would call your API
      console.log("Creating quick order:", quickOrderData)

      toast({
        title: "Pedido criado rapidamente!",
        description: `Pedido para ${quickOrderData.nome} foi criado com sucesso.`,
      })

      setIsQuickOrderOpen(false)
      setQuickOrderData({ telefone: "", nome: "", descricao: "", valor: "", observacoes: "" })
      onPedidoCreated?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearchCliente = async () => {
    if (!searchTelefone) return

    setLoading(true)
    try {
      // Mock search - in real app, call clienteApi.getByTelefone
      const mockCliente = {
        id: 1,
        nome: "João Silva",
        telefone: searchTelefone,
        endereco: "Rua das Flores, 123",
        email: "joao@email.com",
      }

      setClienteEncontrado(mockCliente)
      toast({
        title: "Cliente encontrado!",
        description: `${mockCliente.nome} - ${mockCliente.telefone}`,
      })
    } catch (error) {
      toast({
        title: "Cliente não encontrado",
        description: "Nenhum cliente encontrado com este telefone.",
        variant: "destructive",
      })
      setClienteEncontrado(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Quick Order */}
      <Dialog open={isQuickOrderOpen} onOpenChange={setIsQuickOrderOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-primary" />
                Pedido Rápido
              </CardTitle>
              <CardDescription>Criar pedido rapidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Novo Pedido</Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pedido Rápido</DialogTitle>
            <DialogDescription>Crie um pedido rapidamente com as informações básicas.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickOrder}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={quickOrderData.telefone}
                    onChange={(e) => setQuickOrderData({ ...quickOrderData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={quickOrderData.nome}
                    onChange={(e) => setQuickOrderData({ ...quickOrderData, nome: e.target.value })}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Pedido *</Label>
                <Select onValueChange={(value) => setQuickOrderData({ ...quickOrderData, descricao: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pedido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-frango-completo">1 Frango Inteiro + Acompanhamentos</SelectItem>
                    <SelectItem value="2-frangos-completo">2 Frangos Inteiros + Acompanhamentos</SelectItem>
                    <SelectItem value="meio-frango">Meio Frango + Acompanhamentos</SelectItem>
                    <SelectItem value="frango-batata">Frango + Batata Frita</SelectItem>
                    <SelectItem value="frango-farofa">Frango + Farofa + Vinagrete</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {quickOrderData.descricao === "personalizado" && (
                <div className="grid gap-2">
                  <Label htmlFor="descricao-custom">Descrição Personalizada</Label>
                  <Input
                    id="descricao-custom"
                    onChange={(e) => setQuickOrderData({ ...quickOrderData, descricao: e.target.value })}
                    placeholder="Descreva o pedido"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={quickOrderData.valor}
                  onChange={(e) => setQuickOrderData({ ...quickOrderData, valor: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={quickOrderData.observacoes}
                  onChange={(e) => setQuickOrderData({ ...quickOrderData, observacoes: e.target.value })}
                  placeholder="Observações especiais..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search Cliente */}
      <Dialog open={isSearchClienteOpen} onOpenChange={setIsSearchClienteOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-primary" />
                Buscar Cliente
              </CardTitle>
              <CardDescription>Encontrar cliente por telefone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Buscar
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Buscar Cliente</DialogTitle>
            <DialogDescription>Digite o telefone para encontrar o cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="search-telefone">Telefone</Label>
              <div className="flex gap-2">
                <Input
                  id="search-telefone"
                  value={searchTelefone}
                  onChange={(e) => setSearchTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
                <Button onClick={handleSearchCliente} disabled={loading}>
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            {clienteEncontrado && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Cliente Encontrado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Nome:</strong> {clienteEncontrado.nome}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {clienteEncontrado.telefone}
                  </p>
                  {clienteEncontrado.endereco && (
                    <p>
                      <strong>Endereço:</strong> {clienteEncontrado.endereco}
                    </p>
                  )}
                  {clienteEncontrado.email && (
                    <p>
                      <strong>Email:</strong> {clienteEncontrado.email}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-secondary" />
            Pagamentos
          </CardTitle>
          <CardDescription>Status dos pagamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pendentes</span>
            <Badge variant="destructive">3</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Pagos Hoje</span>
            <Badge className="bg-green-100 text-green-800">15</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Entregas
          </CardTitle>
          <CardDescription>Status das entregas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pendentes</span>
            <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Entregues</span>
            <Badge className="bg-green-100 text-green-800">12</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
