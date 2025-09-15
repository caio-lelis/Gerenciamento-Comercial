"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClienteManager } from "@/components/cliente-manager"
import { PedidoManager } from "@/components/pedido-manager"
import { MaquinasManager } from "@/components/maquinas-manager"
import { Users, ShoppingCart, ChefHat, Bell } from "lucide-react"

export function MainLayout() {
  const [activeTab, setActiveTab] = useState("pedidos")

  // Mock data - in real app, this would come from your API
  const stats = {
    pedidosPendentes: 8,
    pedidosNaoPagos: 3,
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
                <h1 className="text-2xl font-bold text-foreground">Assados do Léo</h1>
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
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="pedidos" className="flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" />
              Pedidos
              {stats.pedidosNaoPagos > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {stats.pedidosNaoPagos}
                </Badge>
              )}
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
          </TabsList>

          <TabsContent value="pedidos">
            <PedidoManager />
          </TabsContent>

          <TabsContent value="maquina">
            <MaquinasManager />
          </TabsContent>

          <TabsContent value="clientes">
            <ClienteManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
