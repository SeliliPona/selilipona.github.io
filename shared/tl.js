let tooltip;

const initTl = function() {
    tooltip = document.getElementById('tl-tooltip');
    const offset = 15; // Distance from cursor

    // --- UPDATED: Click Forwarding Logic in tl.js ---
document.addEventListener('click', (e) => {
    const target = e.target.closest('.tl');
    if (target) {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Stop the browser from following the <a> link
            e.preventDefault(); 
            // Stop the click from reaching the <a> tag
            e.stopPropagation(); 
        } else {
            // ON DESKTOP: Manually trigger the link so the 
            // whole button feels clickable despite the z-index.
            const parent = target.closest('.subpage');
            const link = parent ? parent.querySelector('.stretched-link') : null;
            if (link) {
                link.click();
            }
        }
    }
});

    document.addEventListener('mousemove', (e) => {
    const targetTl = e.target.closest('.tl');
    const targetEmote = e.target.closest('.emote');
    const target = targetEmote || targetTl;
    
    if (target) {
        // 1. Update Content
        const roman = target.getAttribute('data-roman');
        const trans = target.getAttribute('data-trans');
        const br = document.getElementById('tl-break');
        const emote = target.getAttribute('alt');
        if (targetEmote) {
            tooltip.querySelector('.tl-trans').style = 'display: none;';
            tooltip.querySelector('.tl-roman').textContent = emote;
        } else {
            if (roman && roman != "") {
                tooltip.querySelector('.tl-roman').style = '';
                tooltip.querySelector('.tl-roman').textContent = roman;
            } else {
                tooltip.querySelector('.tl-roman').style = 'display: none;';
            }

            if (trans && trans != "") {
                tooltip.querySelector('.tl-trans').style = '';
                tooltip.querySelector('.tl-trans').textContent = trans;
            } else {
                tooltip.querySelector('.tl-trans').style = 'display: none;';
            }

            br.style = ((roman && roman != "") ^ (trans && trans != "")) ? 'display: none' : '';
        }
        tooltip.classList.add('tooltip-visible');
        tooltip.classList.remove('tooltip-hidden');

        // 2. Boundary Math
        let x = e.clientX + offset;
        let y = e.clientY + offset;

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Flip horizontally if hitting right edge
        if (x + tooltipWidth > windowWidth) {
        x = e.clientX - tooltipWidth - offset;
        }

        // Flip vertically if hitting bottom edge
        if (y + tooltipHeight > windowHeight) {
        y = e.clientY - tooltipHeight - offset;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    } else {
        tooltip.classList.add('tooltip-hidden');
        tooltip.classList.remove('tooltip-visible');
    }
    });
}