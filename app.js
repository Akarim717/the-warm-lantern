const app = document.querySelector('#app');
const announcer = document.querySelector('#announcer');
const SAVE_KEY = 'warm_lantern_branching_v2';

const IMAGES = Object.fromEntries(Array.from({ length: 8 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return [`scene${index + 1}`, `assets/warm-lantern/scene-${number}.jpg`];
}));

const ENDINGS = {
  discovery: { number: '01', title: 'The Discovery', theme: 'Responsible curiosity', image: IMAGES.scene1, line: 'Sometimes the smartest adventure is knowing when you have enough evidence.' },
  guardian: { number: '02', title: 'The Guardian', theme: 'Memory and responsibility', image: IMAGES.scene6, line: 'Some people guard treasure. Others guard stories.' },
  classroom: { number: '03', title: 'The Hidden Classroom', theme: 'History, resilience and remembrance', image: IMAGES.scene5, line: 'They went looking for an adventure. They found a forgotten classroom.' },
  escape: { number: '04', title: 'The Escape', theme: 'Evidence, teamwork and consequences', image: IMAGES.scene8, line: 'Curiosity got them into the cave. Thinking got them out.' },
};

const CLUES = {
  tally: { icon: '╱╱╱', title: 'Tally marks', text: 'Five lines, then five more, scratched deep into the old tunnel wall.', question: 'What was someone counting?' },
  footprint: { icon: '◖', title: 'Fresh footprint', text: 'The earth is damp and the tread is sharp. This print is recent.', question: 'Who walked beneath the school?' },
  canteen: { icon: '◒', title: 'Metal canteen', text: 'A rusty water bottle lies beside the fresh footprints.', question: 'Did it belong to the people who once hid here?' },
  bcs: { icon: 'B·C·S', title: 'B.C.S. initials', text: 'The initials are carved beside an old arrow. The carving predates the school.', question: 'Whose name do the letters hide?' },
  photograph: { icon: '▣', title: 'Wartime photograph', text: 'Several families stand at a cave entrance. A man holds an old lantern.', question: 'Were they hiding—or building something here?' },
  map: { icon: '⌁', title: 'Cave map', text: 'A hand-drawn wartime map shows a second tunnel and a ventilation passage.', question: 'Which route can still be trusted?' },
  lantern: { icon: '♢', title: 'Warm lantern', text: 'The lantern looks decades old, but its metal side is warm.', question: 'Who lit it?' },
  badge: { icon: '⬟', title: 'School badge', text: 'A clean Bukit Cempaka badge lies among objects that are decades old.', question: 'Who from the school came here recently?' },
  records: { icon: '▤', title: 'Hidden school records', text: 'Names, drawings and lessons from Sekolah Rakyat Bukit Cempaka, 1944.', question: 'How many stories are still waiting underground?' },
};

