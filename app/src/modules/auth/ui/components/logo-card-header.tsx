import Image from "next/image";

export function LogoCardHeader() {
    return (
        <div className="w-full flex justify-center">
            <Image
                src="/logo-base.svg"
                alt="Logo image"
                width={130}
                height={100}
            />
        </div>
    )
}