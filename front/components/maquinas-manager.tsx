"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { ChefHat, Clock, Flame, Grid3X3, CheckCircle, Timer, Plus, Settings, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PosicaoMaquina {
  id: number
  ocupada: boolean
  pedido_id?: number
  cliente_nome?: string
  tempo_inicio?: string
  tempo_estimado?: number
  observacoes?: string
}

interface Maquina {
  id: string
  nome: string
  posicoes: PosicaoMaquina[]
  ativa: boolean
}

interface Pedido {
  id: number
  cliente_nome: string
  descricao: string
  valor: number
  pago: boolean
  entregue: boolean
}

export function MaquinasManager() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddMaquinaOpen, setIsAddMaquinaOpen] = useState(false)
  const [maquinaSelecionada, setMaquinaSelecionada] = useState<string>("")
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<number | null>(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState("")
  const [tempoEstimado, setTempoEstimado] = useState("45")
  const [observacoes, setObservacoes] = useState("")
  const [novoNomeMaquina, setNovoNomeMaquina] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const maquinaInicial: Maquina = {
      id: "maquina-1",
      nome: "Máquina Principal",
      ativa: true,
      posicoes: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        ocupada: false,
      })),
    }

    maquinaInicial.posicoes[0] = {
      id: 1,
      ocupada: true,
      pedido_id: 1,
      cliente_nome: "João Silva",
      tempo_inicio: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      tempo_estimado: 45,
      observacoes: "Sem pimenta",
    }

    setMaquinas([maquinaInicial])

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
    const tempoDecorrido = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60))
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

  const adicionarMaquina = () => {
    if (!novoNomeMaquina.trim()) return

    const novaMaquina: Maquina = {
      id: `maquina-${Date.now()}`,
      nome: novoNomeMaquina,
      ativa: true,
      posicoes: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        ocupada: false,
      })),
    }

    setMaquinas([...maquinas, novaMaquina])
    setNovoNomeMaquina("")
    setIsAddMaquinaOpen(false)

    toast({
      title: "Máquina adicionada",
      description: `${novoNomeMaquina} foi adicionada com sucesso`,
    })
  }

  const removerMaquina = (maquinaId: string) => {
    if (maquinas.length <= 1) {
      toast({
        title: "Erro",
        description: "Você deve manter pelo menos uma máquina ativa",
        variant: "destructive",
      })
      return
    }

    if (confirm("Tem certeza que deseja remover esta máquina? Todos os frangos em preparo serão perdidos.")) {
      setMaquinas(maquinas.filter((m) => m.id !== maquinaId))
      toast({
        title: "Máquina removida",
        description: "A máquina foi removida com sucesso",
      })
    }
  }

  const adicionarFrangoNaPosicao = () => {
    if (!maquinaSelecionada || !posicaoSelecionada || !pedidoSelecionado) return

    const pedido = pedidosPendentes.find((p) => p.id.toString() === pedidoSelecionado)
    if (!pedido) return

    const novasMaquinas = maquinas.map((maquina) => {
      if (maquina.id !== maquinaSelecionada) return maquina

      const novasPosicoes = maquina.posicoes.map((pos) =>
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

      return { ...maquina, posicoes: novasPosicoes }
    })

    setMaquinas(novasMaquinas)
    setPedidosPendentes(pedidosPendentes.filter((p) => p.id !== pedido.id))

    const maquinaNome = maquinas.find((m) => m.id === maquinaSelecionada)?.nome
    toast({
      title: "Frango adicionado à máquina",
      description: `${maquinaNome} - Posição ${posicaoSelecionada} ocupada com pedido de ${pedido.cliente_nome}`,
    })

    setIsDialogOpen(false)
    setMaquinaSelecionada("")
    setPosicaoSelecionada(null)
    setPedidoSelecionado("")
    setTempoEstimado("45")
    setObservacoes("")
  }

  const removerFrangoDaPosicao = (maquinaId: string, posicaoId: number) => {
    const maquina = maquinas.find((m) => m.id === maquinaId)
    const posicao = maquina?.posicoes.find((p) => p.id === posicaoId)
    if (!posicao || !posicao.ocupada) return

    if (confirm(`Remover frango da posição ${posicaoId} da ${maquina?.nome}?`)) {
      const novasMaquinas = maquinas.map((m) => {
        if (m.id !== maquinaId) return m

        const novasPosicoes = m.posicoes.map((pos) => (pos.id === posicaoId ? { id: pos.id, ocupada: false } : pos))

        return { ...m, posicoes: novasPosicoes }
      })

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

      setMaquinas(novasMaquinas)

      toast({
        title: "Frango removido",
        description: `${maquina?.nome} - Posição ${posicaoId} liberada`,
      })
    }
  }

  const abrirDialogPosicao = (maquinaId: string, posicaoId: number) => {
    setMaquinaSelecionada(maquinaId)
    setPosicaoSelecionada(posicaoId)
    setIsDialogOpen(true)
  }

  const totalPosicoes = maquinas.reduce((acc, m) => acc + m.posicoes.length, 0)
  const posicaoesOcupadas = maquinas.reduce((acc, m) => acc + m.posicoes.filter((p) => p.ocupada).length, 0)
  const posicoesProntas = maquinas.reduce((acc, m) => {
    return (
      acc +
      m.posicoes.filter((p) => {
        if (!p.ocupada) return false
        const progresso = calcularProgresso(p.tempo_inicio!, p.tempo_estimado!)
        return progresso >= 100
      }).length
    )
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Controle das Máquinas</h2>
          <p className="text-muted-foreground">Gerencie múltiplas máquinas de frango assado</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            {posicaoesOcupadas}/{totalPosicoes} Posições
          </Badge>
          {posicoesProntas > 0 && (
            <Badge className="bg-blue-100 text-blue-800 gap-2">
              <CheckCircle className="h-4 w-4" />
              {posicoesProntas} Prontos
            </Badge>
          )}
          <Button onClick={() => setIsAddMaquinaOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Máquina
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{maquinas.length}</div>
            <p className="text-xs text-muted-foreground">máquinas em operação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posições Ocupadas</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {posicaoesOcupadas}/{totalPosicoes}
            </div>
            <p className="text-xs text-muted-foreground">{totalPosicoes - posicaoesOcupadas} posições livres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frangos Prontos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{posicoesProntas}</div>
            <p className="text-xs text-muted-foreground">prontos para retirada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pedidosPendentes.length}</div>
            <p className="text-xs text-muted-foreground">aguardando preparo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {maquinas.map((maquina) => {
          const posicaoesOcupadasMaquina = maquina.posicoes.filter((p) => p.ocupada).length
          const posicoesProntasMaquina = maquina.posicoes.filter((p) => {
            if (!p.ocupada) return false
            const progresso = calcularProgresso(p.tempo_inicio!, p.tempo_estimado!)
            return progresso >= 100
          }).length

          return (
            <Card key={maquina.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{maquina.nome}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Grid3X3 className="h-3 w-3" />
                      {posicaoesOcupadasMaquina}/12
                    </Badge>
                    {posicoesProntasMaquina > 0 && (
                      <Badge className="bg-blue-100 text-blue-800 gap-1 animate-pulse">
                        <CheckCircle className="h-3 w-3" />
                        {posicoesProntasMaquina}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerMaquina(maquina.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={maquinas.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {maquina.posicoes.map((posicao) => {
                    const { status, cor, icone: IconeStatus } = getStatusPosicao(posicao)

                    return (
                      <div
                        key={posicao.id}
                        className={`relative aspect-square rounded-md border-2 ${cor} cursor-pointer transition-all hover:scale-105 hover:shadow-sm flex flex-col items-center justify-center p-2`}
                        onClick={() =>
                          posicao.ocupada
                            ? removerFrangoDaPosicao(maquina.id, posicao.id)
                            : abrirDialogPosicao(maquina.id, posicao.id)
                        }
                      >
                        <IconeStatus className="h-4 w-4 mb-1" />
                        <span className="text-xs font-bold">{posicao.id}</span>

                        {posicao.ocupada && posicao.tempo_inicio && posicao.tempo_estimado && (
                          <div className="absolute -bottom-1 left-0 right-0">
                            <div className="w-full bg-muted rounded-full h-1">
                              <div
                                className="bg-primary h-1 rounded-full transition-all"
                                style={{
                                  width: `${calcularProgresso(posicao.tempo_inicio, posicao.tempo_estimado)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 space-y-1">
                  {maquina.posicoes
                    .filter((p) => p.ocupada)
                    .slice(0, 3)
                    .map((posicao) => (
                      <div
                        key={posicao.id}
                        className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1"
                      >
                        <span className="font-medium">
                          Pos. {posicao.id}: {posicao.cliente_nome}
                        </span>
                        {posicao.tempo_inicio && posicao.tempo_estimado && (
                          <span className="text-muted-foreground">
                            {calcularTempoRestante(posicao.tempo_inicio, posicao.tempo_estimado)}min
                          </span>
                        )}
                      </div>
                    ))}
                  {maquina.posicoes.filter((p) => p.ocupada).length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{maquina.posicoes.filter((p) => p.ocupada).length - 3} mais...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {pedidosPendentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pedidos Aguardando Preparo
            </CardTitle>
            <CardDescription>Clique em uma posição livre para adicionar estes pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pedidosPendentes.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
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

      <Dialog open={isAddMaquinaOpen} onOpenChange={setIsAddMaquinaOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Máquina</DialogTitle>
            <DialogDescription>Digite um nome para identificar a nova máquina</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-maquina">Nome da Máquina</Label>
              <Input
                id="nome-maquina"
                value={novoNomeMaquina}
                onChange={(e) => setNovoNomeMaquina(e.target.value)}
                placeholder="Ex: Máquina 2, Máquina da Direita..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={adicionarMaquina} disabled={!novoNomeMaquina.trim()}>
              Adicionar Máquina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Adicionar Frango na {maquinaSelecionada} - Posição {posicaoSelecionada}
            </DialogTitle>
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
              <Input
                id="observacoes"
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