const NODES = {
  storeroom: {
    image: IMAGES.scene1, eyebrow: 'The last bell · 4.15 pm', title: 'The Storeroom', chapter: '01',
    text: ['Sekolah Kebangsaan Bukit Cempaka is almost empty. A grass cutter hums beyond the quiet field while Aman stacks plastic chairs in the oldest storeroom behind the hall.', 'Behind a wooden cupboard, he finds more than a crack. Cool air moves through a passage barely wider than his shoulders. His battered torch beam disappears into it.'],
    dialogue: [{ name: 'Aman', text: 'No way.' }], next: 'dare', continueLabel: 'Find Kumar and Mei Lin', alt: 'Aman shines an old torch into a hidden opening behind a cupboard in a Malaysian school storeroom.',
  },
  dare: {
    image: IMAGES.scene2, eyebrow: 'Outside the school gate', title: 'The Dare', chapter: '02',
    text: ['Aman finds Kumar and Mei Lin waiting to walk home. Ten minutes later, they are back inside the storeroom: Mei Lin with her father’s cracked phone, Kumar with common sense, and Aman with enough enthusiasm for all three.'],
    dialogue: [{ name: 'Aman', text: 'I found a tunnel.' }, { name: 'Kumar', text: 'You found a hole.' }, { name: 'Mei Lin', text: 'How old?' }, { name: 'Aman', text: 'Old-old.' }],
    next: 'cutaway', continueLabel: 'Move the cupboard', alt: 'Aman tells Kumar and Mei Lin about the hidden tunnel outside their Malaysian primary school.',
  },
  cutaway: {
    type: 'insert', eyebrow: 'Below Bukit Cempaka', title: 'Where does it lead?', chapter: 'Diagram 01',
    text: ['Brick gives way to earth. Earth gives way to limestone. The passage is carrying them below the school field—and towards open space.'], next: 'beneath', continueLabel: 'Crawl deeper',
  },
  beneath: {
    image: IMAGES.scene3, eyebrow: 'Beneath the school', title: 'Fresh Evidence', chapter: '03', statement: 'THE FOOTPRINT IS FRESH.',
    text: ['Cobwebs cling to their hair as old bricks become earth and limestone. Kumar finds rows of tally marks. A few metres later, Mei Lin’s phone light catches a footprint pressed into damp ground. Its tread is sharp.'],
    dialogue: [{ name: 'Kumar', text: 'Old tunnel. New footprint.' }], clues: ['tally', 'footprint'], alt: 'The three children crawl beside tally marks and a fresh footprint in an old earth tunnel.', prompt: 'What should they do?',
    choices: [
      { id: 'follow-footprints', label: 'Follow the fresh footprints', hint: 'The trail may reveal who came here.', target: 'footprints', scores: { explorer: 2 } },
      { id: 'examine-tunnel', label: 'Examine the tunnel carefully', hint: 'Understanding the evidence may be safer than rushing ahead.', target: 'investigate', scores: { investigator: 2, cautious: 1 } },
    ],
  },
  footprints: {
    image: IMAGES.scene4, eyebrow: 'Your choice · Follow the trail', title: 'Into Open Darkness', chapter: '03A',
    text: ['Aman follows quickly until Mei Lin catches his shirt and slows him down. The footprints lead to a place where the tunnel walls simply disappear. Their voices begin to echo. A vast limestone cave waits beyond the beam.'],
    dialogue: [{ name: 'Mei Lin', text: 'Slow down.' }, { name: 'Kumar', text: 'For once, that sounds like a plan.' }], next: 'cave', continueLabel: 'Enter the cave', alt: 'The children follow a fresh footprint as the tunnel opens into a limestone cave.',
  },
  investigate: {
    image: IMAGES.scene4, eyebrow: 'Your choice · Search for evidence', title: 'The Old Arrow', chapter: '03B',
    text: ['Kumar finds a rusty metal canteen near the print. Mei Lin photographs it. Then Aman spots a small arrow carved into the wall beside three letters: B.C.S. The marks look much older than Bukit Cempaka School. They follow the arrow towards an echoing cave.'],
    dialogue: [{ name: 'Mei Lin', text: 'This carving looks much older than our school.' }], clues: ['canteen', 'bcs'], next: 'cave', continueLabel: 'Follow the old arrow', alt: 'Kumar and Mei Lin inspect a rusty canteen and old initials beside a fresh footprint.',
  },
  cave: {
    image: IMAGES.scene5, eyebrow: 'The limestone cave', title: 'Old Cave. New Badge.', chapter: '04', statement: 'THE LANTERN IS WARM.',
    text: ['Their lights sweep across stalactites and the remains of a camp: a broken bed, metal boxes, letters and yellowing photographs. Mei Lin unfolds a wartime map. Kumar touches an old lantern on a stone—and jerks his hand away.'],
    dynamicText: () => chose('examine-tunnel') ? 'Because Mei Lin photographed the earlier clues, they can now see the same B.C.S. initials faintly written on the map.' : 'Without photographs from the tunnel, the faded initials on the map are too difficult to compare.',
    dialogue: [{ name: 'Kumar', text: 'It’s warm.' }], clues: ['photograph', 'map', 'lantern', 'badge'], sound: 'SCRAAAPE. Somewhere beyond the torchlight.', alt: 'Aman, Kumar and Mei Lin discover wartime objects, a cave map and a warm lantern in a limestone cave.', prompt: 'The scraping sound is closer. What should they do?',
    choices: [
      { id: 'leave-report', label: 'Leave and tell an adult', hint: 'They already have photographs, a badge and the entrance location.', target: 'discovery', scores: { cautious: 2, investigator: 1 } },
      { id: 'hide-watch', label: 'Hide and find out who is there', hint: 'Waiting may reveal the person behind the warm lantern.', target: 'hide', scores: { investigator: 1, strategist: 1 } },
      { id: 'second-tunnel-direct', label: 'Follow the second tunnel', hint: 'The map shows another route beyond the cave.', target: 'secondTunnel', scores: { explorer: 2 } },
    ],
  },
  hide: {
    image: IMAGES.scene6, eyebrow: 'Your choice · Hide and watch', title: 'The Lantern Bearer', chapter: '05B',
    text: ['The children squeeze behind a limestone formation and switch off their lights. Darkness swallows them. A dim yellow glow approaches. The figure carrying the lantern steps closer—and Kumar recognises the school caretaker.'],
    dialogue: [{ name: 'Kumar', text: 'Pak Din?' }, { name: 'Pak Din', text: 'What are YOU doing here?' }, { name: 'Aman', text: 'What are YOU doing here?' }], next: 'pakDin', continueLabel: 'Hear Pak Din’s story', alt: 'A figure carrying a warm lantern approaches the children from deep inside the cave.',
  },
  pakDin: {
    image: IMAGES.scene7, eyebrow: 'A secret kept for years', title: 'Bakar Che Soh', chapter: '06B',
    text: ['Pak Din explains that his grandfather, Bakar Che Soh, sheltered here during the Japanese occupation. He has protected the cave from damage and theft for years. Then Mei Lin shows him the clean school badge. Pak Din’s face changes.'],
    dialogue: [{ name: 'Pak Din', text: 'That isn’t mine.' }], sound: 'All four turn towards the second tunnel.', alt: 'Pak Din and the children compare a recent school badge with the old cave map.', prompt: 'What should they do now?',
    choices: [
      { id: 'leave-with-pakdin', label: 'Leave with Pak Din and report the cave', hint: 'The secret has become too dangerous for one person to keep.', target: 'guardian', scores: { cautious: 2, strategist: 1 } },
      { id: 'explore-with-pakdin', label: 'Ask Pak Din to investigate with them', hint: 'His knowledge could make the second tunnel safer.', target: 'secondTunnel', scores: { strategist: 2, investigator: 1 } },
    ],
  },
  secondTunnel: {
    image: IMAGES.scene7, eyebrow: 'The second tunnel', title: 'The Fork', chapter: '07',
    text: ['One route slopes down towards cool air. The other climbs slightly. An old arrow matches Mei Lin’s wartime map. Beside it, someone has scratched a newer symbol into the limestone.'],
    dynamicText: () => chose('explore-with-pakdin') ? 'Pak Din goes first. “No running. No touching anything. You stay behind me.”' : 'Aman raises his torch. “Five minutes.” Kumar looks unconvinced. “That’s what people always say before bad things happen.”',
    alt: 'The children study old arrows and recent markings where the second tunnel splits in two.', prompt: 'Which trail should they trust?',
    choices: [
      { id: 'old-map', label: 'Follow the old arrow', hint: 'It matches the route drawn on the wartime map.', target: 'hiddenChamber', scores: { strategist: 2, investigator: 1 } },
      { id: 'new-markings', label: 'Follow the newer markings', hint: 'Someone recent may have left a route through the cave.', target: 'collapse', scores: { explorer: 2 } },
    ],
  },
  hiddenChamber: {
    image: IMAGES.scene5, eyebrow: 'Following the old map', title: 'The Hidden Chamber', chapter: '08A',
    text: ['The narrow tunnel opens into a chamber filled with untouched wooden boxes. There are letters, photographs, old school records and a hand-painted sign: SEKOLAH RAKYAT BUKIT CEMPAKA · 1944. A cloth-wrapped book lists families, children and teachers.'], clues: ['records'], next: 'classroom', continueLabel: 'Turn the page', alt: 'The children discover old school records, photographs and boxes in a hidden wartime chamber.',
  },
  collapse: {
    image: IMAGES.scene8, eyebrow: 'Following the new markings', title: 'The Collapse', chapter: '08B', statement: 'THE WAY BACK IS GONE.',
    text: ['A crack snaps through the tunnel. The floor collapses behind them and dust fills the air. Mei Lin’s phone has no signal and nine per cent battery. Then she remembers the photographed cave map: a ventilation passage should lead towards the hill.'],
    dialogue: [{ name: 'Kumar', text: 'You said five minutes.' }, { name: 'Aman', text: 'This feels longer than five minutes.' }], sound: 'CRACK. Stone grinds into silence.', alt: 'Dust fills a limestone tunnel after a collapse blocks the children’s route back.', prompt: 'How should they find a way out?',
    choices: [
      { id: 'follow-map', label: 'Follow the map carefully', hint: 'Mei Lin can guide each turn while Kumar counts their steps.', target: 'mappedEscape', scores: { strategist: 2, cautious: 1 } },
      { id: 'follow-water', label: 'Follow the sound of water', hint: 'Running water may lead outside—or deeper underground.', target: 'waterDetour', scores: { explorer: 2 } },
    ],
  },
  mappedEscape: {
    image: IMAGES.scene8, eyebrow: 'Evidence becomes a route', title: 'Wind and Daylight', chapter: '09A',
    text: ['Mei Lin studies every turn. Kumar counts their steps. Aman marks the walls so they cannot circle back. Twenty minutes later, Kumar feels wind. They crawl towards it and emerge from bushes behind the school field—muddy, scratched, exhausted and safe.'], dialogue: [{ name: 'Aman', text: 'Next time, adults.' }], next: 'escape', continueLabel: 'Reach daylight', alt: 'The children follow a mapped ventilation route towards daylight beyond the cave.',
  },
  waterDetour: {
    image: IMAGES.scene8, eyebrow: 'A route chosen by instinct', title: 'The Underground Stream', chapter: '09B',
    text: ['The water grows louder until the tunnel ends at an underground stream. There is nowhere else to go. They retrace every step, return to the fork and finally follow Mei Lin’s photographed map. The detour costs precious phone battery—but wind and daylight eventually find them.'], next: 'escape', continueLabel: 'Climb into daylight', alt: 'The children reach an underground stream before retracing their path to the mapped exit.',
  },
  discovery: { type: 'ending', ending: 'discovery', text: ['They hurry back through the tunnel with the photographs and badge. In the headmaster’s office, nobody believes them—until Mei Lin shows the evidence. Within days, historians and officers begin investigating one of the area’s best-preserved wartime civilian shelters. The warm lantern remains unexplained.'] },
  guardian: { type: 'ending', ending: 'guardian', text: ['Pak Din tells the headmaster everything. Historians are called, and he helps document the cave his family protected. The mysterious figure was guarding a story, not hiding a threat. Yet the unexplained school badge proves that another mystery remains.'] },
  classroom: { type: 'ending', ending: 'classroom', text: ['Beneath a drawing of the cave, Mei Lin finds a message: “If this place is found, remember us.” The cave was not only a shelter—it was a secret school. The children later help create a heritage gallery, with a replica lantern at its entrance.'] },
  escape: { type: 'ending', ending: 'escape', text: ['The adventure nearly becomes a disaster. The children escape because they stop guessing and combine Mei Lin’s map, Kumar’s observations and Aman’s initiative. Somewhere beneath Bukit Cempaka, the warm lantern is still burning.'] },
};

