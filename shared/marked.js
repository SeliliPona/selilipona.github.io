/*
    legend for custom Markdown (in LuaCATS format):

    @class blocks block[]

    @class block string[]

    each string is a line. these lines use some custom Markdown features:

    - bold text: **bold**
    - italic text: *italic*
    - underlined text: __underlined__
    - strikethrough: ~~strike~~
    - small text: _small_
    - code block: `code`
    - colored text: <#CCAAFF>{colored text}
    - ruby text: <日>[に]<本>[ほん]<語>[ご]
    - superscript: 2^8^
    - subscript: H~2~O
    - font family: [fredoka]{new font}

    - hyperlink: [text](https://example.com)
    - pre-defined function: [text](action:action_name)
    - romanization: {セリリ}[Selili]
    - translation: {hola}(hello)
    - romanization+translation: {こんにちは}[kon'nichiwa](hello)
    - emote: :name:
    - time: %T(timestamp?)[dayjs format?]{tz timezone?}
    - FA icon: ;brands github;
*/

// @param text string|string[] if a string, is treated as an array containing it
// @param list boolean? treat text as ul if true, or ol if false
// @param levels integer? how many lists deep we are
// @return string html
let _parse = function(text, levels) {
  console.log(`called parse with text:`, text)
  if (typeof text === 'string') text = [text];
  const lines = [];
  text.forEach(line => {
    if (typeof line == "object") {
      line = _parse(line, levels+1);
    }
    if (levels > 0) line = "\t".repeat(levels)+line;
    // this is for linguistics specified to be Sitelen Pona
    line = line.replace(/%S\{/, "{");
    console.log(`adding line at level ${levels}`, line)
    lines.push(line);
  })

  return lines.join("\n");
}
function parse(text) {
  return marked.parse(_parse(text, 0));
}

function updateTimes() {
  const nows = document.querySelectorAll('.time, .now');
  const now = dayjs.utc();
  if (nows) nows.forEach((time => {
    time.textContent = now.tz(time.getAttribute('data-timezone') || dayjs.tz.guess()).format(time.getAttribute('data-format'));
  }))
}

var timerStart = false;

const customPlugs = {
  // Plug for {text}[rom](trans)
  renderLinguistic: (text, roman, trans) => {
    let html = `<span class="tl"`;
    if (roman) html += ` data-roman="${roman}"`;
    if (trans) html += ` data-trans="${trans}"`;
    return html + `>${text}</span>`;
  },
  // Plug for :emote:
  renderEmote: (name) => {
    return `<img src="/assets/emotes/${name}.webp" alt="${name}" class="emote" />`;
  },
  renderTime: (timestamp, format, timezone) => {
    if (!timerStart && !timestamp) {
      setInterval(updateTimes, 1000);
      timerStart = true;
    }
    return `<span class="time${timestamp ? '' : ' now'}" data-format="${format}" data-timestamp="${timestamp}" data-timezone="${timezone || dayjs.tz.guess()}">${(timestamp ? dayjs(timestamp).utc() : dayjs.utc()).tz(timezone || dayjs.tz.guess()).format(format)}</span>`;
  }
};

// --- EXTENSION DEFINITIONS ---
marked.use({
  extensions: [
    {
      name: 'time',
      level: 'inline',
      start(src) { return src.indexOf('%T')},
      tokenizer(src) {
        const match = /^%T\(((?:[^\)])+)?\)\[((?:[^\]])+)?\]\{((?:[^\}])+)?\}/.exec(src);
        if (match) return {
          type: 'time',
          raw: match[0],
          timestamp: match[1] || null,
          format: match[2] || null,
          timezone: match[3] || null
        }
      },
      renderer(token) { return customPlugs.renderTime(token.timestamp, token.format, token.timezone) }
    },
    // 1. Underline: __text__ (Overriding default bold)
    {
      name: 'underline',
      level: 'inline',
      start(src) { return src.indexOf('__'); },
      tokenizer(src) {
        const match = /^__((?:.|\n)+?)__/.exec(src);
        if (match) return {
          type: 'underline',
          raw: match[0],
          tokens: this.lexer.inlineTokens(match[1])  };
      },
      renderer(token) { return `<u>${this.parser.parseInline(token.tokens)}</u>`; }
    },
    // 2. Small Text: _text_ (Overriding default italic)
    {
      name: 'smallText',
      level: 'inline',
      start(src) { return src.indexOf('_'); },
      tokenizer(src) {
        const match = /^_(?!_)(.+?)_/.exec(src);
        if (match) return {
            type: 'smallText',
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1]) };
      },
      renderer(token) {
    // Use this.parser.parseInline to render the child tokens
        return `<small>${this.parser.parseInline(token.tokens)}</small>`;
    }
    },
    // 3. Linguistic: {text}[rom](trans) or variations
    {
      name: 'linguistic',
      level: 'inline',
      start(src) { return src.indexOf('{'); },
      tokenizer(src) {
        const match = /^\{([^}]+)\}(?:\[([^\]]+)\])?(?:\(([^)]+)\))?/.exec(src);
        if (match) {
          return {
            type: 'linguistic',
            raw: match[0],
            text: match[1],
            roman: match[2] || null,
            trans: match[3] || null,
            tokens: this.lexer.inlineTokens(match[1])
          };
        }
      },
      renderer(token) {
        const innerHtml = this.parser.parseInline(token.tokens);
        return customPlugs.renderLinguistic(innerHtml, token.roman, token.trans);
      }
    },
    // 4. Colored Text: <#HEX>{text}
    {
      name: 'coloredText',
      level: 'inline',
      start(src) { return src.indexOf('<#'); },
      tokenizer(src) {
        const match = /^<(#(?:[0-9a-fA-F]{3}){1,2})>\{([^}]+)\}/.exec(src);
        if (match) return {
          type: 'coloredText',
          raw: match[0],
          color: match[1],
          text: match[2]
        };
      },
      renderer(token) { return `<span style="color: ${token.color}">${this.parser.parseInline(token.text)}</span>`; }
    },
    // 5. Font Family: [font]{text}
    {
      name: 'fontFamily',
      level: 'inline',
      start(src) { return src.indexOf('['); },
      tokenizer(src) {
        const match = /^\[([^\]]+)\]\{([^}]+)\}/.exec(src);
        if (match) return {
            type: 'fontFamily',
            raw: match[0],
            font: match[1],
            text: match[2],
            tokens: this.lexer.inlineTokens(match[2])
        };
      },
      renderer(token) {
        console.log(token)
        const innerHtml = this.parser.parseInline(token.tokens)
        return `<span style="font-family: '${token.font}', sans-serif">${innerHtml}</span>`; }
    },
    // 6. Ruby Text: <base>[ruby]
    {
      name: 'rubyText',
      level: 'inline',
      start(src) { return src.indexOf('<'); },
      tokenizer(src) {
        const match = /^(?:<([^>]+)>\[([^\]]+)\])+/.exec(src);
        if (match) {
          const fullRaw = match[0];
          const rubyItems = [];
          const itemRegex = /<([^>]+)>\[([^\]]+)\]/g;
          let itemMatch;
          while ((itemMatch = itemRegex.exec(fullRaw)) !== null) {
            rubyItems.push({ base: itemMatch[1], char: itemMatch[2] });
          }
          return {
            type: 'rubyText',
            raw: fullRaw,
            items: rubyItems };
        }
      },
      renderer(token) {
        return `<ruby>${token.items.map(i => `${i.base}<rt>${i.char}</rt>`).join('')}</ruby>`;
      }
    },
    // 7. Emotes: :name:
    {
      name: 'emote',
      level: 'inline',
      start(src) { return src.indexOf(':'); },
      tokenizer(src) {
        const match = /^:([a-zA-Z0-9_\-]+):/.exec(src);
        if (match) return {
            type: 'emote',
            raw: match[0],
            name: match[1]
        };
      },
      renderer(token) { return customPlugs.renderEmote(token.name); }
    },
    // 8. Superscript: ^text^
    {
      name: 'sup',
      level: 'inline',
      start(src) { return src.indexOf('^'); },
      tokenizer(src) {
        const match = /^\^([^\^]+)\^/.exec(src);
        if (match) return {
            type: 'sup',
            raw: match[0],
            text: match[1],
            tokens: this.lexer.inlineTokens(match[1])
        };
      },
      renderer(token) { return `<sup>${this.parser.parseInline(token.tokens)}</sup>`; }
    },
    // 9. Subscript: ~text~
    {
      name: 'sub',
      level: 'inline',
      start(src) { return src.indexOf('~'); },
      tokenizer(src) {
        const match = /^~([^~]+)~/.exec(src);
        if (match) return { type: 'sub', raw: match[0], text: match[1] };
      },
      renderer(token) { return `<sub>${this.parser.parseInline(token.tokens)}</sub>`; }
    },
    // 10. FontAwesome Icon: ;icon name;
    {
        name: 'fontawesome',
        level: 'inline',
        start(src) { return src.indexOf(';'); },
        tokenizer(src) {
            const match = /^;([a-z\- ]+);/.exec(src);
            if (match) {
            return {
                type: 'fontawesome',
                raw: match[0],
                icon: match[1] // e.g., "solid volume-high"
            };
            }
        },
        renderer(token) {
            // Generates <i class="fa-solid fa-volume-high"></i>
            // We split by space to ensure "solid" becomes "fa-solid" and "volume" becomes "fa-volume"
            const classes = token.icon.split(' ').map(c => c.includes('fa-') ? c : `fa-${c}`).join(' ');
            return `<i class="${classes}" aria-hidden="true"></i>`;
        }
        },
        // 11. Interactive JS "Links"
        {
            name: 'actionLink',
            level: 'inline',
            start(src) { return src.indexOf('['); },
            tokenizer(src) {
                // Look for [text](action:something)
                const match = /^\[([^\]]+)\]\(action:([a-zA-Z0-9_]+)\)/.exec(src);
                if (match) {
                return {
                    type: 'actionLink',
                    raw: match[0],
                    text: match[1],
                    action: match[2],
                    tokens: this.lexer.inlineTokens(match[1])
                };
                }
            },
            renderer(token) {
                // We use a data-attribute instead of an inline 'onclick' for better security
                const innerHtml = this.parser.parseInline(token.tokens);
                return `<a href="#" class="action-link" data-action="${token.action}" onclick="handleMarkdownAction(event, '${token.action}')">${innerHtml}</a>`;
            }
            }
  ],
  breaks: true
});

window.handleMarkdownAction = (event, actionName) => {
  event.preventDefault(); // Stop the page from jumping
  
  const actions = {
    playAudio: () => seliliAudio.play()
  };

  if (actions[actionName]) {
    actions[actionName]();
  } else {
    console.warn(`Action "${actionName}" is not defined.`);
  }
};