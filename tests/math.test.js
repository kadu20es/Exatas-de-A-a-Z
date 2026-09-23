/*
 * Testes mínimos da biblioteca matemática compartilhada.
 * Execução: node tests/math.test.js
 *
 * O teste cria um mock mínimo de exatas-core.js porque math.js foi
 * projetado para rodar no navegador.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const core = fs.readFileSync(
    require('node:path').join(__dirname, '../assets/js/core/exatas-core.js'),
    'utf8'
);
const math = fs.readFileSync(
    require('node:path').join(__dirname, '../assets/js/core/math.js'),
    'utf8'
);

const context = {
    console,
    Math,
    Number,
    BigInt,
    Error,
    TypeError,
    RangeError,
    document: {
        readyState: 'complete'
    }
};
context.window = context;

vm.createContext(context);
vm.runInContext(core, context);
vm.runInContext(math, context);

const M = context.Exatas.Math;

function equalJSON(actual, expected) {
    assert.equal(JSON.stringify(actual), JSON.stringify(expected));
}

// Números
assert.equal(M.Numbers.gcd(48, 18), 6);
assert.equal(M.Numbers.lcm(12, 18), 36);
equalJSON(Array.from(M.Numbers.primeFactors(60)), [2, 2, 3, 5]);
equalJSON(Array.from(M.Numbers.divisors(12)), [1, 2, 3, 4, 6, 12]);
assert.equal(M.Numbers.isPrime(97), true);
assert.equal(M.Numbers.isPrime(99), false);

// Frações
equalJSON(M.Fraction.create(6, 8), { numerator: 3, denominator: 4 });
equalJSON(
    M.Fraction.add(
        M.Fraction.create(1, 2),
        M.Fraction.create(1, 3)
    ),
    { numerator: 5, denominator: 6 }
);
equalJSON(
    M.Fraction.subtract(
        M.Fraction.create(3, 4),
        M.Fraction.create(1, 4)
    ),
    { numerator: 1, denominator: 2 }
);
equalJSON(
    M.Fraction.multiply(
        M.Fraction.create(2, 3),
        M.Fraction.create(3, 4)
    ),
    { numerator: 1, denominator: 2 }
);
equalJSON(
    M.Fraction.divide(
        M.Fraction.create(2, 3),
        M.Fraction.create(4, 5)
    ),
    { numerator: 5, denominator: 6 }
);
assert.equal(M.Fraction.toString(M.Fraction.create(-6, -8)), '3/4');
assert.equal(M.Fraction.toLatex(M.Fraction.create(2, 3)), '\\frac{2}{3}');

// Álgebra
assert.equal(M.Algebra.discriminant(1, -5, 6), 1);
equalJSON(Array.from(M.Algebra.quadraticRoots(1, -5, 6)), [2, 3]);
equalJSON(M.Algebra.vertex(1, -4, 3), { x: 2, y: -1 });

// Combinatória
assert.equal(M.Combinatorics.factorial(5), 120);
assert.equal(M.Combinatorics.combination(10, 3), 120);
assert.equal(M.Combinatorics.permutation(5, 2), 20);

// Estatística
assert.equal(M.Statistics.sum([1, 2, 3, 4]), 10);
assert.equal(M.Statistics.mean([1, 2, 3, 4]), 2.5);
assert.equal(M.Statistics.median([4, 1, 3, 2]), 2.5);
assert.equal(M.Statistics.range([4, 1, 3, 2]), 3);
assert.equal(M.Statistics.variance([1, 2, 3], false), 2 / 3);
assert.equal(M.Statistics.variance([1, 2, 3], true), 1);

// Probabilidade
assert.equal(M.Probability.complement(0.25), 0.75);
assert.equal(M.Probability.binomial(5, 2), 10);
assert.equal(M.Probability.binomialPMF(5, 2, 0.5), 0.3125);

// Geometria
assert.equal(M.Geometry.distance(0, 0, 3, 4), 5);
equalJSON(M.Geometry.midpoint(0, 2, 4, 6), { x: 2, y: 4 });
assert.equal(M.Geometry.slope(1, 2, 3, 6), 2);
assert.equal(M.Geometry.triangleArea(10, 4), 20);

// Trigonometria
assert.ok(Math.abs(M.Trigonometry.sinDeg(30) - 0.5) < 1e-12);
assert.ok(Math.abs(M.Trigonometry.cosDeg(60) - 0.5) < 1e-12);
assert.equal(M.Trigonometry.toDegrees(Math.PI), 180);

// Matrizes
equalJSON(
    M.Matrix.add([[1, 2]], [[3, 4]]),
    [[4, 6]]
);
equalJSON(
    M.Matrix.multiply([[1, 2]], [[3], [4]]),
    [[11]]
);
assert.equal(M.Matrix.determinant([[1, 2], [3, 4]]), -2);

// Complexos
const z = M.Complex.multiply(
    M.Complex.create(1, 2),
    M.Complex.create(3, 4)
);
equalJSON(z, { real: -5, imaginary: 10 });
assert.equal(M.Complex.toString(z), '-5 + 10i');

// Notação científica
const sci = M.Scientific.create(2500, 0);
assert.equal(sci.coefficient, 2.5);
assert.equal(sci.exponent, 3);
assert.equal(M.Scientific.toNumber(sci), 2500);

// Finanças
assert.equal(M.Finance.simpleInterest(1000, 0.1, 2), 200);
assert.equal(M.Finance.simpleAmount(1000, 0.1, 2), 1200);
assert.ok(Math.abs(M.Finance.compoundAmount(1000, 0.1, 2) - 1210) < 1e-9);

console.log('✓ Todos os testes de math.js passaram.');