function freshState(preserved = {}) {
  return { current: 'storeroom', visited: [], decisions: [], clues: [], history: [], endings: preserved.endings || [], reflections: preserved.reflections || {}, settings: preserved.settings || { audio: false } };
}

let state = loadState();
let activeOverlay = null;
let ambient = null;
let toastTimer = null;
renderHome();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || !NODES[saved.current]) return freshState();
    return { ...freshState(saved), ...saved, settings: { audio: false, ...(saved.settings || {}) } };
  } catch { return freshState(); }
}
function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function chose(id) { return state.decisions.some(decision => decision.id === id); }

function renderHome() {
  closeOverlay();
  const hasProgress = state.visited.length > 0 && NODES[state.current]?.type !== 'ending';
  const allEndings = state.endings.length === 4;
  app.innerHTML = `<main id="main" class="opening">
    <img class="opening-image" src="${IMAGES.scene7}" alt="Aman, Kumar and Mei Lin stand in a limestone cave with a map, school badge and old lantern." />
    <div class="opening-shade" aria-hidden="true"></div><div class="dust" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    <section class="opening-copy"><p class="eyebrow">A Malaysian choose your own adventure</p><h1>The Warm <em>Lantern</em></h1><p class="tagline">Some secrets should stay buried.<br />Others are waiting to be found.</p>
      <div class="opening-actions"><button class="primary" data-action="${hasProgress ? 'resume' : 'begin'}">${hasProgress ? 'Continue adventure' : 'Begin the adventure'} <span aria-hidden="true">→</span></button><button class="ghost" data-action="how">How to play</button>${hasProgress ? '<button class="text-button" data-action="restart">Start again</button>' : ''}</div>
    </section>
    <aside class="ending-shelf" aria-label="Ending collection"><span>${allEndings ? 'Master Explorer' : `${state.endings.length} of 4 endings`}</span><div>${Object.keys(ENDINGS).map(key => `<i class="mini-lantern ${state.endings.includes(key) ? 'lit' : ''}" title="${state.endings.includes(key) ? ENDINGS[key].title : 'Ending not yet discovered'}"></i>`).join('')}</div></aside>
    <footer>Abd Karim Alias · 2026 · CC BY</footer>
  </main>`;
  bind('[data-action="begin"]', () => { state = freshState(state); saveState(); renderNode(); });
  bind('[data-action="resume"]', renderNode);
  bind('[data-action="restart"]', () => { state = freshState(state); saveState(); renderNode(); });
  bind('[data-action="how"]', () => openOverlay('how'));
}

