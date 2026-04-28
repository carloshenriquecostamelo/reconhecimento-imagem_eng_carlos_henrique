from typing import Iterable, Tuple


def calcula_estatisticas(valores: Iterable[float]) -> Tuple[float, float, float, float]:
    """Retorna soma, média, maior e menor valores de uma sequência numérica."""
    valores_lista = list(valores)
    if not valores_lista:
        return 0.0, 0.0, 0.0, 0.0

    total = sum(valores_lista)
    media = total / len(valores_lista)
    maior = max(valores_lista)
    menor = min(valores_lista)
    return total, media, maior, menor


if __name__ == "__main__":
    numeros = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    total, media, maior, menor = calcula_estatisticas(numeros)

    print("total:", total)
    print("media:", media)
    print("maior:", maior)
    print("menor:", menor)
