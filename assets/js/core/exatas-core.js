/*
 * Exatas-de-A-a-Z — Núcleo compartilhado
 * Versão: 0.2.0
 */
(function (window) {
    'use strict';

    const Exatas = window.Exatas || {};

    Exatas.config = Object.assign({
        debug: false,
        numberTolerance: 1e-9,
        answerTolerance: 1e-2
    }, Exatas.config || {});

    Exatas.debug = function (...args) {
        if (Exatas.config.debug) console.debug('[Exatas]', ...args);
    };

    Exatas.warn = function (...args) {
        console.warn('[Exatas]', ...args);
    };

    Exatas.error = function (message) {
        const error = new Error(message);
        error.name = 'ExatasError';
        return error;
    };

    Exatas.assertNumber = function (value, name) {
        const n = Number(value);
        if (!Number.isFinite(n)) {
            throw new TypeError(`${name || 'Valor'} deve ser um número finito.`);
        }
        return n;
    };

    Exatas.assertInteger = function (value, name) {
        const n = Exatas.assertNumber(value, name);
        if (!Number.isInteger(n)) {
            throw new TypeError(`${name || 'Valor'} deve ser um número inteiro.`);
        }
        return n;
    };

    Exatas.assertNonNegativeInteger = function (value, name) {
        const n = Exatas.assertInteger(value, name);
        if (n < 0) {
            throw new RangeError(`${name || 'Valor'} deve ser inteiro e não negativo.`);
        }
        return n;
    };

    Exatas.round = function (value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.round((value + Number.EPSILON) * factor) / factor;
    };

    Exatas.almostEqual = function (a, b, tolerance) {
        tolerance = tolerance ?? Exatas.config.numberTolerance;
        return Math.abs(Number(a) - Number(b)) <= tolerance;
    };

    Exatas.ready = function (fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    };

    window.Exatas = Exatas;
})(window);
