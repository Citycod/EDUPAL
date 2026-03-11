export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f6f8f7] dark:bg-[#102217]">
            {children}
        </div>
    );
}
