import { createSignal, Show } from 'solid-js';
import Pick from './views/Pick'
import Viewer from './views/Viewer'

const App = () => {
  const [messages, setMessages] = createSignal([])

  return (
    <Show when={messages().length > 0} fallback={<Pick setMessages={setMessages} />}>
      <Viewer messages={messages} setMessages={setMessages} />
    </Show>
  );
}

export default App;
