# Depuração de `debug.py`

## Erros encontrados

1. `item1 = float(input(Preço do item 1? ))`
   - Erro: falta de aspas na string do prompt.
   - Consequência: `SyntaxError` durante a leitura do arquivo.

2. `desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
   - Erro: o valor retornado por `input()` é uma string.
   - Consequência: a expressão `desconto_cupom / 100` gera `TypeError` porque não é um número.

3. `print(" Item 2:        R$ {total_item2:.2f}")`
   - Erro: falta do prefixo `f` na string formatada.
   - Consequência: o Python imprime literalmente `{total_item2:.2f}` em vez do valor calculado.

4. `if desconto_cupom > 0:`
   - Erro: `desconto_cupom` era uma string e não um número, então a comparação é inválida.
   - Erro adicional: a linha `print(...)` dentro do `if` estava desalinhada, causando `IndentationError`.

## Correções aplicadas

- Corrigi o prompt de `item1` para usar aspas:
  - `float(input("Preço do item 1? "))`
- Converti o desconto para número com `float(...)` e renomeei para `desconto_percentual` para maior clareza.
- Ajustei a segunda linha de impressão para usar f-string correta:
  - `print(f" Item 2:        R$ {total_item2:.2f}")`
- Corrigi a indentação do bloco `if` e atualizei a condição para usar `desconto_percentual`.

## Explicação do código corrigido

1. `cliente = input("Qual é seu nome? ")`
   - Lê o nome do cliente como texto.

2. `qtd1 = int(input("Quantidade do item 1: "))`
   - Lê a quantidade do item 1 e converte para inteiro.

3. `item1 = float(input("Preço do item 1? "))`
   - Lê o preço do item 1 como texto e converte para número decimal.

4. `qtd2 = int(input("Quantidade do item 2: "))`
   - Lê a quantidade do item 2.

5. `item2 = float(input("Preço do item 2? "))`
   - Lê o preço do item 2.

6. `qtd3 = int(input("Quantidade do item 3: "))`
   - Lê a quantidade do item 3.

7. `item3 = float(input("Preço do item 3? "))`
   - Lê o preço do item 3.

8. `total_item1 = qtd1 * item1`
   - Calcula o valor total do item 1.

9. `total_item2 = qtd2 * item2`
   - Calcula o valor total do item 2.

10. `total_item3 = qtd3 * item3`
    - Calcula o valor total do item 3.

11. `subtotal = total_item1 + total_item2 + total_item3`
    - Soma os totais dos três itens.

12. `imposto = subtotal * 0.10`
    - Calcula 10% de imposto sobre o subtotal.

13. `desconto_percentual = float(input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
    - Lê o desconto em percentual e converte para número.

14. `desconto = subtotal * (desconto_percentual / 100)`
    - Converte o percentual de desconto em valor monetário.

15. `total = subtotal + imposto - desconto`
    - Calcula o total final.

16. `linha = "=" * 31` e `separador = "-" * 31`
    - Cria linhas de separação para exibição organizada.

17. `print(f" Item 2:        R$ {total_item2:.2f}")`
    - Mostra corretamente o valor formatado do item 2.

18. `if desconto_percentual > 0:`
    - Mostra o desconto apenas se houver cupom maior que 0.

19. `print(f" TOTAL:         R$ {round(total, 2):.2f}")`
    - Imprime o total final formatado com duas casas decimais.

---

Resumo:
- Erros corrigidos: string sem aspas, string usada como número, f-string ausente e indentação errada.
- O código agora lê os dados corretamente e mostra o resultado esperado na tela.
