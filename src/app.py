"""Alerta do Bairro: Sprint 0.

Página inicial com o nome do produto, a frase de corte e o primeiro campo
real do formulário de ocorrência. Ainda não grava dados: a gravação em
SQLite entra na próxima sprint.
"""
from flask import Flask, render_template, request

app = Flask(__name__)

# Tipos de ocorrência. Propositalmente NÃO existe campo para descrever ou
# fotografar pessoas (risco ético mapeado na Aula 03: perfilamento).
TIPOS_OCORRENCIA = [
    "Furto de celular",
    "Roubo de celular",
    "Furto de veículo",
    "Roubo de veículo",
    "Furto em residência",
    "Outro",
]


@app.route("/", methods=["GET", "POST"])
def inicio():
    tipo_escolhido = None
    erro = None
    if request.method == "POST":
        tipo = request.form.get("tipo", "")
        if tipo in TIPOS_OCORRENCIA:
            tipo_escolhido = tipo
        else:
            erro = "Escolha um tipo de ocorrência da lista para continuar."
    return render_template(
        "index.html",
        tipos=TIPOS_OCORRENCIA,
        tipo_escolhido=tipo_escolhido,
        erro=erro,
    )


if __name__ == "__main__":
    app.run(debug=True)
