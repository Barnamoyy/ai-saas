
const LandingLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <main className="h-full overflow-auto bg-[#111827]">
            <div className="max-auto max-w-screen h-full w-full">
                {children}
            </div>
        </main>
    );
}

export default LandingLayout;