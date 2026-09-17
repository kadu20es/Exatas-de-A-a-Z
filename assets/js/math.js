/*
 * Exatas-de-A-a-Z
 * Biblioteca matemática compartilhada
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas;

    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de math.js.'
        );
    }

    const MathEx = {};

    /**
     * Máximo Divisor Comum.
     */
    MathEx.gcd = function (a, b) {
        a = Math.abs(
            Exatas.assertInteger(a, 'a')
        );

        b = Math.abs(
            Exatas.assertInteger(b, 'b')
        );

        while (b !== 0) {
            [a, b] = [b, a % b];
        }

        return a;
    };

    /**
     * Mínimo Múltiplo Comum.
     */
    MathEx.lcm = function (a, b) {
        a = Exatas.assertInteger(a, 'a');
        b = Exatas.assertInteger(b, 'b');

        if (a === 0 || b === 0) {
            return 0;
        }

        return Math.abs((a / MathEx.gcd(a, b)) * b);
    };

    /**
     * Cria uma fração normalizada.
     */
    MathEx.fraction = function (numerator, denominator = 1) {
        Exatas.assertInteger(numerator, 'numerador');
        Exatas.assertInteger(denominator, 'denominador');

        if (denominator === 0) {
            throw Exatas.error(
                'O denominador não pode ser zero.',
                'ZERO_DENOMINATOR'
            );
        }

        if (numerator === 0) {
            return {
                numerator: 0,
                denominator: 1
            };
        }

        if (denominator < 0) {
            numerator *= -1;
            denominator *= -1;
        }

        const divisor = MathEx.gcd(
            Math.abs(numerator),
            denominator
        );

        return {
            numerator: numerator / divisor,
            denominator: denominator / divisor
        };
    };

    /**
     * Converte uma fração para número.
     */
    MathEx.fractionToNumber = function (fraction) {
        if (!fraction || typeof fraction !== 'object') {
            throw Exatas.error(
                'Fração inválida.',
                'INVALID_FRACTION'
            );
        }

        return fraction.numerator / fraction.denominator;
    };

    /**
     * Soma duas frações.
     */
    MathEx.addFractions = function (a, b) {
        return MathEx.fraction(
            a.numerator * b.denominator +
                b.numerator * a.denominator,
            a.denominator * b.denominator
        );
    };

    /**
     * Subtrai duas frações.
     */
    MathEx.subtractFractions = function (a, b) {
        return MathEx.fraction(
            a.numerator * b.denominator -
                b.numerator * a.denominator,
            a.denominator * b.denominator
        );
    };

    /**
     * Multiplica duas frações.
     */
    MathEx.multiplyFractions = function (a, b) {
        return MathEx.fraction(
            a.numerator * b.numerator,
            a.denominator * b.denominator
        );
    };

    /**
     * Divide duas frações.
     */
    MathEx.divideFractions = function (a, b) {
        if (b.numerator === 0) {
            throw Exatas.error(
                'Não é possível dividir por zero.',
                'DIVISION_BY_ZERO'
            );
        }

        return MathEx.fraction(
            a.numerator * b.denominator,
            a.denominator * b.numerator
        );
    };

    /**
     * Fatorial.
     *
     * Limitado ao intervalo seguro do Number.
     */
    MathEx.factorial = function (n) {
        Exatas.assertNonNegativeInteger(n, 'n');

        if (n > 170) {
            throw Exatas.error(
                'O fatorial é grande demais para ser representado com segurança usando Number.',
                'FACTORIAL_TOO_LARGE'
            );
        }

        let result = 1;

        for (let i = 2; i <= n; i++) {
            result *= i;
        }

        return result;
    };

    /**
     * Combinação simples:
     * C(n,k)
     *
     * Calculada sem depender diretamente de n!.
     */
    MathEx.combination = function (n, k) {
        Exatas.assertNonNegativeInteger(n, 'n');
        Exatas.assertNonNegativeInteger(k, 'k');

        if (k > n) {
            return 0;
        }

        k = Math.min(k, n - k);

        let result = 1;

        for (let i = 1; i <= k; i++) {
            result *= (n - k + i) / i;
        }

        return Math.round(result);
    };

    /**
     * Permutação simples:
     * P(n,k)
     */
    MathEx.permutation = function (n, k = n) {
        Exatas.assertNonNegativeInteger(n, 'n');
        Exatas.assertNonNegativeInteger(k, 'k');

        if (k > n) {
            return 0;
        }

        let result = 1;

        for (let i = 0; i < k; i++) {
            result *= n - i;
        }

        return result;
    };

    /**
     * Potência.
     */
    MathEx.power = function (base, exponent) {
        Exatas.assertNumber(base, 'base');
        Exatas.assertNumber(exponent, 'expoente');

        return base ** exponent;
    };

    /**
     * Porcentagem.
     *
     * Exemplo:
     * percentage(25, 200) -> 50
     */
    MathEx.percentage = function (percentage, value) {
        Exatas.assertNumber(percentage, 'porcentagem');
        Exatas.assertNumber(value, 'valor');

        return (percentage / 100) * value;
    };

    /**
     * Converte número decimal para porcentagem.
     */
    MathEx.toPercentage = function (decimal) {
        Exatas.assertNumber(decimal, 'decimal');
        return decimal * 100;
    };

    /**
     * Converte porcentagem para decimal.
     */
    MathEx.fromPercentage = function (percentage) {
        Exatas.assertNumber(percentage, 'porcentagem');
        return percentage / 100;
    };

    /**
     * MDC/Máximo Divisor Comum para vários números.
     */
    MathEx.gcdMany = function (numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) {
            throw Exatas.error(
                'Informe pelo menos um número.',
                'INVALID_ARRAY'
            );
        }

        return numbers.reduce(
            (acc, value) => MathEx.gcd(acc, value)
        );
    };

    /**
     * MMC para vários números.
     */
    MathEx.lcmMany = function (numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) {
            throw Exatas.error(
                'Informe pelo menos um número.',
                'INVALID_ARRAY'
            );
        }

        return numbers.reduce(
            (acc, value) => MathEx.lcm(acc, value)
        );
    };

    Exatas.Math = MathEx;
})(window);