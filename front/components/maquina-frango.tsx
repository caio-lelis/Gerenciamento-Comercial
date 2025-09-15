"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChefHat, Clock, Flame, Grid3X3, CheckCircle, Timer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PosicaoMaquina {
  id: number
  ocupada: boolean
  pedido_id?: number
  cliente_nome?: string
  tempo_inicio?: string
  tempo_estimado?: number // em minutos
  observacoes?: string
}

interface Pedido {
  id: number
  cliente_nome: string
  descricao: string
  valor: number
  pago: boolean
  entregue: boolean
}

export function MaquinaFrango() {
  const [posicoes, setPosicoes] = useState<PosicaoMaquina[]>([])
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<number | null>(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState("")
  const [tempoEstimado, setTempoEstimado] = useState("45")
  const [observacoes, setObservacoes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const posicaoesIniciais: PosicaoMaquina[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      ocupada: false,
    }))

    // Simular algumas posições ocupadas para demonstração
    posicaoesIniciais[0] = {
      id: 1,
      ocupada: true,
      pedido_id: 1,
      cliente_nome: "João Silva",
      tempo_inicio: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 min atrás
      tempo_estimado: 45,
      observacoes: "Sem pimenta",
    }
    posicaoesIniciais[5] = {
      id: 6,
      ocupada: true,
      pedido_id: 3,
      cliente_nome: "Pedro Oliveira",
      tempo_inicio: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min atrás
      tempo_estimado: 50,
      observacoes: "Frango grande",
    }

    setPosicoes(posicaoesIniciais)

    // Mock de pedidos pendentes
    setPedidosPendentes([
      { id: 2, cliente_nome: "Maria Santos", descricao: "1 Frango inteiro", valor: 45.0, pago: false, entregue: false },
      {
        id: 4,
        cliente_nome: "Ana Costa",
        descricao: "1 Frango inteiro + batata",
        valor: 52.0,
        pago: false,
        entregue: false,
      },
      { id: 5, cliente_nome: "Carlos Lima", descricao: "2 Frangos inteiros", valor: 85.0, pago: true, entregue: false },
    ])
  }, [])

  const calcularTempoRestante = (tempo_inicio: string, tempo_estimado: number) => {
    const inicio = new Date(tempo_inicio)
    const agora = new Date()
    const tempoDecorrido = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60)) // em minutos
    const tempoRestante = tempo_estimado - tempoDecorrido
    return Math.max(0, tempoRestante)
  }

  const calcularProgresso = (tempo_inicio: string, tempo_estimado: number) => {
    const inicio = new Date(tempo_inicio)
    const agora = new Date()
    const tempoDecorrido = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60))
    const progresso = Math.min(100, (tempoDecorrido / tempo_estimado) * 100)
    return progresso
  }

  const getStatusPosicao = (posicao: PosicaoMaquina) => {
    if (!posicao.ocupada) return { status: "livre", cor: "bg-green-100 border-green-300", icone: CheckCircle }

    const tempoRestante = calcularTempoRestante(posicao.tempo_inicio!, posicao.tempo_estimado!)
    const progresso = calcularProgresso(posicao.tempo_inicio!, posicao.tempo_estimado!)

    if (progresso >= 100) return { status: "pronto", cor: "bg-blue-100 border-blue-300", icone: CheckCircle }
    if (progresso >= 80) return { status: "quase-pronto", cor: "bg-yellow-100 border-yellow-300", icone: Timer }
    return { status: "assando", cor: "bg-orange-100 border-orange-300", icone: Flame }
  }

  const adicionarFrangoNaPosicao = () => {
    if (!posicaoSelecionada || !pedidoSelecionado) return

    const pedido = pedidosPendentes.find((p) => p.id.toString() === pedidoSelecionado)
    if (!pedido) return

    const novasPosicoes = posicoes.map((pos) =>
      pos.id === posicaoSelecionada
        ? {
            ...pos,
            ocupada: true,
            pedido_id: pedido.id,
            cliente_nome: pedido.cliente_nome,
            tempo_inicio: new Date().toISOString(),
            tempo_estimado: Number.parseInt(tempoEstimado),
            observacoes: observacoes,
          }
        : pos,
    )

    setPosicoes(novasPosicoes)
    setPedidosPendentes(pedidosPendentes.filter((p) => p.id !== pedido.id))

    toast({
      title: "Frango adicionado à máquina",
      description: `Posição ${posicaoSelecionada} ocupada com pedido de ${pedido.cliente_nome}`,
    })

    setIsDialogOpen(false)
    setPosicaoSelecionada(null)
    setPedidoSelecionado("")
    setTempoEstimado("45")
    setObservacoes("")
  }

  const removerFrangoDaPosicao = (posicaoId: number) => {
    const posicao = posicoes.find((p) => p.id === posicaoId)
    if (!posicao || !posicao.ocupada) return

    if (confirm(`Remover frango da posição ${posicaoId}? O pedido voltará para a lista de pendentes.`)) {
      const novasPosicoes = posicoes.map((pos) => (pos.id === posicaoId ? { id: pos.id, ocupada: false } : pos))

      // Retornar pedido para lista de pendentes (simulação)
      if (posicao.pedido_id && posicao.cliente_nome) {
        const pedidoRetornado: Pedido = {
          id: posicao.pedido_id,
          cliente_nome: posicao.cliente_nome,
          descricao: "Pedido retornado da máquina",
          valor: 45.0,
          pago: false,
          entregue: false,
        }
        setPedidosPendentes([...pedidosPendentes, pedidoRetornado])
      }

      setPosicoes(novasPosicoes)

      toast({
        title: "Frango removido",
        description: `Posição ${posicaoId} liberada`,
      })
    }
  }

  const abrirDialogPosicao = (posicaoId: number) => {
    setPosicaoSelecionada(posicaoId)
    setIsDialogOpen(true)
  }

  const posicaoesOcupadas = posicoes.filter((p) => p.ocupada).length
  const posicoesProntas = posicoes.filter((p) => {
    if (!p.ocupada) return false
    const progresso = calcularProgresso(p.tempo_inicio!, p.tempo_estimado!)
    return progresso >= 100
  }).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Controle da Máquina</h2>
          <p className="text-muted-foreground">Gerencie as posições dos frangos na máquina</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            {posicaoesOcupadas}/12 Posições
          </Badge>
          {posicoesProntas > 0 && (
            <Badge className="bg-blue-100 text-blue-800 gap-2">
              <CheckCircle className="h-4 w-4" />
              {posicoesProntas} Prontos
            </Badge>
          )}
        </div>
      </div>

      {/* Status geral da máquina */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posições Ocupadas</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{posicaoesOcupadas}/12</div>
            <p className="text-xs text-muted-foreground">{12 - posicaoesOcupadas} posições livres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frangos Prontos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{posicoesProntas}</div>
            <p className="text-xs text-muted-foreground">Prontos para retirada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pedidosPendentes.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando posição</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Máquina de Frango - Posições
          </CardTitle>
          <CardDescription>Clique em uma posição livre para adicionar um frango</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {posicoes.map((posicao) => {
              const { status, cor, icone: IconeStatus } = getStatusPosicao(posicao)

              return (
                <div
                  key={posicao.id}
                  className={`relative aspect-square rounded-lg border-2 ${cor} cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center p-3`}
                  onClick={() =>
                    posicao.ocupada ? removerFrangoDaPosicao(posicao.id) : abrirDialogPosicao(posicao.id)
                  }
                >
                  <IconeStatus className="h-8 w-8 mb-2" />
                  <span className="text-sm font-bold">Pos. {posicao.id}</span>

                  {posicao.ocupada && (
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium truncate w-full">{posicao.cliente_nome}</p>
                      {posicao.tempo_inicio && posicao.tempo_estimado && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>{calcularTempoRestante(posicao.tempo_inicio, posicao.tempo_estimado)}min</p>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div
                              className="bg-primary h-1 rounded-full transition-all"
                              style={{ width: `${calcularProgresso(posicao.tempo_inicio, posicao.tempo_estimado)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos pendentes */}
      {pedidosPendentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pedidos Aguardando Posição
            </CardTitle>
            <CardDescription>{pedidosPendentes.length} pedidos na fila</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pedidosPendentes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{pedido.cliente_nome}</p>
                    <p className="text-sm text-muted-foreground">{pedido.descricao}</p>
                    <p className="text-sm font-medium text-primary">R$ {pedido.valor.toFixed(2)}</p>
                  </div>
                  <Badge variant={pedido.pago ? "default" : "secondary"}>{pedido.pago ? "Pago" : "Não Pago"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para adicionar frango */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Frango na Posição {posicaoSelecionada}</DialogTitle>
            <DialogDescription>Selecione o pedido e configure o tempo de preparo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pedido">Pedido</Label>
              <Select value={pedidoSelecionado} onValueChange={setPedidoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pedido" />
                </SelectTrigger>
                <SelectContent>
                  {pedidosPendentes.map((pedido) => (
                    <SelectItem key={pedido.id} value={pedido.id.toString()}>
                      {pedido.cliente_nome} - {pedido.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tempo">Tempo Estimado (minutos)</Label>
              <Select value={tempoEstimado} onValueChange={setTempoEstimado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="40">40 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="50">50 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <input
                id="observacoes"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex: Sem pimenta, bem passado..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={adicionarFrangoNaPosicao} disabled={!pedidoSelecionado}>
              Adicionar à Máquina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
