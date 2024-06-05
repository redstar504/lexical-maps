import './style.css'
import { FcGlobe } from 'react-icons/fc'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './ToolbarPlugin'

function App() {
  const initialConfig = {
    namespace: 'AnchorPoint',
    nodes: [
      AutoLinkNode,
      LinkNode,
    ],
    onError: (error: Error) => {
      throw error
    },
  }

  return (
    <div id="container">
      <section>
        <h1><FcGlobe />Lexical Maps</h1>
        <p>Lexical Maps gives you the ability to insert maps into your editor. Using a shortcode or a button on the toolbar, you can
        quickly add an interactive map widget to your document.  The implementation uses MapBox's javascript gl library.</p>
      </section>

      <section>
        <h2>Try it out</h2>
        <div id="composerWrapper">
          <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <div id="editorContainer">
              <RichTextPlugin
                contentEditable={
                  <div id="editor">
                    <ContentEditable id="contentEditable" />
                  </div>
                }
                placeholder={
                  <div id="editorPlaceholder">Type, paste, or embed URLs in some text...</div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
          </LexicalComposer>
        </div>
      </section>
    </div>
  )
}

export default App
