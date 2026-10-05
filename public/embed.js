(() => {
  const script = document.currentScript;
  if (!script) return;
  const slug = script.getAttribute('data-chatbot') || 'sales-chatbot';
  const origin = new URL(script.src).origin;
  const iframe = document.createElement('iframe');
  iframe.src = origin + '/embed/' + encodeURIComponent(slug);
  iframe.title = 'AI Chatbot';
  iframe.style.cssText = 'position:fixed;right:20px;bottom:20px;width:390px;height:650px;border:0;border-radius:24px;z-index:2147483647;background:transparent;box-shadow:0 18px 50px rgba(0,0,0,.18);';
  document.body.appendChild(iframe);
  const resize = () => {
    if (window.innerWidth < 520) {
      iframe.style.right='8px'; iframe.style.bottom='8px'; iframe.style.width='calc(100vw - 16px)'; iframe.style.height='calc(100vh - 16px)';
    }
  };
  resize(); window.addEventListener('resize', resize);
})();