function renderNode() {
  closeOverlay();
  const node = NODES[state.current];
  if (!node) return renderHome();
  if (!state.visited.includes(state.current)) state.visited.push(state.current);
  (node.clues || []).forEach(clue => {
    if (!state.clues.includes(clue)) { state.clues.push(clue); window.setTimeout(() => showToast(`Clue discovered: ${CLUES[clue].title}`), 650); }
  });
  saveState();
  if (node.type === 'ending') return renderEnding(node);
  if (node.type === 'insert') return renderInsert(node);
  const dynamic = typeof node.dynamicText === 'function' ? node.dynamicText() : '';
  app.innerHTML = `<main id="main" class="story-shell">${renderTopbar()}<article class="scene">
    <figure class="scene-visual"><img src="${node.image}" alt="${escapeHtml(node.alt)}" /><figcaption><span>Illustrated scene</span><span>Scene ${escapeHtml(node.chapter)}</span></figcaption></figure>
    <section class="story-card"><header class="scene-title"><span class="eyebrow">${escapeHtml(node.eyebrow)}</span><h1>${escapeHtml(node.title)}</h1></header>
      ${node.statement ? `<div class="statement">${escapeHtml(node.statement)}</div>` : ''}
      <div class="narrative">${node.text.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${dynamic ? `<p class="consequence"><span>Earlier choice</span>${escapeHtml(dynamic)}</p>` : ''}</div>
      ${node.dialogue ? `<div class="dialogue-stack">${node.dialogue.map(line => `<blockquote><span>${escapeHtml(line.name)}</span><p>“${escapeHtml(line.text)}”</p></blockquote>`).join('')}</div>` : ''}
      ${node.sound ? `<p class="sound-caption"><span aria-hidden="true">◖ )))</span>${escapeHtml(node.sound)}</p>` : ''}
      ${node.clues?.length ? `<div class="found-clues">${node.clues.map(id => `<button data-clue="${id}"><span>${CLUES[id].icon}</span>${escapeHtml(CLUES[id].title)}</button>`).join('')}</div>` : ''}
      ${node.choices ? renderChoices(node) : `<button class="continue" data-continue>${escapeHtml(node.continueLabel || 'Continue')} <span aria-hidden="true">→</span></button>`}
    </section></article></main>`;
  bindStoryControls();
  bind('[data-continue]', () => goTo(node.next));
  app.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => choose(node, button.dataset.choice, button)));
  app.querySelectorAll('[data-clue]').forEach(button => button.addEventListener('click', () => openOverlay('clue', button.dataset.clue)));
  announce(`${node.title}. ${node.eyebrow}.`); window.scrollTo(0, 0);
}

