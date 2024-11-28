/** UI 컴포넌트 */
import { AsideSection } from "@/widgets";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page">
            <AsideSection />
            <main className="page__main">{children}</main>
        </div>
    );
}
