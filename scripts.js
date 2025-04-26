document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Us from slides-data.js
    renderSlideCards(slidesData);
    setupSearch(slidesData);
});

// Render slide cards from data
function renderSlideCards(slides) {
    const container = document.getElementById('slides-container');
    container.innerHTML = '';
    
    if (slides.length === 0) {
        container.innerHTML = '<div class="no-results">No slide decks found matching your search.</div>';
        return;
    }
    
    slides.forEach(slide => {
        const card = document.createElement('div');
        card.className = 'slide-card';
        
        // Add a class if this is an external link
        if (slide.type === 'external') {
            card.classList.add('external-slide');
        }
        
        // Create tags HTML if tags exist
        let tagsHtml = '';
        if (slide.tags && slide.tags.length > 0) {
            tagsHtml = '<div class="tags">' + 
                slide.tags.map(tag => `<span class="tag">${tag}</span>`).join('') + 
                '</div>';
        }
        
        // Format date if available
        let dateHtml = '';
        if (slide.date) {
            const date = new Date(slide.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            dateHtml = `<div class="meta-info">Last updated: ${formattedDate}</div>`;
        }
        
        // Target attribute for links
        const targetAttr = slide.type === 'external' ? 'target="_blank" rel="noopener noreferrer"' : 'target="_blank"';
        
        // Button text based on link type
        const buttonText = slide.type === 'external' ? 'View Slides' : 'View Slides';
        
        // Add a small icon for external links
        const externalIcon = slide.type === 'external' ? 
            '<svg class="external-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>' : '';
        
        card.innerHTML = `
            <h2>${slide.title}</h2>
            <p>${slide.description || 'No description available'}</p>
            ${tagsHtml}
            <a href="${slide.url}" class="view-btn" ${targetAttr}>${buttonText} ${externalIcon}</a>
            ${dateHtml}
        `;
        
        container.appendChild(card);
    });
}

// Setup search functionality
function setupSearch(allSlides) {
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderSlideCards(allSlides);
            return;
        }
        
        const filteredSlides = allSlides.filter(slide => {
            const titleMatch = slide.title.toLowerCase().includes(searchTerm);
            const descMatch = slide.description && slide.description.toLowerCase().includes(searchTerm);
            const tagMatch = slide.tags && slide.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return titleMatch || descMatch || tagMatch;
        });
        
        renderSlideCards(filteredSlides);
    });
}
