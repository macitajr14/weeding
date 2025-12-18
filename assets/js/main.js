// Elementos do DOM
const modal = document.getElementById('upload-modal');
const form = document.getElementById('upload-form');
const galleryGrid = document.getElementById('gallery-grid');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const dropContent = document.getElementById('drop-content');
const imagePreview = document.getElementById('image-preview');
const removePreviewBtn = document.getElementById('remove-preview');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');

// Variável para armazenar a imagem em Base64
let uploadedImageSrc = null;

// Toggle Modal
function toggleModal() {
    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetForm(); // Limpa o form ao fechar
    }
}

// Lógica de Preview de Imagem (File Reader)
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    handleFile(file);
});

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImageSrc = e.target.result; // Salva o Base64
            
            // UI Updates
            imagePreview.src = uploadedImageSrc;
            imagePreview.classList.remove('hidden');
            removePreviewBtn.classList.remove('hidden');
            dropContent.classList.add('opacity-0'); // Esconde o ícone de upload
            dropZone.classList.add('border-primary'); // Borda ativa
        }
        
        reader.readAsDataURL(file);
    }
}

// Remover Preview
removePreviewBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita abrir o seletor de arquivos de novo
    resetPreview();
});

function resetPreview() {
    fileInput.value = '';
    uploadedImageSrc = null;
    imagePreview.classList.add('hidden');
    removePreviewBtn.classList.add('hidden');
    dropContent.classList.remove('opacity-0');
    dropZone.classList.remove('border-primary');
}

function resetForm() {
    resetPreview();
    document.getElementById('photo-caption').value = '';
    submitBtn.innerText = "Publicar na Galeria";
    submitBtn.disabled = false;
}

// Show Toast Notification
function showToast() {
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Submit do Formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validação simples
    if (!uploadedImageSrc) {
        alert("Por favor, selecione uma imagem primeiro.");
        return;
    }
    
    const captionInput = document.getElementById('photo-caption');
    const captionText = captionInput.value || "Momento Capturado";
    
    // Feedback Visual de Loading
    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    // Simular delay de rede (apenas para UX)
    setTimeout(() => {
        // 1. Criar o elemento HTML da nova foto
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item break-inside-avoid animate-fade-in group relative rounded-2xl overflow-hidden cursor-pointer';
        
        // Usamos uploadedImageSrc que contém a imagem real em Base64
        newItem.innerHTML = `
            <img src="${uploadedImageSrc}" 
                 alt="${captionText}" 
                 class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p class="text-white font-medium drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${captionText}</p>
            </div>
        `;

        // 2. Adicionar ao topo do grid
        galleryGrid.insertBefore(newItem, galleryGrid.firstChild);

        // 3. Sucesso
        toggleModal();
        showToast();
        
        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, 800);
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        toggleModal();
    }
});