"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

function useDeleteTask() {
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    const deleteTask = async (taskId: number) => {
        try {
            const { status, error } = await supabase
                .from("todos")
                .delete()
                .eq("id", taskId);

            if (status === 204) {
                toast({
                    title: "선택한 TASK가 삭제되었습니다.",
                    description: "새로운 TASK가 생기시면 언제든 추가하세요!",
                });
                router.push("/");
            }
            if (error) {
                toast({
                    variant: "destructive",
                    title: "에러가 발생했습니다.",
                    description: `Supabase 오류: ${
                        error.message || "알 수 없는 오류"
                    }`,
                });
            }
        } catch (err) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            toast({
                variant: "destructive",
                title: "네트워크 오류",
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
            });
            console.error("API 호출 중 오류 발생:", err);
        }
    };

    return deleteTask;
}

export { useDeleteTask };
