import { createSignal, For, onCleanup, onMount } from 'solid-js';
import type { Message } from 'whatsapp-chat-parser';
import store from '../store';

const Viewer = () => {
  const [shownMessages, setShownMessages] = createSignal([] as Message[]);
  const [participants, setParticipants] = createSignal([] as string[]);
  const [active, setActive] = createSignal('');
  const messages = store[0];
  let count = 0;
  let date = '';

  const displayMessages = (num = -1) => {
    if (num === -1) {
      count += 30;
    } else {
      count = num;
    }

    if (count > messages.length) {
      count = messages.length;
    }
    setShownMessages(messages.slice(0, count));
  };

  const handleParticipants = () => {
    let tempParticipants = [] as string[];
    messages.map((message) => {
      if (message.author && message.author !== 'System' && !tempParticipants.includes(message.author)) {
        tempParticipants.push(message.author);
      }
    });
    setParticipants(tempParticipants);
  };

  // Check if last message was also made by the same author
  const isChained = (index: number) => {
    const last = index - 1;
    return (
      last >= 0 &&
      shownMessages()[index].author === shownMessages()[last].author
    );
  };

  // Check if the author is the active user (the one writing)
  const isPrimary = (author: string | null) => {
    return author === active();
  };

  const parseDate = (date: Date) => {
    const userLang = navigator.language;
    return date.toLocaleString(userLang, {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const viewAll = () => {
    setShownMessages(messages);
  };

  const enableScroll = () => {
    window.onscroll = () => {
      const bottomOfWindow =
        window.scrollY + window.innerHeight >=
        document.body.offsetHeight - 1000;
      if (bottomOfWindow) {
        displayMessages();
      }
    };
  };

  const scrollToMessage = (index: number) => {
    const msg = document.getElementById(`message${index}`);
    if (msg) {
      console.log(`Scrolling to message ${index}`);
      msg.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      console.error(`Message ${index} does not exist`);
    }
  };

  const searchByDate = () => {
    const messageIndex = messages.findIndex((message) => {
      return message.date.toDateString() === new Date(date).toDateString();
    });
    if (messageIndex !== -1) {
      if (!document.getElementById(`message${messageIndex}`)) {
        // Render all messages until reaching the message found + 30
        displayMessages(messageIndex + 30);
      }
      scrollToMessage(messageIndex);
    } else {
      alert('No message found');
    }
  };

  onMount(() => {
    displayMessages();
    enableScroll();
  });

  onCleanup(() => {
    window.onscroll = null;
  });

  // Set participants and set first one as active
  handleParticipants();
  setActive(participants()[0]);

  return (
    <section id='wrapper' class='section'>
      <div class='columns is-mobile is-vcentered is-multiline'>
        <div class='column is-narrow'>
          <div class='field has-addons'>
            <div class='control'>
              <input
                onChange={(e) => (date = e.target.value)}
                value={date}
                class='input'
                type='date'
              />
            </div>
            <div class='control'>
              <button onClick={searchByDate} class='button is-info'>
                Search
              </button>
            </div>
          </div>
        </div>
        <div class='column is-narrow'>
          <div class='field'>
            <label class='label'>Active participant</label>
            <div class='control'>
              <div class='select'>
                <select onChange={(e) => setActive(e.target.value)}>
                  <For each={participants()}>
                    {(participant) => (
                      <option
                        value={participant}
                        selected={active() === participant}
                      >
                        {participant}
                      </option>
                    )}
                  </For>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class='column is-narrow'>
          <div class='buttons'>
            <button onClick={viewAll} class='button is-danger'>
              Show all messages
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div id='wa-container' class='wa-container'>
        <For each={shownMessages()}>
          {(message, i) => (
            <div id={'message' + i()} class='msg'>
              <div
                class='bubble'
                classList={{
                  alt: isPrimary(message.author) && !isChained(i()),
                  follow: isChained(i()) && !isPrimary(message.author),
                  altfollow: isPrimary(message.author) && isChained(i()),
                }}
              >
                <div class='txt'>
                  {!isChained(i()) && <p class='name'>{message.author}</p>}
                  <span class='timestamp'>{parseDate(message.date)}</span>
                  <p class='message' classList={{ follow: isChained(i()) }}>
                    {message.message}
                  </p>
                </div>
                {!isChained(i()) && (
                  <div
                    class='bubble-arrow'
                    classList={{ alt: isPrimary(message.author) }}
                  ></div>
                )}
              </div>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};

export default Viewer;
