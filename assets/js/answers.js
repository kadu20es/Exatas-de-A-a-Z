/*
 * Exatas-de-A-a-Z
 * Validação de respostas
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas;

    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de answers.js.'
        );
    }

    const Answers = {};

    /**
     * Normaliza uma entrada textual numérica brasileira.
     */
    Answers.normalizeNumericText = function (value) {
        let text = Exatas.normalizeText(value);

        text = text
            .replace(/\s/g, '')
            .replace(/,/g, '.');

        return text;
    };

    /**
     * Converte texto para número.
     */
    Answers.parseNumber = function (value) {
        if (typeof value === 'number') {
            return Number.isFinite(value)
                ? value
                : null;
        }

        const normalized =
            Answers.normalizeNumericText(value);

        if (!normalized) {
            return null;
        }

        const number = Number(normalized);

        return Number.isFinite(number)
            ? number
            : null;
    };

    /**
     * Compara uma resposta numérica.
     */
    Answers.numeric = function (
        userAnswer,
        expected,
        tolerance = 1e-9
    ) {
        const user = Answers.parseNumber(userAnswer);
        const target = Answers.parseNumber(expected);

        if (user === null || target === null) {
            return false;
        }

        return Exatas.almostEqual(
            user,
            target,
            tolerance
        );
    };

    /**
     * Converte uma fração textual simples.
     *
     * Aceita:
     * 2/3
     * -2/3
     * 4
     */
    Answers.parseFraction = function (value) {
        if (
            value &&
            typeof value === 'object' &&
            Number.isInteger(value.numerator) &&
            Number.isInteger(value.denominator)
        ) {
            return Exatas.Math.fraction(
                value.numerator,
                value.denominator
            );
        }

        let text = Exatas.normalizeText(value);

        if (!text) {
            return null;
        }

        text = text.replace(/\s/g, '');

        const match = text.match(
            /^([+-]?\d+)(?:\/([+-]?\d+))?$/
        );

        if (!match) {
            return null;
        }

        const numerator = Number(match[1]);
        const denominator = match[2]
            ? Number(match[2])
            : 1;

        if (denominator === 0) {
            return null;
        }

        return Exatas.Math.fraction(
            numerator,
            denominator
        );
    };

    /**
     * Compara duas frações.
     */
    Answers.fraction = function (
        userAnswer,
        expected
    ) {
        const user =
            Answers.parseFraction(userAnswer);

        const target =
            Answers.parseFraction(expected);

        if (!user || !target) {
            return false;
        }

        return (
            user.numerator === target.numerator &&
            user.denominator === target.denominator
        );
    };

    /**
     * Extrai uma notação científica.
     *
     * Aceita exemplos:
     * 3.2e4
     * 3,2e4
     * 3.2*10^4
     * 3,2 × 10^4
     * 3.2 x 10^4
     */
    Answers.parseScientific = function (value) {
        if (typeof value === 'number') {
            return Number.isFinite(value)
                ? value
                : null;
        }

        let text = Exatas.normalizeText(value);

        if (!text) {
            return null;
        }

        text = text
            .replace(/,/g, '.')
            .replace(/×/g, 'x')
            .replace(/X/g, 'x')
            .replace(/\s+/g, '');

        // 3.2e4
        if (/^[+-]?\d+(?:\.\d+)?e[+-]?\d+$/i.test(text)) {
            const number = Number(text);

            return Number.isFinite(number)
                ? number
                : null;
        }

        // 3.2x10^4
        const match = text.match(
            /^([+-]?\d+(?:\.\d+)?)x10\^([+-]?\d+)$/
        );

        if (!match) {
            return null;
        }

        const coefficient = Number(match[1]);
        const exponent = Number(match[2]);

        const result =
            coefficient * 10 ** exponent;

        return Number.isFinite(result)
            ? result
            : null;
    };

    /**
     * Compara respostas em notação científica.
     */
    Answers.scientific = function (
        userAnswer,
        expected,
        tolerance = 1e-9
    ) {
        const user =
            Answers.parseScientific(userAnswer);

        const target =
            Answers.parseScientific(expected);

        if (user === null || target === null) {
            return false;
        }

        return Exatas.almostEqual(
            user,
            target,
            tolerance
        );
    };

    /**
     * Compara texto ignorando:
     * - espaços
     * - maiúsculas/minúsculas
     */
    Answers.text = function (
        userAnswer,
        expected
    ) {
        const user =
            Exatas.normalizeText(userAnswer)
                .toLowerCase();

        const target =
            Exatas.normalizeText(expected)
                .toLowerCase();

        return user === target;
    };

    /**
     * Compara resposta usando uma estratégia.
     */
    Answers.check = function (
        userAnswer,
        expected,
        type = 'numeric',
        options = {}
    ) {
        switch (type) {
            case 'numeric':
                return Answers.numeric(
                    userAnswer,
                    expected,
                    options.tolerance ?? 1e-9
                );

            case 'fraction':
                return Answers.fraction(
                    userAnswer,
                    expected
                );

            case 'scientific':
                return Answers.scientific(
                    userAnswer,
                    expected,
                    options.tolerance ?? 1e-9
                );

            case 'text':
                return Answers.text(
                    userAnswer,
                    expected
                );

            default:
                throw Exatas.error(
                    `Tipo de resposta desconhecido: ${type}`,
                    'UNKNOWN_ANSWER_TYPE'
                );
        }
    };

    Exatas.Answers = Answers;
})(window);