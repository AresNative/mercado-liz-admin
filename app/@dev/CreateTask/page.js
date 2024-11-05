"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Save,
  FileUp,
  Type,
  Heading1,
  Heading2,
} from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  DropdownTrigger,
  DropdownMenu,
  Tooltip,
} from "@nextui-org/react";

export default function DocumentEditor() {
  const [text, setText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [fileName, setFileName] = useState("");
  const editorRef = useRef(null);

  const insertTemplate = (template) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const newText =
      currentText.substring(0, start) + template + currentText.substring(end);
    setText(newText);
    setFormattedText(newText);
  };

  const handleFormat = (command) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedContent = "";
    switch (command) {
      case "h1":
        formattedContent = `<h1 className="text-2xl font-bold mb-4">${selectedText}</h1>`;
        break;
      case "h2":
        formattedContent = `<h2 className="text-xl font-bold mb-3">${selectedText}</h2>`;
        break;
      case "bold":
        formattedContent = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        formattedContent = `<em>${selectedText}</em>`;
        break;
      case "underline":
        formattedContent = `<u>${selectedText}</u>`;
        break;
      case "insertUnorderedList":
        formattedContent = selectedText
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
          .map((item) => `<li className="ml-4">• ${item}</li>`)
          .join("\n");
        formattedContent = `<ul className="list-none space-y-2">\n${formattedContent}\n</ul>`;
        break;
      case "insertOrderedList":
        formattedContent = selectedText
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
          .map(
            (item, index) => `<li className="ml-4">${index + 1}. ${item}</li>`
          )
          .join("\n");
        formattedContent = `<ol className="list-none space-y-2">\n${formattedContent}\n</ol>`;
        break;
      default:
        formattedContent = selectedText;
    }

    const newText =
      textarea.value.substring(0, start) +
      formattedContent +
      textarea.value.substring(end);
    setText(newText);
    setFormattedText(newText);
  };

  const handleSave = () => {
    const blob = new Blob([formattedText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.html`;
    link.click();
  };

  const handleLoad = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        setText(content);
        setFormattedText(content);
        setFileName(file.name.replace(".html", ""));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 space-y-6 bg-white dark:bg-neutral-800 shadow-lg rounded-lg">
      <div className="flex items-center space-x-3">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          fullWidth
          placeholder="Nombre del archivo"
        />
        <Button onClick={handleSave}>
          <Save size={75} />
          Guardar
        </Button>
        <Button as="label">
          <FileUp size={75} />
          Cargar
          <input
            type="file"
            className="hidden"
            onChange={handleLoad}
            accept=".html"
          />
        </Button>
      </div>
      <div className="flex space-x-3">
        {[
          { icon: Heading1, cmd: "h1" },
          { icon: Heading2, cmd: "h2" },
          { icon: Bold, cmd: "bold" },
          { icon: Italic, cmd: "italic" },
          { icon: Underline, cmd: "underline" },
          { icon: List, cmd: "insertUnorderedList" },
          { icon: ListOrdered, cmd: "insertOrderedList" },
        ].map(({ icon: Icon, cmd }) => (
          <Tooltip content={cmd} key={cmd}>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="outlined"
                size="sm"
                color="primary"
                onClick={() => handleFormat(cmd)}
              >
                <Icon size={20} />
              </Button>
            </motion.div>
          </Tooltip>
        ))}
        <Dropdown>
          <DropdownTrigger>
            <Button variant="outlined" size="sm">
              <Type size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key="taskTemplate"
              onClick={() =>
                insertTemplate(
                  `<h1 className="text-2xl font-bold mb-4">Description</h1>
                  <p className="mb-4">Enter your description here...</p>
                  <h2 className="text-xl font-bold mb-3">Acceptance Criteria</h2>
                  <ul className="list-none space-y-2">
                    <li className="ml-4">• First criteria</li>
                    <li className="ml-4">• Second criteria</li>
                    <li className="ml-4">• Third criteria</li>
                  </ul>`
                )
              }
            >
              Plantilla de Tarea
            </DropdownItem>
            <DropdownItem
              key="meetingNotes"
              onClick={() =>
                insertTemplate(
                  `<h1 className="text-2xl font-bold mb-4">Meeting Notes</h1>
                  <p className="mb-4">Date: ${new Date().toLocaleDateString()}</p>
                  <h2 className="text-xl font-bold mb-3">Attendees</h2>
                  <ul className="list-none space-y-2">
                    <li className="ml-4">• Person 1</li>
                    <li className="ml-4">• Person 2</li>
                  </ul>
                  <h2 className="text-xl font-bold mb-3">Discussion Points</h2>
                  <ul className="list-none space-y-2">
                    <li className="ml-4">• Point 1</li>
                    <li className="ml-4">• Point 2</li>
                  </ul>`
                )
              }
            >
              Notas de Reunión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <Card className="h-full shadow-none">
          <CardHeader>Editor</CardHeader>
          <CardBody className="h-full flex">
            <textarea
              ref={editorRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFormattedText(e.target.value);
              }}
              className="h-full w-full p-2 resize-none bg-gray-100 border border-gray-300 focus:outline-none"
              placeholder="Empieza a escribir aquí..."
            />
          </CardBody>
        </Card>
        <Card className="h-full shadow-none">
          <CardHeader>Vista Previa</CardHeader>
          <CardBody className="h-full flex">
            <div
              className="prose dark:prose-invert h-full w-full p-4 border rounded-md overflow-auto shadow-sm"
              dangerouslySetInnerHTML={{ __html: formattedText }}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
