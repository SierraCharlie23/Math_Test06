let solutionsData = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadSolutions();

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) selectQuestion(currentIndex - 1);
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex < solutionsData.length - 1) selectQuestion(currentIndex + 1);
  });
});

async function loadSolutions() {
  try {
    const response = await fetch('solutions.json');
    solutionsData = await response.json();
    renderQuestionButtons();
    selectQuestion(0);
  } catch (error) {
    console.error('Failed to load solutions.json:', error);
  }
}

function renderQuestionButtons() {
  const nav = document.getElementById('question-nav');
  nav.innerHTML = '';

  solutionsData.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = `q-btn ${index === 0 ? 'active' : ''}`;
    btn.textContent = `Question ${item.question}`;
    btn.addEventListener('click', () => selectQuestion(index));
    nav.appendChild(btn);
  });
}

function selectQuestion(index) {
  currentIndex = index;
  
  // Update button active states
  const buttons = document.querySelectorAll('.q-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });

  // Update navigation button states
  document.getElementById('prev-btn').disabled = index === 0;
  document.getElementById('next-btn').disabled = index === solutionsData.length - 1;

  // Render content
  renderSolution(solutionsData[index]);
}

function renderSolution(data) {
  const container = document.getElementById('solution-content');
  
  let html = `<h2>Question ${data.question}</h2><br>`;

  // Render NO.1 Section
  html += `<div class="section-block">
    <h3 class="section-title">NO.1 — ${data.no1.title}</h3>
    <div class="step-card">
      <div class="step-label">Original F(s)</div>
      <div class="equation-line">\\[${data.no1.original}\\]</div>
    </div>`;

  data.no1.steps.forEach(step => {
    const isFinal = step.label.toLowerCase().includes('final');
    html += `
      <div class="step-card ${isFinal ? 'final-answer' : ''}">
        <div class="step-label">${step.label}</div>
        ${step.equations.map(eq => `<div class="equation-line">\\[${eq}\\]</div>`).join('')}
      </div>`;
  });
  html += `</div>`;

  // Render NO.2 Section
  html += `<div class="section-block">
    <h3 class="section-title">NO.2 — ${data.no2.title}</h3>
    <div class="step-card">
      <div class="step-label">Given Differential Equation</div>
      <div class="equation-line">\\[${data.no2.equation}\\]</div>
      <div class="step-label">Initial Conditions</div>
      <div class="equation-line">\\[${data.no2.initial_conditions.join(',\\quad ')}\\]</div>
    </div>`;

  data.no2.steps.forEach(step => {
    const isFinal = step.label.toLowerCase().includes('final');
    html += `
      <div class="step-card ${isFinal ? 'final-answer' : ''}">
        <div class="step-label">${step.label}</div>
        ${step.equations.map(eq => `<div class="equation-line">\\[${eq}\\]</div>`).join('')}
      </div>`;
  });
  html += `</div>`;

  container.innerHTML = html;

  // Trigger MathJax re-render
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([container]);
  }
}