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
import { Users, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, ChefHat } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Frango Assado</h1>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Sistema de Gerenciamento
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="maquina">Máquinas</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                <QuickActions
                  onPedidoCreated={() => {
                    // Refresh data when a new order is created
                    console.log("New order created, refreshing data...")
                  }}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.totalClientes}</div>
                    <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.pedidosHoje}</div>
                    <p className="text-xs text-muted-foreground">+5 desde ontem</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">R$ {stats.faturamentoHoje.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+8% desde ontem</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">+15%</div>
                    <p className="text-xs text-muted-foreground">Vendas este mês</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-secondary" />
                      Pedidos Pendentes
                    </CardTitle>
                    <CardDescription>Pedidos aguardando preparo ou entrega</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary mb-2">{stats.pedidosPendentes}</div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("pedidos")}>
                      Ver Pedidos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      Não Pagos
                    </CardTitle>
                    <CardDescription>Pedidos que ainda não foram pagos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-destructive mb-2">{stats.pedidosNaoPagos}</div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("pedidos")}>
                      Verificar
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Entregues Hoje
                    </CardTitle>
                    <CardDescription>Pedidos finalizados com sucesso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{stats.pedidosEntregues}</div>
                    <Badge variant="secondary">Excelente!</Badge>
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
