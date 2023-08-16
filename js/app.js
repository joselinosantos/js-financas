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

function listarDespesas(despesas = []) {
    if (despesas.length == 0) {
        despesas = bd.listar()
    }

    let listaDespesas = document.getElementById('lista-despesas')
    listaDespesas.innerHTML = ""

    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow()

        let categorias = {
            '1': 'Alimentação',
            '2': 'Educação',
            '3': 'Lazer',
            '4': 'Saúde',
            '5': 'Transporte'
        }

        d.categoria = categorias[d.categoria]

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.categoria
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`
    })
}
