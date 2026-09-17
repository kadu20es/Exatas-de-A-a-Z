/*
 * Exatas-de-A-a-Z
 * Motor compartilhado de exercícios
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas;

    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de exercises.js.'
        );
    }

    const Exercises = {};

    /**
     * Filtra exercícios.
     *
     * Critérios suportados:
     * - nível
     * - tema
     * - dificuldade
     * - texto
     */
    Exercises.filter = function (
        exercises,
        filters = {}
    ) {
        if (!Array.isArray(exercises)) {
            return [];
        }

        const search =
            Exatas.normalizeText(
                filters.search ?? ''
            ).toLowerCase();

        return exercises.filter(exercise => {
            if (
                filters.level &&
                exercise.level !== filters.level
            ) {
                return false;
            }

            if (
                filters.topic &&
                exercise.topic !== filters.topic
            ) {
                return false;
            }

            if (
                filters.difficulty &&
                exercise.difficulty !==
                    filters.difficulty
            ) {
                return false;
            }

            if (search) {
                const haystack = [
                    exercise.question,
                    exercise.statement,
                    exercise.topic,
                    exercise.explanation
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (!haystack.includes(search)) {
                    return false;
                }
            }

            return true;
        });
    };

    /**
     * Obtém uma resposta digitada.
     */
    Exercises.getAnswer = function (
        container,
        selector = 'input, textarea, select'
    ) {
        if (!container) {
            return null;
        }

        const input =
            container.querySelector(selector);

        if (!input) {
            return null;
        }

        return input.value;
    };

    /**
     * Verifica um exercício.
     */
    Exercises.check = function (
        exercise,
        userAnswer
    ) {
        if (!exercise) {
            throw Exatas.error(
                'Exercício não informado.',
                'INVALID_EXERCISE'
            );
        }

        const type =
            exercise.answerType ??
            'numeric';

        const expected =
            exercise.answer ??
            exercise.ans;

        const correct =
            Exatas.Answers.check(
                userAnswer,
                expected,
                type,
                {
                    tolerance:
                        exercise.tolerance
                }
            );

        return {
            correct,
            expected,
            userAnswer,
            type
        };
    };

    /**
     * Renderiza um exercício.
     *
     * O conteúdo principal continua sendo responsabilidade
     * da página. Esta função fornece uma estrutura comum.
     */
    Exercises.render = function (
        exercise,
        options = {}
    ) {
        if (!exercise) {
            return '';
        }

        const {
            index = 0,
            showId = false
        } = options;

        const id =
            exercise.id ??
            `exercise-${index + 1}`;

        const question =
            exercise.question ??
            exercise.statement ??
            '';

        const escapedQuestion =
            Exatas.escapeHTML(question);

        return `
            <article
                class="exercise-card"
                data-exercise-id="${Exatas.escapeHTML(id)}"
            >
                <div class="exercise-header">
                    <span class="exercise-number">
                        ${index + 1}
                    </span>

                    ${
                        showId
                            ? `
                                <span class="exercise-id">
                                    ${Exatas.escapeHTML(id)}
                                </span>
                            `
                            : ''
                    }
                </div>

                <div class="exercise-question">
                    ${escapedQuestion}
                </div>

                <div class="exercise-answer-area">
                    <input
                        type="text"
                        class="exercise-answer"
                        autocomplete="off"
                        aria-label="Resposta do exercício"
                    >

                    <button
                        type="button"
                        class="exercise-check"
                        data-action="check-exercise"
                    >
                        Verificar
                    </button>
                </div>

                <div
                    class="exercise-feedback"
                    hidden
                ></div>
            </article>
        `;
    };

    /**
     * Renderiza uma lista.
     */
    Exercises.renderList = function (
        exercises,
        container,
        options = {}
    ) {
        if (!container) {
            throw Exatas.error(
                'Container de exercícios não encontrado.',
                'CONTAINER_NOT_FOUND'
            );
        }

        const list =
            Array.isArray(exercises)
                ? exercises
                : [];

        container.innerHTML =
            list
                .map((exercise, index) =>
                    Exercises.render(
                        exercise,
                        {
                            ...options,
                            index
                        }
                    )
                )
                .join('');

        if (
            Exatas.MathRender &&
            typeof Exatas.MathRender.render ===
                'function'
        ) {
            Exatas.MathRender.render(container);
        }

        return list.length;
    };

    /**
     * Alterna a solução de um exercício.
     */
    Exercises.toggleSolution = function (
        container
    ) {
        if (!container) {
            return false;
        }

        const solution =
            container.querySelector(
                '.exercise-solution'
            );

        if (!solution) {
            return false;
        }

        const hidden =
            solution.hasAttribute('hidden');

        solution.toggleAttribute(
            'hidden',
            !hidden
        );

        return !hidden;
    };

    Exatas.Exercises = Exercises;
})(window);