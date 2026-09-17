/*
 * Exatas-de-A-a-Z
 * Core compartilhado
 *
 * Responsabilidades:
 * - Namespace global
 * - Utilidades gerais
 * - Validação de argumentos
 * - Eventos
 * - IDs únicos
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas || {};

    Exatas.version = '0.1.0';

    Exatas.config = {
        debug: false,
        locale: 'pt-BR'
    };

    /**
     * Registra mensagens de debug somente quando habilitado.
     */
    Exatas.debug = function (...args) {
        if (Exatas.config.debug) {
            console.debug('[Exatas]', ...args);
        }
    };

    /**
     * Registra uma mensagem de aviso.
     */
    Exatas.warn = function (...args) {
        console.warn('[Exatas]', ...args);
    };

    /**
     * Cria um erro padronizado.
     */
    Exatas.error = function (message, code = 'EXATAS_ERROR') {
        const error = new Error(message);
        error.code = code;
        return error;
    };

    /**
     * Garante que um valor seja um número finito.
     */
    Exatas.assertNumber = function (value, name = 'valor') {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw Exatas.error(
                `${name} deve ser um número finito.`,
                'INVALID_NUMBER'
            );
        }

        return value;
    };

    /**
     * Garante que um valor seja um inteiro.
     */
    Exatas.assertInteger = function (value, name = 'valor') {
        if (!Number.isInteger(value)) {
            throw Exatas.error(
                `${name} deve ser um número inteiro.`,
                'INVALID_INTEGER'
            );
        }

        return value;
    };

    /**
     * Garante que um inteiro seja não negativo.
     */
    Exatas.assertNonNegativeInteger = function (
        value,
        name = 'valor'
    ) {
        Exatas.assertInteger(value, name);

        if (value < 0) {
            throw Exatas.error(
                `${name} deve ser maior ou igual a zero.`,
                'INVALID_RANGE'
            );
        }

        return value;
    };

    /**
     * Arredondamento numérico seguro.
     */
    Exatas.round = function (value, decimals = 10) {
        Exatas.assertNumber(value);

        if (!Number.isInteger(decimals) || decimals < 0) {
            throw Exatas.error(
                'decimals deve ser um inteiro não negativo.',
                'INVALID_DECIMALS'
            );
        }

        const factor = 10 ** decimals;
        return Math.round((value + Number.EPSILON) * factor) / factor;
    };

    /**
     * Compara números com tolerância.
     */
    Exatas.almostEqual = function (
        a,
        b,
        tolerance = 1e-9
    ) {
        Exatas.assertNumber(a, 'a');
        Exatas.assertNumber(b, 'b');
        Exatas.assertNumber(tolerance, 'tolerance');

        if (tolerance < 0) {
            throw Exatas.error(
                'tolerance não pode ser negativa.',
                'INVALID_TOLERANCE'
            );
        }

        return Math.abs(a - b) <= tolerance;
    };

    /**
     * Normaliza texto:
     * - converte para string
     * - remove espaços externos
     * - normaliza espaços internos
     */
    Exatas.normalizeText = function (value) {
        return String(value ?? '')
            .trim()
            .replace(/\s+/g, ' ');
    };

    /**
     * Escapa texto para uso seguro em HTML.
     */
    Exatas.escapeHTML = function (value) {
        const div = document.createElement('div');
        div.textContent = String(value ?? '');
        return div.innerHTML;
    };

    /**
     * Gera um ID único simples.
     */
    Exatas.uid = function (prefix = 'exatas') {
        return `${prefix}-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
    };

    /**
     * Executa uma função quando o DOM estiver pronto.
     */
    Exatas.ready = function (callback) {
        if (typeof callback !== 'function') {
            throw Exatas.error(
                'Exatas.ready exige uma função.',
                'INVALID_CALLBACK'
            );
        }

        if (document.readyState === 'loading') {
            document.addEventListener(
                'DOMContentLoaded',
                callback,
                { once: true }
            );
        } else {
            callback();
        }
    };

    Exatas.Math = {
        gcd: function (a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) {
                [a, b] = [b, a % b];
            }
            return a || 1;
        }
    };

    /**
     * Obtém um elemento pelo ID.
     */
    Exatas.$ = function (id) {
        return document.getElementById(id);
    };

    /**
     * QuerySelector abreviado.
     */
    Exatas.qs = function (selector, root = document) {
        return root.querySelector(selector);
    };

    /**
     * QuerySelectorAll convertido para Array.
     */
    Exatas.qsa = function (selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    };

    window.Exatas = Exatas;
})(window);