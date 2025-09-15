"use client"

import type React from "react"
import { CheckCircle } from "lucide-react" // Added import for CheckCircle

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
import { DollarSign, Clock, Plus, Search, Zap, Phone } from "lucide-react"
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

  const quickOrderTemplates = [
    {
      id: "1-frango-completo",
      name: "1 Frango Completo",
      price: 35.0,
      description: "1 Frango Inteiro + Acompanhamentos",
    },
    {
      id: "2-frangos-completo",
      name: "2 Frangos Completos",
      price: 65.0,
      description: "2 Frangos Inteiros + Acompanhamentos",
    },
    { id: "meio-frango", name: "Meio Frango", price: 20.0, description: "Meio Frango + Acompanhamentos" },
    { id: "frango-batata", name: "Frango + Batata", price: 28.0, description: "Frango + Batata Frita" },
  ]

  const handleQuickOrderTemplate = (template: any) => {
    setQuickOrderData({
      ...quickOrderData,
      descricao: template.description,
      valor: template.price.toString(),
    })
  }

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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
      <Dialog open={isQuickOrderOpen} onOpenChange={setIsQuickOrderOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Plus className="h-6 w-6" />
                Pedido Rápido
              </CardTitle>
              <CardDescription>Criar pedido em segundos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full h-10 font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Pedido Rápido
            </DialogTitle>
            <DialogDescription>
              Crie um pedido rapidamente com templates pré-definidos ou personalizado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickOrder}>
            <div className="grid gap-6 py-4">
              {/* Quick templates */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Templates Rápidos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {quickOrderTemplates.map((template) => (
                    <Button
                      key={template.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickOrderTemplate(template)}
                      className="justify-start h-auto p-3 text-left"
                    >
                      <div>
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-muted-foreground">R$ {template.price.toFixed(2)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    value={quickOrderData.telefone}
                    onChange={(e) => setQuickOrderData({ ...quickOrderData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                    className="h-10"
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
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descricao">Pedido *</Label>
                <Select
                  onValueChange={(value) => {
                    const template = quickOrderTemplates.find((t) => t.id === value)
                    if (template) {
                      setQuickOrderData({
                        ...quickOrderData,
                        descricao: template.description,
                        valor: template.price.toString(),
                      })
                    } else {
                      setQuickOrderData({ ...quickOrderData, descricao: value })
                    }
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione o pedido ou use os templates acima" />
                  </SelectTrigger>
                  <SelectContent>
                    {quickOrderTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.description} - R$ {template.price.toFixed(2)}
                      </SelectItem>
                    ))}
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
                    className="h-10"
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
                  className="h-10 text-lg font-semibold"
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
              <Button type="submit" disabled={loading} className="h-10 px-8">
                {loading ? "Criando..." : "Criar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSearchClienteOpen} onOpenChange={setIsSearchClienteOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-secondary">
                <Search className="h-6 w-6" />
                Buscar Cliente
              </CardTitle>
              <CardDescription>Encontrar cliente rapidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full h-10 bg-transparent border-secondary/30 hover:bg-secondary/10"
              >
                Buscar por Telefone
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-secondary" />
              Buscar Cliente
            </DialogTitle>
            <DialogDescription>Digite o telefone para encontrar o cliente rapidamente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="search-telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <div className="flex gap-2">
                <Input
                  id="search-telefone"
                  value={searchTelefone}
                  onChange={(e) => setSearchTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="h-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchCliente()}
                />
                <Button onClick={handleSearchCliente} disabled={loading} className="h-10 px-6">
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            {clienteEncontrado && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Cliente Encontrado
                  </CardTitle>
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

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-green-700">
            <DollarSign className="h-6 w-6" />
            Pagamentos
          </CardTitle>
          <CardDescription>Status financeiro em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-white rounded-md">
            <span className="text-sm font-medium">Pendentes</span>
            <Badge variant="destructive" className="animate-pulse">
              3
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-md">
            <span className="text-sm font-medium">Pagos Hoje</span>
            <Badge className="bg-green-600 text-white">15</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
            <Clock className="h-6 w-6" />
            Entregas
          </CardTitle>
          <CardDescription>Status de entrega atualizado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-white rounded-md">
            <span className="text-sm font-medium">Pendentes</span>
            <Badge className="bg-yellow-500 text-yellow-900 animate-pulse">8</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-md">
            <span className="text-sm font-medium">Entregues</span>
            <Badge className="bg-green-600 text-white">12</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
