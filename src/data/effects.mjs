import { initMagneticButton, initDisclosure, initRippleButton } from '../lib/interactions.js';

export const effects = [
  {
    slug: 'magnetic-button', name: 'Magnetic Button', component: 'MagneticButton',
    title: 'Magnetic Button Animation with CSS, JavaScript & React',
    description: 'Build a magnetic button that follows the pointer. Try the live demo and copy complete HTML, CSS, JavaScript, or React code with reduced-motion support.',
    summary: 'A button follows the pointer inside a padded hover zone, then settles back to its center.',
    method: 'Pointer tracking + CSS easing', category: 'Buttons', init: initMagneticButton,
    html: `<div class="magnetic-example">
  <div class="magnetic-zone">
    <button class="magnetic-button" type="button">Hover near me</button>
  </div>
</div>`,
    css: `.magnetic-example { display: grid; place-items: center; }
.magnetic-zone { display: grid; place-items: center; padding: 36px; }
.magnetic-button {
  padding: 14px 24px; border: 1px solid #ff8a00; border-radius: 999px;
  background: #ff8a00; color: #0e0e10; font: 600 16px/1.4 system-ui;
  cursor: pointer; transition: transform 220ms cubic-bezier(.34, 1.56, .64, 1);
}
.magnetic-button:focus-visible { outline: 3px solid #5b8def; outline-offset: 5px; }
@media (prefers-reduced-motion: reduce) {
  .magnetic-button { transition: none; transform: none !important; }
}`,
    explanation: 'The pointer moves inside a zone larger than the button. JavaScript measures that zone and translates the button toward the pointer. Measuring the stationary zone avoids feedback from the moving button. CSS supplies the return easing; this is a spring-like curve, not a continuously integrated physics spring.',
    steps: ['Copy the HTML and CSS into your page.', 'Run the JavaScript after the markup exists, or load it with defer.', 'Move a mouse or pen inside the padded zone. Leave the zone to reset the button.'],
    tuning: [{ name: 'Pull', text: 'Change the 0.2 multiplier to control how closely the button follows the pointer. Keep the translation limits so the target remains easy to click.' }, { name: 'Return', text: 'Change the 220ms transition and cubic-bezier curve to adjust the settling motion. Increasing duration does not add physical velocity continuity.' }],
    accessibility: 'The control remains a native button with a visible keyboard focus ring. Touch users get a stationary button. Reduced-motion users get the same usable control without pointer-following movement, including when their preference changes while the page is open.',
    limitation: 'A true pointer-following magnet needs JavaScript. Add your own button action in the application; the preview does not submit a form or navigate. Use a live spring integrator if you need velocity to carry through interruptions.',
    prompt: 'Build an accessible magnetic button using a native button inside a padded pointer zone. Measure the stationary zone, clamp pointer offsets, and ease the button back on pointer leave. Disable the motion for touch and prefers-reduced-motion. Include complete HTML, CSS, JavaScript, and a React component with event cleanup.'
  },
  {
    slug: 'accordion-spring', name: 'Accordion Spring', component: 'SpringAccordion',
    title: 'Spring-Like Accordion Animation in CSS & React',
    description: 'Create an animated accordion with complete HTML, CSS, JavaScript, and React examples. Includes keyboard controls, dynamic-height content, and reduced motion.',
    summary: 'An accordion opens with a soft height transition while keeping its disclosure state accessible.',
    method: 'CSS grid height transition', category: 'Disclosure', init: initDisclosure,
    html: `<div class="accordion-example">
  <h3 class="accordion-heading">
    <button type="button" data-disclosure aria-expanded="false" aria-controls="spring-answer">
      How does this accordion work?<span aria-hidden="true">+</span>
    </button>
  </h3>
  <div id="spring-answer" class="accordion-panel" data-panel aria-hidden="true" inert>
    <div><p>A grid row grows from zero to its content height. The button exposes the open state, and the panel stays out of the focus order while closed.</p></div>
  </div>
</div>`,
    css: `.accordion-example { width: 100%; max-width: 420px; border: 1px solid #54545b; border-radius: 14px; background: #1a1a1d; color: #ede9e0; }
.accordion-heading { margin: 0; font: inherit; }
.accordion-heading button { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 18px; border: 0; border-radius: 14px; background: transparent; color: inherit; font: 600 15px/1.5 system-ui; text-align: left; cursor: pointer; }
.accordion-heading button:focus-visible { outline: 3px solid #5b8def; outline-offset: 3px; }
.accordion-heading span { color: #ff8a00; font-size: 24px; transition: transform 350ms ease; }
.accordion-heading button[aria-expanded="true"] span { transform: rotate(45deg); }
.accordion-panel { display: grid; grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows 350ms cubic-bezier(.16, 1, .3, 1), visibility 350ms; }
.accordion-panel[aria-hidden="false"] { grid-template-rows: 1fr; visibility: visible; }
.accordion-panel > div { min-height: 0; overflow: hidden; }
.accordion-panel p { margin: 0; padding: 0 18px 18px; color: #bdbbb5; font: 15px/1.7 system-ui; }
@media (prefers-reduced-motion: reduce) {
  .accordion-panel, .accordion-heading span { transition: none; }
}`,
    explanation: 'A native button controls a panel through aria-expanded and aria-controls. The panel uses a grid track that grows from 0fr to 1fr, so the open height follows its content without a hard-coded max-height. The inner wrapper needs min-height: 0 and overflow: hidden so the closed row can collapse.',
    steps: ['Copy the markup and styles. Keep each button and panel ID pair unique if you add more accordions.', 'Run the JavaScript once for each accordion root after the markup exists.', 'Activate the button with a click, Enter, or Space. The script updates both the visible and accessible state.'],
    tuning: [{ name: 'Timing', text: 'The 350ms curve settles quickly without height overshoot. A grid track cannot grow below zero, so a literal bouncing curve is often less useful here than a smooth return.' }, { name: 'Content', text: 'Replace the paragraph with your answer or content. Preserve the inner wrapper. The open row follows changes in content height without measuring scrollHeight.' }],
    accessibility: 'The heading contains a native button. The script updates aria-expanded, aria-hidden, and inert together. Links or fields inside a closed panel cannot receive focus. Reduced-motion users get an immediate state change. Focus stays on the disclosure button.',
    limitation: 'This is a CSS easing transition, not a live spring simulation. Animating grid track size does layout work; use it for small disclosure panels and check long or complex content on slower devices. This custom example needs JavaScript to open; use native details if you need disclosure without JavaScript.',
    prompt: 'Build an accessible accordion with a native button, unique aria-controls ID, aria-expanded, and an inert closed panel. Animate a CSS grid row from 0fr to 1fr with a min-height: 0 inner wrapper. Respect reduced motion and clean up click listeners in React.'
  },
  {
    slug: 'switch-spring', name: 'Switch Spring', component: 'SpringSwitch',
    title: 'Spring Toggle Switch Animation with CSS & React',
    description: 'Build a spring-like toggle switch with a native checkbox and CSS. Copy a complete dependency-free example or React component, including focus and reduced-motion styles.',
    summary: 'A native checkbox moves its thumb along a spring-like easing curve. No animation JavaScript is needed.',
    method: 'CSS-only checkbox transition', category: 'Forms', init: null,
    html: `<div class="switch-example">
  <label class="spring-switch">
    <input type="checkbox" />
    <span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
    <span>Enable notifications</span>
  </label>
</div>`,
    css: `.spring-switch { position: relative; display: inline-flex; align-items: center; gap: 14px; min-height: 48px; color: #ede9e0; font: 15px/1.5 system-ui; cursor: pointer; }
.spring-switch input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
.switch-track { flex: none; width: 54px; height: 32px; padding: 4px; border-radius: 999px; background: #54545b; transition: background 180ms ease; }
.switch-thumb { display: block; width: 24px; height: 24px; border-radius: 50%; background: #ede9e0; transition: transform 420ms cubic-bezier(.34, 1.56, .64, 1); }
.spring-switch input:checked + .switch-track { background: #ff8a00; }
.spring-switch input:checked + .switch-track .switch-thumb { transform: translateX(22px); background: #0e0e10; }
.spring-switch input:focus-visible + .switch-track { outline: 3px solid #5b8def; outline-offset: 4px; }
.spring-switch input:disabled { cursor: not-allowed; }
.spring-switch:has(input:disabled) { opacity: .55; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) {
  .switch-track, .switch-thumb { transition: none; }
}`,
    explanation: 'The real checkbox keeps its native input behavior. CSS styles the adjacent track and moves the thumb when :checked matches. The easing curve overshoots its target briefly before settling. This gives a spring-like appearance without a physics engine or animation dependency.',
    steps: ['Copy the HTML and CSS. Keep the input inside the label so its text supplies an accessible name.', 'Click the label or focus the checkbox and press Space to toggle it.', 'For a form, add a name and value to the checkbox. In React, use onChange if the application needs to store the value.'],
    tuning: [{ name: 'Travel', text: 'The 22px translation is the track width minus the thumb width and the two 4px insets: 54 − 24 − 8. Update these values together if you resize the switch.' }, { name: 'Overshoot', text: 'The second cubic-bezier control point exceeds 1, which creates the visible overshoot. Use a gentler curve or a shorter duration for frequently used settings.' }],
    accessibility: 'The input stays in the accessibility tree and keyboard focus order. Its label is clickable, Space toggles it, and :focus-visible draws an outline on the track. Add the native disabled attribute when needed. Reduced motion removes the movement while preserving the checked state.',
    limitation: 'The easing imitates a spring over a fixed duration. It does not preserve physical velocity when rapidly toggled. The optional :has() disabled-label styling is decorative; the native input remains disabled even in browsers without that selector.',
    prompt: 'Build a spring-like toggle using a native labeled checkbox. Animate an adjacent thumb with a cubic-bezier overshoot, preserve keyboard focus styling and disabled behavior, and turn off transitions for reduced motion. Include standalone CSS and a React version without an animation library.'
  },
  {
    slug: 'ripple-button', name: 'Ripple Feedback', component: 'RippleButton',
    title: 'Button Ripple Effect with CSS, JavaScript & React',
    description: 'Make a button ripple from the click position, with a centered ripple for keyboard activation. Includes complete HTML, CSS, JavaScript, and React code.',
    summary: 'A ripple expands from the click position and fades. Keyboard activation starts it in the center.',
    method: 'CSS keyframes + click coordinates', category: 'Buttons', init: initRippleButton,
    html: `<div class="ripple-example">
  <button class="ripple-button" type="button">Press anywhere</button>
</div>`,
    css: `.ripple-button { position: relative; isolation: isolate; overflow: hidden; min-height: 48px; padding: 14px 28px; border: 1px solid #ff8a00; border-radius: 12px; background: #ff8a00; color: #0e0e10; font: 600 16px/1.4 system-ui; cursor: pointer; }
.ripple-button:focus-visible { outline: 3px solid #5b8def; outline-offset: 4px; }
.ripple-button:active { background: #e67b00; }
.ripple-wave { position: absolute; pointer-events: none; border-radius: 50%; background: rgb(255 255 255 / .45); animation: button-ripple 550ms ease-out forwards; }
@keyframes button-ripple { from { transform: scale(0); opacity: .7; } to { transform: scale(1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .ripple-wave { display: none; animation: none; } }`,
    explanation: 'The click handler measures the button, places a decorative span at the click position, and animates its scale and opacity. The ripple diameter covers the diagonal even when the click starts near an edge. A zero click detail identifies normal keyboard activation, where the ripple starts in the center.',
    steps: ['Copy the HTML and CSS, then run the JavaScript after the button exists.', 'Click near different edges to check that the expanding circle covers the button.', 'Focus the button and press Enter or Space. The same action produces a centered ripple.'],
    tuning: [{ name: 'Duration', text: 'Change the 550ms keyframe duration to control the ripple. Keep feedback quick enough that it confirms an action instead of delaying it.' }, { name: 'Color', text: 'The translucent white wave works on the orange background. Choose a contrasting tint for your own surface and keep text readable during the animation.' }],
    accessibility: 'The button retains its keyboard behavior and focus outline. The extra span is aria-hidden and cannot intercept pointer events. Reduced-motion users get the ordinary pressed color without the expanding circle. The animation never delays the application action.',
    limitation: 'A pointer-positioned ripple needs JavaScript. This is a keyframe effect, not a spring. Each activation removes the previous wave, and animationend removes the new one. The React component also removes listeners and any remaining wave when unmounted.',
    prompt: 'Build a native button with a CSS ripple positioned from click coordinates. Cover the full button diagonal, center the wave for keyboard clicks, mark the wave aria-hidden, remove it on animationend, and disable the effect for reduced motion. Include a complete React component with cleanup.'
  },
  {
    slug: 'card-resize', name: 'Card Resize', component: 'ExpandableCard',
    title: 'Expandable Card Animation with CSS & React',
    description: 'Create a smoothly expanding card without a fixed max-height. Copy complete HTML, CSS, JavaScript, and React code with an accessible disclosure button.',
    summary: 'A compact card reveals extra content using an intrinsic-height grid transition.',
    method: 'CSS grid height transition', category: 'Disclosure', init: initDisclosure,
    html: `<div class="resize-example">
  <div class="resize-card">
    <span class="resize-label">PROJECT NOTES</span>
    <h3>A little more detail.</h3>
    <p>Keep the overview compact, then reveal the context when it is useful.</p>
    <button type="button" data-disclosure aria-expanded="false" aria-controls="card-details">Show details <span aria-hidden="true">+</span></button>
    <div id="card-details" class="resize-extra" data-panel aria-hidden="true" inert>
      <div><p>The expanded section follows its content height. Add your own explanation or controls here.</p></div>
    </div>
  </div>
</div>`,
    css: `.resize-example { width: 100%; max-width: 360px; }
.resize-card { padding: 24px; border: 1px solid #54545b; border-radius: 16px; background: #1a1a1d; color: #ede9e0; font: 15px/1.6 system-ui; }
.resize-label { color: #ff8a00; font: 11px/1.5 ui-monospace, monospace; letter-spacing: .1em; }
.resize-card h3 { margin: 8px 0; font-size: 23px; line-height: 1.25; }
.resize-card p { margin: 0; color: #bdbbb5; }
.resize-card button { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; margin-top: 18px; padding: 12px 0; border: 0; border-top: 1px solid #54545b; background: transparent; color: #ede9e0; font: inherit; cursor: pointer; text-align: left; }
.resize-card button:focus-visible { outline: 3px solid #5b8def; outline-offset: 4px; }
.resize-card button span { color: #ff8a00; transition: transform 350ms ease; }
.resize-card button[aria-expanded="true"] span { transform: rotate(45deg); }
.resize-extra { display: grid; grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows 350ms cubic-bezier(.16, 1, .3, 1), visibility 350ms; }
.resize-extra[aria-hidden="false"] { grid-template-rows: 1fr; visibility: visible; }
.resize-extra > div { min-height: 0; overflow: hidden; }
.resize-extra p { padding-top: 12px; }
@media (prefers-reduced-motion: reduce) { .resize-extra, .resize-card button span { transition: none; } }`,
    explanation: 'The card keeps its normal document height. Only the extra content changes from a collapsed grid row to an intrinsic-height row. There is no arbitrary max-height and no per-frame JavaScript measurement. Because the card grows in the document, content below it moves naturally.',
    steps: ['Copy the markup and CSS, preserving the extra-content wrapper.', 'Run the JavaScript after the card exists. Give each card its own aria-controls and panel ID when using several instances.', 'Replace the text with your content and test opening, closing, and resizing the viewport.'],
    tuning: [{ name: 'Content', text: 'The inner wrapper allows the panel to collapse to zero while the open row follows the content. Avoid adding minimum heights to that wrapper.' }, { name: 'Motion', text: 'The 350ms easing settles smoothly. It approximates spring-like motion without preserving velocity. Use a shorter transition for dense dashboards where people open cards often.' }],
    accessibility: 'A dedicated native button handles activation rather than making the entire card clickable. aria-expanded describes the state and aria-controls identifies the panel. The closed panel is inert and hidden from assistive technology. Reduced motion keeps expansion immediate.',
    limitation: 'Height changes cause layout work, even though the JavaScript does not measure the height every frame. This example is suitable for small content panels, not hundreds of simultaneous expanding cards. Keep the unique IDs and event cleanup if you adapt it to a component list.',
    prompt: 'Build an expandable card with a dedicated disclosure button and an intrinsic-height CSS grid transition. Use aria-expanded, unique aria-controls IDs, an inert closed panel, and reduced-motion styling. Include complete vanilla code and a React component that cleans up its event listener.'
  }
];