function renderInsert(node) {
  app.innerHTML = `<main id="main" class="insert-screen">${renderTopbar()}<section class="cutaway"><span class="eyebrow">${node.eyebrow}</span><h1>${node.title}</h1>
    <div class="diagram" aria-label="Cross-section showing the storeroom above a hidden tunnel and limestone cave"><div class="diagram-school"><span>School storeroom</span><i class="fan">✣</i></div><div class="diagram-depth"><i></i><i></i><i></i></div><div class="diagram-tunnel"><span>Hidden tunnel</span></div><div class="diagram-cave"><span>Limestone cave</span><b>?</b></div></div>
    <p>${node.text[0]}</p><button class="continue compact" data-continue>${node.continueLabel} <span aria-hidden="true">→</span></button></section></main>`;
  bindStoryControls(); bind('[data-continue]', () => goTo(node.next)); announce(node.title);
}

function renderChoices(node) {
  return `<section class="decision" aria-labelledby="decision-title"><span class="decision-pause">The story pauses here</span><h2 id="decision-title">${escapeHtml(node.prompt)}</h2><div class="choice-grid">${node.choices.map((choice, index) => `<button class="choice-card" data-choice="${choice.id}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span><strong>${escapeHtml(choice.label)}</strong><small>${escapeHtml(choice.hint)}</small></span><i aria-hidden="true">→</i></button>`).join('')}</div></section>`;
}

function renderTopbar() {
  const mapUnlocked = state.visited.includes('cave');
  return `<header class="topbar"><button class="brand" data-home aria-label="Return home">The Warm <em>Lantern</em></button><nav aria-label="Adventure tools">
    <button data-panel="clues"><span aria-hidden="true">◇</span><b>Clues</b><small>${state.clues.length}</small></button>${mapUnlocked ? '<button data-panel="map"><span aria-hidden="true">⌁</span><b>Map</b></button>' : ''}<button data-panel="journey"><span aria-hidden="true">↝</span><b>Journey</b></button><button data-audio aria-pressed="${state.settings.audio}"><span aria-hidden="true">${state.settings.audio ? '◉' : '◎'}</span><b>${state.settings.audio ? 'Sound on' : 'Sound off'}</b></button><button data-back ${state.history.length ? '' : 'disabled'}><span aria-hidden="true">↶</span><b>Back</b></button>
  </nav></header>`;
}

