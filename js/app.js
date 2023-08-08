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
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    salvar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
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

        modalMessage()
        limparCampos()
    } else {
        modalMessage('erro')
    }

    $('#modal-cadastro').modal('show')
}

function modalMessage(tipo) {
    let titulo = document.querySelector('.modal-titulo')
    let texto = document.querySelector('.modal-body')
    let btn = document.querySelector('.btn-modal')
    let classesBtn = 'btn btn-modal'

    if (tipo === 'erro') {
        titulo.className = 'modal-titulo text-danger'
        titulo.innerHTML = 'Erro na gravação!'
        texto.innerHTML = 'Existem campos obrigatórios vazios!'

        btn.className = classesBtn + ' btn-danger'
        btn.innerHTML = 'Voltar e corrigir'
    } else {
        titulo.className = 'modal-titulo text-success'
        titulo.innerHTML = 'Sucesso na gravação!'
        texto.innerHTML = 'Despesa cadastrada com sucesso!'

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