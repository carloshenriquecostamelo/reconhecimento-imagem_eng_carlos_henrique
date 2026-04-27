# Explicação linha a linha do código `num_primos.py`

Este arquivo descreve o funcionamento da função `eh_primo` e do bloco de teste `if __name__ == "__main__"`.

1. `def eh_primo(n: int) -> bool:`
   - Define a função `eh_primo` que recebe um número inteiro `n` e retorna um valor booleano (`True` ou `False`).
   - A anotação `: int` informa que o parâmetro esperado é um inteiro, e `-> bool` indica que o retorno será `True` ou `False`.

2. `    """Retorna True se n for um número primo, caso contrário False."""`
   - Esta é a docstring da função.
   - Explica, em texto, o propósito da função: verificar se `n` é primo.

3. `    if n <= 1:`
   - Verifica se o número é menor ou igual a 1.
   - Números 1 e negativos não são considerados primos.

4. `        return False`
   - Se `n` é 1 ou menor, a função imediatamente retorna `False`.

5. `    if n <= 3:`
   - Verifica se o número é 2 ou 3.
   - Esses dois valores são primos, então o resultado pode ser determinado rapidamente.

6. `        return True`
   - Retorna `True` para os casos `2` e `3`.

7. `    if n % 2 == 0 or n % 3 == 0:`
   - Testa se `n` é divisível por 2 ou por 3.
   - Se for divisível por qualquer um desses valores, então `n` não é primo (exceto 2 e 3, que já foram tratados).

8. `        return False`
   - Retorna `False` quando `n` é divisível por 2 ou por 3.

9. `    i = 5`
   - Inicializa a variável `i` com 5.
   - A partir daqui, a função vai testar divisores maiores que 3.

10. `    while i * i <= n:`
    - Executa o loop enquanto o quadrado de `i` for menor ou igual a `n`.
    - Isso é eficiente porque, se `n` tiver um divisor maior que sua raiz quadrada, ele também terá um divisor menor.

11. `        if n % i == 0 or n % (i + 2) == 0:`
    - Verifica se `n` é divisível por `i` ou por `i + 2`.
    - Esse padrão verifica pares de possíveis divisores: 5 e 7, 11 e 13, 17 e 19, etc.
    - Usar `i` e `i + 2` pula todos os múltiplos de 2 e 3 além dos primeiros casos tratados.

12. `            return False`
    - Se `n` for divisível por qualquer desses valores, a função retorna `False`.

13. `        i += 6`
    - Avança `i` em 6 para testar o próximo par de candidatos.
    - Isso mantém a verificação nos números da forma `6k - 1` e `6k + 1`, que são os únicos que podem ser primos (além de 2 e 3).

14. `    return True`
    - Se nenhum divisor foi encontrado até a raiz quadrada de `n`, `n` é primo.
    - A função retorna `True`.

15. `if __name__ == "__main__":`
    - Este bloco é executado apenas quando o arquivo é executado diretamente.
    - Não é executado se o arquivo for importado como módulo em outro script.

16. `    for teste in [1, 2, 3, 4, 17, 18, 19, 20, 97]:`
    - Define uma lista de valores para testar a função.
    - Cada valor é iterado e verificado com `eh_primo`.

17. `        print(f"{teste} -> {eh_primo(teste)}")`
    - Imprime o número testado e o resultado da verificação.
    - Exemplo de saída: `17 -> True`.

---

Resumo rápido:
- `eh_primo` descarta rapidamente casos simples (`<= 1`, `2`, `3`, divisões por `2` e `3`).
- Em seguida, testa apenas divisores potenciais de forma eficiente usando `i` e `i+2`.
- O bloco `if __name__ == "__main__":` fornece um pequeno conjunto de testes demonstrativos.