function bindStoryControls() {
  bind('[data-home]', renderHome);
  app.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openOverlay(button.dataset.panel)));
  bind('[data-audio]', toggleAudio); bind('[data-back]', backOneStep);
}

function choose(node, id, button) {
  const choice = node.choices.find(item => item.id === id);
  if (!choice) return;
  state.history.push(runSnapshot());
  state.decisions = state.decisions.filter(decision => decision.node !== state.current);
  state.decisions.push({ node: state.current, id: choice.id, label: choice.label, target: choice.target, scores: choice.scores || {} });
  button.closest('.choice-grid').querySelectorAll('button').forEach(item => { item.disabled = true; });
  button.classList.add('selected'); playDecisionTone(); saveState();
  window.setTimeout(() => { state.current = choice.target; renderNode(); }, 520);
}
function goTo(target) { state.history.push(runSnapshot()); state.current = target; saveState(); renderNode(); }
function runSnapshot() { return { current: state.current, visited: [...state.visited], decisions: structuredClone(state.decisions), clues: [...state.clues] }; }
function backOneStep() {
  const previous = state.history.pop();
  if (!previous) return showToast('This is the first page of your route.');
  Object.assign(state, previous); saveState(); renderNode();
}

function renderEnding(node) {
  const ending = ENDINGS[node.ending];
  if (!state.endings.includes(node.ending)) state.endings.push(node.ending);
  saveState();
  const allEndings = state.endings.length === 4;
  app.innerHTML = `<main id="main" class="ending ending-${node.ending}"><img src="${ending.image}" alt="An illustrated final scene for ${ending.title}." /><div class="ending-veil"></div><section class="ending-copy">
    <span class="eyebrow">Your ending · ${ending.number} of 04</span><h1>${ending.title}</h1><p>${node.text[0]}</p><blockquote>${ending.line}</blockquote><span class="ending-theme">${ending.theme}</span>
    ${allEndings ? '<div class="master-badge"><i>✦</i><strong>Master Explorer</strong><span>The entire story map is now revealed.</span></div>' : ''}
    <div class="ending-actions"><button class="primary" data-report>See my journey <span aria-hidden="true">→</span></button><button class="ghost" data-try>Try another path</button><button class="text-button" data-home>Return home</button></div>
  </section><div class="lantern-row" aria-label="${state.endings.length} of 4 endings discovered">${Object.keys(ENDINGS).map(key => `<i class="mini-lantern ${state.endings.includes(key) ? 'lit' : ''}"></i>`).join('')}</div></main>`;
  bind('[data-report]', renderJourneyReport); bind('[data-try]', () => { state = freshState(state); saveState(); renderNode(); }); bind('[data-home]', renderHome); announce(`Your ending: ${ending.title}.`);
}

function renderJourneyReport() {
  const profile = getProfile(); const allEndings = state.endings.length === 4; const currentEnding = NODES[state.current]?.ending;
  app.innerHTML = `<main id="main" class="report"><header class="report-head"><button class="brand" data-home>The Warm <em>Lantern</em></button><span>Adventure Journey Report</span></header>
    <section class="report-hero"><span class="eyebrow">Your approach</span><h1>${profile.title}</h1><p>${profile.text}</p></section>
    <section class="report-grid"><article class="report-section route-report"><span class="eyebrow">Your route</span><h2>The choices that shaped the cave</h2><div class="route-line">${state.decisions.map((decision, index) => `<div><i>${index + 1}</i><span>${escapeHtml(decision.label)}</span></div>`).join('')}<div class="route-ending"><i>✦</i><span>${currentEnding ? ENDINGS[currentEnding].title : 'Adventure in progress'}</span></div></div></article>
    <article class="report-section clue-report"><span class="eyebrow">Evidence collected</span><h2>${state.clues.length} clues discovered</h2><div class="report-clues">${state.clues.map(id => `<button data-clue="${id}"><span>${CLUES[id].icon}</span>${escapeHtml(CLUES[id].title)}</button>`).join('')}</div></article></section>
    <section class="story-map-report"><span class="eyebrow">Branching map</span><h2>${allEndings ? 'The full story' : 'What remains in the dark'}</h2>${renderBranchMap(allEndings)}</section>
    <section class="reflection"><span class="eyebrow">Optional reflection</span><h2>What would you do?</h2>${[['hardest', 'Which decision was hardest for you?'], ['clue', 'What clue influenced your decisions the most?'], ['change', 'If you could replay one decision, would you change it?']].map(([id, label]) => `<label>${label}<textarea data-reflection="${id}" rows="2" placeholder="Write a short thought…">${escapeHtml(state.reflections[id] || '')}</textarea></label>`).join('')}<p>Your answers stay on this device.</p></section>
    <div class="report-actions"><button class="primary" data-try>Try another path <span aria-hidden="true">↻</span></button><button class="ghost" data-home>Return home</button></div></main>`;
  bind('[data-home]', renderHome); bind('[data-try]', () => { state = freshState(state); saveState(); renderNode(); });
  app.querySelectorAll('[data-clue]').forEach(button => button.addEventListener('click', () => openOverlay('clue', button.dataset.clue)));
  app.querySelectorAll('[data-reflection]').forEach(input => input.addEventListener('input', () => { state.reflections[input.dataset.reflection] = input.value; saveState(); }));
  announce('Adventure Journey Report'); window.scrollTo(0, 0);
}

