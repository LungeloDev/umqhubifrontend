import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./text-editor"), {ssr: false})
const TextEditor = ({value, onChange}) => {
    return (
        <div className="border">
            <Editor  value={value} onChange={onChange}/>
        </div>
    )
}

export default TextEditor;