// Controle do Modal
const modal = document.getElementById('upload-modal');
const form = document.getElementById('upload-form');
const galleryGrid = document.getElementById('gallery-grid');

function toggleModal() {
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Impede scroll do fundo
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Simulação de Upload e Adição ao Grid
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const captionInput = document.getElementById('photo-caption');
    const captionText = captionInput.value || "Momento Capturado";
    
    // Simular loading no botão
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;
    btn.classList.add('opacity-75');

    setTimeout(() => {
        // 1. Criar o elemento da nova foto
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item break-inside-avoid animate-fade-in group relative rounded-2xl overflow-hidden cursor-pointer';
        
        // Vamos gerar um ID aleatório para a imagem nova para o Nano Banana pegar
        const randomId = Math.floor(Math.random() * 1000);
        
        // HTML interno do card
        newItem.innerHTML = `
            <img src="assets/images/wedding-new-${randomId}.jpg" 
                 alt="${captionText}" 
                 class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                 data-prompt="cinematic wedding photography, ${captionText}, romantic, soft light, 8k, photorealistic"
                 data-aspect-ratio="3:4">
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p class="text-white font-medium drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${captionText}</p>
            </div>
        `;

        // 2. Adicionar ao topo da galeria (prepend)
        galleryGrid.insertBefore(newItem, galleryGrid.firstChild);

        // 3. Resetar formulário e fechar modal
        captionInput.value = '';
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75');
        
        toggleModal();

        // Scroll suave para o topo para ver a nova foto
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, 1500); // Delay artificial de 1.5s para parecer um upload real
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        toggleModal();
    }
});