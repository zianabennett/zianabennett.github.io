'use strict';

(() => {
  const controls = [...document.querySelectorAll('[data-preview-width]')];
  const frames = [...document.querySelectorAll('.frame-stage')];
  const status = document.getElementById('preview-status');
  let selectedWidth = 1280;
  let scheduled = false;

  function fitPreviews() {
    const pageHeight = selectedWidth <= 390 ? 844 : 900;
    for (const stage of frames) {
      const viewport = stage.querySelector('.frame-viewport');
      const frame = stage.querySelector('iframe');
      const scale = Math.min(1, stage.clientWidth / selectedWidth);
      const visibleWidth = Math.floor(selectedWidth * scale);
      const visibleHeight = Math.floor(pageHeight * scale);
      frame.style.width = `${selectedWidth}px`;
      frame.style.height = `${pageHeight}px`;
      frame.style.transform = `scale(${scale})`;
      viewport.style.width = `${visibleWidth}px`;
      viewport.style.height = `${visibleHeight}px`;
      stage.style.height = `${visibleHeight}px`;
      stage.style.minHeight = '0';
    }
    scheduled = false;
  }

  function scheduleFit() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(fitPreviews);
    }
  }

  for (const control of controls) {
    control.addEventListener('click', () => {
      const width = Number(control.dataset.previewWidth);
      if (![1280, 768, 390, 320].includes(width)) return;
      selectedWidth = width;
      for (const button of controls) {
        button.setAttribute('aria-pressed', String(button === control));
      }
      status.textContent = `Both previews use a ${width} px page width.`;
      fitPreviews();
    });
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleFit);
    for (const stage of frames) observer.observe(stage);
  } else {
    window.addEventListener('resize', scheduleFit, { passive: true });
  }
  fitPreviews();
})();