function renderBranchMap(revealAll) {
  const route = (id, text) => `<span class="${chose(id) ? 'taken' : ''}">${chose(id) || revealAll ? text : '???'}</span>`;
  const ending = key => `<span class="ending-node ${state.endings.includes(key) ? 'taken' : ''}">🏮 ${state.endings.includes(key) || revealAll ? ENDINGS[key].title : '???'}</span>`;
  return `<div class="branch-map">
    <div class="branch-root">Storeroom → Fresh footprint</div>
    <div class="branch-pair">${route('follow-footprints', 'Follow prints')}${route('examine-tunnel', 'Examine clues')}</div>
    <div class="branch-root">Warm lantern + school badge</div>
    <div class="branch-trio">${route('leave-report', 'Leave and report')}${route('hide-watch', 'Hide and watch')}${route('second-tunnel-direct', 'Enter second tunnel')}</div>
    <div class="branch-split"><div>${ending('discovery')}</div><div class="branch-column"><small>Pak Din revealed</small><div class="branch-pair">${route('leave-with-pakdin', 'Report with Pak Din')}${route('explore-with-pakdin', 'Explore with Pak Din')}</div>${ending('guardian')}</div><div><small>Second tunnel</small></div></div>
    <div class="branch-root">The tunnel fork</div>
    <div class="branch-pair">${route('old-map', 'Follow old map')}${route('new-markings', 'Follow new markings')}</div>
    <div class="branch-pair"><div>${ending('classroom')}</div><div class="branch-column"><small>Tunnel collapse</small><div class="branch-pair">${route('follow-map', 'Trust the map')}${route('follow-water', 'Follow water')}</div>${ending('escape')}</div></div>
  </div>`;
}

function getProfile() {
  const totals = { investigator: 0, explorer: 0, strategist: 0, cautious: 0 };
  state.decisions.forEach(decision => Object.entries(decision.scores || {}).forEach(([key, value]) => { totals[key] += value; }));
  const key = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  return {
    investigator: { title: 'The Investigator', text: 'You preferred gathering evidence and asking what each clue could prove before acting.' },
    explorer: { title: 'The Explorer', text: 'You were willing to enter unknown places to discover what the darkness was hiding.' },
    strategist: { title: 'The Strategist', text: 'You relied on maps, patterns and careful observation to choose your route.' },
    cautious: { title: 'The Cautious Adventurer', text: 'You balanced curiosity with safety and knew when evidence was enough.' },
  }[key];
}

function openOverlay(type, clueId) {
  closeOverlay();
  const content = {
    how: { eyebrow: 'How to play', title: 'Enter the mystery', body: `<div class="how-list"><p><i>01</i><span><strong>Read one short scene at a time.</strong>The story pauses completely when your decision matters.</span></p><p><i>02</i><span><strong>Choose the path you believe in.</strong>Every decision changes a clue, consequence, scene or ending.</span></p><p><i>03</i><span><strong>Use your case tools.</strong>Review clues, reveal the cave map and retrace your journey.</span></p><p><i>04</i><span><strong>Find four endings.</strong>Undiscovered routes stay hidden until you explore them.</span></p></div>` },
    clues: { eyebrow: 'Evidence drawer', title: 'Clues', body: state.clues.length ? `<div class="clue-drawer">${state.clues.map(id => `<button data-drawer-clue="${id}"><span>${CLUES[id].icon}</span><strong>${escapeHtml(CLUES[id].title)}</strong><small>Inspect clue →</small></button>`).join('')}</div>` : '<p class="empty">The first clue is still somewhere in the dark.</p>' },
    map: { eyebrow: 'Mei Lin’s cave map', title: 'Explored ground', body: renderCaveMap() },
    journey: { eyebrow: 'Your route so far', title: 'Journey', body: state.decisions.length ? `<div class="journey-drawer">${state.decisions.map((decision, index) => `<p><i>${String(index + 1).padStart(2, '0')}</i><span>${escapeHtml(decision.label)}</span></p>`).join('')}</div>` : '<p class="empty">Your first major decision is still ahead.</p>' },
    clue: cluePanel(clueId),
  }[type];
  if (!content) return;
  const wrapper = document.createElement('div'); wrapper.className = 'overlay'; wrapper.setAttribute('role', 'dialog'); wrapper.setAttribute('aria-modal', 'true'); wrapper.setAttribute('aria-label', content.title);
  wrapper.innerHTML = `<button class="overlay-backdrop" data-close aria-label="Close"></button><section class="drawer"><button class="drawer-close" data-close>Close <span aria-hidden="true">×</span></button><header><span class="eyebrow">${content.eyebrow}</span><h2>${content.title}</h2></header>${content.body}</section>`;
  document.body.append(wrapper); activeOverlay = wrapper;
  wrapper.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', closeOverlay));
  wrapper.querySelectorAll('[data-drawer-clue]').forEach(button => button.addEventListener('click', () => openOverlay('clue', button.dataset.drawerClue)));
  wrapper.querySelector('.drawer-close').focus(); document.addEventListener('keydown', overlayKeys);
}

