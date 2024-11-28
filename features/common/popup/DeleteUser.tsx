"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { userAtom } from "@/stores/atoms";
import { createClient } from "@/lib/supabase/auth";
import { toast } from "@/hooks/use-toast";
/** UI 컴포넌트 */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/ui";

interface Props {
    children: React.ReactNode;
}

function DeleteUserPopup({ children }: Props) {
    const router = useRouter();
    const user = useAtomValue(userAtom);
    const supabase = createClient();

    const handleDeleteUser = async () => {
        if (!user) return;
        else {
            try {
                /** SERVICE_ROLE_KEY ISSUE */
                const { data, error } = await supabase.auth.admin.deleteUser(
                    user.id
                );

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "에러가 발생했습니다.",
                        description: `Supabase 오류: ${
                            error.message || "알 수 없는 오류"
                        }`,
                    });
                    console.log(error);
                } else if (data && !error) {
                    toast({
                        title: "회원탈퇴를 완료하였습니다.",
                        description:
                            "지금까지 TASK 관리 앱을 사용해주셔서 감사합니다.",
                    });
                    router.push("/");
                }
            } catch (error) {
                /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "네트워크 오류",
                    description:
                        "서버와 연결할 수 없습니다. 다시 시도해주세요!",
                });
            }
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        회원탈퇴를 정말 진행하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        이 작업이 실행되면 다시 취소할 수 없습니다.
                        <br /> 삭제된 계정은 영구적으로 복구되지 않습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteUser}
                        className="bg-red-600 hover:bg-rose-600"
                    >
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { DeleteUserPopup };
