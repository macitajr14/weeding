document.addEventListener('DOMContentLoaded', () => {
    // Referências DOM
    const modal = document.getElementById('upload-modal');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const backdrop = document.getElementById('modal-backdrop');
    
    const form = document.getElementById('upload-form');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const removePreviewBtn = document.getElementById('remove-preview');
    const dropContent = document.getElementById('drop-content');
    const galleryGrid = document.getElementById('gallery-grid');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');

    let uploadedImageSrc = null;

    // --- Lógica do Modal ---
    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetForm();
    }

    btnOpen.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // --- Lógica de Drag & Drop ---
    
    // Prevenir comportamento padrão (abrir arquivo no navegador)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Efeitos visuais ao arrastar
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('border-primary', 'bg-primary/5');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('border-primary', 'bg-primary/5');
        }, false);
    });

    // Handle Drop
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle Click (Abre o seletor de arquivos)
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle File Input Change
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                previewFile(file);
            } else {
                alert('Por favor, envie apenas imagens.');
            }
        }
    }

    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            uploadedImageSrc = reader.result;
            imagePreview.src = uploadedImageSrc;
            imagePreview.classList.remove('hidden');
            removePreviewBtn.classList.remove('hidden');
            dropContent.classList.add('opacity-0');
        }
    }

    // --- Remover Imagem ---
    removePreviewBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique propague para o dropZone e abra o seletor de novo
        resetPreview();
    });

    function resetPreview() {
        fileInput.value = '';
        uploadedImageSrc = null;
        imagePreview.classList.add('hidden');
        removePreviewBtn.classList.add('hidden');
        dropContent.classList.remove('opacity-0');
    }

    function resetForm() {
        resetPreview();
        document.getElementById('photo-caption').value = '';
        submitBtn.innerText = "Publicar na Galeria";
        submitBtn.disabled = false;
    }

    // --- Submit do Formulário ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!uploadedImageSrc) {
            alert("Selecione uma imagem primeiro!");
            return;
        }

        const captionInput = document.getElementById('photo-caption');
        const captionText = captionInput.value || "Momento Capturado";

        // Loading state
        submitBtn.innerText = "Enviando...";
        submitBtn.disabled = true;

        setTimeout(() => {
            // Criar novo card
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item break-inside-avoid animate-fade-in group relative rounded-2xl overflow-hidden cursor-pointer';
            
            newItem.innerHTML = `
                <img src="${uploadedImageSrc}" 
                     alt="${captionText}" 
                     class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p class="text-white font-medium drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${captionText}</p>
                </div>
            `;

            // Adicionar ao grid
            galleryGrid.insertBefore(newItem, galleryGrid.firstChild);

            // Feedback
            closeModal();
            showToast();
            
            window.scrollTo({ top: 0, behavior: 'smooth' });

        }, 800);
    });

    function showToast() {
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
});