
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchContentData, fetchDocsHeading } from "../../api/services/DocsService";


export const useDocsData = () => {
    const { docsId, subDocsId } = useParams<{ docsId: string; subDocsId: string; }>();

    const {
        data: contentData,
        isLoading: contentLoading,
        isError: contentError,
        refetch: refetchContent,
    } = useQuery({
        queryKey: ["content", docsId, subDocsId],
        queryFn: () => fetchContentData(docsId, subDocsId),
        enabled: !!docsId || !!subDocsId,
    });

    const {
        data: docsData,
        isLoading: docsLoading,
        isError: docsError,
        refetch: refetchDocs,
    } = useQuery({
        queryKey: [`docs-list`],
        queryFn: () => fetchDocsHeading(),

    });

    return {

        contentData,
        contentLoading,
        contentError,
        refetchContent,

        docsData,
        docsLoading,
        docsError,
        refetchDocs,
    };
};
