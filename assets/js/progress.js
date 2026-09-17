/*
 * Exatas-de-A-a-Z
 * Sistema compartilhado de progresso
 */

(function (window) {
    'use strict';

    const Exatas = window.Exatas;

    if (!Exatas) {
        throw new Error(
            'exatas-core.js deve ser carregado antes de progress.js.'
        );
    }

    const Progress = {};

    const STORAGE_PREFIX =
        'exatas-progress:';

    /**
     * Cria a chave de armazenamento.
     */
    function storageKey(pageId) {
        return `${STORAGE_PREFIX}${pageId}`;
    }

    /**
     * Obtém progresso.
     */
    Progress.get = function (pageId) {
        if (!pageId) {
            throw Exatas.error(
                'pageId é obrigatório.',
                'INVALID_PAGE_ID'
            );
        }

        try {
            const raw =
                localStorage.getItem(
                    storageKey(pageId)
                );

            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw);

            return (
                parsed &&
                typeof parsed === 'object'
            )
                ? parsed
                : {};
        } catch (error) {
            Exatas.warn(
                'Não foi possível ler o progresso:',
                error
            );

            return {};
        }
    };

    /**
     * Salva progresso completo.
     */
    Progress.save = function (
        pageId,
        data
    ) {
        if (!pageId) {
            throw Exatas.error(
                'pageId é obrigatório.',
                'INVALID_PAGE_ID'
            );
        }

        if (
            !data ||
            typeof data !== 'object'
        ) {
            throw Exatas.error(
                'data deve ser um objeto.',
                'INVALID_PROGRESS'
            );
        }

        try {
            localStorage.setItem(
                storageKey(pageId),
                JSON.stringify(data)
            );

            return true;
        } catch (error) {
            Exatas.warn(
                'Não foi possível salvar o progresso:',
                error
            );

            return false;
        }
    };

    /**
     * Marca um item como concluído.
     */
    Progress.mark = function (
        pageId,
        itemId,
        value = true
    ) {
        const data =
            Progress.get(pageId);

        data[itemId] = Boolean(value);

        Progress.save(pageId, data);

        return data;
    };

    /**
     * Verifica se um item foi concluído.
     */
    Progress.isCompleted = function (
        pageId,
        itemId
    ) {
        const data =
            Progress.get(pageId);

        return data[itemId] === true;
    };

    /**
     * Retorna quantidade de itens concluídos.
     */
    Progress.countCompleted = function (
        pageId
    ) {
        const data =
            Progress.get(pageId);

        return Object.values(data)
            .filter(Boolean)
            .length;
    };

    /**
     * Calcula porcentagem de progresso.
     */
    Progress.percentage = function (
        pageId,
        total
    ) {
        Exatas.assertNonNegativeInteger(
            total,
            'total'
        );

        if (total === 0) {
            return 0;
        }

        const completed =
            Progress.countCompleted(pageId);

        return Math.min(
            100,
            Math.round(
                (completed / total) * 100
            )
        );
    };

    /**
     * Remove todo o progresso de uma página.
     */
    Progress.reset = function (pageId) {
        if (!pageId) {
            throw Exatas.error(
                'pageId é obrigatório.',
                'INVALID_PAGE_ID'
            );
        }

        try {
            localStorage.removeItem(
                storageKey(pageId)
            );

            return true;
        } catch (error) {
            Exatas.warn(
                'Não foi possível remover o progresso:',
                error
            );

            return false;
        }
    };

    /**
     * Remove todos os dados do sistema Exatas.
     *
     * Deve ser usado futuramente somente por uma
     * ação explícita do usuário.
     */
    Progress.resetAll = function () {
        const keys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key =
                localStorage.key(i);

            if (
                key &&
                key.startsWith(STORAGE_PREFIX)
            ) {
                keys.push(key);
            }
        }

        keys.forEach(key =>
            localStorage.removeItem(key)
        );

        return keys.length;
    };

    Exatas.Progress = Progress;
})(window);