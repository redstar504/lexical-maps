import './style.css'
import { FcGlobe } from 'react-icons/fc'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './ToolbarPlugin'
import { useState } from 'react'
import MapModal from './MapModal.tsx'
import MapsPlugin from './MapsPlugin'
import { MapNode } from './MapsPlugin/MapNode.tsx'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { FaGithub } from 'react-icons/fa'
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin'

function App() {
  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false)

  const initialConfig = {
    namespace: 'Maps',
    nodes: [
      AutoLinkNode,
      LinkNode,
      MapNode,
    ],
    onError: (error: Error) => {
      throw error
    },
    theme: {
      text: {
        bold: 'editor_textBold',
        italic: 'editor_textItalic',
        underline: 'editor_textUnderline',
      },
      map: 'editor_map',
    },
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div id="container">
        <section>
          <h1><FcGlobe />Lexical Maps</h1>
          <p>
            <i>Lexical Maps</i> gives you the ability to insert maps into your Lexical editor using React. Using a
            shortcode, or the toolbar button,
            you can quickly add an interactive map widget to your document. The implementation uses MapBox's GL
            library.
          </p>
        </section>

        <section>
          <h2>Try it out</h2>
          <div id="composerWrapper">
            <ToolbarPlugin onOpenMapModal={() => setIsMapsModalOpen(true)} />
            <MapsPlugin />
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
            <NodeEventPlugin
              nodeType={MapNode}
              eventType={'dblclick'}
              eventListener={() => {
                setIsMapsModalOpen(true)
              }}
            />
          </div>
          <div id="issueReporter">
            <FaGithub />
            <div>
              Found a bug? Please <a href="https://github.com/redstar504/lexical-anchorpoint/issues/new">open an
              issue</a> on Github.
            </div>
          </div>
        </section>

        <section>
          <h2>Installation Instructions</h2>
          <p>The plugin is a WIP and installation instructions are coming soon.</p>
        </section>

        <section>
          <h2>Other Plugins</h2>
          <p>The author has developed other plugins for Lexical framework you should check out.</p>
          <ul>
            <li>
              <IoIosArrowDroprightCircle />
              <a href="https://redstar504.github.io/lexical-anchorpoint/">Lexical AnchorPoint</a> - a revision of the
              built in AutoLink plugin with improvements on URL matching.
            </li>
          </ul>
        </section>
      </div>
      {isMapsModalOpen && <MapModal onClose={() => setIsMapsModalOpen(false)} />}
    </LexicalComposer>
  )
}

export default App
