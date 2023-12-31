class Despesa {
    constructor(ano, mes, dia, categoria, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.categoria = categoria
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let atributo in this) {
            if (this[atributo] == undefined || this[atributo] == '' || this[atributo] == null) {
                return false
            }
        }
        return true
    }
}

class Db {
    constructor() {
    }

    getAllKeys() {
        let keys = Object.keys(localStorage)
        let despesas = keys.filter(d => d.includes('despesa'))
        return despesas
    }

    getProximoId() {
        let keys = this.getAllKeys()
        var id = 0

        if (keys.length > 0) {
            let ids = []
            keys.forEach((k) => {
                ids.push(parseInt(k.split('despesa')[1]))
            })
            id = Math.max.apply(null, ids)
            id += 1
        }
        return id
    }

    salvar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem('despesa' + id, JSON.stringify(despesa))
    }

    listar() {
        let despesas = []
        let registros = this.getAllKeys()

        for (let i = 0; i <= registros.length; i++) {
            let despesa = JSON.parse(localStorage.getItem('despesa' + i))

            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = []
        despesasFiltradas = this.listar()

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.categoria != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.categoria == despesa.categoria)
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Db()

function cadastrarDespesa() {
    getCampos()

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        categoria.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        bd.salvar(despesa)

        modalMessage('Sucesso na gravação!', 'Despesa cadastrada com sucesso!')
        limparCampos()
    } else {
        modalMessage('Erro na gravação!', 'Existem campos obrigatórios vazios!', 'erro')
    }

    $('#modal').modal('show')
}

function modalMessage(title, description, tipo) {
    let titulo = document.querySelector('.modal-titulo')
    let texto = document.querySelector('.modal-body')
    let btn = document.querySelector('.btn-modal')
    let classesBtn = 'btn btn-modal'

    titulo.innerHTML = title
    texto.innerHTML = description

    if (tipo === 'erro') {
        titulo.className = 'modal-titulo text-danger'

        btn.className = classesBtn + ' btn-danger'
        btn.innerHTML = 'Voltar e corrigir'
    } else {
        titulo.className = 'modal-titulo text-success'

        btn.className = classesBtn + ' btn-success'
        btn.innerHTML = 'OK'
    }
}

function getCampos() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let categoria = document.getElementById('categoria')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
}

function limparCampos() {
    getCampos()

    ano.value = ''
    mes.value = ''
    dia.value = ''
    categoria.value = ''
    descricao.value = ''
    valor.value = ''
}

function listarDespesas(despesas = [], filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.listar()
    }

    let listaDespesas = document.getElementById('lista-despesas')
    listaDespesas.innerHTML = ""

    despesas.forEach((d) => {
        let linha = listaDespesas.insertRow()
        let btnExcluir = document.createElement('button')
        let categorias = {
            '1': 'Alimentação',
            '2': 'Educação',
            '3': 'Lazer',
            '4': 'Saúde',
            '5': 'Transporte'
        }

        d.categoria = categorias[d.categoria]

        btnExcluir.className = "btn btn-danger"
        btnExcluir.innerHTML = "<i class='fa fa-trash'></i>"
        btnExcluir.id = d.id

        btnExcluir.onclick = () => {
            modalMessage('Atenção!', 'Tem certeza que deseja deletar o registro ' + d.id + '?', 'erro')
            $('#modal').modal('show')

            let btnModal = document.querySelector('.btn-modal')
            btnModal.innerHTML = "Sim"

            btnModal.onclick = () => {
                bd.remover('despesa' + d.id)
                window.location.reload()
            }
        }

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.categoria
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`
        linha.insertCell(4).append(btnExcluir)
    })
}

function pesquisarDespesas() {
    getCampos()

    let despesa = new Despesa(ano.value, mes.value, dia.value, categoria.value, descricao.value, valor.value)
    let despesas = bd.pesquisar(despesa)

    listarDespesas(despesas, true)
}
