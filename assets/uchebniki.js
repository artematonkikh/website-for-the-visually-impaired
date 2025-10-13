(function(){
  const q = document.getElementById('search');
  const list = document.getElementById('docs');
  const counter = document.getElementById('results-count');

  if (!q || !list) return;

  const items = Array.from(list.querySelectorAll('li'));

  const normalize = s => s.toLowerCase().replace(/[ё]/g, 'е').trim();

  function filter() {
    const v = normalize(q.value);
    let visible = 0;
    items.forEach(li => {
      const text = normalize(li.innerText);
      const match = !v || text.includes(v);
      li.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (counter) {
      counter.textContent = `${visible}`;
    }
  }

  q.addEventListener('input', filter);
  filter();
})();
