"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClienteManager } from "@/components/cliente-manager"
import { PedidoManager } from "@/components/pedido-manager"
import { QuickActions } from "@/components/quick-actions"
import { MaquinasManager } from "@/components/maquinas-manager"
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Bell,
  Zap,
} from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data - in real app, this would come from your API
  const stats = {
    totalClientes: 156,
    pedidosHoje: 23,
    faturamentoHoje: 1250.5,
    pedidosPendentes: 8,
    pedidosNaoPagos: 3,
    pedidosEntregues: 15,
  }

  const priorityAlerts = [
    { type: "urgent", message: "3 pedidos não pagos há mais de 30min", action: () => setActiveTab("pedidos") },
    { type: "warning", message: "Máquina 2 com 4 posições livres", action: () => setActiveTab("maquina") },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Frango Assado</h1>
              </div>
              <Badge variant="secondary" className="ml-2">
                Sistema de Gerenciamento
              </Badge>
            </div>

            {/* Priority notifications */}
            <div className="flex items-center gap-2">
              {priorityAlerts.map((alert, index) => (
                <Button
                  key={index}
                  variant={alert.type === "urgent" ? "destructive" : "secondary"}
                  size="sm"
                  onClick={alert.action}
                  className="flex items-center gap-2 animate-pulse"
                >
                  <Bell className="h-4 w-4" />
                  {alert.message}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="maquina" className="flex items-center gap-2 text-sm font-medium">
              <ChefHat className="h-4 w-4" />
              Máquinas
              {stats.pedidosPendentes > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {stats.pedidosPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" />
              Pedidos
              {stats.pedidosNaoPagos > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {stats.pedidosNaoPagos}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Ações Rápidas</h3>
                  <Badge variant="outline" className="ml-auto">
                    Operação Rápida
                  </Badge>
                </div>
                <QuickActions
                  onPedidoCreated={() => {
                    console.log("New order created, refreshing data...")
                  }}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.totalClientes}</div>
                    <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-secondary">{stats.pedidosHoje}</div>
                    <p className="text-xs text-muted-foreground">+5 desde ontem</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">R$ {stats.faturamentoHoje.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+8% desde ontem</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">+15%</div>
                    <p className="text-xs text-muted-foreground">Vendas este mês</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className={`${stats.pedidosPendentes > 5 ? "ring-2 ring-secondary" : ""}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-secondary" />
                      Pedidos Pendentes
                      {stats.pedidosPendentes > 5 && (
                        <Badge variant="secondary" className="animate-pulse">
                          Alta Demanda
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Pedidos aguardando preparo ou entrega</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary mb-3">{stats.pedidosPendentes}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("pedidos")} className="flex-1">
                        Ver Pedidos
                      </Button>
                      <Button size="sm" onClick={() => setActiveTab("maquina")} className="flex-1">
                        Ir para Máquinas
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${stats.pedidosNaoPagos > 0 ? "ring-2 ring-destructive" : ""}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Não Pagos
                      {stats.pedidosNaoPagos > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                          Atenção!
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Pedidos que ainda não foram pagos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-destructive mb-3">{stats.pedidosNaoPagos}</div>
                    <Button variant="destructive" size="sm" onClick={() => setActiveTab("pedidos")} className="w-full">
                      Verificar Urgente
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Entregues Hoje
                    </CardTitle>
                    <CardDescription>Pedidos finalizados com sucesso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.pedidosEntregues}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Excelente Performance!
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maquina">
            <MaquinasManager />
          </TabsContent>

          <TabsContent value="clientes">
            <ClienteManager />
          </TabsContent>

          <TabsContent value="pedidos">
            <PedidoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
