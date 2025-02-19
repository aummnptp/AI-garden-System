import {  useMutation, useQueryClient } from "@tanstack/react-query"
import { addSubtitleService, addTitleService, changeDocsVisiblityService, changeSubDocsVisiblityService, deleteSubTitleService, deleteTitleService, saveDocsOrderService, saveSubDocsOrderService, updateDocsTitleService, updateSubDocsTitleService } from "../../api/services/DocsService";

export const useDocsMutations = ()=>{
    const queryClient = useQueryClient();

    const addTitleMutation =useMutation({
        mutationFn:addTitleService,
        onSuccess:()=>{
 queryClient.invalidateQueries({ queryKey: ["docs-list"] });        }
    })

    const addSubTitleMutation = useMutation({
        mutationFn:async (docId: string)=> addSubtitleService(docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    })

    const deleteTitleMutation = useMutation({
        mutationFn: async (docId: string) => deleteTitleService(docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const deleteSubTitleMutation = useMutation({
        mutationFn: async (subDocId: string) => deleteSubTitleService(subDocId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const updateDocsTitleMutation = useMutation({
        mutationFn: async ({ docId, newTitle }: { docId: string; newTitle: string }) =>
            updateDocsTitleService(docId, newTitle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const updateSubDocsTitleMutation = useMutation({
        mutationFn: async ({ subDocId, newTitle }: { subDocId: string; newTitle: string }) =>
            updateSubDocsTitleService(subDocId, newTitle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const saveOrderMutation = useMutation({
        mutationFn: async ({ docsToSave, subDocsToSave }: { docsToSave: any[]; subDocsToSave: any[] }) => {
            await saveDocsOrderService(docsToSave);
            await saveSubDocsOrderService(subDocsToSave);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async ({ docId, newState }: { docId: string; newState: boolean }) =>
            changeDocsVisiblityService(docId, newState),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    const toggleSubDocVisibilityMutation = useMutation({
        mutationFn: async ({ subDocId, newState }: { subDocId: string; newState: boolean }) =>
            changeSubDocsVisiblityService(subDocId, newState),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docs-list"] });
        },
    });

    return {
        addTitleMutation,
        addSubTitleMutation,
        deleteTitleMutation,
        deleteSubTitleMutation,
        updateDocsTitleMutation,
        updateSubDocsTitleMutation,
        saveOrderMutation,
        toggleVisibilityMutation,
        toggleSubDocVisibilityMutation,
    };
}