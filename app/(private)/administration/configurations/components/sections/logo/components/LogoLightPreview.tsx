import LightViewerSingle from "@/components/shared/light-gallery/single/light-viewer-single"



const LogoLightPreview = ({ src, alt }: { src: string, alt: string }) => {
    return (
        <div className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-md border border-border bg-background overflow-hidden">
            <LightViewerSingle src={src} alt={alt} className="w-full h-full rounded-md" />
        </div>
    )
}

export default LogoLightPreview