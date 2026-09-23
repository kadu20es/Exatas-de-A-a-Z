/*
 * Exatas-de-A-a-Z — Biblioteca Matemática Compartilhada
 * API pública: window.Exatas.Math
 * Versão: 0.2.0
 *
 * Dependência: assets/js/core/exatas-core.js
 */
(function (window) {
    'use strict';

    const Exatas = window.Exatas;
    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de math.js.'
        );
    }

    const M = {};

    function number(value, name) {
        return Exatas.assertNumber(value, name || 'valor');
    }

    function integer(value, name) {
        return Exatas.assertInteger(value, name || 'valor');
    }

    function nonNegativeInteger(value, name) {
        return Exatas.assertNonNegativeInteger(value, name || 'valor');
    }

    function assertFraction(value, name) {
        if (!value || typeof value !== 'object') {
            console.log(value, typeof value);
            throw new TypeError(`${name || 'Valor'} deve ser um objeto de fração.`);
        }

        if (!Number.isInteger(value.numerator)) {
            throw new TypeError(`${name || 'Valor'} deve ter um numerador inteiro.`);
        }

        if (!Number.isInteger(value.denominator) || value.denominator === 0) {
            throw new TypeError(`${name || 'Valor'} deve ter um denominador inteiro diferente de zero.`);
        }
    }

    /* ============================================================
       NÚMEROS
       ============================================================ */
    const Numbers = {};

    Numbers.gcd = function (a, b) {
        a = Math.abs(integer(a, 'a'));
        b = Math.abs(integer(b, 'b'));
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    };

    Numbers.lcm = function (a, b) {
        a = integer(a, 'a');
        b = integer(b, 'b');
        if (a === 0 || b === 0) return 0;
        return Math.abs((a / Numbers.gcd(a, b)) * b);
    };

    Numbers.gcdMany = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('gcdMany exige um array não vazio.');
        }
        return values.reduce((g, x) => Numbers.gcd(g, x));
    };

    Numbers.lcmMany = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('lcmMany exige um array não vazio.');
        }
        return values.reduce((l, x) => Numbers.lcm(l, x));
    };

    Numbers.isPrime = function (n) {
        n = nonNegativeInteger(n, 'n');
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let d = 3; d * d <= n; d += 2) {
            if (n % d === 0) return false;
        }
        return true;
    };

    Numbers.primeFactors = function (n) {
        n = nonNegativeInteger(n, 'n');
        if (n < 2) return n === 1 ? [1] : [];
        const factors = [];
        while (n % 2 === 0) {
            factors.push(2);
            n /= 2;
        }
        for (let d = 3; d * d <= n; d += 2) {
            while (n % d === 0) {
                factors.push(d);
                n /= d;
            }
        }
        if (n > 1) factors.push(n);
        return factors;
    };

    Numbers.divisors = function (n) {
        n = nonNegativeInteger(n, 'n');
        if (n === 0) return [];
        const result = [];
        for (let d = 1; d * d <= n; d++) {
            if (n % d === 0) {
                result.push(d);
                if (d !== n / d) result.push(n / d);
            }
        }
        return result.sort((a, b) => a - b);
    };

    Numbers.power = function (base, exponent) {
        return Math.pow(number(base, 'base'), number(exponent, 'exponente'));
    };

    Numbers.sqrt = function (value) {
        value = number(value, 'valor');
        if (value < 0) throw new Error('Raiz quadrada real exige valor >= 0.');
        return Math.sqrt(value);
    };

    Numbers.round = function (value, decimals) {
        value = number(value, 'valor');
        decimals = integer(decimals, 'casas decimais');
        if (decimals < 0) throw new Error('Casas decimais deve ser >= 0.');
        const factor = Math.pow(10, decimals);
        return Math.round((value + Number.EPSILON) * factor) / factor;
    };

    /* ============================================================
       FRAÇÕES
       ============================================================ */
    const Fraction = {};

    Fraction.create = function (numerator, denominator) {
        numerator = integer(numerator, 'numerador');
        denominator = integer(denominator, 'denominador');
        if (denominator === 0) {
            throw new Error('O denominador não pode ser zero.');
        }
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }
        const g = Numbers.gcd(Math.abs(numerator), denominator);
        return {
            numerator: numerator / g,
            denominator: denominator / g
        };
    };

    Fraction.simplify = Fraction.create;

    Fraction.add = function (a, b) {
        console.log('Adding fractions:', a, b);
        assertFraction(a, 'a');
        assertFraction(b, 'b');
        console.log('Adding fractions:', a, b);

        return Fraction.create(
            a.numerator * b.denominator + b.numerator * a.denominator,
            a.denominator * b.denominator
        );
    };

    Fraction.subtract = function (a, b) {
        assertFraction(a, 'a');
        assertFraction(b, 'b');

        return Fraction.create(
            a.numerator * b.denominator - b.numerator * a.denominator,
            a.denominator * b.denominator
        );
    };

    Fraction.multiply = function (a, b) {
        assertFraction(a, 'a');
        assertFraction(b, 'b');

        return Fraction.create(
            a.numerator * b.numerator,
            a.denominator * b.denominator
        );
    };

    Fraction.divide = function (a, b) {
        assertFraction(a, 'a');
        assertFraction(b, 'b');

        if (b.numerator === 0) {
            throw new Error('Não é possível dividir por uma fração igual a zero.');
        }

        return Fraction.create(
            a.numerator * b.denominator,
            a.denominator * b.numerator
        );
    };

    Fraction.compare = function (a, b) {
        a = Fraction.create(a.numerator, a.denominator);
        b = Fraction.create(b.numerator, b.denominator);
        const left = a.numerator * b.denominator;
        const right = b.numerator * a.denominator;
        return left === right ? 0 : (left < right ? -1 : 1);
    };

    Fraction.toNumber = function (fraction) {
        fraction = Fraction.create(fraction.numerator, fraction.denominator);
        return fraction.numerator / fraction.denominator;
    };

    Fraction.toString = function (fraction) {
        fraction = Fraction.create(fraction.numerator, fraction.denominator);
        return fraction.denominator === 1
            ? String(fraction.numerator)
            : `${fraction.numerator}/${fraction.denominator}`;
    };

    Fraction.toLatex = function (fraction) {
        fraction = Fraction.create(fraction.numerator, fraction.denominator);
        return fraction.denominator === 1
            ? String(fraction.numerator)
            : `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
    };

    Fraction.parse = function (value) {
        if (typeof value === 'number' && Number.isInteger(value)) {
            return Fraction.create(value, 1);
        }
        const text = String(value).trim().replace(',', '.');
        const match = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
        if (!match) {
            throw new Error(`Fração inválida: "${value}".`);
        }
        return Fraction.create(Number(match[1]), Number(match[2]));
    };

    /* ============================================================
       ÁLGEBRA
       ============================================================ */
    const Algebra = {};

    Algebra.discriminant = function (a, b, c) {
        a = number(a, 'a');
        b = number(b, 'b');
        c = number(c, 'c');
        if (a === 0) throw new Error('Em uma equação quadrática, a deve ser diferente de zero.');
        return b * b - 4 * a * c;
    };

    Algebra.quadraticRoots = function (a, b, c) {
        const delta = Algebra.discriminant(a, b, c);
        if (delta < 0) return [];
        const sqrtDelta = Math.sqrt(delta);
        if (delta === 0) return [-b / (2 * a)];
        return [
            (-b + sqrtDelta) / (2 * a),
            (-b - sqrtDelta) / (2 * a)
        ].sort((x, y) => x - y);
    };

    Algebra.vertex = function (a, b, c) {
        a = number(a, 'a');
        b = number(b, 'b');
        c = number(c, 'c');
        if (a === 0) throw new Error('Em uma função quadrática, a deve ser diferente de zero.');
        const x = -b / (2 * a);
        return { x, y: a * x * x + b * x + c };
    };

    /* ============================================================
       COMBINATÓRIA
       ============================================================ */
    const Combinatorics = {};

    Combinatorics.factorial = function (n) {
        n = nonNegativeInteger(n, 'n');
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    };

    Combinatorics.factorialBigInt = function (n) {
        n = nonNegativeInteger(n, 'n');
        let result = 1n;
        for (let i = 2; i <= n; i++) result *= BigInt(i);
        return result;
    };

    Combinatorics.permutation = function (n, r) {
        n = nonNegativeInteger(n, 'n');
        r = nonNegativeInteger(r, 'r');
        if (r > n) return 0;
        let result = 1;
        for (let i = 0; i < r; i++) result *= (n - i);
        return result;
    };

    Combinatorics.combination = function (n, r) {
        n = nonNegativeInteger(n, 'n');
        r = nonNegativeInteger(r, 'r');
        if (r > n) return 0;
        r = Math.min(r, n - r);
        let result = 1;
        for (let i = 1; i <= r; i++) {
            result = result * (n - r + i) / i;
        }
        return Math.round(result);
    };

    /* ============================================================
       ESTATÍSTICA
       ============================================================ */
    const Statistics = {};

    Statistics.sum = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('sum exige um array não vazio.');
        }
        return values.reduce((s, x) => s + number(x), 0);
    };

    Statistics.mean = function (values) {
        return Statistics.sum(values) / values.length;
    };

    Statistics.weightedMean = function (values, weights) {
        if (!Array.isArray(values) || !Array.isArray(weights) ||
            values.length === 0 || values.length !== weights.length) {
            throw new Error('Valores e pesos devem ter o mesmo tamanho e não podem ser vazios.');
        }
        let total = 0;
        let weightSum = 0;
        for (let i = 0; i < values.length; i++) {
            const w = number(weights[i], 'peso');
            total += number(values[i], 'valor') * w;
            weightSum += w;
        }
        if (weightSum === 0) throw new Error('A soma dos pesos não pode ser zero.');
        return total / weightSum;
    };

    Statistics.median = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('median exige um array não vazio.');
        }
        const sorted = values.map(x => number(x)).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2
            ? sorted[middle]
            : (sorted[middle - 1] + sorted[middle]) / 2;
    };

    Statistics.mode = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('mode exige um array não vazio.');
        }
        const counts = new Map();
        let max = 0;
        values.forEach(x => {
            const key = String(x);
            const count = (counts.get(key) || 0) + 1;
            counts.set(key, count);
            max = Math.max(max, count);
        });
        return [...counts.entries()]
            .filter(([, count]) => count === max)
            .map(([key]) => Number.isNaN(Number(key)) ? key : Number(key));
    };

    Statistics.range = function (values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('range exige um array não vazio.');
        }
        const nums = values.map(x => number(x));
        return Math.max(...nums) - Math.min(...nums);
    };

    Statistics.variance = function (values, sample) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('variance exige um array não vazio.');
        }
        if (sample && values.length < 2) {
            throw new Error('Variância amostral exige pelo menos dois valores.');
        }
        const mean = Statistics.mean(values);
        const divisor = sample ? values.length - 1 : values.length;
        return values.reduce((sum, x) => {
            const d = number(x) - mean;
            return sum + d * d;
        }, 0) / divisor;
    };

    Statistics.standardDeviation = function (values, sample) {
        return Math.sqrt(Statistics.variance(values, sample));
    };

    Statistics.coefficientOfVariation = function (values, sample) {
        const mean = Statistics.mean(values);
        if (mean === 0) throw new Error('Coeficiente de variação indefinido quando a média é zero.');
        return Statistics.standardDeviation(values, sample) / Math.abs(mean) * 100;
    };

    /* ============================================================
       PROBABILIDADE
       ============================================================ */
    const Probability = {};

    Probability.complement = function (p) {
        p = number(p, 'p');
        if (p < 0 || p > 1) throw new Error('Probabilidade deve estar entre 0 e 1.');
        return 1 - p;
    };

    Probability.binomial = function (n, k) {
        return Combinatorics.combination(n, k);
    };

    Probability.binomialPMF = function (n, k, p) {
        n = nonNegativeInteger(n, 'n');
        k = nonNegativeInteger(k, 'k');
        p = number(p, 'p');
        if (k > n) return 0;
        if (p < 0 || p > 1) throw new Error('Probabilidade deve estar entre 0 e 1.');
        return Combinatorics.combination(n, k) *
            Math.pow(p, k) *
            Math.pow(1 - p, n - k);
    };

    /* ============================================================
       GEOMETRIA
       ============================================================ */
    const Geometry = {};

    Geometry.distance = function (x1, y1, x2, y2) {
        return Math.hypot(number(x2) - number(x1), number(y2) - number(y1));
    };

    Geometry.midpoint = function (x1, y1, x2, y2) {
        return {
            x: (number(x1) + number(x2)) / 2,
            y: (number(y1) + number(y2)) / 2
        };
    };

    Geometry.slope = function (x1, y1, x2, y2) {
        x1 = number(x1); y1 = number(y1);
        x2 = number(x2); y2 = number(y2);
        if (x2 === x1) return null;
        return (y2 - y1) / (x2 - x1);
    };

    Geometry.rectangleArea = function (width, height) {
        return number(width, 'largura') * number(height, 'altura');
    };

    Geometry.triangleArea = function (base, height) {
        return number(base, 'base') * number(height, 'altura') / 2;
    };

    Geometry.circleArea = function (radius) {
        radius = number(radius, 'raio');
        if (radius < 0) throw new Error('Raio não pode ser negativo.');
        return Math.PI * radius * radius;
    };

    Geometry.circleCircumference = function (radius) {
        radius = number(radius, 'raio');
        if (radius < 0) throw new Error('Raio não pode ser negativo.');
        return 2 * Math.PI * radius;
    };

    /* ============================================================
       TRIGONOMETRIA
       ============================================================ */
    const Trigonometry = {};

    Trigonometry.toRadians = function (degrees) {
        return number(degrees, 'graus') * Math.PI / 180;
    };

    Trigonometry.toDegrees = function (radians) {
        return number(radians, 'radianos') * 180 / Math.PI;
    };

    Trigonometry.sinDeg = function (degrees) {
        return Math.sin(Trigonometry.toRadians(degrees));
    };

    Trigonometry.cosDeg = function (degrees) {
        return Math.cos(Trigonometry.toRadians(degrees));
    };

    Trigonometry.tanDeg = function (degrees) {
        return Math.tan(Trigonometry.toRadians(degrees));
    };

    Trigonometry.asinDeg = function (value) {
        value = number(value, 'valor');
        if (value < -1 || value > 1) throw new Error('asin exige valor entre -1 e 1.');
        return Trigonometry.toDegrees(Math.asin(value));
    };

    Trigonometry.acosDeg = function (value) {
        value = number(value, 'valor');
        if (value < -1 || value > 1) throw new Error('acos exige valor entre -1 e 1.');
        return Trigonometry.toDegrees(Math.acos(value));
    };

    Trigonometry.atanDeg = function (value) {
        return Trigonometry.toDegrees(Math.atan(number(value, 'valor')));
    };

    Trigonometry.pythagoras = function (a, b, c) {
        const known = [a, b, c].filter(v => v !== undefined && v !== null);
        if (known.length !== 2) {
            throw new Error('Forneça exatamente dois lados do triângulo retângulo.');
        }
        if (a == null) {
            a = Math.sqrt(number(c) ** 2 - number(b) ** 2);
            return a;
        }
        if (b == null) {
            b = Math.sqrt(number(c) ** 2 - number(a) ** 2);
            return b;
        }
        if (c == null) {
            return Math.hypot(number(a), number(b));
        }
        throw new Error('Um dos lados deve ser desconhecido.');
    };

    /* ============================================================
       MATRIZES
       ============================================================ */
    const Matrix = {};

    function validateMatrix(A) {
        if (!Array.isArray(A) || A.length === 0 ||
            !Array.isArray(A[0]) || A[0].length === 0) {
            throw new Error('Matriz inválida.');
        }
        const cols = A[0].length;
        if (!A.every(row => Array.isArray(row) && row.length === cols)) {
            throw new Error('Todas as linhas da matriz devem ter o mesmo tamanho.');
        }
        return A.map(row => row.map(x => number(x)));
    }

    Matrix.add = function (A, B) {
        A = validateMatrix(A); B = validateMatrix(B);
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Matrizes incompatíveis para soma.');
        }
        return A.map((row, i) => row.map((x, j) => x + B[i][j]));
    };

    Matrix.subtract = function (A, B) {
        A = validateMatrix(A); B = validateMatrix(B);
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Matrizes incompatíveis para subtração.');
        }
        return A.map((row, i) => row.map((x, j) => x - B[i][j]));
    };

    Matrix.multiply = function (A, B) {
        A = validateMatrix(A); B = validateMatrix(B);
        if (A[0].length !== B.length) {
            throw new Error('Matrizes incompatíveis para multiplicação.');
        }
        return A.map(row =>
            B[0].map((_, j) =>
                row.reduce((sum, x, k) => sum + x * B[k][j], 0)
            )
        );
    };

    Matrix.transpose = function (A) {
        A = validateMatrix(A);
        return A[0].map((_, j) => A.map(row => row[j]));
    };

    Matrix.determinant = function (A) {
        A = validateMatrix(A);
        if (A.length !== A[0].length) {
            throw new Error('Determinante exige matriz quadrada.');
        }
        if (A.length === 1) return A[0][0];
        if (A.length === 2) {
            return A[0][0] * A[1][1] - A[0][1] * A[1][0];
        }
        let det = 0;
        for (let j = 0; j < A.length; j++) {
            const minor = A.slice(1).map(row =>
                row.filter((_, col) => col !== j)
            );
            det += (j % 2 === 0 ? 1 : -1) * A[0][j] * Matrix.determinant(minor);
        }
        return det;
    };

    /* ============================================================
       COMPLEXOS
       ============================================================ */
    const Complex = {};

    Complex.create = function (real, imaginary) {
        return {
            real: number(real, 'parte real'),
            imaginary: number(imaginary, 'parte imaginária')
        };
    };

    Complex.add = function (a, b) {
        return Complex.create(a.real + b.real, a.imaginary + b.imaginary);
    };

    Complex.subtract = function (a, b) {
        return Complex.create(a.real - b.real, a.imaginary - b.imaginary);
    };

    Complex.multiply = function (a, b) {
        return Complex.create(
            a.real * b.real - a.imaginary * b.imaginary,
            a.real * b.imaginary + a.imaginary * b.real
        );
    };

    Complex.divide = function (a, b) {
        const denominator = b.real * b.real + b.imaginary * b.imaginary;
        if (denominator === 0) throw new Error('Divisão por complexo zero.');
        return Complex.create(
            (a.real * b.real + a.imaginary * b.imaginary) / denominator,
            (a.imaginary * b.real - a.real * b.imaginary) / denominator
        );
    };

    Complex.conjugate = function (z) {
        return Complex.create(z.real, -z.imaginary);
    };

    Complex.modulus = function (z) {
        return Math.hypot(z.real, z.imaginary);
    };

    Complex.argument = function (z) {
        return Math.atan2(z.imaginary, z.real);
    };

    Complex.toString = function (z) {
        const re = z.real;
        const im = z.imaginary;
        if (im === 0) return String(re);
        if (re === 0) return `${im}i`;
        return `${re}${im < 0 ? ' - ' : ' + '}${Math.abs(im)}i`;
    };

    /* ============================================================
       NOTAÇÃO CIENTÍFICA
       ============================================================ */
    const Scientific = {};

    Scientific.create = function (coefficient, exponent) {
        coefficient = number(coefficient, 'coeficiente');
        exponent = integer(exponent, 'expoente');

        if (coefficient === 0) return { coefficient: 0, exponent: 0 };

        const sign = coefficient < 0 ? -1 : 1;
        coefficient = Math.abs(coefficient);

        while (coefficient >= 10) {
            coefficient /= 10;
            exponent++;
        }
        while (coefficient < 1) {
            coefficient *= 10;
            exponent--;
        }

        return { coefficient: sign * coefficient, exponent };
    };

    Scientific.toNumber = function (value) {
        const s = Scientific.create(value.coefficient, value.exponent);
        return s.coefficient * Math.pow(10, s.exponent);
    };

    Scientific.toString = function (value) {
        const s = Scientific.create(value.coefficient, value.exponent);
        return `${s.coefficient} × 10^${s.exponent}`;
    };

    Scientific.toLatex = function (value) {
        const s = Scientific.create(value.coefficient, value.exponent);
        return `${s.coefficient} \\times 10^{${s.exponent}}`;
    };

    /* ============================================================
       PORCENTAGEM E FINANÇAS
       ============================================================ */
    M.percentage = function (value, percent) {
        return number(value, 'valor') * number(percent, 'percentual') / 100;
    };

    M.toPercentage = function (value) {
        return number(value, 'valor') * 100;
    };

    M.fromPercentage = function (percent) {
        return number(percent, 'percentual') / 100;
    };

    const Finance = {};

    Finance.simpleInterest = function (principal, rate, time) {
        return number(principal) * number(rate) * number(time);
    };

    Finance.simpleAmount = function (principal, rate, time) {
        principal = number(principal);
        return principal + Finance.simpleInterest(principal, rate, time);
    };

    Finance.compoundAmount = function (principal, rate, time) {
        return number(principal) * Math.pow(1 + number(rate), number(time));
    };

    Finance.compoundInterest = function (principal, rate, time) {
        principal = number(principal);
        return Finance.compoundAmount(principal, rate, time) - principal;
    };

    /* ============================================================
       API
       ============================================================ */
    M.Numbers = Numbers;
    M.Fraction = Fraction;
    M.Algebra = Algebra;
    M.Combinatorics = Combinatorics;
    M.Statistics = Statistics;
    M.Probability = Probability;
    M.Geometry = Geometry;
    M.Trigonometry = Trigonometry;
    M.Matrix = Matrix;
    M.Complex = Complex;
    M.Scientific = Scientific;
    M.Finance = Finance;

    /* Compatibilidade temporária para páginas já migradas/parcialmente migradas. */
    M.gcd = Numbers.gcd;
    M.lcm = Numbers.lcm;
    M.gcdMany = Numbers.gcdMany;
    M.lcmMany = Numbers.lcmMany;
    M.factorial = Combinatorics.factorial;
    M.combination = Combinatorics.combination;
    M.permutation = Combinatorics.permutation;
    M.power = Numbers.power;

    Exatas.Math = M;
    Exatas.Math.version = '0.2.0';

})(window);
