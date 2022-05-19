import { FaSolidUpload, FaCheckCircle } from 'solid-icons/fa';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { parseString } from 'whatsapp-chat-parser';

const Pick = (props) => {
  const fr = new FileReader()
  const [filename, setFilename] = createSignal('')
  const [parsing, setParsing] = createSignal(false)

  let input

  const processFile = () => {
    setParsing(true)
    fr.readAsText(input.files[0])
  }

  const parseFile = async () => {
    const text = fr.result
    props.setMessages(await parseString(text))
    setParsing(false)
  }

  onMount(() => {
    fr.onload = parseFile
  })

  onCleanup(() => {
    fr.onload = null
  })

  return (
    <section class='hero is-primary is-fullheight'>
      <div class='hero-body'>
        <div class='container'>
          <p class='title'>Whatsapp Export Viewer</p>
          <div class='field'>
            <div class='control'>
              <div class='file is-boxed is-success has-name'>
                <label class='file-label'>
                  <input ref={input} class='file-input' accept='text/plain' type='file' onChange={e => setFilename(e.target.files[0].name)} />
                  <span class='file-cta'>
                    <span class='file-icon'>
                      <FaSolidUpload />
                    </span>
                    <span class='file-label'>Choose a valid txt</span>
                  </span>
                  <span id='file-name' class='file-name'>
                    {filename() || 'No file selected'}
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class='field'>
            <div class='control'>
              <button onClick={processFile} class='button is-success' classList={{'is-loading': parsing()}}>
                <span class="icon">
                  <FaCheckCircle />
                </span>
                <span>Go</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pick;
