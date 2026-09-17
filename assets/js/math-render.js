/*
 * Exatas-de-A-a-Z
 * Renderização matemática compartilhada usando KaTeX
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas;

    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de math-render.js.'
        );
    }

    const MathRender = {};

    /**
     * Verifica se KaTeX está disponível.
     */
    MathRender.isAvailable = function () {
        return (
            typeof window.katex !== 'undefined' &&
            typeof window.katex.render === 'function'
        );
    };

    /**
     * Renderiza uma expressão dentro de um elemento.
     */
    MathRender.renderElement = function (
        element,
        expression,
        options = {}
    ) {
        if (!element) {
            throw Exatas.error(
                'Elemento de renderização não encontrado.',
                'ELEMENT_NOT_FOUND'
            );
        }

        if (!MathRender.isAvailable()) {
            Exatas.warn(
                'KaTeX não está disponível. A expressão não foi renderizada.'
            );

            element.textContent = expression ?? '';
            return false;
        }

        const config = {
            throwOnError: false,
            displayMode: false,
            ...options
        };

        window.katex.render(
            String(expression ?? ''),
            element,
            config
        );

        return true;
    };

    /**
     * Renderiza conteúdo de um elemento usando delimitadores.
     *
     * Aceita:
     * $$...$$
     * \[...\]
     * $...$
     * \(...\)
     */
    MathRender.render = function (
        element,
        options = {}
    ) {
        if (!element) {
            return false;
        }

        if (!MathRender.isAvailable()) {
            return false;
        }

        if (
            typeof window.renderMathInElement === 'function'
        ) {
            window.renderMathInElement(
                element,
                {
                    delimiters: [
                        {
                            left: '$$',
                            right: '$$',
                            display: true
                        },
                        {
                            left: '\\[',
                            right: '\\]',
                            display: true
                        },
                        {
                            left: '$',
                            right: '$',
                            display: false
                        },
                        {
                            left: '\\(',
                            right: '\\)',
                            display: false
                        }
                    ],
                    throwOnError: false,
                    ...options
                }
            );

            return true;
        }

        return false;
    };

    /**
     * Renderiza um elemento e todos os seus descendentes.
     */
    MathRender.renderTree = function (element) {
        if (!element) {
            return false;
        }

        return MathRender.render(element);
    };

    /**
     * Renderiza todo o documento.
     *
     * Usar somente na inicialização.
     * Para atualizações dinâmicas, prefira renderElement().
     */
    MathRender.renderDocument = function () {
        return MathRender.render(document.body);
    };

    /**
     * Atalho para expressão inline.
     */
    MathRender.inline = function (
        expression,
        options = {}
    ) {
        if (!MathRender.isAvailable()) {
            return String(expression ?? '');
        }

        const container = document.createElement('span');

        MathRender.renderElement(
            container,
            expression,
            {
                displayMode: false,
                ...options
            }
        );

        return container.innerHTML;
    };

    /**
     * Atalho para expressão em bloco.
     */
    MathRender.display = function (
        expression,
        options = {}
    ) {
        if (!MathRender.isAvailable()) {
            return String(expression ?? '');
        }

        const container = document.createElement('div');

        MathRender.renderElement(
            container,
            expression,
            {
                displayMode: true,
                ...options
            }
        );

        return container.innerHTML;
    };

    Exatas.MathRender = MathRender;
})(window);