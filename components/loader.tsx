import Image from "next/image";

const Loader = () => {
    return (
        <div className="h-full flex flex-col justify-center items-center gap-y-4">
            <div className="w-10 h-10 relative animate-spin">
                <Image
                    alt="loader"
                    src={"/logo.png"}
                    fill />
            </div>
            <p className="text-sm text-muted-foreground">
                Genius is thinking...
            </p>
        </div>  
    );
}

export default Loader;