function cluePanel(id) {
  const clue = CLUES[id];
  if (!clue || !state.clues.includes(id)) return { eyebrow: 'Evidence', title: 'Not yet discovered', body: '<p class="empty">This clue is still hidden.</p>' };
  return { eyebrow: 'Inspect evidence', title: clue.title, body: `<div class="clue-focus"><div>${clue.icon}</div><p>${escapeHtml(clue.text)}</p><blockquote><span>Question</span>${escapeHtml(clue.question)}</blockquote></div>` };
}

function renderCaveMap() {
  const locations = [['Storeroom', true], ['Main tunnel', true], ['Cave', state.visited.includes('cave')], ['Second tunnel', state.visited.includes('secondTunnel')], ['Hidden chamber', state.visited.includes('hiddenChamber')], ['Ventilation passage', state.visited.includes('mappedEscape') || state.visited.includes('waterDetour')]];
  return `<div class="cave-map"><svg viewBox="0 0 480 360" role="img" aria-label="Hand-drawn map of explored and unknown cave locations"><path d="M70 54 C128 54 107 126 175 129 S218 216 276 204 S339 263 412 277"/><path d="M276 204 C318 169 352 144 418 146"/><path d="M175 129 C224 93 265 80 330 94"/></svg>${locations.map(([name, open], index) => `<span class="map-point point-${index + 1} ${open ? 'open' : ''}">${open ? name : 'Unknown'}</span>`).join('')}</div>`;
}

function closeOverlay() { if (!activeOverlay) return; activeOverlay.remove(); activeOverlay = null; document.removeEventListener('keydown', overlayKeys); }
function overlayKeys(event) {
  if (event.key === 'Escape') closeOverlay();
  if (event.key !== 'Tab' || !activeOverlay) return;
  const focusable = [...activeOverlay.querySelectorAll('button, [href], textarea, [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled);
  if (!focusable.length) return;
  if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
  if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
}

function toggleAudio() {
  state.settings.audio = !state.settings.audio; saveState();
  if (state.settings.audio) { startAmbient(); showToast('Quiet cave ambience on.'); }
  else { stopAmbient(); showToast('Sound off. Important sounds remain captioned.'); }
  renderNode();
}
function startAmbient() {
  if (ambient) return; const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
  const context = new AudioContext(); const gain = context.createGain(); const low = context.createOscillator(); const high = context.createOscillator();
  gain.gain.value = 0.012; low.type = 'sine'; low.frequency.value = 54; high.type = 'sine'; high.frequency.value = 81;
  low.connect(gain); high.connect(gain); gain.connect(context.destination); low.start(); high.start(); ambient = { context, low, high };
}
function stopAmbient() { if (!ambient) return; ambient.low.stop(); ambient.high.stop(); ambient.context.close(); ambient = null; }
function playDecisionTone() {
  if (!state.settings.audio) return; const context = ambient?.context; if (!context) return;
  const tone = context.createOscillator(); const gain = context.createGain(); tone.frequency.value = 196; tone.type = 'sine';
  gain.gain.setValueAtTime(0.025, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35); tone.connect(gain); gain.connect(context.destination); tone.start(); tone.stop(context.currentTime + 0.36);
}

function showToast(message) {
  document.querySelector('.toast')?.remove(); window.clearTimeout(toastTimer);
  const toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.textContent = message; document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add('show')); toastTimer = window.setTimeout(() => toast.remove(), 3200);
}
function bind(selector, handler) { app.querySelector(selector)?.addEventListener('click', handler); }
function announce(message) { announcer.textContent = ''; requestAnimationFrame(() => { announcer.textContent = message; }); }
function escapeHtml(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
