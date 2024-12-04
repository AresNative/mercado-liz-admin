import FileList from "@/components/ui/filelist";

export default function Page() {
    const files = [
        { name: "config.json", extension: "json", size: "2.3 KB" },
        { name: "app.tsx", extension: "tsx", size: "4.1 KB" },
        { name: "styles.css", extension: "css", size: "1.8 KB" },
        { name: "utils.ts", extension: "ts", size: "892 B" },
        { name: "README.md", extension: "md", size: "4.2 KB" },
        { name: "logo.svg", extension: "svg", size: "3.1 KB" },
        { name: "index.js", extension: "js", size: "1.5 KB" },
        { name: "types.d.ts", extension: "ts", size: "567 B" },
    ];
    return (
        <>
            <FileList files={files} isGrid />
        </>
    )
}