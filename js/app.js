class Despesa {
    constructor(ano, mes, dia, categoria, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.categoria = categoria
        this.descricao = descricao
        this.valor = valor
    }
}

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let categoria = document.getElementById('categoria')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        categoria.value,
        descricao.value,
        valor.value
    )
    
    gravar(despesa)
}

function gravar(despesa) {
    localStorage.setItem('despesa', JSON.stringify(despesa))
}