export function codeExamples(effect) {
  const setup = effect.init ? effect.init.toString() : null;
  const js = setup ? `const setup = ${setup};\nconst cleanup = setup(document.querySelector('.${effect.html.match(/class="([^"]+)/)[1]}'));\n// Call cleanup() before removing this example from the page.` : null;
  let jsx = effect.html.replace(/\bclass=/g, 'className=').replace(/\s+inert(?=[\s>])/g, '').replace(/<input([^>]*?)(?<!\/)>(?!<\/input>)/g, '<input$1 />');
  if (setup) jsx = jsx.replace(/^(<\w+)/, '$1 ref={rootRef}');
  const disclosure = effect.init === initDisclosure;
  if (disclosure) jsx = jsx.replace(/(aria-controls|id)="(?:spring-answer|card-details)"/g, '$1={panelId}');
  const imports = setup
    ? `'use client';\nimport React, { useEffect, useRef${disclosure ? ', useId' : ''} } from 'react';\n\n`
    : "import React from 'react';\n\n";
  const cssLiteral = effect.css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const react = `${imports}const styles = \`${cssLiteral}\`;\n${setup ? `const setup = ${setup};\n\n` : '\n'}export default function ${effect.component}() {\n${setup ? `  const rootRef = useRef(null);\n${disclosure ? '  const panelId = useId();\n' : ''}  useEffect(() => setup(rootRef.current), []);\n` : ''}  return (\n    <>\n      <style>{styles}</style>\n      ${jsx.replace(/\n/g, '\n      ')}\n    </>\n  );\n}`;
  return [
    { language: 'html', label: 'HTML', code: effect.html },
    { language: 'css', label: 'CSS', code: effect.css },
    ...(js ? [{ language: 'js', label: 'JavaScript', code: js }] : []),
    { language: 'react', label: 'React', code: react },
    { language: 'prompt', label: 'AI prompt', code: effect.prompt },
  ];
}
