import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContentDocumentService, updateContentSubDocumentService } from "../../api/services/DocsService";


interface UpdateContentProps {
  docsId?: string;
  subDocsId?: string;
  editorValue: string;
  onSuccessCallback?: () => void;
}

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ docsId, subDocsId, editorValue }: UpdateContentProps) => {
      if (!editorValue.trim()) throw new Error("กรุณากรอกเนื้อหาก่อนบันทึก");

      if (subDocsId) {
        return updateContentSubDocumentService(subDocsId, editorValue);
      } else if (docsId) {
        return updateContentDocumentService(docsId, editorValue);
      } else {
        throw new Error("Document ID or SubDocument ID is required.");
      }
    },
    onSuccess: (_data, { docsId, subDocsId, onSuccessCallback }) => {
      queryClient.invalidateQueries({ queryKey: ["content", docsId, subDocsId] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};
