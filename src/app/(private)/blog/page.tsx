"use client";

import RichTextEditor from "@/components/common/rick-test/contentEditable";
import { useState } from "react";


export default function BlogPage() {
    const [content, setContent] = useState('');
    return (
        <div><RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Yazınızı girin..."
/></div>
    )
}

